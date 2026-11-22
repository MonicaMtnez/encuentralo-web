"use strict";
/* Encuéntralo web — publicar el índice para los alumnos.
   La profe guarda en su repositorio de GitHub un docs/indice.json (API de GitHub con un token suyo);
   GitHub Pages lo publica y la página, abierta sin carpeta (o con ?alumnos), entra en modo consulta. */

const RUTA_INDICE = "docs/indice.json";
const MAX_TEXTO_PUBLICO = 40_000;  // por documento: suficiente para buscar sin que el archivo pese demasiado

// usuario/repositorio a partir de la dirección de GitHub Pages: https://usuario.github.io/repo/
function repoDeLaPagina() {
  const h = location.hostname;
  if (!h.endsWith(".github.io")) return "";
  const seg = location.pathname.split("/").filter(Boolean)[0];
  return `${h.split(".")[0]}/${seg && !seg.includes(".") ? seg : h}`;
}
const urlAlumnos = () => location.origin + location.pathname.replace(/index\.html$/, "") + "?alumnos";

const PUB = {
  cfg: { token: "", repo: "", texto: true, auto: true, ultima: null, huella: "", error: "" },
  async cargar() {
    this.cfg = Object.assign({ token: "", repo: repoDeLaPagina(), texto: true, auto: true, ultima: null, huella: "", error: "" },
      (await BD.get("publicar")) || {});
  },
  guardar() { return BD.set("publicar", this.cfg); },
  listo() { return !!(this.cfg.token && /^[\w.-]+\/[\w.-]+$/.test(this.cfg.repo)); },
};

function indicePublico(conTexto) {
  const docs = [...DOCS.values()].filter((d) => d.estado === "ok").map((d) => ({
    ruta: d.ruta, nombre: d.nombre, ext: d.ext, tamano: d.tamano, fecha: d.fecha, detectado: d.detectado,
    modulo: d.modulo, carpeta: d.carpeta, unidades: d.unidades, temas: d.temas, herramientas: d.herramientas,
    notas: d.notas, enlace: d.enlace, sp: d.enlace ? "" : urlSharepoint(d),
    texto: conTexto ? (d.texto || "").slice(0, MAX_TEXTO_PUBLICO) : "",
  }));
  docs.sort((a, b) => a.ruta.localeCompare(b.ruta));
  return { app: "encuentralo-indice", version: 1, docs };
}

async function sha256(texto) {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function base64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

async function github(ruta, opciones = {}) {
  const r = await fetch(`https://api.github.com/repos/${PUB.cfg.repo}${ruta}`, {
    ...opciones,
    headers: {
      Authorization: "Bearer " + PUB.cfg.token.trim(), Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28", ...(opciones.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  const j = await r.json().catch(() => ({}));
  if (r.ok || (r.status === 404 && opciones.permitir404)) return { status: r.status, j };
  const motivo = r.status === 401 ? "el token no es válido o ha caducado"
    : r.status === 403 || r.status === 404 ? `el token no tiene permiso de escritura en «${PUB.cfg.repo}» (o el repositorio no existe)`
    : j.message || r.statusText;
  const e = new Error("GitHub: " + motivo);
  e.status = r.status;
  throw e;
}

let publicando = null;
// Sube docs/indice.json si ha cambiado algo desde la última vez (o siempre, con forzar)
async function publicar(forzar = false) {
  if (!PUB.listo()) throw new Error("Falta el token o el repositorio (Ajustes → Publicar para alumnos)");
  if (publicando) return publicando;
  publicando = (async () => {
    const idx = indicePublico(PUB.cfg.texto);
    const huella = await sha256(JSON.stringify(idx) + "|" + PUB.cfg.repo);
    if (!forzar && huella === PUB.cfg.huella) return { sinCambios: true, n: idx.docs.length };
    const contenido = base64(new TextEncoder().encode(JSON.stringify({ ...idx, generado: ahoraISO() })));
    const { j: repo } = await github("");
    for (let intento = 0; ; intento++) {
      const { j: actual } = await github(`/contents/${RUTA_INDICE}?ref=${encodeURIComponent(repo.default_branch)}`, { permitir404: true });
      try {
        await github(`/contents/${RUTA_INDICE}`, {
          method: "PUT",
          body: JSON.stringify({
            message: `Índice para alumnos: ${idx.docs.length} documentos`, content: contenido,
            branch: repo.default_branch, ...(actual?.sha ? { sha: actual.sha } : {}),
          }),
        });
        break;
      } catch (e) {
        if ((e.status === 409 || e.status === 422) && intento < 2) continue;  // otro cambio a la vez: reintenta
        throw e;
      }
    }
    Object.assign(PUB.cfg, { huella, ultima: { fecha: ahoraISO(), n: idx.docs.length }, error: "" });
    await PUB.guardar();
    return { n: idx.docs.length };
  })();
  try { return await publicando; }
  catch (e) { PUB.cfg.error = e.message; await PUB.guardar(); throw e; }
  finally { publicando = null; }
}

// índice publicado (modo consulta): null si no hay
async function cargarPublicado() {
  try {
    const r = await fetch("indice.json", { cache: "no-cache" });
    if (!r.ok) return null;
    const j = await r.json();
    return j?.app === "encuentralo-indice" && Array.isArray(j.docs) ? j : null;
  } catch { return null; }
}
