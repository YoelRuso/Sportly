/**
 * Main entry point para la aplicación
 * Asegura que los componentes carguen correctamente al iniciar
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('MatchAlert: Inicializando componentes...');

  // Si tu librería requiere una llamada explícita para procesar los archivos:
  if (typeof xluIncludeFile === 'function') {
    xluIncludeFile();
  }

  // Opcional: Manejo de errores de carga de imágenes
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    img.addEventListener('error', function () {
      console.error(`Error cargando imagen: ${this.src}`);
      // Podrías poner una imagen de respaldo aquí
    });
  });
});
