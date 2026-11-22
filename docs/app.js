"use strict";
/* Encuéntralo web — interfaz: búsqueda, filtros, lista, edición y ajustes (el motor está en motor.js). */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const st = { vista: "", q: "", modulo: "", unidades: [], temas: [], herrs: [], seccion: "", mes: "", ext: "", reciente: 0, orden: "", mostrados: 0 };
const POR_PAGINA = 60;
// modo consulta (alumnos): índice publicado por la profe, solo para buscar y abrir en SharePoint
let CONSULTA = null;  // { generado } cuando está activo
const guardado = (k, def) => { try { return localStorage.getItem(k) || def; } catch { return def; } };
const guardarLS = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
let vistaLista = guardado("ix_vista", "lista");
// en móvil no hay cuadrícula (se parece demasiado a la lista): se usa la lista
const MOVIL = matchMedia("(max-width: 800px)");
const vistaActual = () => (vistaLista === "grid" && MOVIL.matches ? "lista" : vistaLista);

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), 3600);
}
const fmtFecha = (f) => f ? new Date(f + "T00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) : "";
const fmtMes = (m) => {
  if (!m) return "Sin fecha";
  const [y, mm] = m.split("-");
  const s = new Date(+y, +mm - 1, 1).toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
};
const fmtTam = (b) => b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(0) + " KB" : (b / 1048576).toFixed(1) + " MB";
const hora = (d) => d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

// ------------------------------------------------------------ colores e iconos
// color estable por texto: 8 tonos de la paleta (.c0 … .c7 en style.css)
const col = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.codePointAt(0)) % 9973; return "c" + (h % 8); };
const ICONOS = {
  descargar: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  externo: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  ver: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  enlace: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  editar: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  cerrar: '<path d="M6 6l12 12M18 6 6 18"/>',
  restaurar: '<path d="M4 12a8 8 0 1 0 2.34-5.66"/><path d="M4 4v5h5"/>',
};
const svg = (k) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONOS[k]}</svg>`;
const EMOJI_EXT = {
  pdf: "📕", doc: "📘", docx: "📘", odt: "📘", ppt: "📙", pptx: "📙", odp: "📙", xls: "📗", xlsx: "📗", ods: "📗", csv: "📗",
  pkt: "🖧", pka: "🖧", zip: "🗜️", rar: "🗜️", "7z": "🗜️", png: "🖼️", jpg: "🖼️", jpeg: "🖼️", gif: "🖼️", svg: "🖼️",
  mp4: "🎬", mkv: "🎬", mov: "🎬", mp3: "🎵", wav: "🎵", txt: "📝", md: "📝", py: "🐍", sh: "💻", ps1: "💻", bat: "💻",
  rsc: "📡", pcap: "🦈", pcapng: "🦈", sql: "🗄️", html: "🌐", htm: "🌐", json: "🧾", xml: "🧾", ova: "💽", iso: "💽",
  url: "🔗", webloc: "🔗",
};
// Teams guarda "Trabajo de clase" en una carpeta llamada Classwork: se muestra con su nombre en español
const nombreCarpeta = (c) => c.replace(/(^|\/)Classwork(?=\/|$)/gi, "$1Trabajo de clase");
const dominio = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
// sección = biblioteca (Materiales de clase…); dentro de "Documentos", su primera carpeta (Classwork, canales)
const seccionDe = (d) => {
  const p = d.carpeta.split("/");
  return nombreCarpeta((ES_DOCUMENTOS.test(p[0]) && p[1]) || p[0] || "");
};

// ------------------------------------------------------------ búsqueda y filtros (en memoria)
function terminos(q) {
  return [...normIgual(q).matchAll(/"([^"]+)"|(\S+)/g)].map((m) => (m[1] || m[2]).trim()).filter(Boolean);
}
// trozo del texto alrededor de la primera coincidencia, con los términos resaltados
function fragmento(d, ts) {
  const n = d._n.texto;
  let i = -1;
  for (const t of ts) { i = n.indexOf(t); if (i >= 0) break; }
  if (i < 0) return "";
  const a = Math.max(0, i - 70), b = Math.min(n.length, i + 130);
  const trozo = n.slice(a, b), rangos = [];
  for (const t of ts) for (let j = trozo.indexOf(t); j >= 0; j = trozo.indexOf(t, j + t.length)) rangos.push([j, j + t.length]);
  rangos.sort((x, y) => x[0] - y[0]);
  const orig = d.texto.slice(a, b);
  let html = "", p = 0;
  for (const [x, y] of rangos) {
    if (x < p) continue;
    html += esc(orig.slice(p, x)) + "<mark>" + esc(orig.slice(x, y)) + "</mark>";
    p = y;
  }
  html += esc(orig.slice(p));
  return (a > 0 ? "… " : "") + html.replace(/\s+/g, " ").trim() + (b < n.length ? " …" : "");
}
function buscar(docs, q) {
  const ts = terminos(q);
  if (!ts.length) return docs.map((d) => ({ d, score: 0 }));
  const res = [];
  for (const d of docs) {
    const n = d._n;
    let score = 0, ok = true;
    for (const t of ts) {
      let s = 0;
      if (n.nombre.includes(t)) s += 10;
      if (n.tags.includes(t)) s += 6;
      if (n.ruta.includes(t)) s += 3;
      if (n.notas.includes(t)) s += 3;
      for (let j = n.texto.indexOf(t), k = 0; j >= 0 && k < 5; j = n.texto.indexOf(t, j + t.length), k++) s += 1;
      if (!s) { ok = false; break; }
      score += s;
    }
    if (ok) res.push({ d, score, snip: fragmento(d, ts) });
  }
  return res;
}
const desde = () => (st.reciente ? isoLocal(new Date(Date.now() - st.reciente * 864e5)) : "");
const FILTROS = {
  modulo: (d) => !st.modulo || d.modulo === st.modulo,
  unidades: (d) => !st.unidades.length || st.unidades.some((u) => d.unidades.includes(u)),
  temas: (d) => st.temas.every((t) => d.temas.includes(t)),
  herrs: (d) => st.herrs.every((t) => d.herramientas.includes(t)),
  seccion: (d) => !st.seccion || seccionDe(d) === st.seccion,
  mes: (d) => !st.mes || (d.fecha || "").slice(0, 7) === st.mes,
  reciente: (d) => !st.reciente || (d.fecha || "") >= desde(),
  ext: (d) => !st.ext || d.ext === st.ext,
};
const pasa = (d, salvo) => Object.entries(FILTROS).every(([k, f]) => k === salvo || f(d));
function enVista(d) {
  if (st.vista === "papelera") return d.estado !== "ok";
  return d.estado === "ok" && (st.vista !== "sin_tema" || !d.temas.length);
}
function contar(res, filtro, valores) {
  const m = new Map();
  for (const { d } of res) if (pasa(d, filtro)) for (const v of valores(d)) if (v !== undefined) m.set(v, (m.get(v) || 0) + 1);
  return [...m].map(([valor, n]) => ({ valor, n }));
}
const porN = (a, b) => b.n - a.n || String(a.valor).localeCompare(String(b.valor), "es");

// ------------------------------------------------------------ pintar
function pintar(append = false) {
  const base = buscar([...DOCS.values()].filter(enVista), st.q);
  const res = base.filter(({ d }) => pasa(d));
  const orden = st.orden || (st.q ? "relevancia" : "fecha");
  const cmp = {
    relevancia: (a, b) => b.score - a.score || (b.d.fecha || "").localeCompare(a.d.fecha || ""),
    fecha: (a, b) => (b.d.fecha || "").localeCompare(a.d.fecha || "") || a.d.nombre.localeCompare(b.d.nombre, "es"),
    fecha_asc: (a, b) => (a.d.fecha || "").localeCompare(b.d.fecha || "") || a.d.nombre.localeCompare(b.d.nombre, "es"),
    detectado: (a, b) => (b.d.detectado || "").localeCompare(a.d.detectado || "") || (b.d.fecha || "").localeCompare(a.d.fecha || ""),
    nombre: (a, b) => a.d.nombre.localeCompare(b.d.nombre, "es", { numeric: true }),
  }[orden];
  res.sort(cmp);

  pintarFacetas(base);
  pintarChips();
  const ok = [...DOCS.values()].filter((d) => d.estado === "ok");
  $("#cTotal").textContent = ok.length || "";
  $("#cSin").textContent = ok.filter((d) => !d.temas.length).length || "";
  $$(".vistas a").forEach((a) => a.classList.toggle("on", a.dataset.vista === st.vista));

  const ul = $("#lista");
  ul.className = "lista vista-" + vistaActual();
  if (!append) st.mostrados = Math.max(POR_PAGINA, st.mostrados);
  $("#count").textContent = res.length === 1 ? "1 documento" : `${res.length} documentos`;
  ul.innerHTML = "";
  if (!res.length) {
    ul.innerHTML = `<li class="vacio">${!DOCS.size
      ? CONSULTA ? "<b>Todavía no hay documentos publicados.</b>" : (ESC.activo ? "<b>Leyendo tus documentos…</b><br>Van apareciendo aquí según se indexan." : "<b>Aún no hay documentos.</b><br>Elige tu carpeta de apuntes para empezar.")
      : "No hay documentos con estos filtros."}</li>`;
  }
  const agrupar = orden === "fecha" || orden === "fecha_asc";
  const hoy = isoLocal(new Date());
  let grupo = null;
  for (const { d, snip } of res.slice(0, st.mostrados)) {
    if (agrupar) {
      const g = (d.fecha || "").slice(0, 7);
      if (g !== grupo) {
        grupo = g;
        const h = document.createElement("li"); h.className = "grupo"; h.textContent = fmtMes(g); ul.appendChild(h);
      }
    }
    ul.appendChild(tarjeta(d, snip, hoy));
  }
  $("#btnMas").hidden = st.mostrados >= res.length;
  pintarDatalists();
}

function tarjeta(d, snip, hoy) {
  const li = document.createElement("li");
  li.className = "doc" + (d.estado !== "ok" ? " fuera" : "");
  const ext = (d.ext || "").replace(".", "");
  const sp = d.enlace ? "" : CONSULTA ? d.sp : urlSharepoint(d);
  // para los alumnos, "nuevo" es lo de los últimos 3 días (la profe publica de vez en cuando)
  const nuevo = CONSULTA ? !!d.detectado && d.detectado >= isoLocal(new Date(Date.now() - 3 * 864e5)) : (d.detectado || "").slice(0, 10) === hoy;
  const estado = d.estado === "oculto" ? "<b>oculto</b>" : d.estado === "desaparecido" ? "<b>ya no está en la carpeta</b>" : "";
  const titulo = d.enlace ? d.nombre.replace(/\.(url|webloc)$/i, "") : d.nombre;
  li.innerHTML = `
    <div class="ico ${esc(ext)}">${EMOJI_EXT[ext] || "📄"}<small>${esc(ext.slice(0, 4) || "?")}</small></div>
    <div>
      <div class="badges">
        ${d.modulo ? `<span class="badge mod ${col(d.modulo)}" data-mod="${esc(d.modulo)}">${esc(d.modulo)}</span>` : ""}
        ${d.unidades.map((u) => `<span class="badge ud" data-ud="${esc(u)}">${esc(u)}</span>`).join("")}
      </div>
      <h4><a data-act="${d.enlace ? "enlace" : sp ? "sharepoint" : CONSULTA ? "" : "ver"}" title="${esc(d.enlace || (sp ? "Abrir en el SharePoint de la clase" : CONSULTA ? "" : "Ver"))}">${esc(titulo)}</a></h4>
      <div class="meta">
        <span>📅 ${fmtFecha(d.fecha)}</span>${d.carpeta ? `<span>${esc(nombreCarpeta(d.carpeta.replace(/^(documentos|documentos compartidos|shared documents)\/(?=.)/i, "")).replace(/\//g, " › "))}</span>` : ""}
        <span>${d.enlace ? "🔗 " + esc(dominio(d.enlace)) : fmtTam(d.tamano)}</span>
        ${nuevo ? '<span class="nuevo">nuevo</span>' : ""}${estado ? `<span>${estado}</span>` : ""}
      </div>
      ${snip ? `<div class="snip">${snip}</div>` : ""}
      <div class="tags">
        ${d.temas.map((t) => `<span class="tag tema ${col(t)}" data-tema="${esc(t)}">${esc(t)}</span>`).join("")}
        ${d.herramientas.map((t) => `<span class="tag herr ${col(t)}" data-herr="${esc(t)}">${esc(t)}</span>`).join("")}
      </div>
      ${d.notas ? `<div class="notas">📝 ${esc(d.notas)}</div>` : ""}
    </div>
    <div class="btns">
      ${CONSULTA ? (d.enlace
        ? `<button data-act="enlace" title="${esc(d.enlace)}">${svg("enlace")}<span class="lbl">Abrir enlace</span></button>`
        : sp ? `<button data-act="sharepoint" title="Abrir en el SharePoint de la clase">${svg("externo")}<span class="lbl">Abrir</span></button>` : "")
      : d.estado === "ok" ? `${d.enlace
        ? `<button data-act="enlace" title="${esc(d.enlace)}">${svg("enlace")}<span class="lbl">Abrir enlace</span></button>`
        : `${sp ? `<button data-act="sharepoint" title="Abrir en el SharePoint de la clase">${svg("externo")}<span class="lbl">SharePoint</span></button>` : ""}
      <button data-act="ver" title="${FUENTE?.tipo === "onedrive" ? "Ver en OneDrive" : "Ver"}">${svg("ver")}<span class="lbl">Ver</span></button>
      <button data-act="descargar" class="solo-icono" title="Descargar">${svg("descargar")}<span class="lbl">Descargar</span></button>`}
      <button data-act="editar" title="Editar etiquetas, fecha y notas">${svg("editar")}<span class="lbl">Editar</span></button>
      <button data-act="ocultar" class="solo-icono" title="Ocultar (no borra el archivo)">${svg("cerrar")}<span class="lbl">Ocultar</span></button>`
      : d.estado === "oculto" ? `<button data-act="restaurar" title="Volver a mostrarlo">${svg("restaurar")}<span class="lbl">Restaurar</span></button>`
      : `<button data-act="quitar" title="Quitar del índice">${svg("cerrar")}<span class="lbl">Quitar del índice</span></button>`}
    </div>`;
  li.addEventListener("click", (ev) => accion(ev, d, sp));
  return li;
}

function facetList(el, items, isOn, onClick, fmt = (v) => v, limite = 6) {
  if (!items.length) { el.innerHTML = `<li class="empty">—</li>`; return; }
  // los marcados siempre a la vista aunque estén más abajo
  const visibles = el._abierto || items.length <= limite + 1 ? items : items.filter((it, i) => i < limite || isOn(it.valor));
  el.innerHTML = visibles.map((it) => {
    const i = items.indexOf(it);
    return `<li data-i="${i}" class="${isOn(it.valor) ? "on" : ""}" title="${esc(fmt(it.valor))}"><span>${esc(fmt(it.valor))}</span><span class="n">${it.n}</span></li>`;
  }).join("") + (items.length > limite + 1 ? `<li class="mas">${el._abierto ? "Ver menos" : `Ver todas (${items.length})`}</li>` : "");
  $$("li[data-i]", el).forEach((li) => li.addEventListener("click", () => onClick(items[+li.dataset.i].valor)));
  const mas = $("li.mas", el);
  if (mas) mas.addEventListener("click", () => { el._abierto = !el._abierto; facetList(el, items, isOn, onClick, fmt, limite); });
}
const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
const filtrar = () => { st.mostrados = 0; pintar(); };

function pintarFacetas(res) {
  facetList($("#fModulos"), contar(res, "modulo", (d) => [d.modulo || undefined]).sort(porN),
    (v) => st.modulo === v, (v) => { st.modulo = st.modulo === v ? "" : v; filtrar(); });
  facetList($("#fUnidades"), contar(res, "unidades", (d) => d.unidades).sort((a, b) => a.valor.slice(2) - b.valor.slice(2)),
    (v) => st.unidades.includes(v), (v) => { st.unidades = toggle(st.unidades, v); filtrar(); });
  facetList($("#fHerr"), contar(res, "herrs", (d) => d.herramientas).sort(porN),
    (v) => st.herrs.includes(v), (v) => { st.herrs = toggle(st.herrs, v); filtrar(); });
  facetList($("#fTemas"), contar(res, "temas", (d) => d.temas).sort(porN),
    (v) => st.temas.includes(v), (v) => { st.temas = toggle(st.temas, v); filtrar(); });
  facetList($("#fSecciones"), contar(res, "seccion", (d) => [seccionDe(d) || undefined]).sort(porN),
    (v) => st.seccion === v, (v) => { st.seccion = st.seccion === v ? "" : v; filtrar(); });
  facetList($("#fMeses"), contar(res, "mes", (d) => [(d.fecha || "").slice(0, 7)]).sort((a, b) => b.valor.localeCompare(a.valor)),
    (v) => st.mes === v, (v) => { st.mes = st.mes === v ? "" : v; st.reciente = 0; filtrar(); }, fmtMes, 4);
  $$("#rapidos button").forEach((b) => b.classList.toggle("on", +b.dataset.dias === st.reciente));
  facetList($("#fTipos"), contar(res, "ext", (d) => [d.ext]).sort(porN),
    (v) => st.ext === v, (v) => { st.ext = st.ext === v ? "" : v; filtrar(); }, (v) => v || "(sin extensión)");
}

function pintarChips() {
  const c = [];
  if (st.q) c.push(["Búsqueda: " + st.q, () => { st.q = ""; $("#q").value = ""; }]);
  if (st.modulo) c.push(["Módulo: " + st.modulo, () => (st.modulo = "")]);
  st.unidades.forEach((t) => c.push([t, () => (st.unidades = st.unidades.filter((x) => x !== t))]));
  st.temas.forEach((t) => c.push(["Tema: " + t, () => (st.temas = st.temas.filter((x) => x !== t))]));
  st.herrs.forEach((t) => c.push(["Herramienta: " + t, () => (st.herrs = st.herrs.filter((x) => x !== t))]));
  if (st.seccion) c.push(["Carpeta: " + st.seccion, () => (st.seccion = "")]);
  if (st.mes) c.push([fmtMes(st.mes), () => (st.mes = "")]);
  if (st.ext) c.push(["Tipo: " + st.ext, () => (st.ext = "")]);
  if (st.reciente) c.push([`Últimos ${st.reciente} días`, () => (st.reciente = 0)]);
  if (st.vista === "papelera") c.push(["Ocultos y desaparecidos", () => (st.vista = "")]);
  const el = $("#chips");
  el.innerHTML = c.map((x, i) => `<span class="chip" data-i="${i}">${esc(x[0])}</span>`).join("");
  $$(".chip", el).forEach((ch) => ch.addEventListener("click", () => { c[+ch.dataset.i][1](); filtrar(); }));
}

function pintarDatalists() {
  const sets = { temas: new Set(), herr: new Set(), mod: new Set(), ud: new Set() };
  for (const d of DOCS.values()) {
    d.temas.forEach((v) => sets.temas.add(v)); d.herramientas.forEach((v) => sets.herr.add(v));
    if (d.modulo) sets.mod.add(d.modulo); d.unidades.forEach((v) => sets.ud.add(v));
  }
  Object.keys(AJ.reglas.temas).forEach((v) => sets.temas.add(v));
  Object.keys(AJ.reglas.herramientas).forEach((v) => sets.herr.add(v));
  const fill = (id, s) => ($(id).innerHTML = [...s].sort().map((v) => `<option value="${esc(v)}">`).join(""));
  fill("#dlTemas", sets.temas); fill("#dlHerr", sets.herr); fill("#dlModulos", sets.mod); fill("#dlUnidades", sets.ud);
}

// estado del escaneo (abajo a la izquierda) y avisos (arriba de la lista)
function pintarEstado() {
  let txt;
  if (CONSULTA) txt = CONSULTA.generado ? `Actualizado el ${fmtFecha(CONSULTA.generado.slice(0, 10))} a las ${CONSULTA.generado.slice(11, 16)}` : "";
  else if (ESC.activo) txt = `Escaneando… ${ESC.vistos} archivos${ESC.actual ? " · " + ESC.actual : ""}`;
  else if (ESC.error) txt = "Error al escanear: " + ESC.error;
  else if (ESC.ultimo) txt = `Actualizado a las ${hora(ESC.ultimo)}` + (ESC.nuevos ? ` · ${ESC.nuevos} nuevos` : "");
  else txt = FUENTE ? `${FUENTE.tipo === "onedrive" ? "OneDrive" : "Carpeta"}: ${FUENTE.nombre}` : "Sin carpeta elegida";
  $("#scanTxt").textContent = txt;
  $("#scanTxt").title = txt;
  $("#scan").className = "scan" + (ESC.activo ? " activo" : ESC.error ? " error" : "");
}
async function pintarAviso() {
  const el = $("#aviso");
  let html = "";
  const f = fuenteObj();
  if (CONSULTA) html = "";
  else if (!FUENTE) html = `Elige de dónde salen tus documentos. <button data-av="inicio" class="primary">Empezar</button>`;
  else if (!(await f.listo(false))) {
    html = FUENTE.tipo === "carpeta" ? `Para buscar cambios y abrir archivos, Encuéntralo necesita permiso para leer «${esc(FUENTE.nombre)}». <button data-av="permiso" class="primary">Dar acceso</button>`
      : FUENTE.tipo === "seleccion" ? `Para buscar cambios y abrir archivos, vuelve a elegir la carpeta «${esc(FUENTE.nombre)}». <button data-av="seleccion" class="primary">Elegir carpeta</button>`
      : !OD.disponible() ? `OneDrive solo funciona desde la página publicada (https) con el Id. de la aplicación configurado.`
      : `Tu sesión de OneDrive ha caducado. <button data-av="login" class="primary">Iniciar sesión</button>`;
  }
  el.innerHTML = html;
  el.hidden = !html;
}
$("#aviso").addEventListener("click", async (ev) => {
  const a = ev.target.closest("[data-av]")?.dataset.av;
  if (a === "inicio") abrirInicio();
  if (a === "permiso" && (await FuenteCarpeta.listo(true))) { await pintarAviso(); escanear(); }
  if (a === "seleccion") $("#inSeleccion").click();
  if (a === "login") OD.login();
});

let tamAntes = 0, pintadoEn = 0;
alCambiarEscaneo = (cambios) => {
  pintarEstado();
  // durante el primer escaneo los documentos van apareciendo poco a poco
  if (ESC.activo && DOCS.size !== tamAntes && Date.now() - pintadoEn > 2000) { tamAntes = DOCS.size; pintadoEn = Date.now(); pintar(); }
  if (!ESC.activo && (cambios || DOCS.size !== tamAntes)) { tamAntes = DOCS.size; pintar(); }
  if (!ESC.activo) { pintarAviso(); programarPublicacion(); }
};

// ------------------------------------------------------------ publicar para alumnos
// tras cada escaneo o cambio, si está activado, se sube el índice (solo si ha cambiado algo)
let tPub;
function programarPublicacion() {
  if (CONSULTA || !PUB.listo() || !PUB.cfg.auto) return;
  clearTimeout(tPub);
  tPub = setTimeout(async () => {
    try {
      const r = await publicar(false);
      if (!r.sinCambios) toast(`Publicado para alumnos: ${r.n} documentos`);
    } catch (e) { toast("No se pudo publicar para alumnos: " + e.message); }
    pintarPublicar();
  }, 4000);
}
function pintarPublicar() {
  const c = PUB.cfg;
  const sinSp = [...DOCS.values()].filter((d) => d.estado === "ok" && !d.enlace && !urlSharepoint(d)).length;
  $("#pubEstado").innerHTML = [
    c.error ? `<span class="err-txt">${esc(c.error)}</span>`
      : c.ultima ? `Última publicación: ${fmtFecha(c.ultima.fecha.slice(0, 10))} a las ${c.ultima.fecha.slice(11, 16)} · ${c.ultima.n} documentos`
      : PUB.listo() ? "Todavía no se ha publicado." : "",
    sinSp ? `${sinSp} documento(s) sin botón para abrir: falta la URL de SharePoint de su módulo (arriba).` : "",
  ].filter(Boolean).join("<br>");
}

// ------------------------------------------------------------ acciones de cada documento
// lo que el navegador sabe mostrar se abre en otra pestaña; el resto se descarga
const VISIBLE = { ".pdf": "application/pdf", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".webp": "image/webp", ".mp4": "video/mp4", ".webm": "video/webm", ".mp3": "audio/mpeg", ".wav": "audio/wav" };
const COMO_TEXTO = new Set([".txt", ".md", ".csv", ".log", ".py", ".sh", ".ps1", ".rsc", ".conf", ".cfg", ".sql", ".bat", ".ini", ".yml", ".yaml", ".json"]);

async function abrirArchivo(d, descargar) {
  if (FUENTE.tipo === "onedrive") {
    if (!descargar) return window.open(d.od.web, "_blank", "noopener");
    location.href = await OD.urlDescarga(d.od.id);
    return;
  }
  const f = fuenteObj();
  if (!(await f.listo(false))) {
    if (FUENTE.tipo === "carpeta" && (await f.listo(true))) { pintarAviso(); toast("Acceso concedido: vuelve a pulsar"); return; }
    throw new Error("Primero da acceso a la carpeta (aviso de arriba)");
  }
  const tipo = VISIBLE[d.ext] || (COMO_TEXTO.has(d.ext) ? "text/plain;charset=utf-8" : "");
  const enPestana = !descargar && tipo;
  const w = enPestana ? window.open("", "_blank") : null;
  try {
    const file = await f.archivo(d);
    const url = URL.createObjectURL(enPestana ? new Blob([file], { type: tipo }) : file);
    if (enPestana) w.location.href = url;
    else { const a = document.createElement("a"); a.href = url; a.download = d.nombre; a.click(); }
    setTimeout(() => URL.revokeObjectURL(url), 120_000);
  } catch (e) {
    w?.close();
    throw e.name === "NotFoundError" ? new Error("Ese archivo ya no está en la carpeta: pulsa Escanear") : e;
  }
}

async function accion(ev, d, sp) {
  const t = ev.target.closest("[data-act],[data-tema],[data-herr],[data-mod],[data-ud]");
  if (!t) return;
  if (t.dataset.tema) { if (!st.temas.includes(t.dataset.tema)) st.temas.push(t.dataset.tema); return filtrar(); }
  if (t.dataset.herr) { if (!st.herrs.includes(t.dataset.herr)) st.herrs.push(t.dataset.herr); return filtrar(); }
  if (t.dataset.mod) { st.modulo = t.dataset.mod; return filtrar(); }
  if (t.dataset.ud) { if (!st.unidades.includes(t.dataset.ud)) st.unidades.push(t.dataset.ud); return filtrar(); }
  const act = t.dataset.act;
  try {
    if (act === "enlace") window.open(d.enlace, "_blank", "noopener");
    if (act === "sharepoint") window.open(sp, "_blank", "noopener");
    if (act === "ver") await abrirArchivo(d, false);
    if (act === "descargar") await abrirArchivo(d, true);
    if (act === "editar") editar(d);
    if (act === "ocultar" || act === "restaurar") {
      d.estado = act === "ocultar" ? "oculto" : "ok";
      await BD.guardar([d]);
      if (act === "ocultar") toast("Ocultado. Puedes restaurarlo en Ajustes → ver ocultos.");
      pintar(); programarPublicacion();
    }
    if (act === "quitar") { DOCS.delete(d.ruta); await BD.quitar([d.ruta]); pintar(); }
  } catch (e) { toast(e.message); }
}

// ------------------------------------------------------------ editar
function tagEditor(el, valores, lista) {
  const vals = [...valores];
  const tipoClase = { temas: "tema", herramientas: "herr", unidades: "ud badge" }[el.dataset.tipo];
  const render = () => {
    el.innerHTML = vals.map((v, i) => `<span class="tag ${tipoClase} ${col(v)}" data-i="${i}">${esc(v)}</span>`).join("") +
      `<input list="${lista}" placeholder="Añadir y pulsar Enter">`;
    $$(".tag", el).forEach((s) => s.addEventListener("click", () => { vals.splice(+s.dataset.i, 1); render(); }));
    const inp = $("input", el);
    const add = () => { const v = inp.value.trim().replace(/,$/, ""); if (v && !vals.includes(v)) vals.push(v); inp.value = ""; render(); $("input", el).focus(); };
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } });
    inp.addEventListener("change", () => { if (inp.value.trim()) add(); });
  };
  render();
  return () => { const pend = $("input", el).value.trim(); if (pend && !vals.includes(pend)) vals.push(pend); return vals; };
}

function editar(d) {
  $("#edNombre").textContent = (EMOJI_EXT[(d.ext || "").replace(".", "")] || "📄") + " " + d.nombre;
  $("#edRuta").textContent = (FUENTE?.nombre ? FUENTE.nombre + "/" : "") + d.ruta;
  $("#edFecha").value = d.fecha || ""; $("#edModulo").value = d.modulo || ""; $("#edNotas").value = d.notas || "";
  $("#edExtracto").textContent = d.texto ? d.texto.slice(0, 5000) : d.leido ? "(sin texto extraíble)" : "(aún no se ha podido leer: hace falta internet para PDF y Office)";
  const getT = tagEditor($('.tagedit[data-tipo="temas"]'), d.temas, "dlTemas");
  const getH = tagEditor($('.tagedit[data-tipo="herramientas"]'), d.herramientas, "dlHerr");
  const getU = tagEditor($('.tagedit[data-tipo="unidades"]'), d.unidades, "dlUnidades");
  const dlg = $("#dlgEditar");
  $("#edAuto").onclick = async () => {
    Object.assign(d, { manual: false, fechaManual: false });
    preparar(recalcular(d)); await BD.guardar([d]);
    dlg.close("x"); pintar(); programarPublicacion();
  };
  dlg.returnValue = "";
  dlg.showModal();
  dlg.onclose = async () => {
    if (dlg.returnValue !== "ok") return;
    const t = getT(), h = getH(), u = getU().map((x) => x.toUpperCase()), m = $("#edModulo").value.trim();
    const cambia = (x, y) => JSON.stringify(x) !== JSON.stringify(y);
    if (cambia(t, d.temas) || cambia(h, d.herramientas) || cambia(u, d.unidades) || m !== (d.modulo || "")) {
      Object.assign(d, { manual: true, temas: t, herramientas: h, unidades: u, modulo: m });
    }
    const f = $("#edFecha").value;
    if (f !== (d.fecha || "")) Object.assign(d, { fechaManual: !!f, fecha: f });
    d.notas = $("#edNotas").value.trim();
    preparar(recalcular(d));
    await BD.guardar([d]);
    pintar(); programarPublicacion();
  };
}

// ------------------------------------------------------------ elegir de dónde salen los documentos
function abrirInicio() {
  const od = $("#inOd"), hint = $("#inOdHint");
  $("#inOdCarpeta").value = FUENTE?.tipo === "onedrive" ? FUENTE.carpeta : CONFIG.carpetaOneDrive;
  $("#inClientId").value = localStorage.getItem("enc_clientId") || "";
  $("#inOdAvanzado").hidden = !!CONFIG.clientId;
  $("#inOdAvanzado").open = !OD.clientId();
  const archivo = location.protocol === "file:";
  od.disabled = archivo;
  if (archivo) hint.textContent = "Solo funciona desde la página publicada (https://…), no abriendo el archivo con doble clic.";
  if (!window.showDirectoryPicker) $("#inCarpetaHint").textContent = "Este navegador no recuerda la carpeta: tendrás que elegirla en cada visita (en Chrome o Edge se recuerda). Tus etiquetas y notas sí se guardan.";
  $("#dlgInicio").showModal();
}
async function empezar(fuente) {
  await cambiarFuente(fuente);
  $("#dlgInicio").close();
  ESC.ultimo = null; ESC.error = "";
  st.mostrados = 0;
  pintar(); pintarEstado(); await pintarAviso();
  escanear();
}
$("#inCarpeta").addEventListener("click", async () => {
  if (!window.showDirectoryPicker) return $("#inSeleccion").click();
  try {
    const nombre = await FuenteCarpeta.elegir();
    await empezar({ tipo: "carpeta", nombre });
  } catch (e) { if (e.name !== "AbortError") toast(e.message); }
});
$("#inSeleccion").addEventListener("change", async (e) => {
  if (!e.target.files.length) return;
  const nombre = FuenteSeleccion.usar(e.target.files);
  e.target.value = "";
  if (FUENTE?.tipo === "seleccion" && FUENTE.nombre === nombre) { await pintarAviso(); escanear(); $("#dlgInicio").close(); return; }
  await empezar({ tipo: "seleccion", nombre });
});
$("#inOd").addEventListener("click", () => {
  const id = $("#inClientId").value.trim();
  if (id) localStorage.setItem("enc_clientId", id);
  if (!OD.clientId()) { $("#inOdAvanzado").open = true; return toast("Falta el Id. de la aplicación (ver guía)"); }
  sessionStorage.setItem("enc_od_carpeta", $("#inOdCarpeta").value.trim().replace(/^\/+|\/+$/g, ""));
  OD.login();
});

// ------------------------------------------------------------ ajustes
const reglasATexto = (o) => Object.entries(o).map(([k, v]) => `${k}: ${v.join(", ")}`).join("\n");
const textoAReglas = (t) => Object.fromEntries(t.split("\n").map((l) => l.trim()).filter((l) => l.includes(":"))
  .map((l) => { const i = l.indexOf(":"); return [l.slice(0, i).trim(), l.slice(i + 1).split(",").map((s) => s.trim()).filter(Boolean)]; })
  .filter(([k]) => k));

function abrirAjustes() {
  $("#ajFuente").textContent = !FUENTE ? "Todavía no has elegido carpeta."
    : FUENTE.tipo === "onedrive" ? `OneDrive personal: carpeta «${FUENTE.carpeta || "(raíz)"}»`
    : `Carpeta de este ordenador: «${FUENTE.nombre}»` + (FUENTE.tipo === "seleccion" ? " (se elige en cada visita)" : "");
  $("#ajSalir").hidden = FUENTE?.tipo !== "onedrive";
  const nombres = [...new Set([...[...DOCS.values()].map((d) => d.modulo), ...Object.keys(AJ.modulos)])].filter(Boolean).sort();
  $("#modulos").innerHTML = nombres.length ? nombres.map((m) => {
    const c = AJ.modulos[m] || {};
    return `<div class="modulo" data-m="${esc(m)}">
      <span class="badge mod ${col(m)}">${esc(m)}</span>
      <input data-k="sharepoint" value="${esc(c.sharepoint || "")}" placeholder="URL de la clase en SharePoint (opcional)">
      <input data-k="tema" value="${esc(c.tema || "")}" placeholder="Tema fijo (opcional)" list="dlTemas">
      <label class="check" title="Usa la primera carpeta dentro de Materiales de clase / Trabajo de clase como tema"><input type="checkbox" data-k="temaSubcarpeta" ${c.temaSubcarpeta ? "checked" : ""}> Subcarpeta = tema</label>
    </div>`;
  }).join("") : `<p class="hint"><i>Aparecerán aquí cuando haya documentos.</i></p>`;
  $("#reglasHerr").value = reglasATexto(AJ.reglas.herramientas);
  $("#reglasTemas").value = reglasATexto(AJ.reglas.temas);
  $("#temasIgn").value = AJ.temasIgnorados.join(", ");
  $("#pubToken").value = PUB.cfg.token;
  $("#pubRepo").value = PUB.cfg.repo;
  $("#pubTexto").checked = PUB.cfg.texto;
  $("#pubAuto").checked = PUB.cfg.auto;
  $("#pubUrl").value = urlAlumnos();
  pintarPublicar();
  const fuera = [...DOCS.values()].filter((d) => d.estado !== "ok").length;
  $("#nOcultos").textContent = fuera ? `(${fuera})` : "(ninguno)";
  $("#dlgAjustes").returnValue = "";
  $("#dlgAjustes").showModal();
}
$("#dlgAjustes").addEventListener("close", async () => {
  if ($("#dlgAjustes").returnValue !== "ok") return;
  const modulos = { ...AJ.modulos };
  $$("#modulos .modulo").forEach((row) => {
    const c = {};
    $$("input", row).forEach((i) => (c[i.dataset.k] = i.type === "checkbox" ? i.checked : i.value.trim()));
    modulos[row.dataset.m] = c;
  });
  Object.assign(AJ, {
    modulos,
    reglas: { herramientas: textoAReglas($("#reglasHerr").value), temas: textoAReglas($("#reglasTemas").value) },
    temasIgnorados: $("#temasIgn").value.split(",").map((s) => s.trim()).filter(Boolean),
  });
  await guardarAjustes();
  leerPublicar();
  await PUB.guardar();
  await reaplicar();
  pintar();
  toast("Ajustes guardados y aplicados");
  programarPublicacion();
});
function leerPublicar() {
  const repo = $("#pubRepo").value.trim().replace(/^https:\/\/github\.com\//, "").replace(/\/+$/, "");
  const cambia = repo !== PUB.cfg.repo || $("#pubTexto").checked !== PUB.cfg.texto;
  Object.assign(PUB.cfg, { token: $("#pubToken").value.trim(), repo, texto: $("#pubTexto").checked, auto: $("#pubAuto").checked });
  if (cambia) PUB.cfg.huella = "";  // otro repositorio u otro contenido: hay que volver a subirlo
}
$("#pubAhora").addEventListener("click", async () => {
  leerPublicar();
  await PUB.guardar();
  const b = $("#pubAhora");
  b.disabled = true; b.textContent = "Publicando…";
  try {
    const r = await publicar(true);
    toast(`Publicado: ${r.n} documentos. Los alumnos lo verán en unos minutos.`);
  } catch (e) { toast(e.message); }
  b.disabled = false; b.textContent = "Publicar ahora";
  pintarPublicar();
});
$("#pubCopiar").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText($("#pubUrl").value); toast("Dirección copiada"); }
  catch { $("#pubUrl").select(); }
});
$("#ajCambiar").addEventListener("click", () => { $("#dlgAjustes").close("cancel"); abrirInicio(); });
$("#ajSalir").addEventListener("click", () => { OD.salir(); $("#dlgAjustes").close("cancel"); pintarAviso(); toast("Sesión de OneDrive cerrada"); });
$("#ajExportar").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(exportar(), null, 2)], { type: "application/json" }));
  const a = document.createElement("a"); a.href = url; a.download = `encuentralo-copia-${isoLocal(new Date())}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
});
$("#ajImportar").addEventListener("click", () => $("#ajImportarArchivo").click());
$("#ajImportarArchivo").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  e.target.value = "";
  if (!f) return;
  try {
    const n = await importar(JSON.parse(await f.text()));
    $("#dlgAjustes").close("cancel");
    pintar();
    toast(`Copia importada${n ? ` (${n} documentos con cambios)` : ""}. Lo que falte se aplicará al escanear.`);
  } catch (err) { toast(err.message); }
});
$("#ajBorrar").addEventListener("click", async () => {
  if (!confirm("¿Borrar el índice de este navegador? Tus archivos no se tocan; se vuelve a crear escaneando. Las etiquetas editadas, notas y ocultos se pierden (salvo que tengas una copia exportada).")) return;
  DOCS.clear(); await BD.vaciar();
  $("#dlgAjustes").close("cancel");
  pintar(); escanear();
});
$("#btnVerOcultos").addEventListener("click", () => { $("#dlgAjustes").close("cancel"); st.vista = "papelera"; filtrar(); });

