# Encuéntralo: tu propia copia, paso a paso

Esta guía es para montar **tu propio Encuéntralo** y buscar en tus apuntes de clase por módulo, unidad, tema, fecha y
contenido.

- **No necesitas** servidor, programas ni dominio. Solo una cuenta gratuita de GitHub y Chrome o Edge.
- Todo se hace desde el navegador. No hay que instalar Git ni usar la terminal.
- **Tus documentos no se suben a ningún sitio.** En GitHub solo está el código de la página. Los archivos se leen
  desde tu ordenador, o desde tu OneDrive si eliges esa opción, y el índice se guarda en tu navegador.

Tiempo: unos 15 minutos la primera vez, y 10 más si quieres que tus alumnos lo usen desde Teams
([sección 10](#10-para-tus-alumnos-pestaña-de-teams)).

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

## 10. Para tus alumnos: pestaña de Teams

Tus alumnos pueden buscar en todo el material de la clase desde una pestaña de Teams, **sin configurar nada**. Funciona
así: tu Encuéntralo, cada vez que lo abres y hay cambios, sube a tu repositorio de GitHub un archivo con el índice
(`docs/indice.json`). Tu página lo publica y, abierta por los alumnos, muestra ese índice en **modo consulta**: buscar,
filtrar y **Abrir**, que lleva al archivo en el SharePoint de la clase con su cuenta de educantabria.

> **Antes de activarlo:** el índice publicado es **público**. Cualquiera que tenga la dirección puede ver los nombres
> de los archivos, las carpetas, tus notas y, si lo marcas, el texto de los documentos (también los enlaces de los
> archivos `.url`). **Los archivos en sí no**: para abrirlos hay que tener acceso a la clase en SharePoint. Si no quieres
> que se vea el texto, desmarca **Incluir el texto de los documentos**: los alumnos buscarán por nombre, unidad, tema y
> notas, pero no dentro de los PDF.

### 10.1 Crear el token de GitHub (una vez)

El token es como una contraseña que solo sirve para que tu Encuéntralo pueda subir ese archivo a **tu** repositorio.

1. En GitHub, arriba a la derecha: tu foto → **Settings**.
2. Abajo del todo, en el menú de la izquierda: **Developer settings** → **Personal access tokens** →
   **Fine-grained tokens** → **Generate new token**.
3. Rellena:
   - **Token name**: `Encuéntralo`.
   - **Expiration**: la más larga que te deje (por ejemplo, 1 año). Apunta la fecha: ese día habrá que crear otro.
   - **Repository access**: **Only select repositories** → elige **tu** copia (`<nombre>` del paso 2).
   - **Permissions** → **Repository permissions** → **Contents**: **Read and write**. No hace falta nada más.
4. **Generate token** y copia el código que empieza por `github_pat_…`. Solo se ve una vez; si lo pierdes, crea otro.

No se lo pases a nadie ni lo pegues en otro sitio que no sea tu Encuéntralo. Se guarda solo en tu navegador, y no va
en la copia de seguridad.

### 10.2 Activar la publicación

1. En tu Encuéntralo: **Ajustes** → **Publicar para alumnos**.
2. **Token de GitHub**: pega el token. **Repositorio** ya viene puesto (`<usuario>/<nombre>`).
3. Revisa las dos casillas:
   - **Incluir el texto de los documentos**: lee el aviso de arriba.
   - **Publicar automáticamente cuando haya cambios**: déjala marcada.
4. Comprueba que cada módulo tiene su **URL de SharePoint** (sección 6). Debajo de **Publicar ahora** te avisa si hay
   documentos sin ella: los alumnos los verían, pero no podrían abrirlos.
5. Pulsa **Publicar ahora**. Sale *Publicado: N documentos*. En 1 a 3 minutos está en tu página.
6. **Guardar**.

Desde ahora, cada vez que abras tu Encuéntralo, edites algo o cambies los ajustes, se publica solo si hay cambios.

### 10.3 Poner la pestaña en Teams

1. En **Ajustes → Publicar para alumnos**, copia la **Dirección para la pestaña de Teams**
   (`https://<usuario>.github.io/<nombre>/?alumnos`).
2. En Teams, en la clase → el canal donde quieras la pestaña (por ejemplo, **General**) → **+** (Agregar una pestaña) →
   **Sitio web**.
3. **Nombre de la pestaña**: `Apuntes` (o el que quieras). **URL**: pega la dirección → **Guardar**.

Si tu centro no deja añadir pestañas de **Sitio web**, publica la dirección en el canal y fíjala: funciona igual en el
navegador y en el móvil.

> El `?alumnos` del final hace que **tú** también veas el modo consulta en esa pestaña, para comprobar lo que ven
> ellos. Tu Encuéntralo normal sigue siendo la dirección sin `?alumnos`.

### 10.4 Qué ven los alumnos

- Todo el material de la clase, con buscador y filtros por módulo, unidad, tema, herramienta, carpeta y fecha.
- Tus **notas** y las etiquetas que hayas corregido a mano.
- **Abrir**: el archivo en el SharePoint de la clase, con su cuenta. **Abrir enlace** en los enlaces.
- La marca **nuevo** en lo que hayas añadido en los últimos 3 días.
- Abajo a la izquierda, cuándo se publicó por última vez.
- No pueden editar, ocultar ni cambiar nada.

Lo nuevo que subas a Teams lo ven **cuando abras tu Encuéntralo** (o pulses **Publicar ahora**), más 1 a 3 minutos
de GitHub. Si no lo abres, siguen viendo la última publicación.

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
| *GitHub: el token no es válido o ha caducado* | Ha pasado la fecha de caducidad del token. Crea otro (10.1) y pégalo en Ajustes |
| *GitHub: el token no tiene permiso de escritura…* | Al crear el token no elegiste tu repositorio o no diste **Contents: Read and write**. Créalo otra vez (10.1) |
| Los alumnos no ven lo último | Abre tu Encuéntralo o pulsa **Publicar ahora**, y espera 1 a 3 minutos. En Teams, recarga la pestaña |
| Los alumnos ven un documento pero sin botón **Abrir** | Falta la URL de SharePoint de ese módulo (sección 6) |

Si nada de esto lo arregla, pregunta a Juan.
