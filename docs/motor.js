"use strict";
/* Encuéntralo web — motor: todo ocurre en el navegador.
   - Guarda el índice en IndexedDB (documentos + texto) y los ajustes también ahí.
   - Fuentes: una carpeta del PC (File System Access), la misma carpeta elegida a mano (navegadores sin
     esa API) o el OneDrive personal (Microsoft Graph, inicio de sesión con PKCE, sin servidor).
   - Mismas reglas que la versión con servidor: módulo, unidad, fecha, temas y herramientas. */

const CONFIG = Object.assign({ clientId: "", carpetaOneDrive: "Indexatodo" }, window.ENCUENTRALO || {});

// ------------------------------------------------------------ ajustes por defecto
const REGLAS_FORENSES = {
  "Volatility": ["volatility", "volatility3", "vol.py"],
  "Autopsy": ["autopsy"],
  "Sleuth Kit": ["sleuth kit", "sleuthkit", "mmls"],
  "FTK Imager": ["ftk", "ftk imager", ".ad1"],
  "Plaso / log2timeline": ["plaso", "log2timeline", "psort"],
  "EnCase": ["encase", ".e01"],
  "Guymager": ["guymager"],
  "dc3dd / dcfldd": ["dc3dd", "dcfldd"],
  "CyberChef": ["cyberchef"],
  "RegRipper / Registro": ["regripper", "registry explorer"],
  "KAPE / Zimmerman": ["kape", "mftecmd", "pecmd", "timeline explorer"],
  "Bulk Extractor": ["bulk_extractor", "bulk extractor"],
};
const AJUSTES_DEF = {
  reglas: {
    herramientas: {
      "Packet Tracer": [".pkt", ".pka", "packet tracer"],
      "MikroTik": ["mikrotik", "routeros", "winbox", ".rsc"],
      "Wireshark": [".pcap", ".pcapng", "wireshark"],
      "Cisco IOS": ["cisco ios", "running-config", "show ip"],
      "Linux": ["linux", "ubuntu", "debian", "bash"],
      "Windows Server": ["windows server", "active directory", "powershell", ".ps1"],
      "Docker": ["docker", "dockerfile", "docker-compose"],
      "VirtualBox": ["virtualbox", ".ova", ".vdi"],
      "Python": [".py", "python"],
      "SQL": [".sql", "mysql", "postgresql", "sqlite"],
      "Kali": ["kali", "nmap", "metasploit", "burp"],
      "Excel": [".xlsx", ".xls"],
      "Word": [".docx", ".doc"],
      "PowerPoint": [".pptx", ".ppt"],
      "PDF": [".pdf"],
      ...REGLAS_FORENSES,
    },
    temas: {
      "Análisis forense": ["forense", "cadena de custodia", "evidencia digital", "peritaje", "perito"],
      "Redes": ["vlan", "subred", "subnetting", "enrutamiento", "ospf", "tcp/ip", "switch"],
      "Ciberseguridad": ["ciberseguridad", "malware", "vulnerabilidad", "pentest", "hardening", "firewall"],
      "Sistemas operativos": ["sistema operativo", "particiones", "usuarios y grupos"],
      "Bases de datos": ["base de datos", "bases de datos", "consulta sql"],
      "Evaluación": ["rúbrica", "rubrica", "examen", "evaluación", "calificaciones"],
    },
  },
  temasIgnorados: ["General", "Documentos", "Documentos compartidos", "Shared Documents"],
  ignorar: ["desktop.ini", "thumbs.db", "~$*", "*.tmp", ".~lock*", "*.lnk"],
  // por módulo: { sharepoint: "https://….sharepoint.com/sites/…", tema: "", temaSubcarpeta: false }
  modulos: {},
  maxMB: 40,
};
let AJ = structuredClone(AJUSTES_DEF);