// ------------------------------------------------------------ eventos generales
// "Cancelar" no es botón de envío: así Enter en un campo acepta en vez de cancelar
$$('dialog button[value="cancel"]').forEach((b) => {
  b.type = "button";
  b.addEventListener("click", () => b.closest("dialog").close("cancel"));
});
let tq;
$("#q").addEventListener("input", (e) => { clearTimeout(tq); tq = setTimeout(() => { st.q = e.target.value.trim(); filtrar(); }, 200); });
$("#orden").addEventListener("change", (e) => { st.orden = e.target.value; filtrar(); });
$$("#rapidos button").forEach((b) => b.addEventListener("click", () => {
  const d = +b.dataset.dias; st.reciente = st.reciente === d ? 0 : d; st.mes = ""; filtrar();
}));
$$(".vistas a").forEach((a) => a.addEventListener("click", () => { st.vista = a.dataset.vista; filtrar(); }));
$("#btnMas").addEventListener("click", () => { st.mostrados += POR_PAGINA; pintar(true); });
function pintarSelectorVista() {
  $$("#vistas button").forEach((b) => b.classList.toggle("on", b.dataset.v === vistaActual()));
  $("#lista").className = "lista vista-" + vistaActual();
}
$$("#vistas button").forEach((b) => b.addEventListener("click", () => { vistaLista = b.dataset.v; guardarLS("ix_vista", vistaLista); pintarSelectorVista(); }));
MOVIL.addEventListener("change", pintarSelectorVista);
$("#btnAjustes").addEventListener("click", abrirAjustes);
$("#btnFiltros").addEventListener("click", () => $("#side").classList.toggle("open"));
$("#btnEscanear").addEventListener("click", async () => {
  if (!FUENTE) return abrirInicio();
  if (FUENTE.tipo === "carpeta") await FuenteCarpeta.listo(true);  // dentro del clic se puede pedir permiso
  if (!(await escanear()) && !ESC.activo) { await pintarAviso(); toast("No se puede leer la carpeta todavía: mira el aviso de arriba"); }
});
document.addEventListener("keydown", (e) => { if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); $("#q").focus(); } });
// al volver a la pestaña, si hace rato del último escaneo, se buscan cambios
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && FUENTE && !CONSULTA && (!ESC.ultimo || Date.now() - ESC.ultimo > 5 * 60_000)) escanear();
});

