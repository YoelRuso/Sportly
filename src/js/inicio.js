/**
 * inicio.js – Loads sport events from db.json and renders cards
 * dynamically on the home (inicio) page.
 */

const NAVBAR_POLL_INTERVAL_MS = 60;

const SPORTS_CONFIG = {
  Soccer:      { label: 'Fútbol',      color: '#00ff88' },
  Basketball:  { label: 'Baloncesto',  color: '#ff9900' },
  Tennis:      { label: 'Tennis',      color: '#00ccff' },
  Motorsport:  { label: 'F1',          color: '#ff3344' },
};

const SPORT_IMAGE_FALLBACK =
  '/public/images/vienna-reyes-qCrKTET_09o-unsplash.jpg';

let allEvents = [];

/* ─── Fetch & store all events ──────────────────────────────────── */

async function fetchAllEvents() {
  const res = await fetch(DB_PATH);
  const db  = await res.json();

  // Normalise each collection to a common shape
  const toEvent = (e, sport) => ({
    id:         e.idEvent,
    sport,
    league:     e.strLeague    || '',
    title:      e.strEvent     || '',
    homeTeam:   e.strHomeTeam  || '',
    awayTeam:   e.strAwayTeam  || '',
    homeBadge:  e.strHomeTeamBadge || '',
    awayBadge:  e.strAwayTeamBadge || '',
    date:       e.dateEvent    || '',
    time:       e.strTime      || '',
    venue:      e.strVenue     || '',
    image:      e.strThumb || e.strSquare || SPORT_IMAGE_FALLBACK,
    homeScore:  e.intHomeScore,
    awayScore:  e.intAwayScore,
    status:     e.strStatus    || '',
    result:     e.strResult    || '',
  });

  const mapped = [
    ...db.soccer.map((e) => toEvent(e, 'Soccer')),
    ...db.basket.map((e) => toEvent(e, 'Basketball')),
    ...db.tenis.map((e)  => toEvent(e, 'Tennis')),
    ...db.f1.map((e)     => toEvent(e, 'Motorsport')),
  ];

  // Shuffle so the "Todos" view is mixed (Fisher-Yates)
  for (let i = mapped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
  }

  return mapped;
}

/* ─── Build a single card element ───────────────────────────────── */

function buildCard(event) {
  const cfg   = SPORTS_CONFIG[event.sport] || { label: event.sport, color: '#888' };
  const image = event.image && event.image.startsWith('http')
    ? event.image
    : SPORT_IMAGE_FALLBACK;

  const scoreHtml =
    event.homeScore !== null && event.awayScore !== null
      ? `<span class="card-score">${event.homeScore} – ${event.awayScore}</span>`
      : '';

  const dateStr = event.date
    ? new Date(event.date + 'T00:00:00').toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '';

  const card = document.createElement('section');
  card.className = 'card-item';
  card.innerHTML = `
    <div class="card">
      <div class="card-header" style="background-image:url('${image}');">
        <span class="badge" style="background-color:${cfg.color}; color:#000;">${cfg.label}</span>
      </div>
      <div class="card-content">
        <h3>${event.title}</h3>
        ${scoreHtml}
        <p class="card-meta">
          <span class="card-league">${event.league}</span>
          <span class="card-date">${dateStr}</span>
        </p>
        ${event.venue ? `<p class="card-venue">${event.venue}</p>` : ''}
      </div>
    </div>`;
  return card;
}

/* ─── Render N cards for given sport ────────────────────────────── */

function renderCards(sport, count = 6) {
  const container = document.getElementById('cards-container');
  if (!container) return;

  container.innerHTML = '';

  const filtered =
    sport === 'all'
      ? allEvents
      : allEvents.filter((e) => e.sport === sport);

  filtered.slice(0, count).forEach((e) => container.appendChild(buildCard(e)));
}

/* ─── Sport filter (navbar buttons) ─────────────────────────────── */

function setupSportFilter() {
  const nav = document.querySelector('.sports-selection nav ul');
  if (!nav) {
    setTimeout(setupSportFilter, NAVBAR_POLL_INTERVAL_MS);
    return;
  }

  // Map visible label → sport key
  const labelMap = {
    'Todos': 'all',
    'Fútbol': 'Soccer',
    'Baloncesto': 'Basketball',
    'Tennis': 'Tennis',
    'F1': 'Motorsport',
  };

  nav.querySelectorAll('a').forEach((a) => {
    const sport = labelMap[a.textContent.trim()];
    if (!sport) return;

    a.addEventListener('click', (e) => {
      e.preventDefault();
      nav.querySelectorAll('a').forEach((x) => x.classList.remove('active'));
      a.classList.add('active');
      renderCards(sport);
    });
  });

  // Set "Todos" as active by default
  const todosLink = [...nav.querySelectorAll('a')].find(
    (a) => a.textContent.trim() === 'Todos'
  );
  if (todosLink) todosLink.classList.add('active');
}

/* ─── Init ──────────────────────────────────────────────────────── */

async function initInicio() {
  const container = document.getElementById('cards-container');
  if (container) {
    container.innerHTML = '<p class="loading-msg">Cargando eventos…</p>';
  }

  try {
    allEvents = await fetchAllEvents();
    renderCards('all');
    setupSportFilter();
  } catch (err) {
    console.error('Error loading events:', err);
    if (container) {
      container.innerHTML = '<p class="loading-msg">No se pudieron cargar los eventos.</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', initInicio);