// ------------------------------------------------------------ IndexedDB
const BD = {
  _db: null,
  abrir() {
    return (this._db ??= new Promise((ok, ko) => {
      const r = indexedDB.open("encuentralo", 1);
      r.onupgradeneeded = () => { r.result.createObjectStore("docs", { keyPath: "ruta" }); r.result.createObjectStore("kv"); };
      r.onsuccess = () => ok(r.result);
      r.onerror = () => ko(r.error);
    }));
  },
  async tx(store, modo, fn) {
    const db = await this.abrir();
    return new Promise((ok, ko) => {
      const t = db.transaction(store, modo);
      let res;
      const r = fn(t.objectStore(store));
      if (r) r.onsuccess = () => (res = r.result);
      t.oncomplete = () => ok(res);
      t.onerror = t.onabort = () => ko(t.error);
    });
  },
  get: (k) => BD.tx("kv", "readonly", (s) => s.get(k)),
  set: (k, v) => BD.tx("kv", "readwrite", (s) => s.put(v, k)),
  del: (k) => BD.tx("kv", "readwrite", (s) => s.delete(k)),
  docs: () => BD.tx("docs", "readonly", (s) => s.getAll()),
  // en memoria cada doc lleva campos "_" (texto normalizado para buscar): no se guardan
  guardar: (docs) => BD.tx("docs", "readwrite", (s) => {
    for (const d of docs) s.put(Object.fromEntries(Object.entries(d).filter(([k]) => !k.startsWith("_"))));
  }),
  quitar: (rutas) => BD.tx("docs", "readwrite", (s) => { for (const r of rutas) s.delete(r); }),
  vaciar: () => BD.tx("docs", "readwrite", (s) => s.clear()),
};

// ------------------------------------------------------------ utilidades de texto
const norm = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
// igual que norm pero sin cambiar la longitud: así las posiciones sirven para el texto original (resaltado)
const normIgual = (s) => (s || "").replace(/[^\x00-\x7f]/g, (c) => {
  const b = c.normalize("NFD")[0].toLowerCase();
  return b.length === 1 ? b : c;
}).toLowerCase();
const isoLocal = (d) => d.toLocaleDateString("sv-SE");  // AAAA-MM-DD en hora local
const ahoraISO = () => { const d = new Date(); return isoLocal(d) + "T" + d.toTimeString().slice(0, 8); };
const extDe = (n) => { const i = n.lastIndexOf("."); return i > 0 ? n.slice(i).toLowerCase() : ""; };