// los alumnos (o cualquiera sin carpeta elegida) ven el índice publicado por la profe, si lo hay
function entrarConsulta(pub) {
  CONSULTA = { generado: pub.generado || "" };
  document.body.classList.add("consulta");
  DOCS.clear();
  for (const d of pub.docs) {
    DOCS.set(d.ruta, preparar(Object.assign({ estado: "ok", unidades: [], temas: [], herramientas: [], notas: "", texto: "", carpeta: "" }, d)));
  }
  pintar(); pintarEstado(); pintarAviso();
}

(async function init() {
  pintarSelectorVista();
  const forzarConsulta = new URLSearchParams(location.search).has("alumnos");
  let bd = null;
  try { await cargarIndice(); await PUB.cargar(); } catch (e) { bd = e; }
  if (forzarConsulta || bd || !FUENTE) {
    const pub = await cargarPublicado();
    if (pub) return entrarConsulta(pub);
  }
  if (bd) { toast("No se pudo abrir el almacenamiento del navegador: " + bd.message); return; }
  try {
    if (await OD.alVolver()) {
      const carpeta = sessionStorage.getItem("enc_od_carpeta") ?? CONFIG.carpetaOneDrive;
      sessionStorage.removeItem("enc_od_carpeta");
      OD.carpeta = carpeta;
      await cambiarFuente({ tipo: "onedrive", nombre: "OneDrive/" + carpeta, carpeta });
    }
  } catch (e) { toast(e.message); }
  tamAntes = DOCS.size;
  pintar(); pintarEstado();
  await pintarAviso();
  if (!FUENTE) abrirInicio();
  else escanear();
  setInterval(() => { if (document.visibilityState === "visible") escanear(); }, 10 * 60_000);
})();
