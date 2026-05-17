/* ============================================================
   FIFA World Cup 2026 — app.js
   ============================================================
   HOW TO ADD A PAGE:
   1. Add a tab in index.html with href="./?yourpage=1"
   2. Add a renderYourPage() function below
   3. Add an `if (params.has('yourpage'))` block in init()
   ============================================================ */

/* ── Helpers ── */
const $ = id => document.getElementById(id);
const app = () => $('app');

$('year').textContent = new Date().getFullYear();

/* ── Load teams.json once and cache it ── */
let _teamsCache = null;
async function loadTeams() {
  if (_teamsCache) return _teamsCache;
  const res = await fetch('teams.json');
  if (!res.ok) throw new Error('Could not load teams.json');
  _teamsCache = await res.json();
  return _teamsCache;
}

/* ============================================================
   HOME PAGE
   ============================================================ */
function renderHome() {
  app().innerHTML = `
    <section class="hero hero-image animate-in">
      <div class="hero-image-wrap">
        <img class="hero-bg" src="images/banner.png" alt="FIFA World Cup 2026 banner">
        <div class="hero-image-overlay"></div>
      </div>
      <div class="hero-content hero-content-image">
        <div class="hero-stats-bar">
          <div class="stat-item">
            <span class="stat-number">48</span>
            <span class="stat-label">Teams</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">104</span>
            <span class="stat-label">Matches</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">16</span>
            <span class="stat-label">Venues</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">12</span>
            <span class="stat-label">Groups</span>
          </div>
        </div>
        <a class="hero-cta" href="./?teams=1">Explore All Teams →</a>
      </div>
    </section>

    <div class="host-banner animate-in-2">
      <div class="host-banner-inner">
        <div class="host-item">
          <img src="https://flagcdn.com/w40/us.png" width="28" height="19" alt="USA flag">
          United States
        </div>
        <span class="host-divider">✦</span>
        <div class="host-item">
          <img src="https://flagcdn.com/w40/ca.png" width="28" height="19" alt="Canada flag">
          Canada
        </div>
        <span class="host-divider">✦</span>
        <div class="host-item">
          <img src="https://flagcdn.com/w40/mx.png" width="28" height="19" alt="Mexico flag">
          Mexico
        </div>
      </div>
    </div>

    <section class="section animate-in-3">
      <div class="wrap">
        <div class="section-head">
          <h2 class="section-title">Featured <span>Teams</span></h2>
          <a class="section-link" href="./?teams=1">See all 48 teams →</a>
        </div>
        <div class="grid" id="featured-grid">
          <p style="color:var(--text-muted)">Loading teams…</p>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <div class="section-head">
          <h2 class="section-title">Quick <span>Links</span></h2>
        </div>
        <div class="grid">
          <a href="./?fixtures=1" style="text-decoration:none">
            <div class="card" style="padding:28px; text-align:center">
              <div class="quick-card-icon">📅</div>
              <div class="quick-card-title">Fixtures</div>
              <p class="quick-card-desc">All group stage matches and kick-off times</p>
            </div>
          </a>
          <a href="./?groups=1" style="text-decoration:none">
            <div class="card" style="padding:28px; text-align:center">
              <div class="quick-card-icon">🏆</div>
              <div class="quick-card-title">Groups</div>
              <p class="quick-card-desc">All 12 groups and which teams are in each</p>
            </div>
          </a>
          <a href="./?teams=1" style="text-decoration:none">
            <div class="card" style="padding:28px; text-align:center">
              <div class="quick-card-icon">🌍</div>
              <div class="quick-card-title">All Teams</div>
              <p class="quick-card-desc">Browse and search all 48 competing nations</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  `;

  /* Load a handful of featured teams async */
  loadTeams().then(teams => {
    const featured = ['ARG', 'ENG', 'BRA', 'FRA', 'GER', 'ESP'];
    const picks = featured.map(c => teams.find(t => t.code === c)).filter(Boolean);
    $('featured-grid').innerHTML = picks.map(teamCard).join('');
  }).catch(() => {
    $('featured-grid').innerHTML = '<p>Could not load teams.</p>';
  });
}

/* ============================================================
   TEAMS LIST PAGE
   ============================================================ */