const _glob = new Map();
function ignorado(nombre) {
  if (nombre.startsWith(".")) return true;
  const n = nombre.toLowerCase();
  return AJ.ignorar.some((p) => {
    let rx = _glob.get(p);
    if (!rx) _glob.set(p, (rx = new RegExp("^" + p.toLowerCase().replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$")));
    return rx.test(n);
  });
}

// Power Automate puede anteponer la fecha de subida: "2026-11-12~Práctica.pdf" (OneDrive guarda a veces "_").
const MARCA_FECHA_RE = /^(20\d\d-\d\d-\d\d)[~_](?=.)/;
const nombreVisible = (n) => n.replace(MARCA_FECHA_RE, "");

function fechaValida(y, m, d) {
  const f = new Date(y, m - 1, d);
  return f.getFullYear() === y && f.getMonth() === m - 1 && f.getDate() === d ? f : null;
}
const FECHA_RE = [
  [/(20\d\d)[-_.](\d{1,2})[-_.](\d{1,2})/, ["y", "m", "d"]],
  [/(\d{1,2})[-_.](\d{1,2})[-_.](20\d\d)/, ["d", "m", "y"]],
];
function fechaDeNombre(nombre) {
  for (const [rx, orden] of FECHA_RE) {
    const m = nombre.match(rx);
    if (!m) continue;
    const v = Object.fromEntries(orden.map((k, i) => [k, +m[i + 1]]));
    const f = fechaValida(v.y, v.m, v.d);
    if (f) return isoLocal(f);
  }
  return "";
}
const MESES = { ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6, jul: 7, ago: 8, sep: 9, oct: 10, nov: 11, dic: 12 };
const FECHA_CARPETA_RE = /(?<!\d)(\d{1,2})\s*(?:de\s+)?(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[a-z]*(?:\s+(?:de\s+)?(20\d\d))?(?![a-z])/;
// 'UD1/Jue 12 Nov' o '…/8 de octubre de 2026' -> fecha. Sin año: el más reciente que no sea futuro.
function fechaDeCarpeta(ruta) {
  const hoy = new Date();
  for (const parte of norm(ruta).split("/").filter(Boolean).reverse()) {
    const m = parte.match(FECHA_CARPETA_RE);
    if (!m) continue;
    const dia = +m[1], mes = MESES[m[2]];
    const anios = m[3] ? [+m[3]] : [hoy.getFullYear(), hoy.getFullYear() - 1];
    for (const a of anios) {
      const f = fechaValida(a, mes, dia);
      if (!f) break;
      if (m[3] || f <= hoy) return isoLocal(f);
    }
  }
  return "";
}

const UNIDAD_RE = /(?<![a-z0-9])(?:ud|ut|unidad(?: didactica| de trabajo)?|tema)[\s_\-.]*0*(\d{1,2})(?!\d)/g;
function detectarUnidades(nombre, carpeta) {
  for (const t of [carpeta, nombre]) {
    const s = new Set([...norm(t).matchAll(UNIDAD_RE)].map((m) => "UD" + +m[1]));
    if (s.size) return s;
  }
  return new Set();
}

const _kw = new Map();
function coincide(kw, ext, meta, cont) {
  kw = norm(kw.trim());
  if (!kw) return false;
  if (kw.startsWith(".") && !kw.includes(" ")) return ext === kw;
  let rx = _kw.get(kw);
  // detrás puede ir un número (volatility2, python3) pero no otra letra
  if (!rx) _kw.set(kw, (rx = new RegExp("(?<![\\p{L}\\p{N}_])" + kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?!\\p{L})", "gu")));
  rx.lastIndex = 0;
  if (rx.test(meta)) return true;
  if (!cont) return false;
  // en el contenido exigimos varias apariciones para evitar ruido
  rx.lastIndex = 0;
  let n = 0;
  while (rx.exec(cont)) if (++n >= 3) return true;
  return false;
}

// 'IESCentro26-CICLO-AFI-12345678,87654321, - Materiales de clase' -> { modulo: 'AFI', biblioteca: 'Materiales de clase' }
// (así se llaman las carpetas de clase cuando se sincronizan con la app de OneDrive)
function carpetaDeClase(nombre) {
  const i = nombre.indexOf(" - ");
  if (i < 0) return null;
  const trozos = nombre.slice(0, i).split("-").map((t) => t.trim()).filter(Boolean);
  const utiles = trozos.filter((t) => !/^[\d,\s]+$/.test(t));
  if (trozos.length < 2 || !utiles.length) return null;
  return { modulo: utiles.at(-1), biblioteca: nombre.slice(i + 3).trim() };
}

/* De la ruta dentro de la carpeta elegida saca módulo y ubicación. Dos formas de organizarlo:
   - AFI/Materiales de clase/UD1/Jue 12 Nov/x.pdf   (lo que copia Power Automate: una carpeta por módulo)
   - IES…-AFI-…, - Materiales de clase/UD1/Jue 12 Nov/x.pdf   (bibliotecas sincronizadas con OneDrive)
   "sp" son las carpetas tal como están en el sitio de SharePoint: <biblioteca>/<carpetas>. */
function ubicar(ruta) {
  const p = ruta.split("/");
  const archivo = p.pop();
  let modulo = "", sp = [];
  if (p.length) {
    const clase = carpetaDeClase(p[0]);
    modulo = clase ? clase.modulo : p[0];
    sp = clase ? [clase.biblioteca, ...p.slice(1)] : p.slice(1);
  }
  return { archivo, modulo, sp };
}

function autoEtiquetas(d, sp) {
  const rel = [...sp, d.nombre].join("/");
  const meta = norm(rel), cont = d.texto ? norm(d.texto.slice(0, 200_000)) : "";
  const temas = new Set(), herrs = new Set();
  for (const [h, kws] of Object.entries(AJ.reglas.herramientas)) if (kws.some((k) => coincide(k, d.ext, meta, cont))) herrs.add(h);
  for (const [t, kws] of Object.entries(AJ.reglas.temas)) if (kws.some((k) => coincide(k, d.ext, meta, cont))) temas.add(t);
  const mc = AJ.modulos[d.modulo] || {};
  if (mc.tema?.trim()) temas.add(mc.tema.trim());
  if (mc.temaSubcarpeta) {
    // la primera carpeta dentro de la biblioteca (no "Materiales de clase" ni "Classwork"), si no es una unidad o una fecha
    const c = sp[1];
    const ign = new Set(AJ.temasIgnorados.map(norm));
    if (c && !ign.has(norm(c)) && !detectarUnidades(c, "").size && !fechaDeCarpeta(c)) temas.add(c);
  }
  const unidades = [...detectarUnidades(d.nombre, sp.join("/"))].sort((a, b) => a.slice(2) - b.slice(2));
  return { temas: [...temas].sort(), herramientas: [...herrs].sort(), unidades };
}

// Recalcula todo lo que sale de la ruta y de las reglas, respetando lo editado a mano.
function recalcular(d) {
  const u = ubicar(d.ruta);
  d.carpeta = u.sp.join("/");
  if (!d.manual) d.modulo = u.modulo;
  if (!d.fechaManual) d.fecha = fechaDeNombre(u.archivo) || fechaDeCarpeta(d.carpeta) || isoLocal(new Date(d.mtime));
  if (!d.manual) Object.assign(d, autoEtiquetas(d, u.sp));
  return d;
}

// ------------------------------------------------------------ extracción de texto
const MAX_TEXTO = 200_000;
const TEXT_EXT = new Set([".txt", ".md", ".csv", ".json", ".py", ".sh", ".ps1", ".rsc", ".conf", ".cfg", ".html", ".htm",
  ".xml", ".yml", ".yaml", ".log", ".sql", ".bat", ".ini", ".js", ".css", ".url", ".webloc"]);
const OOXML = { ".docx": "word/document.xml", ".pptx": "ppt/slides/", ".xlsx": "xl/sharedStrings.xml" };
const ODF = new Set([".odt", ".odp", ".ods"]);
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function xmlTexto(xml) {
  return xml.replace(/<\/(w:p|a:p|text:p|text:h|si|p|div|li|tr|h\d)>/g, "\n").replace(/<(w:tab|text:tab)\s*\/>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => e[0] === "#"
      ? String.fromCodePoint(parseInt(e[1] === "x" || e[1] === "X" ? e.slice(2) : e.slice(1), e[1] === "x" || e[1] === "X" ? 16 : 10))
      : ENT[e.toLowerCase()] ?? m);
}
function decodificar(buf) {
  try { return new TextDecoder("utf-8", { fatal: true }).decode(buf); } catch { return new TextDecoder("windows-1252").decode(buf); }
}
// Devuelve el texto, o null si falta la librería necesaria (sin internet): se reintenta en otro escaneo.
async function extraerTexto(buf, ext) {
  try {
    if (TEXT_EXT.has(ext)) {
      const t = decodificar(buf.slice(0, 2_000_000));
      return ([".html", ".htm", ".xml"].includes(ext) ? xmlTexto(t) : t).slice(0, MAX_TEXTO);
    }
    if (OOXML[ext] || ODF.has(ext)) {
      if (!window.JSZip) return null;
      const z = await JSZip.loadAsync(buf);
      const pref = OOXML[ext] || "content.xml";
      const nombres = Object.keys(z.files).filter((n) => n.startsWith(pref) && n.endsWith(".xml"))
        .sort((a, b) => (+a.replace(/\D/g, "") || 0) - (+b.replace(/\D/g, "") || 0));
      let t = "";
      for (const n of nombres) {
        t += xmlTexto(await z.file(n).async("string")) + "\n";
        if (t.length > MAX_TEXTO) break;
      }
      return t.slice(0, MAX_TEXTO);
    }
    if (ext === ".pdf") {
      if (!window.pdfjsLib) return null;
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise;
      let t = "";
      for (let i = 1; i <= Math.min(pdf.numPages, 80) && t.length < MAX_TEXTO; i++) {
        const c = await (await pdf.getPage(i)).getTextContent();
        t += c.items.map((it) => it.str + (it.hasEOL ? "\n" : " ")).join("") + "\n";
      }
      pdf.destroy();
      return t.slice(0, MAX_TEXTO);
    }
  } catch (e) {
    console.warn("[texto]", ext, e);
  }
  return "";
}
function leerEnlace(texto, ext) {
  const m = ext === ".webloc" ? texto.match(/<string>\s*([^<\s]+)\s*<\/string>/i) : texto.match(/^\s*URL\s*=\s*(\S+)/mi);
  return m && /^https?:\/\//i.test(m[1]) ? m[1] : "";
}

// SharePoint: vista previa del archivo dentro de su biblioteca en el sitio de la clase.
function baseSharepoint(url) {
  const m = (url || "").match(/^\s*(https:\/\/[^/\s]+\.sharepoint\.com\/(?:sites|teams)\/[^/?#\s]+)/i);
  return m ? m[1] : "";
}
// La biblioteca "Documentos" (donde está Classwork) se llama "Shared Documents" en las direcciones de SharePoint
const ES_DOCUMENTOS = /^(documentos|documentos compartidos|shared documents)$/i;
function urlSharepoint(d) {
  const sitio = baseSharepoint(AJ.modulos[d.modulo]?.sharepoint);
  if (!sitio || !d.carpeta) return "";
  const partes = d.carpeta.split("/");
  if (ES_DOCUMENTOS.test(partes[0])) partes[0] = "Shared Documents";
  const srv = new URL(sitio).pathname, carpeta = partes.join("/");
  const enc = (s) => encodeURIComponent(s).replace(/%2F/g, "/");
  const archivo = `${srv}/${carpeta}/${d.nombre}`, padre = `${srv}/${carpeta}`;
  return `${sitio}/${encodeURIComponent(partes[0])}/Forms/AllItems.aspx?id=${enc(archivo)}&parent=${enc(padre)}`;
}

// ------------------------------------------------------------ fuentes
/* Cada fuente tiene: listar() (generador de { ruta, tamano, mtime, leer(), od? }), archivo(doc) → File o URL,
   y listo(pedir) → true si se puede leer ya (pedir=true solo dentro de un clic: puede pedir permiso). */

// 1) Carpeta del PC con acceso recordado (Chrome, Edge)
const FuenteCarpeta = {
  tipo: "carpeta",
  h: null,
  async cargar() { this.h = await BD.get("carpeta"); return !!this.h; },
  async elegir() {
    this.h = await showDirectoryPicker({ id: "encuentralo", mode: "read" });
    await BD.set("carpeta", this.h);
    return this.h.name;
  },
  async listo(pedir) {
    if (!this.h) return false;
    if ((await this.h.queryPermission({ mode: "read" })) === "granted") return true;
    return pedir && (await this.h.requestPermission({ mode: "read" })) === "granted";
  },
  async *listar(h = this.h, pref = "") {
    for await (const [nombre, e] of h.entries()) {
      if (ignorado(nombre)) continue;
      if (e.kind === "directory") { yield* this.listar(e, pref + nombre + "/"); continue; }
      const f = await e.getFile();
      yield { ruta: pref + nombre, tamano: f.size, mtime: f.lastModified, leer: () => f.arrayBuffer() };
    }
  },
  async archivo(d) {
    const p = d.ruta.split("/");
    let dir = this.h;
    for (const x of p.slice(0, -1)) dir = await dir.getDirectoryHandle(x);
    return (await dir.getFileHandle(p.at(-1))).getFile();
  },
};

// 2) Carpeta elegida con <input webkitdirectory> (Firefox, Safari): hay que elegirla en cada visita
const FuenteSeleccion = {
  tipo: "seleccion",
  archivos: null,  // Map ruta → File (solo en memoria)
  usar(files) {
    this.archivos = new Map();
    for (const f of files) {
      const ruta = f.webkitRelativePath.split("/").slice(1).join("/");  // sin la carpeta elegida
      if (ruta && !ruta.split("/").some(ignorado)) this.archivos.set(ruta, f);
    }
    return files[0]?.webkitRelativePath.split("/")[0] || "carpeta";
  },
  async listo() { return !!this.archivos; },
  async *listar() {
    for (const [ruta, f] of this.archivos) yield { ruta, tamano: f.size, mtime: f.lastModified, leer: () => f.arrayBuffer() };
  },
  async archivo(d) {
    const f = this.archivos?.get(d.ruta);
    if (!f) throw new Error("Vuelve a elegir la carpeta (Ajustes) para abrir archivos");
    return f;
  },
};

// 3) OneDrive personal (cuenta Microsoft normal) con Microsoft Graph
const OD = {
  tipo: "onedrive",
  auth: "https://login.microsoftonline.com/consumers/oauth2/v2.0",
  graph: "https://graph.microsoft.com/v1.0",
  scope: "Files.Read offline_access",
  carpeta: CONFIG.carpetaOneDrive,
  clientId: () => (localStorage.getItem("enc_clientId") || CONFIG.clientId || "").trim(),
  redirect: () => location.origin + location.pathname.replace(/index\.html$/, ""),
  disponible() { return !!this.clientId() && isSecureContext && location.protocol !== "file:"; },
  tokens() { try { return JSON.parse(localStorage.getItem("enc_tokens")) || {}; } catch { return {}; } },
  guardarTokens(j) {
    localStorage.setItem("enc_tokens", JSON.stringify({ access: j.access_token, exp: Date.now() + (j.expires_in - 120) * 1000, refresh: j.refresh_token }));
  },
  salir() { localStorage.removeItem("enc_tokens"); },
  async login() {
    const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const verifier = b64(crypto.getRandomValues(new Uint8Array(48)));
    const state = b64(crypto.getRandomValues(new Uint8Array(16)));
    sessionStorage.setItem("enc_pkce", JSON.stringify({ verifier, state }));
    const p = new URLSearchParams({
      client_id: this.clientId(), response_type: "code", redirect_uri: this.redirect(), response_mode: "query",
      scope: this.scope, state, code_challenge: b64(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))),
      code_challenge_method: "S256", prompt: "select_account",
    });
    location.href = `${this.auth}/authorize?${p}`;
  },
  async pedirToken(datos) {
    const r = await fetch(`${this.auth}/token`, { method: "POST", body: new URLSearchParams({ client_id: this.clientId(), scope: this.scope, ...datos }) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error_description?.split("\n")[0] || j.error || "Error al iniciar sesión");
    this.guardarTokens(j);
  },
  // al volver de la página de Microsoft: ?code=…&state=…  → true si se ha iniciado sesión ahora
  async alVolver() {
    const q = new URLSearchParams(location.search);
    if (!q.has("code") && !q.has("error")) return false;
    history.replaceState(null, "", this.redirect() + location.hash);
    const pk = JSON.parse(sessionStorage.getItem("enc_pkce") || "{}");
    sessionStorage.removeItem("enc_pkce");
    if (q.has("error")) throw new Error(q.get("error_description") || q.get("error"));
    if (!pk.state || pk.state !== q.get("state")) throw new Error("La respuesta de inicio de sesión no es válida; vuelve a intentarlo");
    await this.pedirToken({ grant_type: "authorization_code", code: q.get("code"), redirect_uri: this.redirect(), code_verifier: pk.verifier });
    return true;
  },
  async token() {
    const t = this.tokens();
    if (t.access && t.exp > Date.now()) return t.access;
    if (!t.refresh) return null;
    try { await this.pedirToken({ grant_type: "refresh_token", refresh_token: t.refresh }); return this.tokens().access; }
    catch { this.salir(); return null; }
  },
  async api(url) {
    for (let intento = 0; ; intento++) {
      const tk = await this.token();
      if (!tk) throw new Error("Inicia sesión en OneDrive");
      const r = await fetch(url.startsWith("http") ? url : this.graph + url, { headers: { Authorization: "Bearer " + tk } });
      if ((r.status === 429 || r.status >= 500) && intento < 3) {
        await new Promise((ok) => setTimeout(ok, (+r.headers.get("Retry-After") || 2) * 1000));
        continue;
      }
      const j = await r.json().catch(() => ({}));
      if (r.status === 404) throw new Error(`No existe la carpeta «${this.carpeta}» en tu OneDrive`);
      if (!r.ok) throw new Error(j.error?.message || r.statusText);
      return j;
    }
  },
  async listo() { return this.disponible() && !!(await this.token()); },
  async *listar() {
    const raiz = this.carpeta.split("/").filter(Boolean).map(encodeURIComponent).join("/");
    const pila = [[raiz ? `/me/drive/root:/${raiz}:/children?$top=200` : "/me/drive/root/children?$top=200", ""]];
    while (pila.length) {
      const [url0, pref] = pila.pop();
      for (let url = url0; url;) {
        const j = await this.api(url);
        for (const it of j.value) {
          if (ignorado(it.name)) continue;
          if (it.folder) { pila.push([`/me/drive/items/${it.id}/children?$top=200`, pref + it.name + "/"]); continue; }
          if (!it.file) continue;
          yield {
            ruta: pref + it.name, tamano: it.size, mtime: Date.parse(it.lastModifiedDateTime), od: { id: it.id, web: it.webUrl },
            leer: () => this.contenido(it.id, it["@microsoft.graph.downloadUrl"]),
          };
        }
        url = j["@odata.nextLink"];
      }
    }
  },
  // la URL de descarga caduca en un rato: si falla se pide otra
  async urlDescarga(id) { return (await this.api(`/me/drive/items/${id}?select=id,@microsoft.graph.downloadUrl`))["@microsoft.graph.downloadUrl"]; },
  async contenido(id, url) {
    let r = url ? await fetch(url).catch(() => null) : null;
    if (!r?.ok) r = await fetch(await this.urlDescarga(id));
    if (!r.ok) throw new Error("No se pudo descargar");
    return r.arrayBuffer();
  },
};

// ------------------------------------------------------------ índice y escaneo
const DOCS = new Map();  // ruta → doc
let FUENTE = null;       // { tipo, nombre } guardado en IndexedDB
const fuenteObj = () => ({ carpeta: FuenteCarpeta, seleccion: FuenteSeleccion, onedrive: OD }[FUENTE?.tipo]);
let PENDIENTES = {};     // ediciones importadas de una copia de seguridad, por ruta

function preparar(d) {
  d._n = {
    nombre: normIgual(d.nombre), tags: normIgual([d.modulo, ...d.unidades, ...d.temas, ...d.herramientas].join(" ")),
    ruta: normIgual(d.carpeta), notas: normIgual(d.notas), texto: normIgual(d.texto),
  };
  return d;
}

async function cargarIndice() {
  AJ = Object.assign(structuredClone(AJUSTES_DEF), (await BD.get("ajustes")) || {});
  PENDIENTES = (await BD.get("pendientes")) || {};
  FUENTE = (await BD.get("fuente")) || null;
  if (FUENTE?.tipo === "carpeta") await FuenteCarpeta.cargar();
  if (FUENTE?.tipo === "onedrive") OD.carpeta = FUENTE.carpeta || CONFIG.carpetaOneDrive;
  DOCS.clear();
  for (const d of await BD.docs()) DOCS.set(d.ruta, preparar(d));
}
async function guardarAjustes() { await BD.set("ajustes", AJ); _glob.clear(); }

async function cambiarFuente(f) {
  if (FUENTE && (FUENTE.tipo !== f.tipo || FUENTE.nombre !== f.nombre)) { DOCS.clear(); await BD.vaciar(); }
  FUENTE = f;
  await BD.set("fuente", f);
}

function aplicarPendiente(d) {
  const e = PENDIENTES[d.ruta];
  if (!e) return false;
  Object.assign(d, e);
  delete PENDIENTES[d.ruta];
  return true;
}

const ESC = { activo: false, vistos: 0, actual: "", ultimo: null, nuevos: 0, error: "", fallos: 0 };
let alCambiarEscaneo = () => {};

async function indexar(f, old, primero) {
  const nombre = nombreVisible(f.ruta.split("/").pop()), ext = extDe(nombre);
  let texto = "", leido = true;
  if (f.tamano <= AJ.maxMB * 1048576) {
    const t = await extraerTexto(await f.leer(), ext);
    if (t === null) leido = false; else texto = t;
  }
  const d = old ? { ...old } : {
    ruta: f.ruta, detectado: primero ? "" : ahoraISO(), notas: "", manual: false, fechaManual: false, estado: "ok",
    temas: [], herramientas: [], unidades: [],
  };
  Object.assign(d, {
    nombre, ext, tamano: f.tamano, mtime: f.mtime, texto, leido, od: f.od || null,
    estado: d.estado === "oculto" ? "oculto" : "ok", enlace: ext === ".url" || ext === ".webloc" ? leerEnlace(texto, ext) : "",
  });
  aplicarPendiente(d);
  recalcular(d);
  DOCS.set(d.ruta, preparar(d));
  await BD.guardar([d]);
}

async function escanear() {
  const fuente = fuenteObj();
  if (ESC.activo || !fuente || !(await fuente.listo(false))) return false;
  Object.assign(ESC, { activo: true, vistos: 0, actual: "", nuevos: 0, error: "", fallos: 0 });
  alCambiarEscaneo();
  const primero = DOCS.size === 0, vistos = new Set();
  let completo = false, cambios = 0, aviso = 0;
  try {
    for await (const f of fuente.listar()) {
      vistos.add(f.ruta);
      ESC.vistos++;
      const old = DOCS.get(f.ruta);
      if (old?.estado === "oculto") continue;
      if (old && Math.abs(old.mtime - f.mtime) < 1000 && old.tamano === f.tamano && old.estado === "ok" && old.leido) {
        if (f.od && old.od?.web !== f.od.web) { old.od = f.od; await BD.guardar([old]); }
        if (Date.now() - aviso > 400) { aviso = Date.now(); alCambiarEscaneo(); }
        continue;
      }
      ESC.actual = nombreVisible(f.ruta.split("/").pop());
      alCambiarEscaneo();
      try {
        await indexar(f, old, primero);
        cambios++;
        if (!old) ESC.nuevos++;
      } catch (e) {
        ESC.fallos++;
        console.error("[escaneo] error en", f.ruta, e);
      }
    }
    completo = true;
  } catch (e) {
    ESC.error = e.message;
    console.error("[escaneo]", e);
  }
  if (completo) {
    const fuera = [];
    for (const d of DOCS.values()) if (!vistos.has(d.ruta) && d.estado === "ok") { d.estado = "desaparecido"; fuera.push(d); }
    if (fuera.length) { await BD.guardar(fuera); cambios += fuera.length; }
    await BD.set("pendientes", PENDIENTES);
    ESC.ultimo = new Date();
    if (ESC.fallos) ESC.error = `${ESC.fallos} archivo(s) sin indexar, se reintentará`;
  }
  ESC.activo = false;
  ESC.actual = "";
  alCambiarEscaneo(cambios > 0);
  return true;
}

// Reaplica reglas y ajustes de módulo a todo lo que no se ha editado a mano
async function reaplicar() {
  const todos = [...DOCS.values()];
  for (const d of todos) preparar(recalcular(d));
  await BD.guardar(todos);
}

// ------------------------------------------------------------ copia de seguridad
function exportar() {
  const ediciones = {};
  for (const d of DOCS.values()) {
    const e = {};
    if (d.manual) Object.assign(e, { manual: true, modulo: d.modulo, temas: d.temas, herramientas: d.herramientas, unidades: d.unidades });
    if (d.fechaManual) Object.assign(e, { fechaManual: true, fecha: d.fecha });
    if (d.notas) e.notas = d.notas;
    if (d.estado === "oculto") e.estado = "oculto";
    if (Object.keys(e).length) ediciones[d.ruta] = e;
  }
  return { app: "encuentralo", version: 1, fecha: ahoraISO(), ajustes: AJ, ediciones: { ...PENDIENTES, ...ediciones } };
}
async function importar(j) {
  if (j?.app !== "encuentralo") throw new Error("Ese archivo no es una copia de Encuéntralo");
  AJ = Object.assign(structuredClone(AJUSTES_DEF), j.ajustes || {});
  await guardarAjustes();
  PENDIENTES = { ...(j.ediciones || {}) };
  const tocados = [];
  for (const d of DOCS.values()) if (aplicarPendiente(d)) tocados.push(d);
  await BD.set("pendientes", PENDIENTES);
  await reaplicar();
  return tocados.length;
}
