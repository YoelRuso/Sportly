# 🏟️ Sportly

**Sportly** es una aplicación web para la consulta y seguimiento de partidos deportivos. Permite a los usuarios explorar deportes, ver un calendario de partidos y gestionar su cuenta de forma sencilla.

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
├── index.html                          # Punto de entrada de la aplicación
├── package.json                        # Dependencias y scripts del proyecto
├── public/                             # Recursos estáticos
│   └── style.css                       # Hoja de estilos principal (importa templates)
├── src/
│   ├── main.js                         # Inicialización y carga dinámica de componentes
│   ├── pages/
│   │   ├── pagina-inicio/              # Página de inicio
│   │   ├── pagina-login/               # Página de inicio de sesión
│   │   └── pagina-calendario/          # Página del calendario de partidos
│   └── templates/
│       ├── template-header/            # Componente de cabecera (navbar)
│       ├── template-footer/            # Componente de pie de página
│       ├── template-sidebar/           # Componente de barra lateral
│       ├── template-card/              # Tarjeta de partido/deporte
│       ├── template-navbar-entre-deportes/  # Navegación entre deportes
│       └── template-politicas-avisos/  # Políticas y avisos legales
└── mockups/                            # Diseños de referencia (PDF)
    ├── pagina-inicio.pdf
    ├── Login.pdf
    ├── Calendario.pdf
    ├── Deportes.pdf
    ├── Header.pdf
    ├── Footer.pdf
    ├── Gestión de Usuario.pdf
    ├── Gestión de Administrador.pdf
    └── Zoom Partido.pdf
```

---

## ✨ Funcionalidades

- 🏠 **Página de inicio** – Muestra una cuadrícula de tarjetas con partidos o deportes destacados.
- 🔑 **Login** – Formulario de inicio de sesión con opción de "Recordarme" y recuperación de contraseña.
- 📅 **Calendario de partidos** – Calendario dinámico navegable por mes y año con información de partidos.
- 🧩 **Componentes reutilizables** – Cabecera, footer, sidebar y tarjetas son plantillas HTML modulares.

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
- Deportes
- Header y Footer
- Gestión de Usuario y Administrador
- Vista detallada de partido (Zoom Partido)

---

## 📄 Licencia

© 2026 Sportly. Todos los derechos reservados.
