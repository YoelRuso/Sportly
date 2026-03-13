/**
 * Configuración y Datos de MatchAlert
 * Carga los eventos desde json-server (db.json)
 */
let partidos = {};

// Fecha objetivo: Febrero 2026
const MES_OBJETIVO = 1; // Febrero (0-11)
const ANIO_OBJETIVO = 2026;
const HOY = new Date();

/**
 * Carga todos los eventos deportivos desde json-server y los agrupa por día del mes objetivo.
 */
async function cargarEventosDelMes() {
  const sports = ['soccer', 'basket', 'tenis', 'f1'];
  const allEvents = [];

  for (const sport of sports) {
    try {
      const response = await fetch(`${JSON_SERVER_BASE}/${sport}`);
      if (response.ok) {
        const data = await response.json();
        allEvents.push(...data);
      }
    } catch (error) {
      console.error(`Error fetching ${sport} for calendar:`, error);
    }
  }

  // Filtrar eventos del mes/año objetivo y agrupar por día
  const eventosDelMes = {};
  allEvents.forEach((event) => {
    if (!event.dateEvent) return;
    const date = new Date(event.dateEvent);
    if (date.getMonth() === MES_OBJETIVO && date.getFullYear() === ANIO_OBJETIVO) {
      const dia = date.getDate();
      if (!eventosDelMes[dia]) eventosDelMes[dia] = [];

      const config = getSportConfig(event.strSport);
      const titulo = config.title(event);
      const hora = event.strTime ? event.strTime.substring(0, 5) : '';
      eventosDelMes[dia].push(hora ? `${titulo} ${hora}` : titulo);
    }
  });

  return eventosDelMes;
}

/**
 * Función que construye la cuadrícula del calendario
 */
function generarCalendario() {
  const tbody = document.querySelector('#calendar tbody');
  if (!tbody) return;

  tbody.innerHTML = ''; // Limpiar cualquier residuo

  // Calcular días del mes y el desfase inicial
  const diasEnMes = new Date(ANIO_OBJETIVO, MES_OBJETIVO + 1, 0).getDate();
  const primerDiaSemana = new Date(ANIO_OBJETIVO, MES_OBJETIVO, 1).getDay();

  // Ajuste para que la semana empiece en Lunes (0) en vez de Domingo (6)
  const offset = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

  let diaActual = 1;
  let fila = document.createElement('tr');

  // 1. Celdas vacías iniciales
  for (let i = 0; i < offset; i++) {
    const tdVacio = document.createElement('td');
    tdVacio.classList.add('empty-cell');
    fila.appendChild(tdVacio);
  }

  // 2. Creación de días (máximo 42 celdas para cubrir todas las variantes de meses)
  for (let i = offset; i < 42; i++) {
    // Si la fila está llena (7 días), añadirla al cuerpo y crear una nueva
    if (i % 7 === 0 && i !== 0) {
      tbody.appendChild(fila);
      fila = document.createElement('tr');
    }

    const td = document.createElement('td');

    if (diaActual <= diasEnMes) {
      // Estructura compatible con tu CSS (day-number y matches)
      td.innerHTML = `
        <div class="day-number">${diaActual}</div>
        <div class="matches"></div>
      `;

      // Inyectar partidos si existen
      const containerPartidos = td.querySelector('.matches');
      if (partidos[diaActual]) {
        partidos[diaActual].forEach((texto) => {
          const divPartido = document.createElement('div');
          divPartido.textContent = texto;
          containerPartidos.appendChild(divPartido);
        });
      }

      // Resaltar día de hoy (solo si coincide mes/año real)
      if (
        diaActual === HOY.getDate() &&
        MES_OBJETIVO === HOY.getMonth() &&
        ANIO_OBJETIVO === HOY.getFullYear()
      ) {
        td.classList.add('today');
      }

      // Evento de clic para información
      const d = diaActual;
      td.onclick = () => showInfo(d);

      diaActual++;
    } else {
      // Celdas vacías al final para mantener la estética de la tabla
      td.classList.add('empty-cell');
    }

    fila.appendChild(td);

    // Salir del bucle si ya no hay más días y terminamos la fila
    if (diaActual > diasEnMes && (i + 1) % 7 === 0) break;
  }

  tbody.appendChild(fila);
}

/**
 * Muestra información detallada al hacer clic
 */
function showInfo(dia) {
  const infoBox = document.getElementById('info');
  if (!infoBox) return;

  if (partidos[dia]) {
    infoBox.innerHTML = `Eventos para el ${dia} de Febrero: ${partidos[dia].join(' | ')}`;
  } else {
    infoBox.textContent = `No hay eventos programados para el día ${dia}.`;
  }
}