async function renderList() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">All <span>Teams</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap">
        <div class="search-wrap">
          <input class="search" placeholder="Search by team name or group…" aria-label="Search teams" id="team-search" />
        </div>
        <div class="grid grid-lg" id="teams-grid">
          <p style="color:var(--text-muted)">Loading…</p>
        </div>
      </div>
    </div>
  `;

  const teams = await loadTeams();
  const grid = $('teams-grid');
  const search = $('team-search');

  function draw(q = '') {
    const filtered = teams.filter(t =>
      !q || t.name.toLowerCase().includes(q) || t.group.toLowerCase().includes(q)
    );
    grid.innerHTML = filtered.length
      ? filtered.map(teamCard).join('')
      : '<p style="color:var(--text-muted)">No teams match your search.</p>';
  }

  search.addEventListener('input', e => draw(e.target.value.trim().toLowerCase()));
  draw();
}

function teamCard(t) {
  return `
    <article class="card">
      <div class="card-flag-bar" style="background:linear-gradient(90deg, var(--green-bright), var(--green-light))"></div>
      <div class="card-body">
        <a href="?team=${encodeURIComponent(t.code)}" aria-label="${t.name}">
          <div class="card-header">
            <img class="card-flag" src="${t.flag}" alt="${t.name} flag" loading="lazy">
            <div>
              <div class="card-name">${t.name}</div>
              <span class="tag">Group ${t.group}</span>
            </div>
          </div>
          <p class="card-blurb">${t.blurb}</p>
        </a>
      </div>
    </article>`;
}

/* ============================================================
   TEAM DETAIL PAGE
   ============================================================ */
async function renderTeam(code) {
  const teams = await loadTeams();
  const team = teams.find(t => t.code.toLowerCase() === code.toLowerCase());

  if (!team) {
    app().innerHTML = `
      <a class="back-link" href="./?teams=1">← Back to Teams</a>
      <div class="wrap"><p>Team not found.</p></div>`;
    return;
  }

  const others = teams.filter(t => t.code !== team.code).slice(0, 4);

  app().innerHTML = `
    <a class="back-link" href="./?teams=1">← All Teams</a>

    <div class="team-hero">
      <div class="wrap">
        <div class="team-hero-inner">
          <img class="team-flag-lg" src="${team.flag}" alt="${team.name} flag">
          <div>
            <h1 class="team-hero-name">${team.name.toUpperCase()}</h1>
            <div class="team-hero-group">
              <span class="tag" style="background:rgba(255,255,255,0.15);color:#fff">Group ${team.group}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="team-content">
      <div class="wrap">
        <div class="team-grid">

          <div class="info-card">
            <h3>About</h3>
            <p>${team.description || team.blurb}</p>
          </div>

          ${team.players?.length ? `
          <div class="info-card">
            <h3>Key Players</h3>
            <ul class="player-list">
              ${team.players.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>` : ''}

        </div>

        <h2 class="section-title" style="margin-top:40px;margin-bottom:20px">More <span>Teams</span></h2>
        <div class="grid">
          ${others.map(teamCard).join('')}
        </div>
      </div>
    </div>
  `;
}

/* ============================================================
   FIXTURES PAGE
   ============================================================ */
function renderFixtures() {
  /* 
    HOW TO ADD REAL FIXTURES:
    Each fixture object has:
      home, away       — team names
      homeFlag, awayFlag — flag image URLs (from flagcdn.com)
      date             — display date string
      time             — kick-off time
      stadium          — venue name
      group            — "Group A" or "Round of 16" etc
      result           — e.g. "2 - 1" or null if not played yet
  */
  const fixtures = [
    /* ── Group A ── */
    { home:'Mexico',        homeFlag:'https://flagcdn.com/w40/mx.png',
      away:'Poland',        awayFlag:'https://flagcdn.com/w40/pl.png',
      date:'Thu 11 Jun',    time:'17:00',  stadium:'AT&T Stadium, Dallas', group:'Group A', result: null },
    { home:'United States', homeFlag:'https://flagcdn.com/w40/us.png',
      away:'Canada',        awayFlag:'https://flagcdn.com/w40/ca.png',
      date:'Fri 12 Jun',    time:'20:00',  stadium:'SoFi Stadium, LA', group:'Group A', result: null },
    { home:'Poland',        homeFlag:'https://flagcdn.com/w40/pl.png',
      away:'Canada',        awayFlag:'https://flagcdn.com/w40/ca.png',
      date:'Tue 16 Jun',    time:'17:00',  stadium:'BMO Field, Toronto', group:'Group A', result: null },
    /* ── Group B ── */
    { home:'Argentina',     homeFlag:'https://flagcdn.com/w40/ar.png',
      away:'Australia',     awayFlag:'https://flagcdn.com/w40/au.png',
      date:'Sat 13 Jun',    time:'14:00',  stadium:'Hard Rock Stadium, Miami', group:'Group B', result: null },
    { home:'Argentina',     homeFlag:'https://flagcdn.com/w40/ar.png',
      away:'Poland',        awayFlag:'https://flagcdn.com/w40/pl.png',
      date:'Thu 19 Jun',    time:'20:00',  stadium:'MetLife Stadium, New York', group:'Group B', result: null },
    /* ── Group C ── */
    { home:'France',        homeFlag:'https://flagcdn.com/w40/fr.png',
      away:'Belgium',       awayFlag:'https://flagcdn.com/w40/be.png',
      date:'Sun 14 Jun',    time:'17:00',  stadium:'Mercedes-Benz Stadium, Atlanta', group:'Group C', result: null },
    { home:'Morocco',       homeFlag:'https://flagcdn.com/w40/ma.png',
      away:'Belgium',       awayFlag:'https://flagcdn.com/w40/be.png',
      date:'Fri 20 Jun',    time:'14:00',  stadium:'Rose Bowl, LA', group:'Group C', result: null },
    /* ── Group D ── */
    { home:'England',       homeFlag:'https://flagcdn.com/w40/gb-eng.png',
      away:'Brazil',        awayFlag:'https://flagcdn.com/w40/br.png',
      date:'Mon 15 Jun',    time:'20:00',  stadium:'Gillette Stadium, Boston', group:'Group D', result: null },
    { home:'Nigeria',       homeFlag:'https://flagcdn.com/w40/ng.png',
      away:'Brazil',        awayFlag:'https://flagcdn.com/w40/br.png',
      date:'Sat 21 Jun',    time:'17:00',  stadium:'NRG Stadium, Houston', group:'Group D', result: null },
    /* ── Group E ── */
    { home:'Germany',       homeFlag:'https://flagcdn.com/w40/de.png',
      away:'Japan',         awayFlag:'https://flagcdn.com/w40/jp.png',
      date:'Tue 16 Jun',    time:'20:00',  stadium:'Levi\'s Stadium, San Jose', group:'Group E', result: null },
    { home:'Senegal',       homeFlag:'https://flagcdn.com/w40/sn.png',
      away:'Germany',       awayFlag:'https://flagcdn.com/w40/de.png',
      date:'Sun 22 Jun',    time:'14:00',  stadium:'Arrowhead Stadium, Kansas City', group:'Group E', result: null },
    /* ── Group F ── */
    { home:'Spain',         homeFlag:'https://flagcdn.com/w40/es.png',
      away:'Portugal',      awayFlag:'https://flagcdn.com/w40/pt.png',
      date:'Wed 17 Jun',    time:'20:00',  stadium:'MetLife Stadium, New York', group:'Group F', result: null },
    { home:'Croatia',       homeFlag:'https://flagcdn.com/w40/hr.png',
      away:'Portugal',      awayFlag:'https://flagcdn.com/w40/pt.png',
      date:'Mon 23 Jun',    time:'17:00',  stadium:'Estadio Azteca, Mexico City', group:'Group F', result: null },
  ];

  const groups = [...new Set(fixtures.map(f => f.group))];

  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">Match <span>Fixtures</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap">
        <div class="fixtures-filter" id="filter-bar">
          <button class="filter-btn active" data-filter="all">All Groups</button>
          ${groups.map(g => `<button class="filter-btn" data-filter="${g}">${g}</button>`).join('')}
        </div>
        <div id="fixtures-list"></div>
      </div>
    </div>
  `;

  function renderFixtureList(filter) {
    const toShow = filter === 'all' ? fixtures : fixtures.filter(f => f.group === filter);
    const byGroup = {};
    toShow.forEach(f => { (byGroup[f.group] = byGroup[f.group] || []).push(f); });

    $('fixtures-list').innerHTML = Object.entries(byGroup).map(([group, matches]) => `
      <div class="fixture-group">
        <div class="fixture-group-title">${group}</div>
        ${matches.map(f => `
          <div class="fixture-card">
            <div class="fixture-team home">
              <span>${f.home}</span>
              <img class="fixture-flag" src="${f.homeFlag}" alt="${f.home}">
            </div>
            <div class="fixture-score">
              ${f.result
                ? `<div class="fixture-result">${f.result}</div>`
                : `<div class="fixture-vs">VS</div>`}
              <div class="fixture-time">${f.date} · ${f.time}</div>
              <div class="fixture-stadium">📍 ${f.stadium}</div>
              <span class="fixture-badge badge-group">${f.group}</span>
            </div>
            <div class="fixture-team away">
              <img class="fixture-flag" src="${f.awayFlag}" alt="${f.away}">
              <span>${f.away}</span>
            </div>
          </div>`).join('')}
      </div>`).join('');
  }

  renderFixtureList('all');

  $('filter-bar').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderFixtureList(btn.dataset.filter);
  });
}

