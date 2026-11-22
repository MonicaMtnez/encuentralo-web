# Encuéntralo: tu propia copia, paso a paso

Esta guía es para montar **tu propio Encuéntralo** y buscar en tus apuntes de clase por módulo, unidad, tema, fecha y
contenido.

- **No necesitas** servidor, programas ni dominio. Solo una cuenta gratuita de GitHub y Chrome o Edge.
- Todo se hace desde el navegador. No hay que instalar Git ni usar la terminal.
- **Tus documentos no se suben a ningún sitio.** En GitHub solo está el código de la página. Los archivos se leen
  desde tu ordenador, o desde tu OneDrive si eliges esa opción, y el índice se guarda en tu navegador.

Tiempo: unos 15 minutos la primera vez.

---

## Antes de empezar: lo que tiene que estar listo en el repositorio de Juan

> Esto lo hace Juan, no tú. Si ya te ha pasado el enlace del repositorio, está hecho.

- El repositorio <https://github.com/jbooruiz/encuentralo-web> existe y es **público**. Si no, no se puede copiar.

---

## 1. Crear tu cuenta de GitHub

1. Entra en <https://github.com/signup>.
2. Usa tu correo **personal**. Así la cuenta sigue siendo tuya aunque cambies de centro.
3. Elige tu **nombre de usuario** con cuidado: formará parte de la dirección de tu página
   (`https://<usuario>.github.io/…`). Por ejemplo, `profe-apuntes`.
4. Confirma el correo y entra.

---

## 2. Hacer tu copia (fork) del proyecto

1. Abre <https://github.com/jbooruiz/encuentralo-web>.
2. Arriba a la derecha, pulsa **Fork** → **Create a new fork**.
3. En la pantalla que sale:
   - **Owner**: tu usuario.
   - **Repository name**: déjalo como `encuentralo-web` o ponle un nombre más corto, por ejemplo `apuntes`.
     Ese nombre también va en la dirección.
   - Deja marcado **Copy the main branch only**.
4. Pulsa **Create fork**.

Ahora tienes tu copia en `https://github.com/<usuario>/<nombre>`. Es pública, pero solo contiene código: ningún
documento tuyo.

---

## 3. Publicar tu página (GitHub Pages)

1. En **tu** copia, pulsa **Settings** (la rueda dentada de la barra de arriba del repositorio).
2. En el menú de la izquierda, entra en **Pages**.
3. En **Build and deployment**:
   - **Source**: **Deploy from a branch**.
   - **Branch**: `main`, y al lado, la carpeta **`/docs`**.
   - Pulsa **Save**.
4. Espera de 1 a 3 minutos y recarga esa página. Arriba aparecerá:
   **Your site is live at `https://<usuario>.github.io/<nombre>/`**.
5. Abre esa dirección y **guárdala en marcadores**: es tu Encuéntralo.

> Si a los 5 minutos no aparece, entra en la pestaña **Actions** de tu copia. Si sale un botón **I understand my
> workflows, go ahead and enable them**, púlsalo, vuelve a **Settings → Pages** y pulsa **Save** otra vez.

---

## 4. Tener tus clases de Teams en el ordenador

Encuéntralo lee una carpeta de tu ordenador. Lo más cómodo es que OneDrive te traiga ahí las clases de Teams y las
mantenga al día.

Necesitas la app de **OneDrive** en Windows o Mac, con la sesión iniciada con tu cuenta de **educantabria**. Suele
venir instalada.

1. En tu carpeta `OneDrive - Educantabria`, crea una carpeta llamada **`Clases`**.
2. Para cada clase:
   1. Teams → la clase → pestaña **Archivos** (o **Materiales de clase**) → **⋯** → **Abrir en SharePoint**.
   2. En SharePoint, entra en **Materiales de clase**. Si quieres también *Trabajo de clase*, entra en
      **Documentos**, donde está la carpeta `Classwork`.
   3. Pulsa **Añadir acceso directo a Mis archivos**.
3. En unos minutos aparece en `OneDrive - Educantabria` una carpeta por clase, con un nombre como
   `IESAlisal26-CETI-AFI-…, - Materiales de clase`. **Muévelas dentro de `Clases`.** Son accesos directos: no se
   cambia nada en Teams.

No hace falta renombrar nada. Encuéntralo saca el módulo (`AFI`) y la sección (`Materiales de clase`) del nombre de
cada carpeta.

---

## 5. Abrir Encuéntralo por primera vez

1. Abre tu dirección (paso 3) en **Chrome o Edge**.
2. Sale la bienvenida. En **Carpeta de este ordenador**, pulsa **Elegir carpeta**.
3. Selecciona la carpeta **`Clases`** → **Seleccionar carpeta**.
4. El navegador pregunta si dejas que la página vea esos archivos → **Ver archivos** o **Permitir**.
5. Empieza a leerlos. Abajo a la izquierda pone **Escaneando… N archivos** y los documentos van apareciendo.
   La primera vez tarda unos minutos, porque OneDrive tiene que descargar cada archivo.

