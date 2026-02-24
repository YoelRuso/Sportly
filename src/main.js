const app = document.getElementById('app');

async function loadComponent(path, container) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`NO SE ENCUENTRA: ${path}`);

    const html = await response.text();

    // TRUCO: Insertamos el HTML directamente al final del contenedor.
    // Esto evita el problema de "firstElementChild" y funciona siempre.
    container.insertAdjacentHTML('beforeend', html);
  } catch (error) {
    console.error(`Error cargando ${path}:`, error);
  }
}

async function initApp() {
  // 1. Cargar Header
  await loadComponent('./src/templates/pagina-header/header.html', app);

  // 2. Cargar Main
  // Esperamos a que el HTML se inserte antes de continuar
  await loadComponent('./src/templates/pagina-inicio/main-container-pagina-inicio.html', app);

  // 3. Buscar el Grid (Ahora ya existe en el DOM)
  const grid = document.getElementById('grid-container');

  if (grid) {
    // Cargar las 3 tarjetas
    for (let i = 0; i < 9; i++) {
      await loadComponent('./src/templates/pagina-inicio/card-pagina-inicio.html', grid);
    }
  } else {
    console.error(
      'ALERTA: No se encontró el #grid-container. Revisa que tu archivo main-container tenga ese ID escrito correctamente.',
    );
  }

  // 4. Cargar Footer
  await loadComponent('./src/templates/pagina-footer/footer.html', app);
}

initApp();