/* ============================================================
   GROUPS PAGE
   ============================================================ */
async function renderGroups() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">Group <span>Stage</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap">
        <p style="color:var(--text-muted);margin-bottom:24px">All 12 groups — top 2 from each group advance to the Round of 32</p>
        <div class="groups-grid" id="groups-grid">
          <p style="color:var(--text-muted)">Loading…</p>
        </div>
      </div>
    </div>
  `;

  const teams = await loadTeams();

  /* Build groups map */
  const groups = {};
  teams.forEach(t => {
    (groups[t.group] = groups[t.group] || []).push(t);
  });

  $('groups-grid').innerHTML = Object.entries(groups)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([letter, members]) => `
      <div class="group-card">
        <div class="group-card-header">
          <div>
            <div class="group-letter">${letter}</div>
            <div class="group-label">Group ${letter}</div>
          </div>
          <div style="color:rgba(255,255,255,0.4);font-size:0.8rem">${members.length} teams</div>
        </div>
        <table class="group-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th>
            </tr>
          </thead>
          <tbody>
            ${members.map(t => `
              <tr>
                <td>
                  <a class="team-cell" href="?team=${encodeURIComponent(t.code)}">
                    <img src="${t.flag}" alt="${t.name}" loading="lazy">
                    ${t.name}
                  </a>
                </td>
                <td>0</td><td>0</td><td>0</td><td>0</td>
                <td style="font-weight:700;color:var(--green-dark)">0</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    `).join('');
}

