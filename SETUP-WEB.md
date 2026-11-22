# Encuéntralo web: puesta en marcha paso a paso

Encuéntralo web busca en tus apuntes de clase por módulo, unidad, tema, fecha y contenido, y funciona **entero en
el navegador**. El código está en la carpeta [`docs/`](docs/).

- No necesita servidor, programas ni dominio.
- Lee los archivos de una carpeta del ordenador o del OneDrive personal.
- Guarda el índice en el propio navegador. Los documentos no se suben a ningún sitio.

> **¿Se lo monta otra persona en su propia cuenta de GitHub, como la profe?** Que siga
> [GUIA-PROFE.md](GUIA-PROFE.md): fork, GitHub Pages y carpeta del ordenador, todo desde el navegador.
> Esta guía es la referencia completa.

Esta guía tiene tres partes:

| Parte | Quién | Cuándo |
|---|---|---|
| [1. Publicar la página](#1-publicar-la-página-una-vez) | Quien tiene el repositorio | Una vez |
| [2. Opción A: carpeta del ordenador](#2-opción-a-carpeta-del-ordenador-recomendada) | Quien la va a usar | Una vez por ordenador |
| [3. Opción B: OneDrive personal](#3-opción-b-onedrive-personal-también-en-el-móvil) | Quien publica y quien la usa | Una vez |

Después vienen los [ajustes](#4-ajustes-para-las-dos-opciones), el [uso diario](#5-uso-diario),
los [problemas frecuentes](#6-problemas-frecuentes) y cómo [actualizar](#7-actualizar-la-página).

## ¿Qué opción elegir?

| | Opción A: carpeta del ordenador | Opción B: OneDrive personal |
|---|---|---|
| Qué necesita | La app de OneDrive en el PC con las clases sincronizadas | Power Automate y una aplicación registrada en Azure |
| Dónde se usa | En ese PC, con Chrome o Edge | En cualquier dispositivo, también en el móvil |
| Dificultad | Baja: unos 10 minutos | Media: entre 30 y 45 minutos la primera vez |
| Archivos nuevos | Llegan solos al PC con OneDrive | Los copia Power Automate al OneDrive personal |

**Si solo la va a usar en su ordenador, la A.** La B solo merece la pena si también la quiere en el móvil o en otros
equipos.

Lo que vale para las dos:
- Cada navegador tiene su propio índice. No se comparte con otras personas: para eso hace falta una versión con servidor.
- Busca cambios al abrir la página, al volver a la pestaña tras 5 minutos, cada 10 minutos si está abierta, y con el
  botón ⟳.

---

## 1. Publicar la página (una vez)

La hace quien tiene el repositorio. El resultado es una dirección gratuita del tipo
`https://jbooruiz.github.io/encuentralo-web/`.

> Quien quiera su propia copia (como la profe) hace un **fork** y repite este paso en su copia: ver
> [GUIA-PROFE.md](GUIA-PROFE.md), pasos 2 y 3.

### 1.1 Activar GitHub Pages

GitHub Pages es gratis con repositorios **públicos**. Este repositorio solo contiene el código de la página:
ningún documento ni dato personal.

1. GitHub → el repositorio → **Settings** → **Pages** (menú de la izquierda).
2. **Build and deployment** → **Source**: **Deploy from a branch**.
3. **Branch**: `main`, carpeta **`/docs`** → **Save**.
4. Espera entre 1 y 3 minutos. Arriba de esa misma página aparece **Your site is live at
   `https://jbooruiz.github.io/encuentralo-web/`**.

### 1.2 Comprobar

Abre la dirección. Tiene que salir la pantalla de bienvenida de Encuéntralo, con **Carpeta de este ordenador** y
**Mi OneDrive personal**. Pulsa **Ahora no** para cerrarla.

---

## 2. Opción A: carpeta del ordenador (recomendada)

Lo hace la profe en su ordenador, con su cuenta de educantabria.

### 2.1 Sincronizar las clases con el PC

Hace falta la app de **OneDrive** de Windows o Mac, con la sesión iniciada con la cuenta de educantabria. Suele
venir instalada.

Para cada clase:

1. Teams → la clase → pestaña **Archivos** (o **Materiales de clase**) → **⋯** → **Abrir en SharePoint**.
2. En SharePoint, entra en la biblioteca que quieras: **Materiales de clase** o **Documentos** (ahí está
   *Classwork*, que es "Trabajo de clase").
3. Pulsa **Añadir acceso directo a Mis archivos**.
4. En unos minutos aparece en el PC una carpeta como
   `OneDrive - Educantabria\IESAlisal26-CETI-AFI-…, - Materiales de clase`.

Encuéntralo saca el módulo (`AFI`) y la biblioteca (`Materiales de clase`) de ese nombre. **No hace falta
renombrar nada.**

> Si OneDrive tiene activado **Archivos a petición**, los archivos están en la nube hasta que se abren. Encuéntralo
> los descarga al leerlos la primera vez, así que el primer escaneo tarda más.

### 2.2 Elegir qué carpeta se le da

Encuéntralo trata **cada subcarpeta de la carpeta elegida como un módulo**. Hay dos formas:

- **La más sencilla:** elegir `OneDrive - Educantabria`. Salen las clases, pero también las demás carpetas que haya
  ahí (Documentos, Grabaciones…) como si fueran módulos. Puedes ocultar lo que no interese con ✕ en cada documento.
- **La más limpia:** crear una carpeta solo para las clases y poner dentro los accesos directos.
  1. En `OneDrive - Educantabria`, crea una carpeta `Clases`.
  2. Mueve dentro las carpetas de las clases (`IES…- Materiales de clase`). Son accesos directos, así que no se mueve
     nada en Teams.
  3. Elige `Clases`.

### 2.3 Abrir Encuéntralo y darle la carpeta

1. Abre la dirección del paso 1.1 en **Chrome o Edge**. En Firefox o Safari también funciona, pero hay que elegir la
   carpeta en cada visita.
2. Pulsa **Carpeta de este ordenador** → **Elegir carpeta**.
3. Selecciona la carpeta del paso 2.2 → **Seleccionar carpeta**.
4. El navegador pregunta si permites que el sitio vea los archivos → **Ver archivos** o **Permitir**.
5. Empieza el primer escaneo. Abajo a la izquierda se ve **Escaneando… N archivos**, y los documentos van
   apareciendo. Con unos cientos de PDF puede tardar unos minutos.

> Truco: añade la página a marcadores o, en Chrome o Edge, usa **⋮ → Enviar, guardar y compartir → Instalar
> página como aplicación**, para abrirla como un programa más.

### 2.4 La siguiente vez

Al volver a abrir la página, el índice ya está y se puede buscar enseguida. Para buscar archivos nuevos, a veces
Chrome pide permiso otra vez: sale un aviso arriba, **Dar acceso**, y es un clic.

Sigue con los [ajustes](#4-ajustes-para-las-dos-opciones).

---

## 3. Opción B: OneDrive personal (también en el móvil)

El camino de los archivos:

```
Teams (cuenta educantabria)
   │  Power Automate copia cada archivo nuevo o modificado
   ▼
OneDrive personal  /Indexatodo/<MÓDULO>/…
   │  Encuéntralo web lo lee con el permiso "leer tus archivos"
   ▼
el navegador (índice guardado ahí)
```

Encuéntralo no puede leer directamente el SharePoint de educantabria: el tenant pide aprobación del administrador
para cualquier aplicación que lea archivos. Power Automate sí está permitido. Por eso se copian los archivos a una
cuenta **personal**.

### 3.1 Cuenta Microsoft personal

La profe necesita una cuenta Microsoft personal (Outlook o Hotmail) con OneDrive. Con la gratuita, 5 GB, suele
bastar para apuntes.

En <https://onedrive.live.com>, con esa cuenta, crea una carpeta **`Indexatodo`** en la raíz.

### 3.2 Power Automate: copiar cada clase al OneDrive personal

Se hace en <https://make.powerautomate.com> **con la cuenta de educantabria**. Por cada módulo hay que crear
dos flujos.

#### Conexiones (la primera vez)

Al añadir la primera acción de OneDrive, Power Automate pide crear una conexión:

- Para leer de Teams: **SharePoint**, con la cuenta de educantabria. Se crea sola.
- Para escribir: **OneDrive** (el personal, **no** "OneDrive para la Empresa"). Pulsa **Iniciar sesión** e
  identifícate con la cuenta **personal**.

#### Flujo 1: automático (lo nuevo que se suba)

1. **Crear** → **Flujo de nube automatizado** → nombre `Encuéntralo AFI`.
2. Busca el desencadenador **SharePoint → Cuando se crea o modifica un archivo (solo propiedades)** → **Crear**.
   - **Dirección del sitio**: el sitio de la clase. Sale en el desplegable; si no, pega la URL hasta el nombre del
     sitio: `https://educantabria.sharepoint.com/sites/IESAlisal26-CETI-AFI-…`.
   - **Nombre de la biblioteca**: `Materiales de clase`. Si en tu clase no aparece, `Documentos` y, en
     **Carpeta**, `/Materiales de clase`.
3. **+ Nuevo paso** → **SharePoint → Obtener contenido de archivo**.
   - **Dirección del sitio**: la misma.
   - **Identificador de archivo**: el valor dinámico **Identificador** del desencadenador.
4. **+ Nuevo paso** → **OneDrive → Crear archivo**. Elige **OneDrive**, no "OneDrive para la Empresa".
   - **Ruta de carpeta**: escribe `/Indexatodo/AFI/` y, detrás, el valor dinámico **Ruta de carpeta** del
     desencadenador.
   - **Nombre de archivo**: el valor dinámico **Nombre de archivo con extensión**.
   - **Contenido de archivo**: el valor dinámico **Contenido de archivo** del paso 3.
5. **Guardar**. En **Mis flujos** comprueba que está **Activado**.

#### Flujo 2: volcado (lo que ya existe, se ejecuta una vez)

1. **Crear** → **Flujo de nube instantáneo** → **Desencadenar manualmente un flujo** → nombre `Copiar AFI existente`.
2. **+ Nuevo paso** → **SharePoint → Obtener archivos (solo propiedades)**.
   - **Dirección del sitio** y **Nombre de la biblioteca**: como en el flujo 1.
   - **Mostrar opciones avanzadas** → **Incluir elementos anidados**: **Sí**. Si usaste `Documentos`,
     **Limitar entradas a la carpeta**: `Materiales de clase`.
3. **+ Nuevo paso** → **Control → Condición**: valor dinámico **¿Es carpeta?** · *es igual a* · `false`.
   En el campo de la derecha, pestaña **Expresión** → `false`.
   Power Automate mete solo la condición dentro de **Aplicar a cada uno**.
4. Dentro de **Si es verdadero**, las mismas dos acciones del flujo 1:
   - **Obtener contenido de archivo** → **Identificador de archivo**: valor dinámico **Identificador** (de *Obtener
     archivos*).
   - **Crear archivo** → `/Indexatodo/AFI/` + **Ruta de carpeta**, **Nombre de archivo con extensión**,
     **Contenido de archivo**.
5. **Guardar** → **Probar** → **Manualmente** → **Probar** → **Ejecutar flujo**. Espera a que todo salga en verde ✅.
6. En OneDrive personal tiene que aparecer `Indexatodo/AFI/Materiales de clase/…`.

#### Otros módulos

En **Mis flujos**, en cada flujo, **⋮ → Guardar como** → cambia el nombre, y en la copia cambia:
- el **sitio**, en todas las acciones donde aparezca;
- `/Indexatodo/AFI/` por `/Indexatodo/PPS/`, o el módulo que sea.

Después ejecuta el volcado de ese módulo.

#### Trabajo de clase (Classwork)

Classwork está en la biblioteca **Documentos**, carpeta `Classwork`. Haz otra pareja de flujos con **Carpeta** o
**Limitar entradas a la carpeta** igual a `Classwork`.

Classwork no tiene carpetas con fecha. Para que salga la fecha real de subida, en **Crear archivo → Nombre de
archivo** borra el valor dinámico y, en la pestaña **Expresión** (fx), pega:

- Flujo automático:
  ```
  concat(convertFromUtc(triggerOutputs()?['body/Created'], 'Romance Standard Time', 'yyyy-MM-dd'), '~', triggerOutputs()?['body/{FilenameWithExtension}'])
  ```
- Flujo de volcado (dentro de *Aplicar a cada uno*):
  ```
  concat(convertFromUtc(items('Aplicar_a_cada_uno')?['Created'], 'Romance Standard Time', 'yyyy-MM-dd'), '~', items('Aplicar_a_cada_uno')?['{FilenameWithExtension}'])
  ```
  Si el bucle se llama distinto, cambia `Aplicar_a_cada_uno` por su nombre, con `_` en vez de espacios.

Encuéntralo usa esa fecha y muestra el nombre sin ella. Classwork aparece como **Trabajo de clase**.

### 3.3 Registrar la aplicación en Azure (una vez)

Hace falta para que la página pueda pedir a Microsoft el permiso de leer el OneDrive. Lo hace quien publica la
página, **siempre con una cuenta Microsoft personal**: con la de educantabria no deja. Con un solo registro sirve
para todas las personas que usen esa página.

1. Entra en <https://entra.microsoft.com> con la cuenta personal.
   - Si dice que la cuenta no tiene directorio, crea una **cuenta gratuita de Azure** en
     <https://azure.microsoft.com/free> con la misma cuenta. Puede pedir una tarjeta para verificar la identidad,
     pero el registro de aplicaciones no cuesta nada. Después vuelve a entra.microsoft.com.
2. **Identidad** → **Aplicaciones** → **Registros de aplicaciones** → **+ Nuevo registro**.
3. Rellena:
   - **Nombre**: `Encuéntralo`.
   - **Tipos de cuenta compatibles**: **Solo cuentas personales de Microsoft**.
   - **URI de redirección**: plataforma **Aplicación de página única (SPA)** y la dirección exacta del paso 1.1,
     **con la `/` final**: `https://jbooruiz.github.io/encuentralo-web/`.
4. **Registrar**.
5. En la página de la aplicación, copia el **Id. de aplicación (cliente)**. Es algo como
   `1a2b3c4d-…-9f0e`. No es secreto: puede ir en el código.
6. Los permisos no hay que tocarlos. La página pide solo **Files.Read** (leer tus archivos) y
   **offline_access** (mantener la sesión). La persona los acepta al iniciar sesión.

### 3.4 Poner el Id. en la página

Hay dos formas:

- **Para todo el mundo (recomendada):** en el repositorio, edita [`docs/config.js`](docs/config.js):
  ```js
  clientId: "1a2b3c4d-…-9f0e",
  ```
  Haz commit y push a la rama publicada. GitHub Pages se actualiza en un par de minutos.
- **Solo en un navegador, sin tocar código:** en la página, **Mi OneDrive personal** → **Id. de la aplicación** →
  pégalo ahí. Se guarda en ese navegador.

### 3.5 Iniciar sesión

1. Abre la página, en el ordenador o en el móvil.
2. **Mi OneDrive personal** → carpeta `Indexatodo` (ya viene puesta) → **Iniciar sesión con Microsoft**.
3. Elige la cuenta **personal**.
4. Microsoft avisa de que la aplicación no está verificada y pide permiso para **leer tus archivos** → **Aceptar**.
5. La página vuelve sola y empieza el escaneo.

La sesión se renueva sola durante un tiempo, normalmente un día. Cuando caduca, sale arriba **Tu sesión de
OneDrive ha caducado → Iniciar sesión**. El índice no se pierde.

En el móvil, añádela a la pantalla de inicio desde el menú del navegador para abrirla como una app.

---

## 4. Ajustes (para las dos opciones)

Botón de ajustes (arriba a la derecha):

1. **Módulos → URL de la clase en SharePoint.** Teams → la clase → **Archivos** → **Abrir en SharePoint** → copia
   la dirección entera y pégala en su módulo. Así cada documento tiene el botón **SharePoint**, que abre el original
   en la clase. Hay que hacerlo para cada módulo.
2. **Tema fijo** (opcional). Por ejemplo, poner `Forense` a todo lo de AFI.
3. **Subcarpeta = tema** (opcional). Usa la primera carpeta dentro de *Materiales de clase* o *Trabajo de clase*
   como tema. Las carpetas `UD1` y las de fecha se ignoran.
4. **Reglas de etiquetado.** Una línea por etiqueta: `Nombre: palabra, otra, .ext`. Al **Guardar** se aplican a
   todo lo que no se haya editado a mano.
5. **Copia de seguridad → Exportar.** Hazlo de vez en cuando y guarda el `.json`, por ejemplo en OneDrive. Guarda
   los ajustes, las reglas, las etiquetas editadas, las notas y los ocultos.

---

## 5. Uso diario

| Para… | Haz… |
|---|---|
| Buscar | Escribe arriba (o pulsa `/`). Busca en nombre, etiquetas, notas y **dentro** de PDF, Word y PowerPoint. Para una frase exacta, ponla entre comillas: `"cadena de custodia"` |
| Filtrar | Panel izquierdo: módulo, unidad, herramienta, tema, carpeta (Materiales / Trabajo de clase), fecha, tipo. En el móvil, botón **Filtros** |
| Abrir | **Ver**: PDF e imágenes se abren en otra pestaña; Word y PowerPoint se descargan, o se abren en OneDrive en la opción B. **SharePoint**: el original en la clase |
| Corregir etiquetas, fecha o notas | **Editar**. **Volver a lo automático** deshace lo editado |
| Quitar algo que no interesa | ✕ (Ocultar). No borra el archivo. Para recuperarlo: Ajustes → **ver** ocultos → **Restaurar** |
| Ver lo nuevo | Orden: **Detectados recientemente**. Lo detectado hoy lleva la marca **nuevo** |
| Buscar cambios ya | Botón ⟳ |

---

## 6. Problemas frecuentes

| Qué pasa | Por qué / qué hacer |
|---|---|
| Aviso **Dar acceso** cada vez que abro | Chrome pide confirmar el permiso de la carpeta en cada sesión. Es un clic. Si se instala la página como aplicación (2.3), lo suele recordar |
| **Elegir carpeta** no recuerda nada (Firefox, Safari) | Esos navegadores no tienen la función de recordar carpetas. Usa Chrome o Edge, o elígela en cada visita |
| Un PDF sale sin texto al editarlo | Es un PDF escaneado (imagen): no tiene texto que leer. Se puede buscar por nombre y etiquetas |
| "Aún no se ha podido leer" en el texto extraído | Se abrió sin internet: las librerías de PDF y Office se cargan de internet. Se reintenta solo en el próximo escaneo con conexión |
| Desaparece todo al cambiar de navegador u ordenador | El índice es de cada navegador. Exporta la copia en el viejo, importa en el nuevo y elige la carpeta |
| **Mi OneDrive personal** está desactivado | La página está abierta con doble clic (`file://`). OneDrive solo funciona desde la dirección `https://…` publicada |
| Error de Microsoft **redirect_uri** al iniciar sesión | La URI del paso 3.3 no coincide exactamente con la dirección de la página. Revisa la `/` final y que el nombre del repositorio coincida, mayúsculas incluidas |
| **Necesita aprobación del administrador** al iniciar sesión | Se ha usado la cuenta de educantabria. Inicia sesión con la cuenta **personal** |
| No existe la carpeta «Indexatodo» en tu OneDrive | Créala (3.1), o escribe en **Mi OneDrive personal** la carpeta donde copia Power Automate |
| Un archivo nuevo de Teams no aparece (opción B) | Power Automate → **Mis flujos** → el flujo automático → **Historial de ejecución**: mira si falló. Luego pulsa ⟳ en Encuéntralo |
| El botón SharePoint da 404 | Revisa la URL del módulo en Ajustes: tiene que ser de esa clase |

---

## 7. Para alumnos: índice publicado (pestaña de Teams)

Sin servidor: el Encuéntralo de la profe sube `docs/indice.json` a su repositorio con la API de GitHub (token
*fine-grained* con **Contents: Read and write** solo sobre ese repositorio). GitHub Pages lo publica, y la página
abierta sin carpeta elegida, o con `?alumnos`, entra en **modo consulta**: solo buscar, filtrar y abrir en SharePoint.

- Se publica solo tras cada escaneo, edición o cambio de ajustes, si el índice ha cambiado. También con **Publicar
  ahora**.
- Incluye lo que no está oculto: nombre, carpeta, fecha, módulo, unidades, etiquetas, notas, el enlace de SharePoint
  ya calculado y, si se marca, hasta 40 000 caracteres de texto por documento.
- **Es público**, como toda la web de GitHub Pages gratuita. Los archivos no: se abren en SharePoint con inicio de sesión.
- **El repositorio original (`jbooruiz/encuentralo-web`) no debe tener nunca un `docs/indice.json`.** Si lo tuviera,
  al hacer **Sync fork** chocaría con el de cada profe. Publica solo desde copias (forks).

Paso a paso para la profe: [GUIA-PROFE.md, sección 10](GUIA-PROFE.md#10-para-tus-alumnos-pestaña-de-teams).

---

## 8. Actualizar la página

Los cambios en `docs/` se publican solos al hacer push a la rama publicada. Tardan un par de minutos.

Quien la use solo tiene que recargar la página. Si sigue viéndose la versión anterior, recarga forzada con
**Ctrl + F5**. El índice y los ajustes se conservan.