> Para abrirla como un programa: en Chrome o Edge, menú **⋮** → **Enviar, guardar y compartir** → **Instalar
> página como aplicación**.

---

## 6. Ajustes recomendados (5 minutos)

Pulsa el botón de ajustes (arriba a la derecha):

1. **Módulos → URL de la clase en SharePoint.** Para cada módulo: Teams → la clase → **Archivos** → **Abrir en
   SharePoint** → copia la dirección del navegador y pégala en su módulo. Así cada documento tiene un botón
   **SharePoint** que abre el original en la clase.
2. **Reglas de etiquetado**, si quieres. Una línea por etiqueta, por ejemplo `Redes: vlan, subred, ospf`. Los
   documentos que contengan esas palabras reciben esa etiqueta.
3. Pulsa **Guardar**.
4. **Copia de seguridad → Exportar.** Guarda el archivo `.json` en tu OneDrive. Si algún día borras los datos del
   navegador o cambias de ordenador, con **Importar** recuperas tus etiquetas, notas y ajustes.

---

## 7. Uso diario

- **Buscar**: escribe arriba. Busca también **dentro** de PDF, Word y PowerPoint. Para una frase exacta, ponla
  entre comillas: `"cadena de custodia"`.
- **Filtrar**: en el panel izquierdo, por módulo, unidad, tema, herramienta, carpeta, fecha o tipo.
- **Abrir**: **Ver** abre el archivo; **SharePoint** abre el original en Teams.
- **Corregir**: **Editar** cambia etiquetas, fecha o notas. ✕ oculta un documento sin borrarlo.
- **Archivos nuevos**: cuando subas algo a Teams, OneDrive lo trae al ordenador. Encuéntralo busca cambios al
  abrir la página, al volver a la pestaña y con el botón ⟳.
- A veces, al abrir la página, sale arriba **Dar acceso**. Es Chrome pidiendo confirmar el permiso de la carpeta:
  un clic y listo.

---

## 8. Recibir las mejoras de Juan

Cuando Juan mejore Encuéntralo, tu copia no se actualiza sola:

1. Entra en tu copia en GitHub (`https://github.com/<usuario>/<nombre>`).
2. Si sale **This branch is N commits behind jbooruiz/encuentralo-web:main**, pulsa **Sync fork** → **Update branch**.
3. En 1 a 3 minutos tu página se actualiza. Recárgala (con **Ctrl + F5** si sigue igual).

Tus documentos, etiquetas y ajustes no se tocan: están en tu navegador, no en GitHub.

---

## 9. Opcional: usarlo también en el móvil (OneDrive personal)

Lo de arriba funciona en tu ordenador. Para usarlo en el móvil o en cualquier otro equipo, la página tiene que leer
los archivos desde un **OneDrive personal**. Lleva más trabajo, unos 45 minutos, y tiene tres partes:

1. **Copiar tus clases a un OneDrive personal** (cuenta Outlook o Hotmail) con Power Automate. Los pasos están en
   [SETUP-WEB.md → 3.1 y 3.2](SETUP-WEB.md#31-cuenta-microsoft-personal).
2. **Registrar la aplicación en Azure** con tu cuenta **personal**, como en
   [SETUP-WEB.md → 3.3](SETUP-WEB.md#33-registrar-la-aplicación-en-azure-una-vez). En **URI de redirección** pon
   **tu** dirección del paso 3, con la `/` final: `https://<usuario>.github.io/<nombre>/`.
3. **Pegar el Id. de la aplicación** en tu copia:
   1. En GitHub, abre `docs/config.js` en tu repositorio.
   2. Pulsa el lápiz ✏️ (**Edit this file**).
   3. Pega el Id. entre las comillas: `clientId: "1a2b3c4d-…",`.
   4. **Commit changes…** → **Commit changes**.

Después, en la página: **Ajustes → Cambiar… → Mi OneDrive personal → Iniciar sesión con Microsoft**, con tu cuenta
**personal**, no la de educantabria.

---

## Si algo falla

| Qué pasa | Qué hacer |
|---|---|
| La dirección da **404** | Espera unos minutos tras el paso 3. Revisa que en **Settings → Pages** esté `main` y `/docs` |
| No veo el botón **Elegir carpeta** o no recuerda la carpeta | Usa **Chrome o Edge**. Firefox y Safari no recuerdan carpetas: hay que elegirla en cada visita |
| Salen carpetas que no son clases como módulos | Has elegido una carpeta con más cosas. Usa la carpeta `Clases` del paso 4 (**Ajustes → Cambiar…**) |
| Un PDF no se encuentra por su contenido | Es un PDF escaneado (una imagen): no tiene texto. Se puede buscar por nombre o ponerle etiquetas con **Editar** |
| El botón SharePoint da error | Revisa en Ajustes que la URL de ese módulo sea de esa clase |
| No aparece **Sync fork** | Tu copia ya está al día |

Si nada de esto lo arregla, pregunta a Juan.
