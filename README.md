# 🏟️ Sportly
**Sportly** es una aplicación web para la consulta y seguimiento de partidos deportivos. Permite a los usuarios explorar deportes, ver un calendario de partidos y gestionar su cuenta de forma sencilla.

> ✅ **Sprint 1 completado** – Todas las vistas y componentes del Sprint 1 han sido implementados.
---
👥 Componentes del Grupo
Joel Morera Apaza (GitHub: YoelRuso)

Benjamín Klett (GitHub: Bencrex)

Samuel Santana García (GitHub: Samuel93SP)

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
├── index.html                          # Punto de entrada de la aplicación
├── package.json                        # Dependencias y scripts del proyecto
├── public/                             # Recursos estáticos
│   └── style.css                       # Hoja de estilos principal (importa templates)
├── src/
│   ├── main.js                         # Inicialización y carga dinámica de componentes
│   ├── pages/
│   │   ├── pagina-inicio/              # Página de inicio
│   │   ├── pagina-login/               # Página de inicio de sesión
│   │   ├── pagina-calendario/          # Página del calendario de partidos
│   │   ├── pagina-gestion-usuario/     # Página de gestión de usuario
│   │   ├── pagina-resumen/             # Página de resumen de partido
│   │   └── pagina-leermas-resumen/     # Página de detalle ampliado de partido
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
└── mockups/                            # Diseños de referencia (PDF)
    ├── pagina-inicio.pdf
    ├── Login.pdf
    ├── Calendario.pdf
    ├── Resumen.pdf
    ├── Mockup leer mas.pdf
    ├── CONTACTO.pdf
    ├── Aviso legal.pdf
    ├── POLÍTICA DE PRIVACIDAD.pdf
    └── POLÍTICA DE  COOKIES.pdf
```
---
## ✨ Funcionalidades
- 🏠 **Página de inicio** – Muestra una cuadrícula de tarjetas con partidos o deportes destacados.
- 🔑 **Login** – Formulario de inicio de sesión con opción de "Recordarme" y recuperación de contraseña.
- 📅 **Calendario de partidos** – Calendario dinámico navegable por mes y año con información de partidos.
- 👤 **Gestión de usuario** – Perfil del usuario con opciones para editar datos personales.
- 📋 **Resumen de partido** – Vista resumida con tarjetas de información clave de cada partido.
- 📖 **Leer más** – Vista detallada y ampliada de un partido con información completa.
- 🧩 **Componentes reutilizables** – Cabecera, footer, sidebar, tarjetas, contacto y políticas son plantillas HTML modulares.
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
## 🎨 Mockups
Los diseños de referencia de las distintas vistas se encuentran en la carpeta [`mockups/`](./mockups/). Incluyen wireframes de:
- Página de inicio
- Login
- Calendario
- Resumen de partido
- Leer más (detalle de partido)
- Contacto
- Aviso legal
- Política de privacidad
- Política de cookies
---
## 📄 Licencia
© 2026 Sportly. Todos los derechos reservados.