/**
 * calendario.js — Sportly Calendar Module
 *
 * Fetches sport events from the json-server and renders them
 * dynamically on the calendar grid.
 */

const JSON_SERVER_BASE_CAL = 'http://localhost:3000';
const MESES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Current displayed month/year (start at February 2026)
let mesActual = 1;   // 0-indexed (1 = Febrero)
let anioActual = 2026;

// Events indexed by "YYYY-MM-DD" → array of event labels
let eventosPorFecha = {};

/**
 * Fetches all sport events from json-server and indexes them by date.
 */
async function cargarEventos() {
  const sports = ['soccer', 'basket', 'tenis', 'f1'];
  try {
    const results = await Promise.all(
      sports.map((s) =>
        fetch(`${JSON_SERVER_BASE_CAL}/${s}`)
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => []),
      ),
    );
    eventosPorFecha = {};
    results.flat().forEach((event) => {
      const fecha = event.dateEvent;
      if (!fecha) return;
      const label =
        event.strEvent ||
        (event.strHomeTeam && event.strAwayTeam
          ? `${event.strHomeTeam} vs ${event.strAwayTeam}`
          : null) ||
        'Evento deportivo';
      const sport = (event.strSport || '').toLowerCase();
      const sportLabel =
        sport === 'soccer'
          ? '⚽'
          : sport === 'basketball'
          ? '🏀'
          : sport === 'tennis'
          ? '🎾'
          : sport === 'motorsport'
          ? '🏎️'
          : '🏅';
      if (!eventosPorFecha[fecha]) eventosPorFecha[fecha] = [];
      eventosPorFecha[fecha].push({ label, sportLabel, event });
    });
  } catch (error) {
    console.error('Error cargando eventos del calendario:', error);
  }
}

/**
 * Updates the month/year display in the header.
 */
function actualizarDisplay() {
  const monthEl = document.getElementById('month-display');
  const yearEl = document.getElementById('year-display');
  if (monthEl) monthEl.textContent = MESES_ES[mesActual];
  if (yearEl) yearEl.textContent = String(anioActual);
}

/**
 * Builds the calendar grid for the current month/year using fetched events.
 */
function generarCalendario() {
  const tbody = document.querySelector('#calendar tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  const HOY = new Date();
  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();
  const primerDiaSemana = new Date(anioActual, mesActual, 1).getDay();
  const offset = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

  let diaActual = 1;
  let fila = document.createElement('tr');

  for (let i = 0; i < offset; i++) {
    const tdVacio = document.createElement('td');
    tdVacio.classList.add('empty-cell');
    fila.appendChild(tdVacio);
  }

  for (let i = offset; i < 42; i++) {
    if (i % 7 === 0 && i !== 0) {
      tbody.appendChild(fila);
      fila = document.createElement('tr');
    }

    const td = document.createElement('td');

    if (diaActual <= diasEnMes) {
      const fechaStr = `${anioActual}-${String(mesActual + 1).padStart(2, '0')}-${String(diaActual).padStart(2, '0')}`;
      const eventosDelDia = eventosPorFecha[fechaStr] || [];

      td.innerHTML = `
        <div class="day-number">${diaActual}</div>
        <div class="matches"></div>
      `;

      const containerPartidos = td.querySelector('.matches');
      eventosDelDia.forEach(({ label, sportLabel }) => {
        const divPartido = document.createElement('div');
        divPartido.textContent = `${sportLabel} ${label}`;
        containerPartidos.appendChild(divPartido);
      });

      if (
        diaActual === HOY.getDate() &&
        mesActual === HOY.getMonth() &&
        anioActual === HOY.getFullYear()
      ) {
        td.classList.add('today');
      }

      const d = diaActual;
      const fecha = fechaStr;
      td.onclick = () => showInfo(d, fecha);

      diaActual++;
    } else {
      td.classList.add('empty-cell');
    }

    fila.appendChild(td);

    if (diaActual > diasEnMes && (i + 1) % 7 === 0) break;
  }

  tbody.appendChild(fila);
  actualizarDisplay();
}

/**
 * Shows event details when a day is clicked.
 */
function showInfo(dia, fechaStr) {
  const infoBox = document.getElementById('info');
  if (!infoBox) return;

  const eventos = eventosPorFecha[fechaStr] || [];
  if (eventos.length > 0) {
    infoBox.innerHTML =
      `<strong>Eventos para el ${dia} de ${MESES_ES[mesActual]}:</strong><br>` +
      eventos.map(({ sportLabel, label }) => `${sportLabel} ${label}`).join('<br>');
  } else {
    infoBox.textContent = `No hay eventos programados para el día ${dia}.`;
  }
}

/**
 * Sets up prev/next navigation for month and year.
 */
function setupNavegacion() {
  document.getElementById('prev-month')?.addEventListener('click', (e) => {
    e.preventDefault();
    mesActual--;
    if (mesActual < 0) { mesActual = 11; anioActual--; }
    generarCalendario();
  });

  document.getElementById('next-month')?.addEventListener('click', (e) => {
    e.preventDefault();
    mesActual++;
    if (mesActual > 11) { mesActual = 0; anioActual++; }
    generarCalendario();
  });

  document.getElementById('prev-year')?.addEventListener('click', (e) => {
    e.preventDefault();
    anioActual--;
    generarCalendario();
  });

  document.getElementById('next-year')?.addEventListener('click', (e) => {
    e.preventDefault();
    anioActual++;
    generarCalendario();
  });
}