/* ============================================================
   ABOUT PAGE
   ============================================================ */
function renderAbout() {
  app().innerHTML = `
    <div class="about-hero">
      <h1 class="about-title">About <span>This Site</span></h1>
      <p class="about-sub">A family-made World Cup fan site — built to learn, share, and celebrate football</p>
    </div>
    <div class="about-content">
      <div class="wrap">
        <div class="about-grid">
          <div class="about-card">
            <div class="about-card-icon">⚽</div>
            <h3>What is this?</h3>
            <p>A fun fan site for FIFA World Cup 2026 — covering all 48 teams, group fixtures, and match results. Made at home, with no trackers or cookies.</p>
          </div>
          <div class="about-card">
            <div class="about-card-icon">🛠️</div>
            <h3>How to update it</h3>
            <p>To add a team, edit <code>teams.json</code>. To add fixtures, update the fixtures array in <code>app.js</code>. Push to GitHub and the site updates automatically.</p>
          </div>
          <div class="about-card">
            <div class="about-card-icon">📸</div>
            <h3>Adding photos</h3>
            <p>Create an <code>images/</code> folder. Put banner photos in <code>images/banner.jpg</code> and player photos in <code>images/players/</code>. Then update the links in the code.</p>
          </div>
          <div class="about-card">
            <div class="about-card-icon">🌐</div>
            <h3>Hosted on GitHub</h3>
            <p>The site lives on GitHub Pages and updates every time you push changes. No servers, no cost — just HTML, CSS, and JavaScript.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ============================================================
   ROUTER — reads URL and decides which page to show
   ============================================================ */
(async function init() {
  const params = new URLSearchParams(location.search);

  try {
    if (params.has('about'))    { renderAbout();                         }
    else if (params.has('fixtures')) { renderFixtures();                 }
    else if (params.has('groups'))   { await renderGroups();             }
    else if (params.get('team'))     { await renderTeam(params.get('team')); }
    else if (params.has('teams'))    { await renderList();               }
    else                             { renderHome();                     }
  } catch (err) {
    app().innerHTML = `<div class="wrap" style="padding:2rem"><p>Something went wrong: ${err.message}</p></div>`;
  }
})();

/* ============================================================
   NAV: active tab highlighting + mobile menu
   ============================================================ */
(function () {
  const params = new URLSearchParams(location.search);
  document.querySelectorAll('.tab').forEach(tab => {
    const page = tab.dataset.page;
    const isActive =
      (page === 'home'     && !params.has('teams') && !params.has('fixtures') && !params.has('groups') && !params.has('about') && !params.get('team')) ||
      (page === 'teams'    && (params.has('teams') || params.get('team'))) ||
      (page === 'fixtures' && params.has('fixtures')) ||
      (page === 'groups'   && params.has('groups')) ||
      (page === 'about'    && params.has('about'));
    if (isActive) tab.classList.add('active');
  });

  /* Mobile hamburger */
  const toggle = document.querySelector('.nav-toggle');
  const tabs   = document.querySelector('.tabs');
  toggle?.addEventListener('click', () => {
    const open = tabs.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  /* Scroll shadow on header */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 8
      ? '0 4px 30px rgba(0,0,0,0.4)'
      : '0 4px 20px rgba(0,0,0,0.3)';
  }, { passive: true });
})();
