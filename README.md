# Sportly

Aplicacion web para consultar eventos deportivos, leer noticias/resumenes, gestionar favoritos y visualizar contenido legal.

## Componentes del grupo

| Nombre | GitHub |
|---|---|
| Joel Morera Apaza | [@YoelRuso](https://github.com/YoelRuso) |
| Benjamin Klett | [@Bencrex](https://github.com/Bencrex) |
| Samuel Santana Garcia | [@Samuel93SP](https://github.com/Samuel93SP) |

## Mockups nuevos (nombre y ubicacion)

### Carpeta: `mockups-responsive-movil/`
- `Aviso legal` (archivo en carpeta sin extension visible)
- `Calendario.pdf`
- `Contacto.pdf`
- `Gestion de usuario.pdf`
- `Inicio.pdf`
- `Leer mas.pdf`
- `Login.pdf`
- `Resumen.pdf`

### Carpeta: `mockups-responsive-tablet/`
- `Aviso Legal.pdf`
- `Calendario.pdf`
- `Contacto.pdf`
- `Gestion de usuario.pdf`
- `Inicio.pdf`
- `Leer mas.pdf`
- `Login.pdf`
- `Resumen.pdf`

## Paginas HTML del proyecto

- `index.html`
- `src/pages/pagina-inicio/inicio.html`
- `src/pages/pagina-resumen/resumen.html`
- `src/pages/pagina-calendario/calendario.html`
- `src/pages/pagina-leermas-resumen/leermas.html`
- `src/pages/pagina-politicas-avisos/politicas-avisos.html`
- `src/pages/pagina-login/login.html`
- `src/pages/pagina-registro/registro.html`
- `src/pages/pagina-gestion-usuario/gestion-usuario.html`

## Pagina de inicio de la aplicacion web

- Entrada de la aplicacion: `index.html`
- Redireccion automatica a: `src/pages/pagina-inicio/inicio.html`

## Matriz por pagina: responsive, templates y JSON

| Pagina | Responsive implementado | Carga templates | Carga contenido JSON |
|---|---|---|---|
| `index.html` | No aplica (solo redireccion meta refresh) | No | No |
| `pagina-inicio/inicio.html` | Si. Usa estilos globales con breakpoints (`992px`, `834px`, `600px`, `430px`) para grid de cards y ajustes de contenedor. | Si (`header`, `navbar-entre-deportes`, `footer`) via `initInicio()` en `src/app.js`. | Si. Eventos deportivos desde `soccer`, `basket`, `tenis`, `f1` y favoritos en `partidas-favoritas`. |
| `pagina-calendario/calendario.html` | Si. Breakpoints en `834px` y `430px`; adapta tabla a grid, reduce tipografias y cambia representacion de eventos para movil. | Si (`header`, `footer`) via `initCalendario()`. | Si. `cargarEventos()` consulta `soccer`, `basket`, `tenis`, `f1`. |
| `pagina-leermas-resumen/leermas.html` | Si. Breakpoints en `834px` y `430px` en `leermas.css` para titulo, imagen y espaciados. | Si (`header`, `main-leermas`, `footer`) via `initLeermas()`. | No. Contenido principal es estatico (plantilla HTML), sin `fetch` a JSON. |
| `pagina-politicas-avisos/politicas-avisos.html` | Si. Breakpoints en `834px` y `430px`; menu lateral adaptado y boton menu en movil. | Si (`header`, `main-politicas-avisos`, `footer`) via `initPoliticas()`. | Si. Carga `legal` desde `db.json` (`fetchLegalContent()`). |
| `pagina-login/login.html` | Si. Breakpoints en `834px` y `430px` en `login.css`. | No | Si. Consulta `usuarios` por email para autenticar. |
| `pagina-registro/registro.html` | Si. Breakpoints en `834px` y `430px` en `registro.css`. | No | Si. Consulta `usuarios` para verificar email y crea usuario nuevo en `usuarios`. |
| `pagina-gestion-usuario/gestion-usuario.html` | Parcial. Tiene layout fijo de dashboard en escritorio; actualmente no tiene media queries especificas para tablet/movil en `gestion-usuario.css`. | No | Si. Lee usuario de `localStorage`, consulta `partidas-favoritas` y busca eventos en `soccer`, `basket`, `tenis`, `f1`. |

## Formularios y validaciones HTML implementadas

### `src/pages/pagina-login/login.html`
- Campo correo: `type="email"` + `required`
- Campo contrasena: `type="password"` + `required`
- Checkbox `Recordarme`: opcional (sin `required`)

### `src/pages/pagina-registro/registro.html`
- Campo correo: `type="email"` + `required`
- Campo contrasena: `type="password"` + `required`
- Campo confirmar contrasena: `type="password"` + `required`
- Checkbox de terminos y condiciones: `required`

Nota: ademas de HTML, en `registro.js` hay validaciones JavaScript (regex de email, fortaleza de contrasena, coincidencia de contrasenas y verificacion de email existente).

## Usuario y contrasena de prueba

Credenciales recomendadas para probar login (compatibles con el flujo actual por email):

- Email: `test@mail.es`
- Contrasena: `qQ!1234`

Tambien existen otros usuarios de prueba en `db.json` dentro de `usuarios`.

## Ubicacion del contenido JSON y como ejecutarlo

### Ubicacion

- Archivo principal consumido por la app: `db.json`
- Endpoints usados por frontend: `soccer`, `basket`, `tenis`, `f1`, `usuarios`, `partidas-favoritas`, `news-soccer`, `news-basket`, `news-tenis`, `news-f1`, `legal`
- Archivos fuente adicionales (datasets en bruto):
  - `soccer.json`
  - `basketball.json`
  - `tenis.json`
  - `F1.json`

### Ejecucion (frontend + json-server)

1. Instalar dependencias del proyecto:

```bash
npm install
```

2. Levantar el backend JSON en puerto `3000`:

```bash
npx json-server --watch db.json --port 3000
```

3. En otra terminal, iniciar la app web:

```bash
npm run dev
```

4. Abrir la URL de Vite (normalmente `http://localhost:5173`).

Sin `json-server` activo, no funcionaran login/registro, favoritos, calendario dinamico, resumen por noticias ni politicas legales dinamicas.
