RENOUT — Sitio estático (Plantilla)

Archivos creados:
- `index.html`
- `assets/css/styles.css`

Ver localmente:
Abre `index.html` en tu navegador (doble click o "Open File" en VS Code).

Deploy a GitHub Pages (rápido):
1. Inicializa git si no existe: `git init`
2. Añade y commitea: `git add . && git commit -m "RENOUT initial site"`
3. Crea un repo en GitHub llamado `RENOUT` (o usa tu nombre de usuario y repo preferido) y añade el remoto:

   git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
   git branch -M main
   git push -u origin main

4. En GitHub -> Settings -> Pages, selecciona la rama `main` y la carpeta `/ (root)` y guarda.

Opcional: usar `gh-pages` branch o la acción de GitHub Pages para despliegues automáticos.

Siguientes pasos que puedo hacer por ti:
- Subir estos archivos a un repo nuevo (necesitaré la URL remota o credenciales manuales).
- Personalizar el diseño o añadir backend/contacto real.
- Generar README principal y licencia.
Dime qué quieres que haga ahora.

Formspree / Google Sheets / Email integration
- Formspree: ya existe el endpoint en `index.html`. Para recibir emails automáticos, entra en tu cuenta de Formspree y configura el forwarding o las notificaciones.
- Google Sheets (opcional): crea un Google Apps Script web app que reciba POST JSON y guarde filas en una hoja. Copia la URL del web app y pégala en el atributo `data-sheet-endpoint` del formulario en `index.html`.
   - Ejemplo (Apps Script) — en un nuevo proyecto, pega:

      function doPost(e){
         var ss = SpreadsheetApp.openById('TU_SPREADSHEET_ID');
         var sheet = ss.getSheetByName('Sheet1');
         var data = JSON.parse(e.postData.contents);
         sheet.appendRow([new Date(), data.name||'', data.email||'', data.phone||'', data.message||'']);
         return ContentService.createTextOutput(JSON.stringify({status:'ok'})).setMimeType(ContentService.MimeType.JSON);
      }

   - Publica → "Deploy" → "New deployment" → tipo "Web app" y selecciona "Anyone" para permitir POSTs. Usa la URL resultante como `data-sheet-endpoint`.

- Email webhook (opcional): si tienes un servicio o función que envía emails al recibir POST, pega su URL en `data-email-endpoint`.

Código relevante:
- `index.html` — formulario con atributos: `data-sheet-endpoint` y `data-email-endpoint`.
- `assets/js/main.js` — validación, envío a Formspree y reenvío opcional a los endpoints configurados.

Si quieres, puedo crear el Apps Script por ti — necesitaré que pegues aquí la ID de tu Google Sheet, o puedes hacerlo y pegarme la URL del web app para que yo actualice `index.html` automáticamente.

WhatsApp Business
- Para añadir un botón de WhatsApp Business, reemplaza `YOUR_NUMBER_HERE` en el enlace de `index.html` por tu número internacional sin signos ni espacios (ejemplo México: `5215512345678`).
- El botón abrirá una conversación directa con el mensaje predefinido: "Hola RENOUT, me interesa una propiedad".
- Si prefieres, puedo cambiar el texto por defecto o mostrar un botón condicional sólo en móviles.