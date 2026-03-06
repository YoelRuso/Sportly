/**
 * calendario.js – Builds a monthly calendar and populates it with
 * sport events loaded dynamically from db.json.
 */

const XLU_RETRY_DELAY_MS = 200;

// ── State ──────────────────────────────────────────────────────────
let currentMonth; // 0-based
let currentYear;
let eventsByDay = {}; // { 'YYYY-MM-DD': [eventTitle, ...] }

// ── Helpers ────────────────────────────────────────────────────────

function padTwo(n) {
  return String(n).padStart(2, '0');
}

function monthName(m) {
  return new Date(2000, m, 1).toLocaleString('es-ES', { month: 'long' });
}

// ── Fetch events from db.json ──────────────────────────────────────

async function fetchCalendarEvents() {
  try {
    const res = await fetch('/db.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const db = await res.json();

    const all = [
      ...db.soccer.map((e) => ({ date: e.dateEvent, title: e.strEvent, sport: 'Fútbol' })),
      ...db.basket.map((e) => ({ date: e.dateEvent, title: e.strEvent, sport: 'Baloncesto' })),
      ...db.tenis.map((e)  => ({ date: e.dateEvent, title: e.strEvent, sport: 'Tennis' })),
      ...db.f1.map((e)     => ({ date: e.dateEvent, title: e.strEvent, sport: 'F1' })),
    ];

    eventsByDay = {};
    all.forEach(({ date, title, sport }) => {
      if (!date) return;
      if (!eventsByDay[date]) eventsByDay[date] = [];
      eventsByDay[date].push(`${sport}: ${title}`);
    });
  } catch (err) {
    console.warn('No se pudieron cargar los eventos del calendario:', err);
  }
}

// ── Build the calendar grid ────────────────────────────────────────

function generarCalendario() {
  const tbody = document.querySelector('#calendar tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  // Update header display
  const monthDisplay = document.querySelector('.nav-selectionar-tiempo .time-display');
  const yearDisplay  = document.querySelectorAll('.nav-selectionar-tiempo .time-display')[1];
  if (monthDisplay) monthDisplay.textContent = monthName(currentMonth);
  if (yearDisplay)  yearDisplay.textContent  = currentYear;

  const diasEnMes       = new Date(currentYear, currentMonth + 1, 0).getDate();
  const primerDiaSemana = new Date(currentYear, currentMonth, 1).getDay();
  const offset          = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
  const hoy             = new Date();

  let diaActual = 1;
  let fila      = document.createElement('tr');

  // Leading empty cells
  for (let i = 0; i < offset; i++) {
    const td = document.createElement('td');
    td.classList.add('empty-cell');
    fila.appendChild(td);
  }

  for (let i = offset; i < 42; i++) {
    if (i % 7 === 0 && i !== 0) {
      tbody.appendChild(fila);
      fila = document.createElement('tr');
    }

    const td = document.createElement('td');

    if (diaActual <= diasEnMes) {
      td.innerHTML = `<div class="day-number">${diaActual}</div><div class="matches"></div>`;

      const dateKey = `${currentYear}-${padTwo(currentMonth + 1)}-${padTwo(diaActual)}`;
      const dayEvents = eventsByDay[dateKey] || [];

      const matchesDiv = td.querySelector('.matches');
      dayEvents.slice(0, 3).forEach((text) => {
        const div = document.createElement('div');
        div.textContent = text;
        matchesDiv.appendChild(div);
      });
      if (dayEvents.length > 3) {
        const more = document.createElement('div');
        more.textContent = `+${dayEvents.length - 3} más`;
        more.style.color = '#888';
        matchesDiv.appendChild(more);
      }

      // Highlight today
      if (
        diaActual === hoy.getDate() &&
        currentMonth === hoy.getMonth() &&
        currentYear === hoy.getFullYear()
      ) {
        td.classList.add('today');
      }

      const d = diaActual;
      td.onclick = () => showInfo(d, dateKey);
      diaActual++;
    } else {
      td.classList.add('empty-cell');
    }

    fila.appendChild(td);
    if (diaActual > diasEnMes && (i + 1) % 7 === 0) break;
  }

  tbody.appendChild(fila);
}

// ── Show info on click ─────────────────────────────────────────────

function showInfo(dia, dateKey) {
  const infoBox = document.getElementById('info');
  if (!infoBox) return;

  const events = eventsByDay[dateKey] || [];
  if (events.length) {
    infoBox.innerHTML = `<strong>${dia} de ${monthName(currentMonth)} ${currentYear}:</strong><br>${events.join('<br>')}`;
  } else {
    infoBox.textContent = `No hay eventos programados para el ${dia} de ${monthName(currentMonth)}.`;
  }
}

// ── Navigation arrows ──────────────────────────────────────────────

function prevMonth() {
  if (currentMonth === 0) { currentMonth = 11; currentYear--; }
  else { currentMonth--; }
  generarCalendario();
}

function nextMonth() {
  if (currentMonth === 11) { currentMonth = 0; currentYear++; }
  else { currentMonth++; }
  generarCalendario();
}

// ── Wire navigation arrows ─────────────────────────────────────────

function setupNavArrows() {
  const rows = document.querySelectorAll('.nav-selectionar-tiempo');
  if (!rows.length) return;

  // First row = month, second row = year
  const monthPrev = rows[0].querySelectorAll('.nav-arrow')[0];
  const monthNext = rows[0].querySelectorAll('.nav-arrow')[1];
  const yearPrev  = rows[1].querySelectorAll('.nav-arrow')[0];
  const yearNext  = rows[1].querySelectorAll('.nav-arrow')[1];

  if (monthPrev) monthPrev.addEventListener('click', (e) => { e.preventDefault(); prevMonth(); });
  if (monthNext) monthNext.addEventListener('click', (e) => { e.preventDefault(); nextMonth(); });
  if (yearPrev) yearPrev.addEventListener('click', (e) => {
    e.preventDefault(); currentYear--; generarCalendario();
  });
  if (yearNext) yearNext.addEventListener('click', (e) => {
    e.preventDefault(); currentYear++; generarCalendario();
  });
}

// ── Init ───────────────────────────────────────────────────────────

async function initCalendario() {
  const now    = new Date();
  currentMonth = now.getMonth();
  currentYear  = now.getFullYear();

  await fetchCalendarEvents();

  const tabla = document.getElementById('calendar');
  if (tabla) {
    generarCalendario();
    setupNavArrows();
  } else {
    // xlu-include-file might not be done yet — retry
    setTimeout(async () => {
      generarCalendario();
      setupNavArrows();
    }, XLU_RETRY_DELAY_MS);
  }
}

document.addEventListener('DOMContentLoaded', initCalendario);

