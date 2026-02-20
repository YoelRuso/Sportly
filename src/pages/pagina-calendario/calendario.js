// Datos de partidos (día: array de partidos)
//Partidos de prueba, se pueden modificar para agregar más o cambiar fechas/hora
const partidos = {
  1: ['Partido vs Madrid 18:00', 'Partido vs Barça 20:30'],
  3: ['Partido vs Sevilla 19:00'],
  5: ['Partido vs Valencia 21:00'],
};

// Fecha actual
const today = new Date();
const diaHoy = today.getDate();
const mes = today.getMonth();
const anio = today.getFullYear();

// Número de días del mes
const diasDelMes = new Date(anio, mes + 1, 0).getDate();

// Generar calendario
function generarCalendario() {
  const tbody = document.querySelector('#calendar tbody');
  tbody.innerHTML = ''; // limpiar calendario

  const primerDia = new Date(anio, mes, 1).getDay(); // 0 = domingo
  let fila = document.createElement('tr');
  let diaActual = 1;

  let offset = (primerDia + 6) % 7; // ajustar para que lunes = 0

  // Primera fila
  for (let i = 0; i < 7; i++) {
    const td = document.createElement('td');
    if (i >= offset) {
      td.setAttribute('data-day', diaActual);
      td.innerHTML = `
        <div class="day-number">${diaActual}</div>
        <div class="matches"></div>`;
      agregarPartidos(td, diaActual);
      if (diaActual === diaHoy) td.classList.add('today');
      td.onclick = () => showInfo(diaActual);
      diaActual++;
    }
    fila.appendChild(td);
  }
  tbody.appendChild(fila);

  // Filas siguientes
  while (diaActual <= diasDelMes) {
    let fila = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
      const td = document.createElement('td');
      if (diaActual <= diasDelMes) {
        td.setAttribute('data-day', diaActual);
        td.innerHTML = `<div class="day-number">${diaActual}</div><div class="matches"></div>`;
        agregarPartidos(td, diaActual);
        if (diaActual === diaHoy) td.classList.add('today');
        td.onclick = () => showInfo(diaActual);
        diaActual++;
      }
      fila.appendChild(td);
    }
    tbody.appendChild(fila);
  }
}

// Agregar partidos en la celda
function agregarPartidos(td, dia) {
  const container = td.querySelector('.matches');
  if (partidos[dia]) {
    partidos[dia].forEach((p) => {
      const div = document.createElement('div');
      div.textContent = p;
      container.appendChild(div);
    });
  }
}

// Mostrar info al hacer click
function showInfo(dia) {
  const info = document.getElementById('info');
  if (partidos[dia]) {
    info.innerHTML = `<strong>Día ${dia}:</strong><br>${partidos[dia].join('<br>')}`;
  } else {
    info.textContent = `Día ${dia}: No hay partidos`;
  }
}

// Generar calendario al cargar
window.onload = generarCalendario;
