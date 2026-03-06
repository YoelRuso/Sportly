/**
 * resumen.js – Loads sport results/summaries from db.json and renders
 * news cards dynamically on the resumen page.
 */

const SPORT_LABELS = {
  Soccer:     'Fútbol',
  Basketball: 'Baloncesto',
  Tennis:     'Tennis',
  Motorsport: 'F1',
};

const NEWS_IMAGE_FALLBACK =
  '/public/images/bence-balla-schottner-KMn0EXRfG9c-unsplash.jpg';

/* ─── Fetch finished matches to show as news ────────────────────── */

async function fetchNews() {
  const res = await fetch(DB_PATH);
  const db  = await res.json();

  const toArticle = (e, sport) => ({
    sport,
    title:     e.strEvent     || '',
    league:    e.strLeague    || '',
    date:      e.dateEvent    || '',
    venue:     e.strVenue     || '',
    result:    e.strResult    || '',
    homeScore: e.intHomeScore,
    awayScore: e.intAwayScore,
    image:     e.strThumb || e.strSquare || NEWS_IMAGE_FALLBACK,
  });

  // Only completed events make sense as "summaries"
  const isFinished = (e) =>
    e.strStatus &&
    (e.strStatus.toLowerCase().includes('finish') ||
      e.strStatus.toUpperCase() === 'FT');

  const articles = [
    ...db.soccer.filter(isFinished).map((e) => toArticle(e, 'Soccer')),
    ...db.basket.filter(isFinished).map((e) => toArticle(e, 'Basketball')),
    ...db.tenis.filter(isFinished).map((e) => toArticle(e, 'Tennis')),
    ...db.f1.filter(isFinished).map((e) => toArticle(e, 'Motorsport')),
  ];

  // Shuffle so different sports appear in the grid
  for (let i = articles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [articles[i], articles[j]] = [articles[j], articles[i]];
  }

  return articles;
}

/* ─── Build a single news card ──────────────────────────────────── */

function buildNewsCard(article) {
  const image = article.image && article.image.startsWith('http')
    ? article.image
    : NEWS_IMAGE_FALLBACK;

  const label = SPORT_LABELS[article.sport] || article.sport;

  const dateStr = article.date
    ? new Date(article.date + 'T00:00:00').toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '';

  const scoreStr =
    article.homeScore !== null && article.awayScore !== null
      ? ` (${article.homeScore}–${article.awayScore})`
      : '';

  // Clean up the result string (strip HTML, trim)
  const resultClean = article.result
    ? article.result.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    : '';

  const excerpt = resultClean
    ? resultClean.slice(0, 100)
    : `${article.title}${scoreStr}`;

  const card = document.createElement('section');
  card.className = 'card-item';
  card.innerHTML = `
    <div class="news-card">
      <div class="news-image-container" style="background-image:url('${image}');">
        <div class="news-overlay">
          <span class="news-category">${label}</span>
          <span class="news-date">${dateStr}</span>
        </div>
      </div>
      <div class="news-body">
        <h2 class="news-title">${article.title}</h2>
        <p class="news-excerpt">${excerpt}</p>
        <span class="news-league" style="color:#888;font-size:.8rem;">${article.league}</span>
      </div>
    </div>`;
  return card;
}

/* ─── Render news grid ───────────────────────────────────────────── */

async function initResumen() {
  const container = document.getElementById('news-container');
  if (!container) return;

  container.innerHTML = '<p class="loading-msg">Cargando noticias…</p>';

  try {
    const articles = await fetchNews();
    container.innerHTML = '';
    articles.slice(0, 6).forEach((a) => container.appendChild(buildNewsCard(a)));
  } catch (err) {
    console.error('Error loading news:', err);
    container.innerHTML = '<p class="loading-msg">No se pudieron cargar las noticias.</p>';
  }
}

document.addEventListener('DOMContentLoaded', initResumen);
