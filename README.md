# Encuéntralo web

Busca en tus apuntes de clase por **módulo**, **unidad**, **tema**, **herramienta** y **fecha**, también **dentro**
de PDF, Word y PowerPoint. Pensado para las clases de Teams (Materiales de clase y Trabajo de clase).

Funciona **entero en el navegador**:

- No necesita servidor, programas ni dominio. Se publica gratis con GitHub Pages.
- Lee los archivos de una carpeta del ordenador (por ejemplo, las clases sincronizadas con OneDrive) o de un OneDrive
  personal.
- El índice, las etiquetas y las notas se guardan en el navegador de cada persona. **Los documentos no se suben a
  ningún sitio**, y este repositorio solo contiene el código de la página.

**Página publicada:** <https://jbooruiz.github.io/encuentralo-web/>

## Guías

- **[GUIA-PROFE.md](GUIA-PROFE.md)**: para tener tu propia copia, paso a paso y todo desde el navegador (fork,
  GitHub Pages y carpeta del ordenador).
- **[SETUP-WEB.md](SETUP-WEB.md)**: referencia completa, incluida la opción de OneDrive personal (Power Automate y
  Azure) para usarlo también en el móvil.

## Código

Todo está en [`docs/`](docs/), sin compilar ni instalar nada:

| Archivo | Qué hace |
|---|---|
| `index.html`, `style.css` | La página |
| `app.js` | Interfaz: búsqueda, filtros, lista, edición y ajustes |
| `motor.js` | Índice en IndexedDB, lectura de carpetas y OneDrive, extracción de texto y etiquetado |
| `config.js` | Id. de la aplicación de Azure (solo para la opción de OneDrive) |

Usa [pdf.js](https://mozilla.github.io/pdf.js/) y [JSZip](https://stuk.github.io/jszip/) desde cdnjs. Las fuentes
Manrope y Lora tienen licencia OFL (`docs/fonts/`).

Para probarlo en local, sirve la carpeta con cualquier servidor estático y abre `http://localhost:8000/docs/`:

```bash
python -m http.server 8000
```
