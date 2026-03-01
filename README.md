# 🏟️ Sportly

**Sportly** es una aplicación web para la consulta y seguimiento de partidos deportivos. Permite a los usuarios explorar deportes, ver un calendario de partidos y gestionar su cuenta de forma sencilla.

> ✅ **Sprint 1 completado** – Todas las vistas y componentes del Sprint 1 han sido implementados.

---

## 👥 Componentes del Grupo

| Nombre | GitHub |
|---|---|
| Joel Morera Apaza | [@YoelRuso](https://github.com/YoelRuso) |
| Benjamín Klett | [@Bencrex](https://github.com/Bencrex) |
| Samuel Santana García | [@Samuel93SP](https://github.com/Samuel93SP) |

---

## 📝 Descripción del proyecto

Sportly es una plataforma web de seguimiento deportivo que permite a los usuarios:
- Explorar deportes y partidos destacados mediante tarjetas visuales.
- Consultar un calendario mensual con los partidos programados.
- Ver el resumen detallado de cada partido.
- Gestionar su cuenta personal (registro, inicio de sesión y edición de perfil).
- Acceder a información legal (aviso legal, políticas de privacidad y cookies) y de contacto.

La aplicación está construida con HTML5, CSS3 y JavaScript vanilla, utilizando una arquitectura modular basada en plantillas HTML reutilizables que se cargan dinámicamente mediante la función `xluIncludeFile`.

---

## ✅ Requisitos Funcionales

1. **RF-01 – Visualización de deportes y partidos:** El sistema debe mostrar una cuadrícula de tarjetas con deportes y partidos destacados en la página de inicio.
2. **RF-02 – Navegación entre deportes:** El sistema debe permitir navegar entre distintos deportes mediante una barra de navegación horizontal.
3. **RF-03 – Inicio de sesión:** El sistema debe ofrecer un formulario de inicio de sesión con campos de usuario y contraseña, opción de "Recordarme" y enlace de recuperación de contraseña.
4. **RF-04 – Calendario de partidos:** El sistema debe mostrar un calendario mensual con los partidos programados para cada día, destacando el día actual.
5. **RF-05 – Resumen de partidos:** El sistema debe presentar tarjetas con el resumen de los partidos (equipos, resultado, deporte).
6. **RF-06 – Detalle de partido (Leer más):** El sistema debe mostrar una vista ampliada con información completa de un partido seleccionado.
7. **RF-07 – Gestión de usuario:** El sistema debe permitir al usuario ver y editar su información de perfil (nombre, apellidos, correo, contraseña, fecha de nacimiento, foto).
8. **RF-08 – Páginas informativas:** El sistema debe incluir páginas de Contacto, Aviso Legal, Política de Privacidad y Política de Cookies.
9. **RF-09 – Componentes reutilizables:** La cabecera (navbar), pie de página, barra lateral y tarjetas deben ser componentes modulares cargados dinámicamente en todas las páginas.
10. **RF-10 – Página de inicio de la aplicación:** El punto de entrada (`index.html`) debe redirigir automáticamente a la página de inicio (`pagina-inicio/inicio.html`).

---

## 🎨 Mockups y Storyboard

Los ficheros PDF con los mockups y el storyboard de la aplicación se encuentran en la carpeta **[`mockups/`](./mockups/)**.

| Archivo PDF | Descripción |
|---|---|
| [`mockups/pagina-inicio.pdf`](./mockups/pagina-inicio.pdf) | Mockup de la página de inicio |
| [`mockups/Login.pdf`](./mockups/Login.pdf) | Mockup de la página de login |
| [`mockups/Calendario.pdf`](./mockups/Calendario.pdf) | Mockup de la página del calendario |
| [`mockups/Resumen.pdf`](./mockups/Resumen.pdf) | Mockup de la página de resumen de partido |
| [`mockups/Mockup leer mas.pdf`](<./mockups/Mockup leer mas.pdf>) | Mockup de la página de detalle de partido (leer más) |
| [`mockups/CONTACTO.pdf`](./mockups/CONTACTO.pdf) | Mockup de la página de contacto |
| [`mockups/Avisio legal.pdf`](<./mockups/Avisio legal.pdf>) | Mockup del aviso legal |
| [`mockups/POLÍTICA DE PRIVACIDAD.pdf`](<./mockups/POLÍTICA DE PRIVACIDAD.pdf>) | Mockup de la política de privacidad |
| [`mockups/POLÍTICA DE  COOKIES.pdf`](<./mockups/POLÍTICA DE  COOKIES.pdf>) | Mockup de la política de cookies |

---

## 📄 Páginas HTML del proyecto

> ⭐ **Página de inicio de la aplicación:** `index.html` redirige automáticamente a `src/pages/pagina-inicio/inicio.html`.

| Archivo HTML | Ruta | Mockup que implementa |
|---|---|---|
| `index.html` ⭐ | `/index.html` | Punto de entrada – redirige a la página de inicio |
| `inicio.html` | `src/pages/pagina-inicio/inicio.html` | `mockups/pagina-inicio.pdf` |
| `login.html` | `src/pages/pagina-login/login.html` | `mockups/Login.pdf` |
| `calendario.html` | `src/pages/pagina-calendario/calendario.html` | `mockups/Calendario.pdf` |
| `resumen.html` | `src/pages/pagina-resumen/resumen.html` | `mockups/Resumen.pdf` |
| `leermas.html` | `src/pages/pagina-leermas-resumen/leermas.html` | `mockups/Mockup leer mas.pdf` |
| `gestion-usuario.html` | `src/pages/pagina-gestion-usuario/gestion-usuario.html` | *(Sin mockup específico)* |

Las páginas de **Contacto**, **Aviso Legal**, **Política de Privacidad** y **Política de Cookies** están implementadas como plantillas HTML (`template-contacto` y `template-politicas-avisos`) y se renderizan dentro de las páginas principales según la navegación.

---

## 🧩 Plantillas (Templates)

Las plantillas son componentes HTML reutilizables que se cargan dinámicamente mediante el atributo `xlu-include-file` y la función `xluIncludeFile()` definida en `src/xlu-include-file.js`.

| Plantilla | Archivo | Cargada en |
|---|---|---|
| Cabecera (header/navbar) | `src/templates/template-header/header.html` | `inicio.html`, `resumen.html`, `leermas.html`, `calendario.html` |
| Pie de página (footer) | `src/templates/template-footer/footer.html` | `inicio.html`, `resumen.html`, `leermas.html`, `calendario.html` |
| Barra lateral (sidebar) | `src/templates/template-sidebar/sidebar.html` | *(disponible para uso en páginas)* |
| Barra de navegación entre deportes | `src/templates/template-navbar-entre-deportes/navbar-entre-deportes.html` | `inicio.html`, `resumen.html` |
| Tarjeta de partido/deporte | `src/templates/template-card/card.html` | `inicio.html` (×6 instancias) |
| Tarjeta de resumen de partido | `src/templates/template-card-resumen/card-resumen.html` | `resumen.html` (×6 instancias) |
| Popup de tarjeta de resumen | `src/templates/template-card-resumen-popup/card-resumen-popup.html` | `template-main-leermas/main-leermas.html` |
| Contenido principal leer más | `src/templates/template-main-leermas/main-leermas.html` | `leermas.html` |
| Políticas y avisos legales | `src/templates/template-politicas-avisos/politicas-avisos.html` | *(disponible para uso en páginas)* |
| Contacto | `src/templates/template-contacto/contacto.html` | *(disponible para uso en páginas)* |

---

## 🚀 Tecnologías utilizadas

| Tecnología | Descripción |
|---|---|
| HTML5 | Estructura y maquetación de las páginas |
| CSS3 | Estilos y diseño visual |
| JavaScript (Vanilla) | Lógica del cliente y carga dinámica de componentes |
| [Vite](https://vitejs.dev/) | Servidor de desarrollo y empaquetado |
| [Prettier](https://prettier.io/) | Formateador de código |

---

## 📁 Estructura del proyecto

```
Sportly/
├── index.html                          # Punto de entrada ⭐ (redirige a pagina-inicio)
├── package.json                        # Dependencias y scripts del proyecto
├── public/                             # Recursos estáticos
│   └── style.css                       # Hoja de estilos principal (importa templates)
├── src/
│   ├── main.js                         # Inicialización y carga dinámica de componentes
│   ├── xlu-include-file.js             # Función de carga asíncrona de plantillas HTML
│   ├── pages/
│   │   ├── pagina-inicio/              # Página de inicio (inicio.html + CSS)
│   │   ├── pagina-login/               # Página de inicio de sesión (login.html + CSS)
│   │   ├── pagina-calendario/          # Página del calendario (calendario.html + CSS + JS)
│   │   ├── pagina-gestion-usuario/     # Página de gestión de usuario (gestion-usuario.html + CSS)
│   │   ├── pagina-resumen/             # Página de resumen de partido (resumen.html)
│   │   └── pagina-leermas-resumen/     # Página de detalle ampliado (leermas.html + CSS)
│   └── templates/
│       ├── template-header/            # Componente de cabecera (navbar)
│       ├── template-footer/            # Componente de pie de página
│       ├── template-sidebar/           # Componente de barra lateral
│       ├── template-card/              # Tarjeta de partido/deporte
│       ├── template-card-resumen/      # Tarjeta de resumen de partido
│       ├── template-card-resumen-popup/# Popup de tarjeta de resumen
│       ├── template-navbar-entre-deportes/  # Navegación entre deportes
│       ├── template-main-leermas/      # Contenido principal de leer más
│       ├── template-politicas-avisos/  # Políticas y avisos legales
│       └── template-contacto/          # Formulario y datos de contacto
└── mockups/                            # Diseños de referencia (PDFs)
```

---

## 💡 Otros aspectos del proyecto

### JavaScript – Tareas implementadas

- **Carga dinámica de componentes (`src/xlu-include-file.js`):** Función `xluIncludeFile()` asíncrona que recorre todos los elementos del DOM con el atributo `xlu-include-file`, los recupera mediante `fetch` y los inyecta en el HTML. Esto permite la reutilización de plantillas sin necesidad de un framework.
- **Calendario dinámico (`src/pages/pagina-calendario/calendario.js`):** Genera la cuadrícula del calendario mensual de forma programática usando JavaScript. Calcula el desfase de inicio del mes, resalta el día actual, añade indicadores de partidos programados y permite la navegación entre meses y años mediante botones.
- **Inicialización de componentes (`src/main.js`):** Escucha el evento `DOMContentLoaded` para lanzar `xluIncludeFile()` y gestionar errores de carga de imágenes.

### Organización de las hojas de estilo (CSS)

- **`public/style.css`** – Hoja de estilos principal que importa los estilos de los templates via `@import`. Define los estilos globales (fondo, tipografía base, cuadrícula de tarjetas).
- **Estilos por página** – Cada página tiene su propia hoja de estilos local (ej. `calendario.css`, `login.css`, `leermas.css`, `gestion-usuario.css`) para estilos específicos de esa vista.
- **Estilos por template** – Cada componente/plantilla tiene su propia hoja de estilos (ej. `header.css`, `footer.css`, `card.css`, `card-resumen.css`, etc.) para encapsular los estilos del componente.

---

## 🛠️ Instalación y uso

### Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior

### Pasos
1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/YoelRuso/Sportly.git
   cd Sportly
   ```
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.
4. **Genera la build de producción:**
   ```bash
   npm run build
   ```
5. **Previsualiza la build de producción:**
   ```bash
   npm run preview
   ```

---

## 📄 Licencia

© 2026 Sportly. Todos los derechos reservados.