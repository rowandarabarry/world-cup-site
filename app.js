/* ============================================================
   FIFA World Cup 2026 — app.js
   ============================================================
   HOW TO ADD A PAGE:
   1. Add a tab in index.html with href="./?yourpage=1"
   2. Add a renderYourPage() function below
   3. Add an `if (params.has('yourpage'))` block in init()
   ============================================================ */

const CUTOFF = new Date('2026-06-11T18:00:00Z'); // 7pm IST = 6pm UTC


/* Convert UTC time string to Irish Standard Time (UTC+1 in summer) */
function toIST(utcTimeStr) {
  const timeMap = {
    '12pm': '1pm', '1pm': '2pm', '2pm': '3pm', '3pm': '4pm',
    '4pm': '5pm', '5pm': '6pm', '6pm': '7pm', '7pm': '8pm',
    '8pm': '9pm', '9pm': '10pm', '10pm': '11pm', '11pm': '12am',
    '12am': '1am', '1am': '2am', '2am': '3am', '3am': '4am',
    '4am': '5am', '5am': '6am', '6am': '7am', '7am': '8am',
    '8am': '9am', '9am': '10am', '10am': '11am', '11am': '12pm',
  };
  return timeMap[utcTimeStr?.toLowerCase()] || utcTimeStr;
}
const BUSTER_POTS = [
  { pot: 1, label: 'Elite',       desc: 'Tournament favourites',              teams: ['France','Brazil','England','Argentina','Spain','Germany','Portugal','Netherlands'] },
  { pot: 2, label: 'Contenders',  desc: 'Strong teams who could win it',      teams: ['Belgium','Uruguay','Colombia','Morocco','Croatia','United States','Mexico','Japan'] },
  { pot: 3, label: 'Challengers', desc: 'Quality teams who could go deep',    teams: ['Senegal','Norway','Türkiye','Switzerland','Canada','Korea Republic',"Côte d'Ivoire",'Ecuador'] },
  { pot: 4, label: 'Dark Horses', desc: 'Teams that could surprise everyone', teams: ['Austria','Algeria','Scotland','Sweden','Australia','Egypt','Ghana','South Africa'] },
  { pot: 5, label: 'Underdogs',   desc: 'Solid but unlikely to go far',       teams: ['Czechia','Tunisia','Saudi Arabia','IR Iran','Paraguay','Bosnia & Herz.','Cabo Verde','Iraq'] },
  { pot: 6, label: 'Minnows',     desc: 'Real underdogs and first timers',    teams: ['Curaçao','Haiti','Jordan','Congo DR','Uzbekistan','New Zealand','Panama','Qatar'] },
];

const BUSTER_POINTS = {
  winner: 25, final: 17, sf: 12, qf: 8,
  r16: 5, best_third: 1, group_second: 2, group_winner: 4, eliminated: 0
};

const STAGE_LABELS = {
  winner: '🏆 World Cup Winner', final: '🥈 Finalist',
  sf: '🌟 Semi Final', qf: '⚡ Quarter Final',
  r16: '🔟 Round of 16', best_third: '✔️ Best 3rd Place',
  group_second: '2️⃣ Group Runner-up', group_winner: '1️⃣ Group Winner',
  eliminated: '❌ Eliminated'
};

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
      <div class="hero-title-overlay">
        <div class="wrap">
          <div class="hero-site-name">ROWAN'S <span>WORLD CUP ZONE</span></div>
          <a class="hero-cta hero-cta-banner" href="./?comps=1">Enter Competition →</a>
        </div>
      </div>
    </section>

    <div class="info-strip animate-in-2">
      <div class="info-strip-inner wrap">
        <div class="strip-stat"><strong>48</strong> Teams</div>
        <div class="strip-divider"></div>
        <div class="strip-stat"><strong>104</strong> Matches</div>
        <div class="strip-divider"></div>
        <div class="strip-stat"><strong>16</strong> Venues</div>
        <div class="strip-divider"></div>
        <div class="strip-stat"><strong>12</strong> Groups</div>
        <div class="strip-divider"></div>
        <a href="./?teams=1" class="strip-stat" style="color:var(--teal);font-weight:700;text-decoration:none">🌍 Explore Teams</a>
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
    const featured = ['ARG', 'ENG', 'BRA', 'FRA', 'GER', 'NOR'];
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
              ${team.worldCupWins > 0 ? `<span class="tag" style="background:var(--gold);color:var(--navy);margin-left:8px">🏆 ${team.worldCupWins}× Winners</span>` : ''}
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
            <p class="team-blurb-text">${team.description || team.blurb}</p>

            <div class="team-facts-inline">
              <div class="fact-row">
                <span class="fact-label">🏛️ Capital</span>
                <span class="fact-value">${team.capital || '—'}</span>
              </div>
              <div class="fact-row">
                <span class="fact-label">👥 Population</span>
                <span class="fact-value">${team.population || '—'}</span>
              </div>
              <div class="fact-row">
                <span class="fact-label">🏆 Best Finish</span>
                <span class="fact-value">${team.bestFinish || '—'}</span>
              </div>
            </div>

            ${(team.fact || team.interestingFact) ? `
            <div class="interesting-fact">
              <span class="fact-tag">⚽ Rowan's Facts</span>
              <ul style="margin:8px 0 0 0;padding-left:18px;line-height:1.8;color:var(--text-mid);font-size:0.9rem">
                ${team.fact ? `<li>${team.fact}</li>` : ''}
                ${team.fact2 ? `<li>${team.fact2}</li>` : ''}
                ${!team.fact && team.interestingFact ? `<li>${team.interestingFact}</li>` : ''}
              </ul>
            </div>` : ''}
          </div>

          <div class="info-card team-right-col">
            ${team.players?.length ? `
            <h3>Key Players</h3>
            <ul class="player-list">
              ${team.players.map(p => `<li>${p}</li>`).join('')}
            </ul>` : ''}
            <div class="country-map" id="country-map"></div>
          </div>

        </div>

        <h2 class="section-title" style="margin-top:40px;margin-bottom:20px">More <span>Teams</span></h2>
        <div class="grid">
          ${others.map(teamCard).join('')}
        </div>
      </div>
    </div>
  `;

  /* Inject map from mapsicon — maps our codes to ISO 2-letter codes */
  const mapEl = document.getElementById('country-map');
  if (mapEl) {
    const codeMap = {
      MEX:'mx', RSA:'za', KOR:'kr', CZE:'cz', CAN:'ca', BIH:'ba', QAT:'qa',
      SUI:'ch', BRA:'br', MAR:'ma', HAI:'ht', SCO:'gb', USA:'us', PAR:'py',
      AUS:'au', TUR:'tr', GER:'de', CUW:'cw', CIV:'ci', ECU:'ec', NED:'nl',
      JPN:'jp', SWE:'se', TUN:'tn', BEL:'be', EGY:'eg', IRN:'ir', NZL:'nz',
      ESP:'es', CPV:'cv', KSA:'sa', URU:'uy', FRA:'fr', SEN:'sn', IRQ:'iq',
      NOR:'no', ARG:'ar', ALG:'dz', AUT:'at', JOR:'jo', POR:'pt', COD:'cd',
      UZB:'uz', COL:'co', ENG:'gb', CRO:'hr', GHA:'gh', PAN:'pa'
    };
    const iso = codeMap[team.code];
    if (iso) {
      const img = document.createElement('img');
      img.src = `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${iso}/vector.svg`;
      img.alt = `${team.name} map`;
      img.onerror = () => { mapEl.style.display = 'none'; };
      mapEl.appendChild(img);
    }
  }
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
    { home:'Mexico',             homeFlag:'https://flagcdn.com/w40/mx.png',
      away:'South Africa',       awayFlag:'https://flagcdn.com/w40/za.png',
      date:'Thu 11 Jun',  time:'20:00 IST', stadium:'SoFi Stadium, Los Angeles',       group:'Group A', result:null },
    { home:'Korea Republic',     homeFlag:'https://flagcdn.com/w40/kr.png',
      away:'Czechia',            awayFlag:'https://flagcdn.com/w40/cz.png',
      date:'Thu 11 Jun',  time:'03:00 IST', stadium:'SoFi Stadium, Los Angeles',       group:'Group A', result:null },
    { home:'Mexico',             homeFlag:'https://flagcdn.com/w40/mx.png',
      away:'Korea Republic',     awayFlag:'https://flagcdn.com/w40/kr.png',
      date:'Mon 16 Jun',  time:'02:00 IST', stadium:'Estadio Azteca, Mexico City',     group:'Group A', result:null },
    { home:'Czechia',            homeFlag:'https://flagcdn.com/w40/cz.png',
      away:'South Africa',       awayFlag:'https://flagcdn.com/w40/za.png',
      date:'Tue 17 Jun',  time:'20:00 IST', stadium:'SoFi Stadium, Los Angeles',       group:'Group A', result:null },
    { home:'Czechia',            homeFlag:'https://flagcdn.com/w40/cz.png',
      away:'Mexico',             awayFlag:'https://flagcdn.com/w40/mx.png',
      date:'Sat 21 Jun',  time:'02:00 IST', stadium:'Estadio Azteca, Mexico City',     group:'Group A', result:null },
    { home:'South Africa',       homeFlag:'https://flagcdn.com/w40/za.png',
      away:'Korea Republic',     awayFlag:'https://flagcdn.com/w40/kr.png',
      date:'Sat 21 Jun',  time:'02:00 IST', stadium:'SoFi Stadium, Los Angeles',       group:'Group A', result:null },

    /* ── Group B ── */
    { home:'Canada',             homeFlag:'https://flagcdn.com/w40/ca.png',
      away:'Bosnia & Herz.',     awayFlag:'https://flagcdn.com/w40/ba.png',
      date:'Fri 12 Jun',  time:'20:00 IST', stadium:'BMO Field, Toronto',              group:'Group B', result:null },
    { home:'Qatar',              homeFlag:'https://flagcdn.com/w40/qa.png',
      away:'Switzerland',        awayFlag:'https://flagcdn.com/w40/ch.png',
      date:'Fri 12 Jun',  time:'02:00 IST', stadium:'Levi\'s Stadium, San Francisco',  group:'Group B', result:null },
    { home:'Switzerland',        homeFlag:'https://flagcdn.com/w40/ch.png',
      away:'Bosnia & Herz.',     awayFlag:'https://flagcdn.com/w40/ba.png',
      date:'Wed 18 Jun',  time:'20:00 IST', stadium:'Seattle Stadium',                 group:'Group B', result:null },
    { home:'Canada',             homeFlag:'https://flagcdn.com/w40/ca.png',
      away:'Qatar',              awayFlag:'https://flagcdn.com/w40/qa.png',
      date:'Wed 18 Jun',  time:'03:00 IST', stadium:'BMO Field, Toronto',              group:'Group B', result:null },
    { home:'Bosnia & Herz.',     homeFlag:'https://flagcdn.com/w40/ba.png',
      away:'Qatar',              awayFlag:'https://flagcdn.com/w40/qa.png',
      date:'Sun 22 Jun',  time:'20:00 IST', stadium:'Levi\'s Stadium, San Francisco',  group:'Group B', result:null },
    { home:'Switzerland',        homeFlag:'https://flagcdn.com/w40/ch.png',
      away:'Canada',             awayFlag:'https://flagcdn.com/w40/ca.png',
      date:'Sun 22 Jun',  time:'02:00 IST', stadium:'BMO Field, Toronto',              group:'Group B', result:null },

    /* ── Group C ── */
    { home:'Brazil',             homeFlag:'https://flagcdn.com/w40/br.png',
      away:'Morocco',            awayFlag:'https://flagcdn.com/w40/ma.png',
      date:'Sat 13 Jun',  time:'23:00 IST', stadium:'MetLife Stadium, New York',       group:'Group C', result:null },
    { home:'Haiti',              homeFlag:'https://flagcdn.com/w40/ht.png',
      away:'Scotland',           awayFlag:'https://flagcdn.com/w40/gb-sct.png',
      date:'Sun 14 Jun',  time:'20:00 IST', stadium:'AT&T Stadium, Dallas',            group:'Group C', result:null },
    { home:'Brazil',             homeFlag:'https://flagcdn.com/w40/br.png',
      away:'Haiti',              awayFlag:'https://flagcdn.com/w40/ht.png',
      date:'Thu 19 Jun',  time:'01:30 IST', stadium:'Hard Rock Stadium, Miami',        group:'Group C', result:null },
    { home:'Scotland',           homeFlag:'https://flagcdn.com/w40/gb-sct.png',
      away:'Morocco',            awayFlag:'https://flagcdn.com/w40/ma.png',
      date:'Thu 19 Jun',  time:'23:00 IST', stadium:'AT&T Stadium, Dallas',            group:'Group C', result:null },
    { home:'Scotland',           homeFlag:'https://flagcdn.com/w40/gb-sct.png',
      away:'Brazil',             awayFlag:'https://flagcdn.com/w40/br.png',
      date:'Mon 23 Jun',  time:'23:00 IST', stadium:'Hard Rock Stadium, Miami',        group:'Group C', result:null },
    { home:'Morocco',            homeFlag:'https://flagcdn.com/w40/ma.png',
      away:'Haiti',              awayFlag:'https://flagcdn.com/w40/ht.png',
      date:'Mon 23 Jun',  time:'23:00 IST', stadium:'AT&T Stadium, Dallas',            group:'Group C', result:null },

    /* ── Group D ── */
    { home:'USA',                homeFlag:'https://flagcdn.com/w40/us.png',
      away:'Paraguay',           awayFlag:'https://flagcdn.com/w40/py.png',
      date:'Sun 14 Jun',  time:'02:00 IST', stadium:'Levi\'s Stadium, San Francisco',  group:'Group D', result:null },
    { home:'Australia',          homeFlag:'https://flagcdn.com/w40/au.png',
      away:'Türkiye',            awayFlag:'https://flagcdn.com/w40/tr.png',
      date:'Mon 15 Jun',  time:'17:00 IST', stadium:'Seattle Stadium',                 group:'Group D', result:null },
    { home:'USA',                homeFlag:'https://flagcdn.com/w40/us.png',
      away:'Australia',          awayFlag:'https://flagcdn.com/w40/au.png',
      date:'Fri 20 Jun',  time:'20:00 IST', stadium:'Levi\'s Stadium, San Francisco',  group:'Group D', result:null },
    { home:'Türkiye',            homeFlag:'https://flagcdn.com/w40/tr.png',
      away:'Paraguay',           awayFlag:'https://flagcdn.com/w40/py.png',
      date:'Fri 20 Jun',  time:'02:00 IST', stadium:'Seattle Stadium',                 group:'Group D', result:null },
    { home:'Türkiye',            homeFlag:'https://flagcdn.com/w40/tr.png',
      away:'USA',                awayFlag:'https://flagcdn.com/w40/us.png',
      date:'Tue 24 Jun',  time:'03:00 IST', stadium:'Seattle Stadium',                 group:'Group D', result:null },
    { home:'Paraguay',           homeFlag:'https://flagcdn.com/w40/py.png',
      away:'Australia',          awayFlag:'https://flagcdn.com/w40/au.png',
      date:'Tue 24 Jun',  time:'23:00 IST', stadium:'Levi\'s Stadium, San Francisco',  group:'Group D', result:null },

    /* ── Group E ── */
    { home:'Germany',            homeFlag:'https://flagcdn.com/w40/de.png',
      away:'Curaçao',            awayFlag:'https://flagcdn.com/w40/cw.png',
      date:'Mon 15 Jun',  time:'02:00 IST', stadium:'NRG Stadium, Houston',            group:'Group E', result:null },
    { home:'Côte d\'Ivoire',     homeFlag:'https://flagcdn.com/w40/ci.png',
      away:'Ecuador',            awayFlag:'https://flagcdn.com/w40/ec.png',
      date:'Mon 15 Jun',  time:'18:00 IST', stadium:'Arrowhead Stadium, Kansas City',  group:'Group E', result:null },
    { home:'Germany',            homeFlag:'https://flagcdn.com/w40/de.png',
      away:'Côte d\'Ivoire',     awayFlag:'https://flagcdn.com/w40/ci.png',
      date:'Sat 21 Jun',  time:'01:00 IST', stadium:'NRG Stadium, Houston',            group:'Group E', result:null },
    { home:'Ecuador',            homeFlag:'https://flagcdn.com/w40/ec.png',
      away:'Curaçao',            awayFlag:'https://flagcdn.com/w40/cw.png',
      date:'Sat 21 Jun',  time:'21:00 IST', stadium:'Arrowhead Stadium, Kansas City',  group:'Group E', result:null },
    { home:'Ecuador',            homeFlag:'https://flagcdn.com/w40/ec.png',
      away:'Germany',            awayFlag:'https://flagcdn.com/w40/de.png',
      date:'Wed 25 Jun',  time:'03:00 IST', stadium:'NRG Stadium, Houston',            group:'Group E', result:null },
    { home:'Curaçao',            homeFlag:'https://flagcdn.com/w40/cw.png',
      away:'Côte d\'Ivoire',     awayFlag:'https://flagcdn.com/w40/ci.png',
      date:'Wed 25 Jun',  time:'03:00 IST', stadium:'Arrowhead Stadium, Kansas City',  group:'Group E', result:null },

    /* ── Group F ── */
    { home:'Netherlands',        homeFlag:'https://flagcdn.com/w40/nl.png',
      away:'Japan',              awayFlag:'https://flagcdn.com/w40/jp.png',
      date:'Mon 15 Jun',  time:'21:00 IST', stadium:'AT&T Stadium, Dallas',            group:'Group F', result:null },
    { home:'Sweden',             homeFlag:'https://flagcdn.com/w40/se.png',
      away:'Tunisia',            awayFlag:'https://flagcdn.com/w40/tn.png',
      date:'Tue 17 Jun',  time:'17:00 IST', stadium:'Estadio Azteca, Mexico City',     group:'Group F', result:null },
    { home:'Netherlands',        homeFlag:'https://flagcdn.com/w40/nl.png',
      away:'Sweden',             awayFlag:'https://flagcdn.com/w40/se.png',
      date:'Sun 22 Jun',  time:'18:00 IST', stadium:'AT&T Stadium, Dallas',            group:'Group F', result:null },
    { home:'Tunisia',            homeFlag:'https://flagcdn.com/w40/tn.png',
      away:'Japan',              awayFlag:'https://flagcdn.com/w40/jp.png',
      date:'Sun 22 Jun',  time:'00:00 IST', stadium:'Estadio Azteca, Mexico City',     group:'Group F', result:null },
    { home:'Tunisia',            homeFlag:'https://flagcdn.com/w40/tn.png',
      away:'Netherlands',        awayFlag:'https://flagcdn.com/w40/nl.png',
      date:'Thu 26 Jun',  time:'21:00 IST', stadium:'AT&T Stadium, Dallas',            group:'Group F', result:null },
    { home:'Japan',              homeFlag:'https://flagcdn.com/w40/jp.png',
      away:'Sweden',             awayFlag:'https://flagcdn.com/w40/se.png',
      date:'Thu 26 Jun',  time:'00:00 IST', stadium:'Estadio Azteca, Mexico City',     group:'Group F', result:null },

    /* ── Group G ── */
    { home:'Belgium',            homeFlag:'https://flagcdn.com/w40/be.png',
      away:'Egypt',              awayFlag:'https://flagcdn.com/w40/eg.png',
      date:'Tue 16 Jun',  time:'20:00 IST', stadium:'Vancouver Stadium',               group:'Group G', result:null },
    { home:'IR Iran',            homeFlag:'https://flagcdn.com/w40/ir.png',
      away:'New Zealand',        awayFlag:'https://flagcdn.com/w40/nz.png',
      date:'Tue 16 Jun',  time:'02:00 IST', stadium:'Seattle Stadium',                 group:'Group G', result:null },
    { home:'Belgium',            homeFlag:'https://flagcdn.com/w40/be.png',
      away:'IR Iran',            awayFlag:'https://flagcdn.com/w40/ir.png',
      date:'Sun 22 Jun',  time:'18:00 IST', stadium:'Vancouver Stadium',               group:'Group G', result:null },
    { home:'New Zealand',        homeFlag:'https://flagcdn.com/w40/nz.png',
      away:'Egypt',              awayFlag:'https://flagcdn.com/w40/eg.png',
      date:'Sun 22 Jun',  time:'02:00 IST', stadium:'Seattle Stadium',                 group:'Group G', result:null },
    { home:'New Zealand',        homeFlag:'https://flagcdn.com/w40/nz.png',
      away:'Belgium',            awayFlag:'https://flagcdn.com/w40/be.png',
      date:'Thu 26 Jun',  time:'21:00 IST', stadium:'Vancouver Stadium',               group:'Group G', result:null },
    { home:'Egypt',              homeFlag:'https://flagcdn.com/w40/eg.png',
      away:'IR Iran',            awayFlag:'https://flagcdn.com/w40/ir.png',
      date:'Thu 26 Jun',  time:'04:00 IST', stadium:'Seattle Stadium',                 group:'Group G', result:null },

    /* ── Group H ── */
    { home:'Spain',              homeFlag:'https://flagcdn.com/w40/es.png',
      away:'Cabo Verde',         awayFlag:'https://flagcdn.com/w40/cv.png',
      date:'Wed 17 Jun',  time:'18:00 IST', stadium:'Hard Rock Stadium, Miami',        group:'Group H', result:null },
    { home:'Saudi Arabia',       homeFlag:'https://flagcdn.com/w40/sa.png',
      away:'Uruguay',            awayFlag:'https://flagcdn.com/w40/uy.png',
      date:'Wed 17 Jun',  time:'23:00 IST', stadium:'Levi\'s Stadium, San Francisco',  group:'Group H', result:null },
    { home:'Spain',              homeFlag:'https://flagcdn.com/w40/es.png',
      away:'Saudi Arabia',       awayFlag:'https://flagcdn.com/w40/sa.png',
      date:'Mon 23 Jun',  time:'23:00 IST', stadium:'Hard Rock Stadium, Miami',        group:'Group H', result:null },
    { home:'Uruguay',            homeFlag:'https://flagcdn.com/w40/uy.png',
      away:'Cabo Verde',         awayFlag:'https://flagcdn.com/w40/cv.png',
      date:'Mon 23 Jun',  time:'18:00 IST', stadium:'Levi\'s Stadium, San Francisco',  group:'Group H', result:null },
    { home:'Uruguay',            homeFlag:'https://flagcdn.com/w40/uy.png',
      away:'Spain',              awayFlag:'https://flagcdn.com/w40/es.png',
      date:'Fri 27 Jun',  time:'01:00 IST', stadium:'Hard Rock Stadium, Miami',        group:'Group H', result:null },
    { home:'Cabo Verde',         homeFlag:'https://flagcdn.com/w40/cv.png',
      away:'Saudi Arabia',       awayFlag:'https://flagcdn.com/w40/sa.png',
      date:'Fri 27 Jun',  time:'04:00 IST', stadium:'Levi\'s Stadium, San Francisco',  group:'Group H', result:null },

    /* ── Group I ── */
    { home:'France',             homeFlag:'https://flagcdn.com/w40/fr.png',
      away:'Senegal',            awayFlag:'https://flagcdn.com/w40/sn.png',
      date:'Thu 18 Jun',  time:'23:00 IST', stadium:'MetLife Stadium, New York',       group:'Group I', result:null },
    { home:'Iraq',               homeFlag:'https://flagcdn.com/w40/iq.png',
      away:'Norway',             awayFlag:'https://flagcdn.com/w40/no.png',
      date:'Thu 18 Jun',  time:'02:00 IST', stadium:'BMO Field, Toronto',              group:'Group I', result:null },
    { home:'France',             homeFlag:'https://flagcdn.com/w40/fr.png',
      away:'Iraq',               awayFlag:'https://flagcdn.com/w40/iq.png',
      date:'Tue 24 Jun',  time:'22:00 IST', stadium:'MetLife Stadium, New York',       group:'Group I', result:null },
    { home:'Norway',             homeFlag:'https://flagcdn.com/w40/no.png',
      away:'Senegal',            awayFlag:'https://flagcdn.com/w40/sn.png',
      date:'Tue 24 Jun',  time:'01:00 IST', stadium:'BMO Field, Toronto',              group:'Group I', result:null },
    { home:'Norway',             homeFlag:'https://flagcdn.com/w40/no.png',
      away:'France',             awayFlag:'https://flagcdn.com/w40/fr.png',
      date:'Sat 28 Jun',  time:'01:00 IST', stadium:'MetLife Stadium, New York',       group:'Group I', result:null },
    { home:'Senegal',            homeFlag:'https://flagcdn.com/w40/sn.png',
      away:'Iraq',               awayFlag:'https://flagcdn.com/w40/iq.png',
      date:'Sat 28 Jun',  time:'22:00 IST', stadium:'BMO Field, Toronto',              group:'Group I', result:null },

    /* ── Group J ── */
    { home:'Argentina',          homeFlag:'https://flagcdn.com/w40/ar.png',
      away:'Algeria',            awayFlag:'https://flagcdn.com/w40/dz.png',
      date:'Fri 19 Jun',  time:'02:00 IST', stadium:'Mercedes-Benz Stadium, Atlanta',  group:'Group J', result:null },
    { home:'Austria',            homeFlag:'https://flagcdn.com/w40/at.png',
      away:'Jordan',             awayFlag:'https://flagcdn.com/w40/jo.png',
      date:'Fri 19 Jun',  time:'17:00 IST', stadium:'Levi\'s Stadium, San Francisco',  group:'Group J', result:null },
    { home:'Argentina',          homeFlag:'https://flagcdn.com/w40/ar.png',
      away:'Austria',            awayFlag:'https://flagcdn.com/w40/at.png',
      date:'Wed 25 Jun',  time:'18:00 IST', stadium:'Mercedes-Benz Stadium, Atlanta',  group:'Group J', result:null },
    { home:'Jordan',             homeFlag:'https://flagcdn.com/w40/jo.png',
      away:'Algeria',            awayFlag:'https://flagcdn.com/w40/dz.png',
      date:'Wed 25 Jun',  time:'02:00 IST', stadium:'Levi\'s Stadium, San Francisco',  group:'Group J', result:null },
    { home:'Jordan',             homeFlag:'https://flagcdn.com/w40/jo.png',
      away:'Argentina',          awayFlag:'https://flagcdn.com/w40/ar.png',
      date:'Sun 29 Jun',  time:'03:00 IST', stadium:'Mercedes-Benz Stadium, Atlanta',  group:'Group J', result:null },
    { home:'Algeria',            homeFlag:'https://flagcdn.com/w40/dz.png',
      away:'Austria',            awayFlag:'https://flagcdn.com/w40/at.png',
      date:'Sun 29 Jun',  time:'00:30 IST', stadium:'Levi\'s Stadium, San Francisco',  group:'Group J', result:null },

    /* ── Group K ── */
    { home:'Portugal',           homeFlag:'https://flagcdn.com/w40/pt.png',
      away:'Congo DR',           awayFlag:'https://flagcdn.com/w40/cd.png',
      date:'Sat 20 Jun',  time:'18:00 IST', stadium:'NRG Stadium, Houston',            group:'Group K', result:null },
    { home:'Uzbekistan',         homeFlag:'https://flagcdn.com/w40/uz.png',
      away:'Colombia',           awayFlag:'https://flagcdn.com/w40/co.png',
      date:'Sat 20 Jun',  time:'03:00 IST', stadium:'Arrowhead Stadium, Kansas City',  group:'Group K', result:null },
    { home:'Portugal',           homeFlag:'https://flagcdn.com/w40/pt.png',
      away:'Uzbekistan',         awayFlag:'https://flagcdn.com/w40/uz.png',
      date:'Thu 26 Jun',  time:'18:00 IST', stadium:'NRG Stadium, Houston',            group:'Group K', result:null },
    { home:'Colombia',           homeFlag:'https://flagcdn.com/w40/co.png',
      away:'Congo DR',           awayFlag:'https://flagcdn.com/w40/cd.png',
      date:'Thu 26 Jun',  time:'03:00 IST', stadium:'Arrowhead Stadium, Kansas City',  group:'Group K', result:null },
    { home:'Colombia',           homeFlag:'https://flagcdn.com/w40/co.png',
      away:'Portugal',           awayFlag:'https://flagcdn.com/w40/pt.png',
      date:'Mon 30 Jun',  time:'03:00 IST', stadium:'NRG Stadium, Houston',            group:'Group K', result:null },
    { home:'Congo DR',           homeFlag:'https://flagcdn.com/w40/cd.png',
      away:'Uzbekistan',         awayFlag:'https://flagcdn.com/w40/uz.png',
      date:'Mon 30 Jun',  time:'00:00 IST', stadium:'Arrowhead Stadium, Kansas City',  group:'Group K', result:null },

    /* ── Group L ── */
    { home:'England',            homeFlag:'https://flagcdn.com/w40/gb-eng.png',
      away:'Croatia',            awayFlag:'https://flagcdn.com/w40/hr.png',
      date:'Sun 21 Jun',  time:'21:00 IST', stadium:'MetLife Stadium, New York',       group:'Group L', result:null },
    { home:'Ghana',              homeFlag:'https://flagcdn.com/w40/gh.png',
      away:'Panama',             awayFlag:'https://flagcdn.com/w40/pa.png',
      date:'Sun 21 Jun',  time:'00:00 IST', stadium:'BMO Field, Toronto',              group:'Group L', result:null },
    { home:'England',            homeFlag:'https://flagcdn.com/w40/gb-eng.png',
      away:'Ghana',              awayFlag:'https://flagcdn.com/w40/gh.png',
      date:'Fri 27 Jun',  time:'22:00 IST', stadium:'MetLife Stadium, New York',       group:'Group L', result:null },
    { home:'Panama',             homeFlag:'https://flagcdn.com/w40/pa.png',
      away:'Croatia',            awayFlag:'https://flagcdn.com/w40/hr.png',
      date:'Fri 27 Jun',  time:'00:00 IST', stadium:'BMO Field, Toronto',              group:'Group L', result:null },
    { home:'Panama',             homeFlag:'https://flagcdn.com/w40/pa.png',
      away:'England',            awayFlag:'https://flagcdn.com/w40/gb-eng.png',
      date:'Tue 1 Jul',   time:'22:00 IST', stadium:'MetLife Stadium, New York',       group:'Group L', result:null },
    { home:'Croatia',            homeFlag:'https://flagcdn.com/w40/hr.png',
      away:'Ghana',              awayFlag:'https://flagcdn.com/w40/gh.png',
      date:'Tue 1 Jul',   time:'22:00 IST', stadium:'BMO Field, Toronto',              group:'Group L', result:null },
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
   GROUPS PAGE — live standings from Google Sheets
   ============================================================ */
async function renderGroups() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">Group <span>Standings</span></h1>
        <p style="color:rgba(255,255,255,0.6);font-size:0.85rem;margin-top:6px">💡 Click on any team to see their facts, players and more</p>
      </div>
    </div>
    <div class="section">
      <div class="wrap">
        <div class="groups-grid" id="groups-grid">
          <p style="color:var(--text-muted)">Loading…</p>
        </div>
      </div>
    </div>
  `;

  const [teams, results] = await Promise.all([
    loadTeams(),
    sbGet('results').catch(() => [])
  ]);

  /* Build standings from played results */
  const standings = {};
  teams.forEach(t => {
    if (!standings[t.group]) standings[t.group] = {};
    standings[t.group][t.name] = { team: t, p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 };
  });

  /* Build standings — normalise team names for lookup */
  const nameMap = {
    'Bosnia & Herzegovina': 'Bosnia & Herz.',
    'Côte d\'Ivoire': "Côte d'Ivoire"
  };
  const normName = n => nameMap[n] || n;

  results.filter(r => r.status === 'Played').forEach(r => {
    const hScore = parseInt(r.home_score);
    const aScore = parseInt(r.away_score);
    const grp = r.group_name.replace('Group ', '');
    if (!standings[grp]) return;
    const home = standings[grp][normName(r.home_team)];
    const away = standings[grp][normName(r.away_team)];
    if (!home || !away) return;
    home.p++; away.p++;
    home.gf += hScore; home.ga += aScore;
    away.gf += aScore; away.ga += hScore;
    if (hScore > aScore)      { home.w++; home.pts+=3; away.l++; }
    else if (hScore < aScore) { away.w++; away.pts+=3; home.l++; }
    else                      { home.d++; home.pts++; away.d++; away.pts++; }
  });

  const sortedGroups = Object.entries(standings)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([letter, teams]) => ({
      letter,
      teams: Object.values(teams).sort((a,b) =>
        b.pts - a.pts || (b.gf-b.ga) - (a.gf-a.ga) || b.gf - a.gf
      )
    }));

  $('groups-grid').innerHTML = sortedGroups.map(({letter, teams}) => `
      <div class="group-card">
        <div class="group-card-header">
          <div>
            <div class="group-letter">${letter}</div>
            <div class="group-label">Group ${letter}</div>
          </div>
        </div>
        <table class="group-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>P</th><th>W</th><th>D</th><th>L</th>
              <th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
            </tr>
          </thead>
          <tbody>
            ${teams.map(s => `
              <tr>
                <td>
                  <a class="team-cell" href="?team=${encodeURIComponent(s.team.code)}">
                    <img src="${s.team.flag}" alt="${s.team.name}" loading="lazy">
                    ${s.team.name}
                  </a>
                </td>
                <td>${s.p}</td><td>${s.w}</td><td>${s.d}</td><td>${s.l}</td>
                <td>${s.gf}</td><td>${s.ga}</td>
                <td>${s.gf-s.ga > 0 ? '+' : ''}${s.gf-s.ga}</td>
                <td class="pts-cell">${s.pts}</td>
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
   SHEET API URL — replace with your deployed Apps Script URL
   ============================================================ */
/* ============================================================
   SUPABASE CONFIG
   ============================================================ */
const ADMIN_PIN     = '1919'; // ← Change this to your PIN
const SUPABASE_URL  = 'https://gniybjqkfkzlzmyuckmq.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaXlianFrZmt6bHpteXVja21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NzQ0ODcsImV4cCI6MjA5NjE1MDQ4N30.q-sKWngq5f3FR89x00h54gr9YlpXQtELqWU4o5tC2Ho';

const sbHeaders = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON,
  'Authorization': `Bearer ${SUPABASE_ANON}`
};

async function sbGet(table, params = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?order=match_id${params}`, { headers: sbHeaders });
  return res.json();
}


/* ============================================================
   SESSION — stores user token in sessionStorage
   ============================================================ */
function getSession() {
  try {
    const s = sessionStorage.getItem('wc_user');
    return s ? JSON.parse(s) : null;
  } catch(e) { return null; }
}
function setSession(user) {
  try { sessionStorage.setItem('wc_user', JSON.stringify(user)); } catch(e) {}
}
function clearSession() {
  try { sessionStorage.removeItem('wc_user'); } catch(e) {}
}
function compLogout() {
  clearSession();
  location.href = './?comps=1';
}
async function sbUpdate(table, match_id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?match_id=eq.${match_id}`, {
    method: 'PATCH',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify(data)
  });
  return res.ok;
}

/* Time lookup map — built from fixture data */
const MATCH_TIMES = {
  
};

function getMatchTime(matchId) {
  return MATCH_TIMES[matchId] || '';
}

/* ============================================================
   RESULTS PAGE — loads live from Google Sheets
   ============================================================ */
async function renderResults() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">Match <span>Results</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap">
        <div id="results-content">
          <p style="color:var(--text-muted)">Loading results…</p>
        </div>
      </div>
    </div>`;

  try {
    const results = await sbGet('results');

    /* Group by group */
    const groups = {};
    results.forEach(r => {
      const g = r.group_name || 'Other';
      if (!groups[g]) groups[g] = [];
      groups[g].push(r);
    });

    const played = results.filter(r => r.status === 'Played');
    const upcoming = results.filter(r => r.status !== 'Played');

    document.getElementById('results-content').innerHTML = `
      <div class="results-summary">
        <div class="rs-item"><strong>${played.length}</strong> Played</div>
        <div class="rs-item"><strong>${upcoming.length}</strong> Remaining</div>
      </div>

      ${Object.entries(groups).sort(([a],[b]) => a.localeCompare(b)).map(([group, matches]) => `
        <div class="fixture-group">
          <div class="fixture-group-title">${group}</div>
          ${matches.map(m => `
            <div class="fixture-card ${m.status === 'Played' ? 'fixture-played' : ''}">
              <div class="fixture-team home">
                <span>${m.home_team}</span>
                <img class="fixture-flag" src="https://flagcdn.com/w40/${flagCode(m.home_team)}.png" alt="${m.home_team}">
              </div>
              <div class="fixture-score">
                ${m.status === 'Played'
                  ? `<div class="fixture-result">${m.home_score} – ${m.away_score}</div>`
                  : `<div class="fixture-vs">VS</div>`}
                <div class="fixture-time">${m.match_date}</div>
              </div>
              <div class="fixture-team away">
                <img class="fixture-flag" src="https://flagcdn.com/w40/${flagCode(m.away_team)}.png" alt="${m.away_team}">
                <span>${m.away_team}</span>
              </div>
            </div>`).join('')}
        </div>`).join('')}`;
  } catch(e) {
    document.getElementById('results-content').innerHTML =
      `<p style="color:var(--text-muted)">Could not load results. Could not connect to database.</p>`;
  }
}

/* ============================================================
   ADMIN PANEL
   ============================================================ */
let adminPin = null;

async function renderAdmin() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">Admin <span>Panel</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap">
        <div id="admin-content">
          <div class="admin-login" id="admin-login">
            <div class="info-card" style="max-width:360px;margin:0 auto;text-align:center">
              <h3>Admin Login</h3>
              <p style="margin-bottom:20px;color:var(--text-muted)">Enter your PIN to access the admin panel</p>
              <input type="password" id="pin-input" class="search" placeholder="Enter PIN"
                style="text-align:center;letter-spacing:0.3em;font-size:1.2rem;margin-bottom:12px">
              <button onclick="submitPin()" class="hero-cta" style="width:100%;justify-content:center">
                Login →
              </button>
              <p id="pin-error" style="color:#e63200;margin-top:10px;display:none">Incorrect PIN</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  /* Allow Enter key on PIN input */
  document.getElementById('pin-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitPin();
  });
}

async function submitPin() {
  const pin = document.getElementById('pin-input').value.trim();
  if (pin === ADMIN_PIN) {
    adminPin = pin;
    loadAdminPanel();
  } else {
    document.getElementById('pin-error').style.display = 'block';
  }
}

async function loadAdminPanel() {
  document.getElementById('admin-content').innerHTML =
    `<p style="color:var(--text-muted)">Loading…</p>`;

  try {
    const results = await sbGet('results');
    const upcoming = results.filter(r => r.status !== 'Played');
    const played   = results.filter(r => r.status === 'Played');

    document.getElementById('admin-content').innerHTML = `
      <div class="admin-header">
        <p style="color:var(--text-muted);margin-bottom:24px">
          ✅ ${played.length} results entered &nbsp;·&nbsp; ⏳ ${upcoming.length} remaining
        </p>
      </div>

      <h2 class="section-title" style="margin-bottom:16px">Enter <span>Results</span></h2>
      ${upcoming.length === 0 ? '<p style="color:var(--text-muted)">All results entered!</p>' : ''}
      ${upcoming.map(m => `
        <div class="admin-match-card" id="match-${m.match_id}">
          <div class="admin-match-teams">
            <img src="https://flagcdn.com/w40/${flagCode(m.home_team)}.png" class="fixture-flag" alt="">
            <span class="admin-team-name">${m.home_team}</span>
            <input type="number" min="0" max="20" class="score-input" id="home-${m.match_id}" value="${m.home_score ?? 0}" style="${m.status==='Played'?'border-color:var(--teal)':''}">
            <span class="admin-vs">–</span>
            <input type="number" min="0" max="20" class="score-input" id="away-${m.match_id}" value="${m.away_score ?? 0}" style="${m.status==='Played'?'border-color:var(--teal)':''}">
            <span class="admin-team-name">${m.away_team}</span>
            <img src="https://flagcdn.com/w40/${flagCode(m.away_team)}.png" class="fixture-flag" alt="">
          </div>
          <div class="admin-match-meta">${m.group_name} · ${m.match_date}</div>
          <span style="font-size:0.7rem;color:var(--text-muted);margin-right:8px">#${m.match_id}</span>
          <button class="admin-save-btn" onclick="saveResult(${m.match_id})"
            style="${m.status==='Played'?'background:var(--teal-dark)':''}">
            ${m.status==='Played'?'Update':'Save'} Result
          </button>
          <span class="admin-saved" id="saved-${m.match_id}" style="display:none">✅ Saved!</span>
        </div>`).join('')}

      ${played.length > 0 ? `
      <h2 class="section-title" style="margin-top:40px;margin-bottom:16px">Entered <span>Results</span></h2>
      ${played.map(m => `
        <div class="admin-match-card admin-match-played">
          <div class="admin-match-teams">
            <img src="https://flagcdn.com/w40/${flagCode(m.home_team)}.png" class="fixture-flag" alt="">
            <span class="admin-team-name">${m.home_team}</span>
            <span class="admin-score-display">${m.home_score} – ${m.away_score}</span>
            <span class="admin-team-name">${m.away_team}</span>
            <img src="https://flagcdn.com/w40/${flagCode(m.away_team)}.png" class="fixture-flag" alt="">
          </div>
          <div class="admin-match-meta">${m.group_name} · ${m.match_date}</div>
        </div>`).join('')}` : ''}

      <h2 class="section-title" style="margin-top:40px;margin-bottom:16px">Reset <span>Password</span></h2>
      <div id="admin-users-list"><p style="color:var(--text-muted)">Loading users…</p></div>`;

  /* Load users for password reset */
  fetch(`${SUPABASE_URL}/rest/v1/users?select=id,username&order=username`, { headers: sbHeaders })
    .then(r => r.json())
    .then(users => {
      if (!users.length) { $('admin-users-list').innerHTML = '<p style="color:var(--text-muted)">No users yet.</p>'; return; }
      $('admin-users-list').innerHTML = users.map(u => `
        <div class="admin-match-card" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <span style="font-weight:600;flex:1;min-width:120px">${u.username}</span>
          <input class="search" id="pw-${u.id}" type="password" placeholder="New password" style="padding:8px 12px;flex:2;min-width:160px">
          <button class="admin-save-btn" onclick="adminResetPassword('${u.id}','${u.username}')">Reset</button>
          <span id="pw-msg-${u.id}" style="color:var(--teal);font-size:0.85rem;display:none">✅ Done</span>
        </div>`).join('');
    });

    /* Add blog management section */
    const blogHtml = await renderAdminBlog();
    const busterHtml = await renderAdminBuster();
    const utilsHtml = await renderAdminUtilities();
    document.getElementById('admin-content').innerHTML += blogHtml + busterHtml + utilsHtml;

  } catch(e) {
    document.getElementById('admin-content').innerHTML =
      `<p style="color:var(--text-muted)">Could not load matches.</p>`;
  }
}

async function saveResult(matchId) {
  const homeVal = document.getElementById(`home-${matchId}`).value;
  const awayVal = document.getElementById(`away-${matchId}`).value;
  const homeScore = homeVal === '' ? null : parseInt(homeVal);
  const awayScore = awayVal === '' ? null : parseInt(awayVal);

  if (homeScore === null || awayScore === null || isNaN(homeScore) || isNaN(awayScore)) {
    alert('Please enter both scores before saving.');
    return;
  }

  const btn = document.querySelector(`#match-${matchId} .admin-save-btn`);
  btn.textContent = 'Saving…';
  btn.disabled = true;

  try {
    const ok = await sbUpdate('results', matchId, {
      home_score: homeScore,
      away_score: awayScore,
      status: 'Played'
    });
    if (ok) {
      document.getElementById(`saved-${matchId}`).style.display = 'inline';
      btn.style.display = 'none';
      document.getElementById(`match-${matchId}`).style.opacity = '0.6';
      /* Auto-update team progress for buster scoring */
      await autoUpdateTeamProgress();
    } else {
      throw new Error('Update failed');
    }
  } catch(e) {
    alert('Could not connect to server.');
    btn.textContent = 'Save Result';
    btn.disabled = false;
  }
}

/* Auto-calculate team progress from results for Buster scoring */
async function autoUpdateTeamProgress() {
  try {
    const results = await sbGet('results');
    const played  = results.filter(r => r.status === 'Played');

    /* Build group standings from played results */
    const teams = await loadTeams();
    const standings = {};
    teams.forEach(t => {
      if (!standings[t.group]) standings[t.group] = {};
      standings[t.group][t.name] = { p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 };
    });

    played.filter(r => r.match_id <= 72).forEach(r => {
      const g = r.group_name.replace('Group ','');
      if (!standings[g]) return;
      const normName = n => n === 'Bosnia & Herzegovina' ? 'Bosnia & Herz.' : n;
      const home = standings[g][normName(r.home_team)];
      const away = standings[g][normName(r.away_team)];
      if (!home || !away) return;
      home.p++; away.p++;
      home.gf += r.home_score; home.ga += r.away_score;
      away.gf += r.away_score; away.ga += r.home_score;
      if (r.home_score > r.away_score)      { home.w++; home.pts+=3; away.l++; }
      else if (r.home_score < r.away_score) { away.w++; away.pts+=3; home.l++; }
      else                                  { home.d++; home.pts++; away.d++; away.pts++; }
    });

    /* Determine stage for each team based on how far they've gone */
    const teamStage = {};

    /* Check group stage completion per group */
    Object.entries(standings).forEach(([g, teams]) => {
      const sorted = Object.entries(teams).sort(([,a],[,b]) =>
        b.pts-a.pts || (b.gf-b.ga)-(a.gf-a.ga) || b.gf-a.gf
      );
      /* Only assign group stage if group is complete (6 matches played) */
      const groupPlayed = played.filter(r => r.match_id <= 72 && r.group_name === `Group ${g}`).length;
      if (groupPlayed === 6) {
        sorted.forEach(([name], i) => {
          if (i === 0) teamStage[name] = 'group_winner';
          else if (i === 1) teamStage[name] = 'group_second';
          else if (!teamStage[name]) teamStage[name] = 'eliminated';
        });
      }
    });

    /* Knockout stage progression */
    const koStages = [
      { matchIds: [73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88], stage: 'r16'    },
      { matchIds: [89,90,91,92,93,94,95,96],                          stage: 'qf'     },
      { matchIds: [97,98,99,100],                                      stage: 'sf'     },
      { matchIds: [101,102],                                           stage: 'final'  },
      { matchIds: [103,104],                                           stage: 'winner' },
    ];

    koStages.forEach(({ matchIds, stage }) => {
      played.filter(r => matchIds.includes(r.match_id)).forEach(r => {
        /* Both teams reached this stage */
        const normName = n => n === 'Bosnia & Herzegovina' ? 'Bosnia & Herz.' : n;
        const home = normName(r.home_team);
        const away = normName(r.away_team);
        const stageOrder = ['eliminated','group_second','best_third','group_winner','r16','qf','sf','final','winner'];
        const upgrade = (name, newStage) => {
          const curr = teamStage[name] || 'eliminated';
          if (stageOrder.indexOf(newStage) > stageOrder.indexOf(curr)) teamStage[name] = newStage;
        };
        upgrade(home, stage);
        upgrade(away, stage);
        /* Winner goes to next stage, loser stays */
        if (stage === 'final' || stage === 'winner') {
          const winner = r.home_score > r.away_score ? home : r.home_score < r.away_score ? away : null;
          if (winner) upgrade(winner, 'winner');
        }
      });
    });

    /* Batch update all team progress */
    const updates = Object.entries(teamStage).map(([team_name, best_stage]) =>
      fetch(`${SUPABASE_URL}/rest/v1/team_progress?team_name=eq.${encodeURIComponent(team_name)}`, {
        method: 'PATCH',
        headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ best_stage, updated_at: new Date().toISOString() })
      })
    );
    await Promise.all(updates);
  } catch(e) {
    console.warn('Auto team progress update failed:', e);
  }
}

async function adminResetPassword(userId, username) {
  const input = $(`newpw-${userId}`);
  const msg   = $(`pw-msg-${userId}`);
  const newPw = input?.value.trim();
  console.log('Reset pw length:', newPw?.length, 'value:', newPw);

  if (!newPw || newPw.length < 4) {
    alert(`Password must be at least 4 characters (you entered ${newPw?.length || 0}).`);
    return;
  }

  const password_hash = await sha256(newPw + 'wc2026pw');

  const ok = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
    method: 'PATCH',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ password_hash })
  }).then(r => r.ok);

  if (ok) {
    input.value = '';
    msg.style.display = 'inline';
    setTimeout(() => msg.style.display = 'none', 3000);
  } else {
    alert('Could not reset password. Try again.');
  }
}

/* Helper — map team names to flag codes */
function flagCode(team) {
  const map = {
    'Mexico':'mx','South Africa':'za','Korea Republic':'kr','Czechia':'cz',
    'Canada':'ca','Bosnia & Herzegovina':'ba','Qatar':'qa','Switzerland':'ch',
    'Brazil':'br','Morocco':'ma','Haiti':'ht','Scotland':'gb-sct',
    'United States':'us','USA':'us','Paraguay':'py','Australia':'au','Türkiye':'tr',
    'Germany':'de','Curaçao':'cw',"Côte d'Ivoire":'ci','Ecuador':'ec',
    'Netherlands':'nl','Japan':'jp','Sweden':'se','Tunisia':'tn',
    'Belgium':'be','Egypt':'eg','IR Iran':'ir','New Zealand':'nz',
    'Spain':'es','Cabo Verde':'cv','Saudi Arabia':'sa','Uruguay':'uy',
    'France':'fr','Senegal':'sn','Iraq':'iq','Norway':'no',
    'Argentina':'ar','Algeria':'dz','Austria':'at','Jordan':'jo',
    'Portugal':'pt','Congo DR':'cd','Uzbekistan':'uz','Colombia':'co',
    'England':'gb-eng','Croatia':'hr','Ghana':'gh','Panama':'pa'
  };
  return map[team] || 'un';
}
(async function init() {
  const params = new URLSearchParams(location.search);

  try {
    if (params.has('about'))           { renderAbout();                        }
    else if (params.has('fixtures'))   { renderFixtures();                     }
    else if (params.has('groups'))     { await renderGroups();                 }
    else if (params.has('results'))    { await renderResults();                }
    else if (params.has('admin'))      { await renderAdmin();                  }
    else if (params.has('predict'))    { await renderPredict();                }
    else if (params.has('leaderboard')){ await renderLeaderboard();            }
    else if (params.has('wallchart'))  {
      const session = getSession();
      if (session) {
        const preds = await fetch(
          `${SUPABASE_URL}/rest/v1/match_predictions?user_id=eq.${session.id}&select=*`,
          { headers: sbHeaders }
        ).then(r => r.json()).catch(() => []);
        await renderWallChart(preds, session.username);
      } else {
        await renderWallChart();
      }
    }
    else if (params.has('comps'))      { await renderComps();                  }
    else if (params.has('scoring'))    { renderScoring(params.get('scoring')); }
    else if (params.has('busterpicks')) { await renderBusterPicks();              }
    else if (params.has('buster'))     { await renderBuster();                 }
    else if (params.has('review'))     { await renderReview();                 }
    else if (params.has('blog'))       { await renderBlog();                   }
    else if (params.has('about'))      { await renderAbout();                  }
    else if (params.get('team'))       { await renderTeam(params.get('team')); }
    else if (params.has('teams'))      { await renderList();                   }
    else                               { renderHome();                         }
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
      (page === 'home'        && !params.has('teams') && !params.has('fixtures') && !params.has('groups') && !params.has('about') && !params.has('results') && !params.has('predict') && !params.has('leaderboard') && !params.has('wallchart') && !params.has('review') && !params.has('blog') && !params.get('team')) ||
      (page === 'teams'       && (params.has('teams') || params.get('team'))) ||
      (page === 'fixtures'    && params.has('fixtures')) ||
      (page === 'groups'      && params.has('groups')) ||
      (page === 'results'     && params.has('results')) ||
      (page === 'wallchart'   && params.has('wallchart')) ||
      (page === 'predict'     && params.has('predict')) ||
      (page === 'leaderboard' && params.has('leaderboard')) ||
      (page === 'review'      && params.has('review')) ||
      (page === 'blog'        && params.has('blog')) ||
      (page === 'about'       && params.has('about'));
    if (isActive) tab.classList.add('active');
  });

  /* Mobile hamburger */
  const toggle = document.querySelector('.nav-toggle');
  const tabs   = document.querySelector('.tabs');
  toggle?.addEventListener('click', () => {
    const open = tabs.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  /* Dropdown nav — click to toggle, close on outside click */
  document.querySelectorAll('.tab-dropdown').forEach(dd => {
    const btn  = dd.querySelector('.tab-drop-btn');
    const menu = dd.querySelector('.tab-dropdown-menu');

    /* Highlight parent when child page is active */
    dd.querySelectorAll('.tab-dropdown-item').forEach(item => {
      if (item.dataset.page && params.has(item.dataset.page)) {
        btn?.classList.add('active');
        item.classList.add('active');
      }
    });

    /* Toggle on button click */
    btn?.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('open');
      /* Close all dropdowns first */
      document.querySelectorAll('.tab-dropdown-menu.open').forEach(m => m.classList.remove('open'));
      /* Open this one if it was closed */
      if (!isOpen) menu.classList.add('open');
    });
  });

  /* Close all dropdowns when clicking anywhere outside */
  document.addEventListener('click', () => {
    document.querySelectorAll('.tab-dropdown-menu.open').forEach(m => m.classList.remove('open'));
  });

  /* Prevent clicks inside menu from closing it */
  document.querySelectorAll('.tab-dropdown-menu').forEach(m => {
    m.addEventListener('click', e => e.stopPropagation());
  });

  /* Bottom nav active state */
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    const page = item.dataset.page;
    const isActive =
      (page === 'home'        && !params.has('results') && !params.has('groups') && !params.has('predict') && !params.has('leaderboard') && !params.has('blog') && !params.has('fixtures') && !params.has('teams') && !params.has('review') && !params.has('wallchart') && !params.get('team')) ||
      (page === 'results'     && params.has('results')) ||
      (page === 'groups'      && params.has('groups')) ||
      (page === 'predict'     && params.has('predict')) ||
      (page === 'leaderboard' && params.has('leaderboard')) ||
      (page === 'blog'        && params.has('blog')) ||
      (page === 'comps'       && params.has('comps')) ||
      (page === 'review'      && params.has('review')) ||
      (page === 'about'       && params.has('about'));
    if (isActive) item.classList.add('active');
  });

  /* Scroll shadow on header */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 8
      ? '0 4px 30px rgba(0,0,0,0.4)'
      : '0 4px 20px rgba(0,0,0,0.3)';
  }, { passive: true });
})();

/* ============================================================
   PREDICTIONS — helper functions
   ============================================================ */

function isPastCutoff() {
  return new Date() > CUTOFF || window._competitionsLocked === true;
}

/* Load competition lock state from Supabase */
async function loadLockState() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/settings?key=eq.competitions_locked&select=value`,
      { headers: sbHeaders }
    ).then(r => r.json());
    window._competitionsLocked = res[0]?.value === 'true';
  } catch(e) { window._competitionsLocked = false; }
}

/* Hash a string with SHA-256 */
async function sha256(str) {
  /* crypto.subtle requires HTTPS — fallback to simple hash for HTTP */
  if (!crypto?.subtle) {
    /* Simple fallback hash */
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8,'0').repeat(8).slice(0,64);
  }
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

/* Generate token from username — same username always gives same token */
async function usernameToToken(username) {
  return (await sha256(username.toLowerCase().trim() + 'wc2026token')).slice(0, 32);
}

/* Register a new user */
async function registerUser(username, password, name = '') {
  const token         = await usernameToToken(username);
  const password_hash = await sha256(password + 'wc2026pw');

  /* Check username not taken */
  const existing = await fetch(
    `${SUPABASE_URL}/rest/v1/users?username=eq.${encodeURIComponent(username)}&select=id`,
    { headers: sbHeaders }
  ).then(r => r.json());
  if (existing.length > 0) throw new Error('Username already taken — please choose another.');

  const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
    method: 'POST',
    headers: { ...sbHeaders, 'Prefer': 'return=representation' },
    body: JSON.stringify({ username, password_hash, token, name: name || username })
  });
  const data = await res.json();
  if (!data[0]) throw new Error('Registration failed — please try again.');
  return data[0];
}

/* Login existing user */
async function loginUser(username, password) {
  const password_hash = await sha256(password + 'wc2026pw');
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/users?username=eq.${encodeURIComponent(username)}&password_hash=eq.${password_hash}&select=*`,
    { headers: sbHeaders }
  ).then(r => r.json());
  if (!res.length) throw new Error('Incorrect username or password.');
  return res[0];
}

/* Load existing predictions for a user */
async function loadUserPredictions(userId) {
  return fetch(
    `${SUPABASE_URL}/rest/v1/match_predictions?user_id=eq.${userId}&select=*`,
    { headers: sbHeaders }
  ).then(r => r.json());
}

/* Save predictions for a section (upsert) */
async function savePredictions(userId, predictions) {
  const rows = predictions.map(p => ({
    user_id:    userId,
    match_id:   p.matchId,
    home_score: parseInt(p.homeScore ?? 0),
    away_score: parseInt(p.awayScore ?? 0),
    et_winner:  p.etWinner || null,
    stage:      p.stage || 'group',
    updated_at: new Date().toISOString()
  })).filter(r => r.match_id && !isNaN(r.home_score) && !isNaN(r.away_score));

  if (!rows.length) return true;

  /* Try upsert first, fall back to delete+insert if it fails */
  const res = await fetch(`${SUPABASE_URL}/rest/v1/match_predictions`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify(rows)
  });

  if (res.ok || res.status === 204 || res.status === 201) return true;

  /* Fallback: delete existing rows then insert fresh */
  const matchIds = rows.map(r => r.match_id).join(',');
  await fetch(
    `${SUPABASE_URL}/rest/v1/match_predictions?user_id=eq.${userId}&match_id=in.(${matchIds})`,
    { method: 'DELETE', headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}` } }
  );

  const res2 = await fetch(`${SUPABASE_URL}/rest/v1/match_predictions`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(rows)
  });

  if (!res2.ok && res2.status !== 204 && res2.status !== 201) {
    const err = await res2.text().catch(() => res2.status);
    throw new Error('Save failed: ' + err);
  }
  return true;
}

/* Calculate predicted group standings from predictions */
function calcStandings(teams, predictions) {
  const standings = {};
  teams.forEach(t => {
    if (!standings[t.group]) standings[t.group] = {};
    standings[t.group][t.name] = { team: t, p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 };
  });

  predictions.forEach(p => {
    const grp = p.group_name ? p.group_name.replace('Group ','') : p.group;
    if (!grp || !standings[grp]) return;
    const normName = n => n === 'Bosnia & Herzegovina' ? 'Bosnia & Herz.' : n;
    const home = standings[grp][normName(p.home_team || p.homeTeam)];
    const away = standings[grp][normName(p.away_team || p.awayTeam)];
    if (!home || !away || p.home_score === null || p.away_score === null || p.home_score === undefined || p.away_score === undefined) return;
    const hs = parseInt(p.home_score ?? p.homeScore);
    const as_ = parseInt(p.away_score ?? p.awayScore);
    if (isNaN(hs) || isNaN(as_)) return;
    home.p++; away.p++;
    home.gf += hs; home.ga += as_;
    away.gf += as_; away.ga += hs;
    if (hs > as_)       { home.w++; home.pts+=3; away.l++; }
    else if (hs < as_)  { away.w++; away.pts+=3; home.l++; }
    else                { home.d++; home.pts++; away.d++; away.pts++; }
  });

  const sorted = {};
  Object.entries(standings).forEach(([g, teams]) => {
    sorted[g] = Object.values(teams).sort((a,b) =>
      b.pts-a.pts || (b.gf-b.ga)-(a.gf-a.ga) || b.gf-a.gf
    );
  });
  return sorted;
}

/* Get ranked list of all 3rd place teams from standings */
function getRanked3rd(standings) {
  const groups = 'ABCDEFGHIJKL'.split('');
  const thirds = [];
  groups.forEach(g => {
    if (standings[g] && standings[g].length >= 3) {
      const t = standings[g][2];
      thirds.push({ ...t, fromGroup: g });
    }
  });
  /* Sort by pts, GD, GF */
  return thirds.sort((a, b) =>
    b.pts - a.pts ||
    (b.gf - b.ga) - (a.gf - a.ga) ||
    b.gf - a.gf
  );
}

/* Work out which 3rd place teams auto-qualify and which are tied */
function get3rdPlaceQualifiers(standings, userPicks = []) {
  const ranked = getRanked3rd(standings);
  if (ranked.length < 8) {
    /* Not enough data yet — return placeholders */
    return { qualified: ranked, tied: [], needsPicks: false };
  }

  const top8 = ranked.slice(0, 8);
  const rank8 = ranked[7];
  const rank9 = ranked.length > 8 ? ranked[8] : null;

  /* Check if 8th and 9th are tied on all criteria */
  const isTied = rank9 &&
    rank8.pts === rank9.pts &&
    (rank8.gf - rank8.ga) === (rank9.gf - rank9.ga) &&
    rank8.gf === rank9.gf;

  if (!isTied) {
    return { qualified: top8, tied: [], needsPicks: false };
  }

  /* Find all teams tied with 8th place */
  const tiedTeams = ranked.filter(t =>
    t.pts === rank8.pts &&
    (t.gf - t.ga) === (rank8.gf - rank8.ga) &&
    t.gf === rank8.gf
  );

  /* How many spots remain for tied teams */
  const autoQualified = ranked.filter(t =>
    t.pts > rank8.pts ||
    ((t.pts === rank8.pts) && (t.gf - t.ga) > (rank8.gf - rank8.ga)) ||
    ((t.pts === rank8.pts) && (t.gf - t.ga) === (rank8.gf - rank8.ga) && t.gf > rank8.gf)
  );
  const spotsLeft = 8 - autoQualified.length;

  /* Apply user picks if provided */
  const picked = userPicks.filter(name =>
    tiedTeams.some(t => t.team.name === name)
  ).slice(0, spotsLeft);

  const qualified = [
    ...autoQualified,
    ...tiedTeams.filter(t => picked.includes(t.team.name))
  ];

  return {
    qualified,
    tied: tiedTeams,
    spotsLeft,
    needsPicks: picked.length < spotsLeft,
    autoQualified
  };
}

/* Generate Round of 32 fixtures from predicted standings */
function generateR32(standings, userPicks3rd = []) {
  const groups = 'ABCDEFGHIJKL'.split('');
  const winners = {}, runners = {};
  groups.forEach(g => {
    if (standings[g] && standings[g].length >= 2) {
      winners[g] = standings[g][0].team.name;
      runners[g] = standings[g][1].team.name;
    } else {
      winners[g] = `Winner Group ${g}`;
      runners[g] = `Runner-up Group ${g}`;
    }
  });

  /* Get 3rd place qualifiers */
  const { qualified, tied, needsPicks, spotsLeft, autoQualified } =
    get3rdPlaceQualifiers(standings, userPicks3rd);

  /* Map 3rd place teams to their R32 slots (1-8 in ranking order) */
  const third = (n) => {
    const t = qualified[n];
    if (t) return t.team.name;
    if (tied.length > 0 && needsPicks) return `TBD_3rd_${n}`;
    return `3rd Place #${n+1}`;
  };

  return {
    fixtures: [
      /* Official FIFA 2026 R32 pairings per Article 12.6 */
      { matchId:73, home: runners['A'],  away: runners['B'],  stage:'r32', date:'Sun 29 Jun' },
      { matchId:74, home: winners['E'],  away: third(0),      stage:'r32', date:'Sun 29 Jun' },  /* best 3rd ABCDF */
      { matchId:75, home: winners['F'],  away: runners['C'],  stage:'r32', date:'Mon 30 Jun' },
      { matchId:76, home: winners['C'],  away: runners['F'],  stage:'r32', date:'Mon 30 Jun' },
      { matchId:77, home: winners['I'],  away: third(1),      stage:'r32', date:'Tue 1 Jul'  },  /* best 3rd CDFGH */
      { matchId:78, home: runners['E'],  away: runners['I'],  stage:'r32', date:'Tue 1 Jul'  },
      { matchId:79, home: winners['A'],  away: third(2),      stage:'r32', date:'Wed 2 Jul'  },  /* best 3rd CEFHI */
      { matchId:80, home: winners['L'],  away: third(3),      stage:'r32', date:'Wed 2 Jul'  },  /* best 3rd EHIJK */
      { matchId:81, home: winners['D'],  away: third(4),      stage:'r32', date:'Thu 3 Jul'  },  /* best 3rd BEFIJ */
      { matchId:82, home: winners['G'],  away: third(5),      stage:'r32', date:'Thu 3 Jul'  },  /* best 3rd AEHIJ */
      { matchId:83, home: runners['K'],  away: runners['L'],  stage:'r32', date:'Fri 4 Jul'  },
      { matchId:84, home: winners['H'],  away: runners['J'],  stage:'r32', date:'Fri 4 Jul'  },
      { matchId:85, home: winners['B'],  away: third(6),      stage:'r32', date:'Sat 5 Jul'  },  /* best 3rd EFGIJ */
      { matchId:86, home: winners['J'],  away: runners['H'],  stage:'r32', date:'Sat 5 Jul'  },
      { matchId:87, home: winners['K'],  away: third(7),      stage:'r32', date:'Sun 6 Jul'  },  /* best 3rd DEIJL */
      { matchId:88, home: runners['D'],  away: runners['G'],  stage:'r32', date:'Sun 6 Jul'  },
    ],
    tiedTeams: tied,
    needsPicks,
    spotsLeft,
    autoQualified,
    qualified
  };
}

/* Generate R16 from R32 predictions */
function generateR16(r32Fixtures, r32Preds) {
  const predMap = {};
  r32Preds.forEach(p => { predMap[p.matchId || p.match_id] = p; });

  function winner(fix) {
    const p = predMap[fix.matchId];
    if (!p) return `⏳ M${fix.matchId} winner`;
    const hs = parseInt(p.homeScore ?? p.home_score);
    const as_ = parseInt(p.awayScore ?? p.away_score);
    if (isNaN(hs) || isNaN(as_)) return `⏳ M${fix.matchId} winner`;
    if (hs > as_) return fix.home;
    if (hs < as_) return fix.away;
    return p.etWinner || p.et_winner || `Winner Match ${fix.matchId}`;
  }

  /* Official FIFA R16 pairings per Article 12.7
     indices: 0=M73,1=M74,2=M75,3=M76,4=M77,5=M78,6=M79,7=M80,
              8=M81,9=M82,10=M83,11=M84,12=M85,13=M86,14=M87,15=M88 */
  return [
    { matchId:89,  home: winner(r32Fixtures[1]),  away: winner(r32Fixtures[4]),  stage:'r16', date:'Tue 7 Jul'  },  /* W74 v W77 */
    { matchId:90,  home: winner(r32Fixtures[0]),  away: winner(r32Fixtures[2]),  stage:'r16', date:'Tue 7 Jul'  },  /* W73 v W75 */
    { matchId:91,  home: winner(r32Fixtures[3]),  away: winner(r32Fixtures[5]),  stage:'r16', date:'Wed 8 Jul'  },  /* W76 v W78 */
    { matchId:92,  home: winner(r32Fixtures[6]),  away: winner(r32Fixtures[7]),  stage:'r16', date:'Wed 8 Jul'  },  /* W79 v W80 */
    { matchId:93,  home: winner(r32Fixtures[10]), away: winner(r32Fixtures[11]), stage:'r16', date:'Thu 9 Jul'  },  /* W83 v W84 */
    { matchId:94,  home: winner(r32Fixtures[8]),  away: winner(r32Fixtures[9]),  stage:'r16', date:'Thu 9 Jul'  },  /* W81 v W82 */
    { matchId:95,  home: winner(r32Fixtures[13]), away: winner(r32Fixtures[15]), stage:'r16', date:'Fri 10 Jul' },  /* W86 v W88 */
    { matchId:96,  home: winner(r32Fixtures[12]), away: winner(r32Fixtures[14]), stage:'r16', date:'Fri 10 Jul' },  /* W85 v W87 */
  ];
}

/* Generate QF from R16 predictions per Article 12.8
   M97: W89 v W90, M98: W93 v W94, M99: W91 v W92, M100: W95 v W96
   indices: 0=M89,1=M90,2=M91,3=M92,4=M93,5=M94,6=M95,7=M96 */
function generateQF(r16Fixtures, r16Preds) {
  const predMap = {};
  r16Preds.forEach(p => { predMap[p.matchId || p.match_id] = p; });
  function winner(fix) {
    const p = predMap[fix.matchId];
    if (!p) return `⏳ M${fix.matchId} winner`;
    const hs = parseInt(p.homeScore ?? p.home_score);
    const as_ = parseInt(p.awayScore ?? p.away_score);
    if (isNaN(hs) || isNaN(as_)) return `⏳ M${fix.matchId} winner`;
    if (hs > as_) return fix.home;
    if (hs < as_) return fix.away;
    return p.etWinner || p.et_winner || `Winner Match ${fix.matchId}`;
  }
  return [
    { matchId:97,  home: winner(r16Fixtures[0]), away: winner(r16Fixtures[1]), stage:'qf', date:'Mon 13 Jul' },  /* W89 v W90 */
    { matchId:98,  home: winner(r16Fixtures[4]), away: winner(r16Fixtures[5]), stage:'qf', date:'Mon 13 Jul' },  /* W93 v W94 */
    { matchId:99,  home: winner(r16Fixtures[2]), away: winner(r16Fixtures[3]), stage:'qf', date:'Tue 14 Jul' },  /* W91 v W92 */
    { matchId:100, home: winner(r16Fixtures[6]), away: winner(r16Fixtures[7]), stage:'qf', date:'Tue 14 Jul' },  /* W95 v W96 */
  ];
}

/* Generate SF from QF predictions per Article 12.9
   M101: W97 v W98, M102: W99 v W100 */
function generateSF(qfFixtures, qfPreds) {
  const predMap = {};
  qfPreds.forEach(p => { predMap[p.matchId || p.match_id] = p; });
  function winner(fix) {
    const p = predMap[fix.matchId];
    if (!p) return `⏳ M${fix.matchId} winner`;
    const hs = parseInt(p.homeScore ?? p.home_score);
    const as_ = parseInt(p.awayScore ?? p.away_score);
    if (isNaN(hs) || isNaN(as_)) return `⏳ M${fix.matchId} winner`;
    if (hs > as_) return fix.home;
    if (hs < as_) return fix.away;
    return p.etWinner || p.et_winner || `Winner Match ${fix.matchId}`;
  }
  return [
    { matchId:101, home: winner(qfFixtures[0]), away: winner(qfFixtures[1]), stage:'sf', date:'Fri 17 Jul' },  /* W97 v W98 */
    { matchId:102, home: winner(qfFixtures[2]), away: winner(qfFixtures[3]), stage:'sf', date:'Sat 18 Jul' },  /* W99 v W100 */
  ];
}

/* Generate Final from SF predictions */
function generateFinal(sfFixtures, sfPreds) {
  const predMap = {};
  sfPreds.forEach(p => { predMap[p.matchId || p.match_id] = p; });
  function winner(fix) {
    const p = predMap[fix.matchId];
    if (!p) return `⏳ M${fix.matchId} winner`;
    const hs = parseInt(p.homeScore ?? p.home_score);
    const as_ = parseInt(p.awayScore ?? p.away_score);
    if (isNaN(hs) || isNaN(as_)) return `⏳ M${fix.matchId} winner`;
    return hs >= as_ ? fix.home : fix.away;
  }
  return [
    { matchId:103, home: winner(sfFixtures[0]), away: winner(sfFixtures[1]), stage:'final', date:'Sun 19 Jul' },
  ];
}

/* Render a section of prediction matches — knockouts include ET winner picker */
function renderPredictionSection(fixtures, savedPreds, readOnly) {
  const predMap = {};
  savedPreds.forEach(p => { predMap[p.match_id || p.matchId] = p; });

  return fixtures.map(fix => {
    const saved    = predMap[fix.matchId] || predMap[fix.match_id];
    const hScore   = saved != null ? (saved.home_score ?? saved.homeScore ?? 0) : 0;
    const aScore   = saved != null ? (saved.away_score ?? saved.awayScore ?? 0) : 0;
    const etWinner = saved ? (saved.et_winner || saved.etWinner || '') : '';
    const hFlag    = flagCode(fix.home_team || fix.home);
    const aFlag    = flagCode(fix.away_team || fix.away);
    const homeTeam = fix.home_team || fix.home;
    const awayTeam = fix.away_team || fix.away;
    /* Show ET picker if draw or no score saved yet (0-0 default needs it) */
    const hs = parseInt(hScore);
    const as_ = parseInt(aScore);
    const isDraw = isNaN(hs) || isNaN(as_) || hs === as_;

    return `
      <div class="pred-match-card" id="pred-${fix.matchId}"
        data-home="${homeTeam.replace(/"/g,'&quot;')}"
        data-away="${awayTeam.replace(/"/g,'&quot;')}">
        <div class="pred-match-date">${fix.match_date || fix.date}</div>
        <div class="pred-match-teams">
          <div class="pred-team home">
            <img src="https://flagcdn.com/w40/${hFlag}.png" class="fixture-flag" alt="">
            <span class="pred-team-name">${homeTeam}</span>
          </div>
          <div class="pred-inputs">
            <input type="number" min="0" max="20" class="score-input pred-score"
              id="ph-${fix.matchId}" value="${hScore}"
              ${readOnly ? 'disabled' : ''}
              onchange="onKnockoutChange(${fix.matchId})" onblur="onKnockoutChange(${fix.matchId})">
            <span class="admin-vs">–</span>
            <input type="number" min="0" max="20" class="score-input pred-score"
              id="pa-${fix.matchId}" value="${aScore}"
              ${readOnly ? 'disabled' : ''}
              onchange="onKnockoutChange(${fix.matchId})" onblur="onKnockoutChange(${fix.matchId})">
          </div>
          <div class="pred-team away">
            <span class="pred-team-name">${awayTeam}</span>
            <img src="https://flagcdn.com/w40/${aFlag}.png" class="fixture-flag" alt="">
          </div>
        </div>
        <div class="et-winner-row" id="et-${fix.matchId}" style="${isDraw ? '' : 'display:none'}">
          <span class="et-label">After extra time, winner:</span>
          <select class="et-select" id="et-sel-${fix.matchId}" ${readOnly ? 'disabled' : ''}
            onchange="cascadeKnockouts()">
            <option value="">— pick winner —</option>
            <option value="${homeTeam}" ${etWinner === homeTeam ? 'selected' : ''}>${homeTeam}</option>
            <option value="${awayTeam}" ${etWinner === awayTeam ? 'selected' : ''}>${awayTeam}</option>
          </select>
        </div>
      </div>`;
  }).join('');
}

/* ============================================================
   PREDICTIONS PAGE
   ============================================================ */
async function renderPredict() {
  await loadLockState();
  /* ── Check session ── */
  const session = getSession();
  if (!session) {
    renderCompLogin('predict');
    return;
  }
  const user = session;
  const savedPreds = await loadUserPredictions(user.id);
  const teams = await loadTeams();
  const results = await sbGet('results');
  const locked = isPastCutoff();

  /* Group stage fixtures from results table */
  const groupFixtures = results.filter(r => parseInt(r.match_id) <= 72);

  /* Build prediction map */
  const predMap = {};
  savedPreds.forEach(p => { predMap[p.match_id] = p; });

  /* Calculate current predicted standings from saved group preds */
  const groupPreds = groupFixtures.map(fix => {
    const saved = predMap[fix.match_id];
    return {
      ...fix,
      home_score: saved?.home_score ?? null,
      away_score: saved?.away_score ?? null
    };
  });
  const standings = calcStandings(teams, groupPreds);

  /* Generate knockout fixtures */
  const r32Result = generateR32(standings, window._userPicks3rd || []);
  const r32Fixtures = r32Result.fixtures;
  const r32TiedTeams = r32Result.tiedTeams;
  const r32NeedsPicks = r32Result.needsPicks;
  const r32SpotsLeft = r32Result.spotsLeft;
  const r32Preds = savedPreds.filter(p => p.match_id >= 73 && p.match_id <= 88)
    .map(p => ({ ...p, matchId: p.match_id, homeScore: p.home_score, awayScore: p.away_score }));
  const r16Fixtures = generateR16(r32Fixtures, r32Preds);
  const r16Preds = savedPreds.filter(p => p.match_id >= 89 && p.match_id <= 96)
    .map(p => ({ ...p, matchId: p.match_id, homeScore: p.home_score, awayScore: p.away_score }));
  const qfFixtures = generateQF(r16Fixtures, r16Preds);
  const qfPreds = savedPreds.filter(p => p.match_id >= 97 && p.match_id <= 100)
    .map(p => ({ ...p, matchId: p.match_id, homeScore: p.home_score, awayScore: p.away_score }));
  const sfFixtures = generateSF(qfFixtures, qfPreds);
  const sfPreds = savedPreds.filter(p => p.match_id >= 101 && p.match_id <= 102)
    .map(p => ({ ...p, matchId: p.match_id, homeScore: p.home_score, awayScore: p.away_score }));
  const finalFixtures = generateFinal(sfFixtures, sfPreds);

  const cutoffDate = new Date(CUTOFF.getTime() + 60*60*1000); // +1hr for IST
    const cutoffStr = cutoffDate.toLocaleDateString('en-GB', { day:'numeric', month:'long' }) + ' at ' +
      cutoffDate.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' }) + ' (Irish time)';

  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">🎯 <span>${user.username}'s</span> Predictions</h1>
      </div>
    </div>
    <div class="${locked ? 'comp-status-bar locked' : 'comp-status-bar'}">
      <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:14px 0">
        <div style="display:flex;align-items:center;gap:10px">
          ${locked
            ? `<span style="font-size:1.1rem">🔒</span><strong style="font-size:0.95rem">Predictions are locked</strong>`
            : `<span style="font-size:1.1rem">⏰</span><strong style="font-size:0.95rem">Locks ${cutoffStr}</strong>`}
        </div>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          ${!locked ? `
          <button onclick="confirmResetPredictions('${user.id}')"
            class="comp-action-btn danger">
            🗑️ Reset My Predictions
          </button>` : ''}
          <button onclick="compLogout()" class="comp-action-btn">
            👋 Log Out
          </button>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="wrap">

        <!-- GROUP STAGE -->
        <div class="pred-section" id="section-group">
          <div class="pred-section-header">
            <h2 class="section-title">Group <span>Stage</span></h2>
            <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:20px">
              Predict all 72 group stage matches. Your predicted standings will automatically
              generate your knockout fixtures below.
            </p>
          </div>
          <div id="group-matches">
            ${renderGroupMatchesByGroup(groupFixtures, savedPreds, locked)}
          </div>
          ${!locked ? `
          <div style="text-align:center;margin-top:24px">
            <button class="hero-cta" onclick="saveSection('group')" id="save-group">
              Save Group Stage & See Knockouts →
            </button>
            <p id="save-group-msg" style="margin-top:10px;font-size:0.85rem;color:var(--teal);display:none">✅ Group stage saved!</p>
          </div>` : ''}
        </div>

        <!-- PREDICTED STANDINGS -->
        <div class="pred-section" id="section-standings" style="margin-top:40px">
          <h2 class="section-title">Your Predicted <span>Standings</span></h2>
          <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:20px">Updates as you fill in scores above.</p>
          <div id="pred-standings">${renderPredStandings(standings)}</div>
        </div>

        <!-- 3RD PLACE PICKER (only shown if there's a tie) -->
        ${r32NeedsPicks ? `
        <div class="pred-section" style="margin-top:40px" id="section-3rd">
          <h2 class="section-title">Pick <span>3rd Place Qualifiers</span></h2>
          <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:16px">
            ${r32SpotsLeft} spot${r32SpotsLeft > 1 ? 's' : ''} remain${r32SpotsLeft === 1 ? 's' : ''} — these teams are all level on points, goal difference and goals scored.
            Pick ${r32SpotsLeft} to qualify:
          </p>
          <div class="third-place-picker" id="third-place-picker">
            ${r32TiedTeams.map(t => `
              <label class="third-pick-option">
                <input type="checkbox" name="third-pick" value="${t.team.name}"
                  ${(window._userPicks3rd||[]).includes(t.team.name) ? 'checked' : ''}
                  onchange="onThirdPick(${r32SpotsLeft})">
                <img src="${t.team.flag}" width="28" height="19" style="border-radius:2px;border:1px solid var(--border)">
                <span>${t.team.name}</span>
                <span class="third-pick-stats">${t.pts}pts · GD${t.gf-t.ga > 0 ? '+' : ''}${t.gf-t.ga} · GF${t.gf}</span>
              </label>`).join('')}
          </div>
          <p id="third-pick-msg" style="color:#e63200;font-size:0.85rem;margin-top:8px;display:none">
            Please pick exactly ${r32SpotsLeft} team${r32SpotsLeft > 1 ? 's' : ''}.
          </p>
        </div>` : ''}

        <!-- ROUND OF 32 -->
        <div class="pred-section" style="margin-top:40px">
          <h2 class="section-title">Round of <span>32</span></h2>
          <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:20px">Based on your predicted group standings.</p>
          <div id="r32-matches">${renderPredictionSection(r32Fixtures, savedPreds, locked)}</div>
          ${!locked ? `
          <div style="text-align:center;margin-top:24px">
            <button class="hero-cta" onclick="saveSection('r32')" id="save-r32">Save Round of 32 →</button>
            <p id="save-r32-msg" style="margin-top:10px;font-size:0.85rem;color:var(--teal);display:none">✅ Round of 32 saved!</p>
          </div>` : ''}
        </div>

        <!-- ROUND OF 16 -->
        <div class="pred-section" style="margin-top:40px">
          <h2 class="section-title">Round of <span>16</span></h2>
          <div id="r16-matches">${renderPredictionSection(r16Fixtures, savedPreds, locked)}</div>
          ${!locked ? `
          <div style="text-align:center;margin-top:24px">
            <button class="hero-cta" onclick="saveSection('r16')" id="save-r16">Save Round of 16 →</button>
            <p id="save-r16-msg" style="margin-top:10px;font-size:0.85rem;color:var(--teal);display:none">✅ Round of 16 saved!</p>
          </div>` : ''}
        </div>

        <!-- QUARTER FINALS -->
        <div class="pred-section" style="margin-top:40px">
          <h2 class="section-title">Quarter <span>Finals</span></h2>
          <div id="qf-matches">${renderPredictionSection(qfFixtures, savedPreds, locked)}</div>
          ${!locked ? `
          <div style="text-align:center;margin-top:24px">
            <button class="hero-cta" onclick="saveSection('qf')" id="save-qf">Save Quarter Finals →</button>
            <p id="save-qf-msg" style="margin-top:10px;font-size:0.85rem;color:var(--teal);display:none">✅ Quarter finals saved!</p>
          </div>` : ''}
        </div>

        <!-- SEMI FINALS -->
        <div class="pred-section" style="margin-top:40px">
          <h2 class="section-title">Semi <span>Finals</span></h2>
          <div id="sf-matches">${renderPredictionSection(sfFixtures, savedPreds, locked)}</div>
          ${!locked ? `
          <div style="text-align:center;margin-top:24px">
            <button class="hero-cta" onclick="saveSection('sf')" id="save-sf">Save Semi Finals →</button>
            <p id="save-sf-msg" style="margin-top:10px;font-size:0.85rem;color:var(--teal);display:none">✅ Semi finals saved!</p>
          </div>` : ''}
        </div>

        <!-- FINAL -->
        <div class="pred-section" style="margin-top:40px;margin-bottom:40px">
          <h2 class="section-title">The <span>Final</span></h2>
          <div id="final-matches">${renderPredictionSection(finalFixtures, savedPreds, locked)}</div>
          <div style="text-align:center;margin:24px 0 8px">
            <a href="./?wallchart=1"
              style="display:inline-flex;align-items:center;justify-content:center;padding:10px 24px;border:2px solid var(--purple-mid);border-radius:999px;font-weight:700;font-size:0.875rem;color:var(--purple-dark);text-decoration:none;background:var(--white)">
              🖨️ Download My Predictions Wall Chart
            </a>
          </div>
          ${!locked ? `
          <div style="text-align:center;margin-top:8px">
            <button class="hero-cta" onclick="saveSection('final')" id="save-final"
              style="background:var(--gold);color:var(--navy);box-shadow:0 4px 20px rgba(245,194,0,0.4)">
              🏆 Save Final Prediction
            </button>
            <p id="save-final-msg" style="margin-top:10px;font-size:0.85rem;color:var(--teal);display:none">✅ All predictions saved! Good luck!</p>
          </div>` : ''}
        </div>

      </div>
    </div>`;

  /* Store user and fixtures in window for save/cascade functions */
  window._predUser      = user;
  window._predTeams     = teams;
  window._results       = results;
  window._savedPreds    = savedPreds;
  window._r32Fixtures   = r32Fixtures;
  window._r16Fixtures   = r16Fixtures;
  window._qfFixtures    = qfFixtures;
  window._sfFixtures    = sfFixtures;
  window._finalFixtures = finalFixtures;
}

function renderGroupMatchesByGroup(fixtures, savedPreds, locked) {
  const predMap = {};
  savedPreds.forEach(p => { predMap[p.match_id] = p; });

  const groups = {};
  fixtures.forEach(fix => {
    const g = fix.group_name.replace('Group ', '');
    if (!groups[g]) groups[g] = [];
    groups[g].push(fix);
  });

  return Object.entries(groups).sort(([a],[b]) => a.localeCompare(b)).map(([g, matches]) => `
    <div style="margin-bottom:28px">
      <div class="fixture-group-title">Group ${g}</div>
      ${matches.map(fix => {
        const saved = predMap[fix.match_id];
        const hScore = saved ? (saved.home_score ?? 0) : 0;
        const aScore = saved ? (saved.away_score ?? 0) : 0;
        return `
          <div class="pred-match-card" id="pred-${fix.match_id}">
            <div class="pred-match-date">${fix.match_date}</div>
            <div class="pred-match-teams">
              <div class="pred-team home">
                <img src="https://flagcdn.com/w40/${flagCode(fix.home_team)}.png" class="fixture-flag" alt="">
                <span class="pred-team-name">${fix.home_team}</span>
              </div>
              <div class="pred-inputs">
                <input type="number" min="0" max="20" class="score-input pred-score"
                  id="ph-${fix.match_id}" value="${hScore}"
                  ${locked ? 'disabled' : ''}
                  oninput="onGroupPredChange()">
                <span class="admin-vs">–</span>
                <input type="number" min="0" max="20" class="score-input pred-score"
                  id="pa-${fix.match_id}" value="${aScore}"
                  ${locked ? 'disabled' : ''}
                  oninput="onGroupPredChange()">
              </div>
              <div class="pred-team away">
                <span class="pred-team-name">${fix.away_team}</span>
                <img src="https://flagcdn.com/w40/${flagCode(fix.away_team)}.png" class="fixture-flag" alt="">
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`).join('');
}

function renderPredStandings(standings) {
  return `<div class="groups-grid">
    ${Object.entries(standings).sort(([a],[b]) => a.localeCompare(b)).map(([letter, teams]) => `
      <div class="group-card">
        <div class="group-card-header">
          <div class="group-letter">${letter}</div>
        </div>
        <table class="group-table">
          <thead><tr><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead>
          <tbody>
            ${teams.map(s => `
              <tr>
                <td><div class="team-cell">
                  <img src="${s.team.flag}" alt="" loading="lazy">
                  ${s.team.name}
                </div></td>
                <td>${s.p}</td><td>${s.w}</td><td>${s.d}</td><td>${s.l}</td>
                <td>${s.gf-s.ga > 0 ? '+' : ''}${s.gf-s.ga}</td>
                <td class="pts-cell">${s.pts}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`).join('')}
  </div>`;
}

/* Handle 3rd place team picks */
function onThirdPick(spotsLeft) {
  const checked = Array.from(document.querySelectorAll('input[name="third-pick"]:checked'))
    .map(cb => cb.value);
  const msg = $('third-pick-msg');

  /* Prevent checking more than spotsLeft */
  if (checked.length > spotsLeft) {
    event.target.checked = false;
    return;
  }

  window._userPicks3rd = checked;

  if (msg) msg.style.display = checked.length === spotsLeft ? 'none' : 'block';

  /* Regenerate R32 with new picks */
  if (window._predTeams && window._results) {
    const groupFixtures = window._results.filter(r => parseInt(r.match_id) <= 72);
    const groupPreds = groupFixtures.map(fix => ({
      ...fix,
      home_score: $(`ph-${fix.match_id}`)?.value ?? '',
      away_score: $(`pa-${fix.match_id}`)?.value ?? ''
    }));
    const standings = calcStandings(window._predTeams, groupPreds);
    const r32Result = generateR32(standings, window._userPicks3rd);
    const r32El = $('r32-matches');
    if (r32El) r32El.innerHTML = renderPredictionSection(r32Result.fixtures, [], false);
  }
}

/* Called when group scores change — update standings and regenerate knockouts */
function onGroupPredChange() {
  if (!window._predTeams || !window._results) return;
  const groupFixtures = window._results.filter(r => parseInt(r.match_id) <= 72);
  const groupPreds = groupFixtures.map(fix => ({
    ...fix,
    home_score: $(`ph-${fix.match_id}`)?.value ?? '',
    away_score: $(`pa-${fix.match_id}`)?.value ?? ''
  }));
  const standings = calcStandings(window._predTeams, groupPreds);
  const standingsEl = $('pred-standings');
  if (standingsEl) standingsEl.innerHTML = renderPredStandings(standings);

  /* Regenerate R32 */
  const r32Result = generateR32(standings, window._userPicks3rd || []);
  const r32Fixtures = r32Result.fixtures;
  const r32El = $('r32-matches');
  if (r32El) {
    const r32Preds = r32Fixtures.map(fix => ({
      matchId: fix.matchId,
      home_score: $(`ph-${fix.matchId}`)?.value ?? 0,
      away_score: $(`pa-${fix.matchId}`)?.value ?? 0
    }));
    r32El.innerHTML = renderPredictionSection(r32Fixtures, [], false);
  }
}

/* onPredChange — update downstream knockout fixtures */
function onPredChange() {
  /* Will be expanded to cascade through rounds */
}

/* Full cascade — regenerate all knockout rounds from current page inputs */
function cascadeKnockouts() {
  if (!window._predTeams || !window._results || !window._r32Fixtures) return;

  /* Capture ALL current DOM scores into a unified pred map */
  const domPreds = [];
  document.querySelectorAll('.pred-match-card[id^="pred-"]').forEach(card => {
    const matchId = parseInt(card.id.replace('pred-', ''));
    if (isNaN(matchId)) return;
    const hInput = document.getElementById(`ph-${matchId}`);
    const aInput = document.getElementById(`pa-${matchId}`);
    const etSel  = document.getElementById(`et-sel-${matchId}`);
    if (hInput) {
      domPreds.push({
        match_id: matchId, matchId,
        home_score: parseInt(hInput.value ?? 0),
        away_score: parseInt(aInput?.value ?? 0),
        homeScore:  parseInt(hInput.value ?? 0),
        awayScore:  parseInt(aInput?.value ?? 0),
        et_winner:  etSel?.value || null,
        etWinner:   etSel?.value || null,
      });
    }
  });

  /* Merge DOM preds with saved preds (DOM takes priority) */
  const savedMap = {};
  (window._savedPreds || []).forEach(p => { savedMap[p.match_id] = p; });
  domPreds.forEach(p => { savedMap[p.matchId] = p; });
  const allPreds = Object.values(savedMap);

  const getPred = (matchId) => {
    const p = savedMap[matchId];
    if (p) return { ...p, matchId, match_id: matchId,
      homeScore: p.home_score ?? p.homeScore ?? 0,
      awayScore: p.away_score ?? p.awayScore ?? 0,
      etWinner: p.et_winner ?? p.etWinner ?? null };
    return { matchId, match_id: matchId, homeScore:0, awayScore:0, home_score:0, away_score:0 };
  };

  const r32Preds    = window._r32Fixtures.map(f => getPred(f.matchId));
  const r16Fixtures = generateR16(window._r32Fixtures, r32Preds);
  window._r16Fixtures = r16Fixtures;

  const r16Preds    = r16Fixtures.map(f => getPred(f.matchId));
  const qfFixtures  = generateQF(r16Fixtures, r16Preds);
  window._qfFixtures = qfFixtures;

  const qfPreds     = qfFixtures.map(f => getPred(f.matchId));
  const sfFixtures  = generateSF(qfFixtures, qfPreds);
  window._sfFixtures = sfFixtures;

  const sfPreds         = sfFixtures.map(f => getPred(f.matchId));
  const finalFixtures   = generateFinal(sfFixtures, sfPreds);
  window._finalFixtures = finalFixtures;

  const locked = isPastCutoff();
  const r16El  = $('r16-matches');
  const qfEl   = $('qf-matches');
  const sfEl   = $('sf-matches');
  const finEl  = $('final-matches');

  if (r16El)  r16El.innerHTML  = renderPredictionSection(r16Fixtures,   allPreds, locked);
  if (qfEl)   qfEl.innerHTML   = renderPredictionSection(qfFixtures,    allPreds, locked);
  if (sfEl)   sfEl.innerHTML   = renderPredictionSection(sfFixtures,    allPreds, locked);
  if (finEl)  finEl.innerHTML  = renderPredictionSection(finalFixtures, allPreds, locked);
}

/* onPredChange — cascade knockout fixtures when any knockout score changes */
function onPredChange() {
  cascadeKnockouts();
}

/* Show/hide ET winner picker when knockout score changes */
function onKnockoutChange(matchId) {
  const hInput = $(`ph-${matchId}`);
  const aInput = $(`pa-${matchId}`);
  const etRow  = $(`et-${matchId}`);
  const etSel  = $(`et-sel-${matchId}`);
  const card   = document.getElementById(`pred-${matchId}`);
  if (!etRow || !card) return;

  const hVal = parseInt(hInput?.value ?? '');
  const aVal = parseInt(aInput?.value ?? '');

  const homeTeam = card.dataset.home || '';
  const awayTeam = card.dataset.away || '';

  /* Update team names in ET picker */
  if (etSel.options[1]) { etSel.options[1].value = homeTeam; etSel.options[1].text = homeTeam; }
  if (etSel.options[2]) { etSel.options[2].value = awayTeam; etSel.options[2].text = awayTeam; }

  /* Show ET picker only when score is a draw */
  if (!isNaN(hVal) && !isNaN(aVal) && hVal !== aVal) {
    etRow.style.display = 'none';
    etSel.value = '';
  } else {
    etRow.style.display = 'flex';
  }
  cascadeKnockouts();
}

/* Save a section */
async function saveSection(stage) {
  const user = window._predUser;
  if (!user) return;

  const btn = $(`save-${stage}`);
  const msg = $(`save-${stage}-msg`);
  btn.textContent = 'Saving…';
  btn.disabled = true;

  let fixtures = [];
  if (stage === 'group') {
    fixtures = (window._results || []).filter(r => parseInt(r.match_id) <= 72)
      .map(fix => ({
        matchId: fix.match_id,
        homeScore: parseInt($(`ph-${fix.match_id}`)?.value ?? 0),
        awayScore: parseInt($(`pa-${fix.match_id}`)?.value ?? 0),
        stage: 'group'
      }));
  } else {
    /* Knockout stages — find inputs on page */
    const sectionId = `${stage}-matches`;
    document.querySelectorAll(`#${sectionId} .pred-match-card`).forEach(card => {
      const id = card.id.replace('pred-', '');
      const hInput  = $(`ph-${id}`);
      const aInput  = $(`pa-${id}`);
      const etInput = $(`et-sel-${id}`);
      if (hInput && aInput) {
        fixtures.push({
          matchId:   parseInt(id),
          homeScore: parseInt(hInput.value ?? 0),
          awayScore: parseInt(aInput.value ?? 0),
          etWinner:  etInput?.value || null,
          stage
        });
      }
    });
  }

  try {
    await savePredictions(user.id, fixtures);
    btn.textContent = stage === 'final' ? '🏆 Save Final Prediction' : `Save ${stage.toUpperCase()} →`;
    btn.disabled = false;
    if (msg) { msg.style.display = 'block'; setTimeout(() => msg.style.display = 'none', 3000); }
    btn.disabled = false;
    if (msg) { msg.style.display = 'block'; setTimeout(() => msg.style.display = 'none', 3000); }

    /* After saving group stage — regenerate R32 then cascade */
    if (stage === 'group' && window._predTeams && window._results) {
      const groupFixtures = window._results.filter(r => parseInt(r.match_id) <= 72);
      const groupPreds = groupFixtures.map(fix => ({
        ...fix,
        home_score: $(`ph-${fix.match_id}`)?.value ?? 0,
        away_score: $(`pa-${fix.match_id}`)?.value ?? 0
      }));
      const standings = calcStandings(window._predTeams, groupPreds);
      const r32Result = generateR32(standings, window._userPicks3rd || []);
      window._r32Fixtures = r32Result.fixtures;
      const r32El = $('r32-matches');
      if (r32El) r32El.innerHTML = renderPredictionSection(r32Result.fixtures, [], isPastCutoff());
      const standingsEl = $('pred-standings');
      if (standingsEl) standingsEl.innerHTML = renderPredStandings(standings);
    }

    /* Update saved preds cache then cascade */
    const fresh = await fetch(
      `${SUPABASE_URL}/rest/v1/match_predictions?user_id=eq.${user.id}&select=*`,
      { headers: sbHeaders }
    ).then(r => r.json()).catch(() => window._savedPreds || []);
    window._savedPreds = fresh;
    cascadeKnockouts();

  } catch(e) {
    btn.textContent = 'Error — try again';
    btn.disabled = false;
  }
}

/* Handle registration form */
async function handleRegister() {
  const username = $('reg-username')?.value.trim().toLowerCase().replace(/\s+/g,'');
  const password = $('reg-password')?.value;
  const err      = $('reg-error');

  if (!username || username.length < 3) {
    err.textContent = 'Username must be at least 3 characters, no spaces.';
    err.style.display = 'block'; return;
  }
  if (!password || password.length < 4) {
    err.textContent = 'Password must be at least 4 characters.';
    err.style.display = 'block'; return;
  }

  const btn = $('reg-username').closest('.info-card').querySelector('button');
  btn.textContent = 'Registering…'; btn.disabled = true; err.style.display = 'none';

  try {
    const user = await registerUser(username, password);
    showPredLink(user);
  } catch(e) {
    btn.textContent = 'Register →'; btn.disabled = false;
    err.textContent = e.message; err.style.display = 'block';
  }
}

/* Handle login form */
async function handleLogin() {
  const username = $('login-username')?.value.trim().toLowerCase();
  const password = $('login-password')?.value;
  const err      = $('login-error');

  if (!username || !password) {
    err.textContent = 'Please enter your username and password.';
    err.style.display = 'block'; return;
  }

  const btn = $('login-username').closest('.info-card').querySelector('button');
  btn.textContent = 'Logging in…'; btn.disabled = true; err.style.display = 'none';

  try {
    const user = await loginUser(username, password);
    showPredLink(user);
  } catch(e) {
    btn.textContent = 'Login →'; btn.disabled = false;
    err.textContent = e.message; err.style.display = 'block';
  }
}

/* Show the unique prediction link */
function showPredLink(user) {
  const link = `${location.origin}${location.pathname}?predict=1&token=${user.token}`;
  app().innerHTML = `
    <div class="section">
      <div class="wrap">
        <div class="info-card" style="max-width:520px;margin:0 auto;text-align:center">
          <div style="font-size:2.5rem;margin-bottom:12px">🎉</div>
          <h3 style="margin-bottom:12px">Welcome, ${user.username}!</h3>
          <p style="color:var(--text-muted);margin-bottom:20px;font-size:0.9rem">
            Bookmark this link — it takes you straight to your predictions every time.
          </p>
          <div style="background:var(--off-white);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 16px;word-break:break-all;font-size:0.8rem;color:var(--text-mid);margin-bottom:20px">
            ${link}
          </div>
          <a class="hero-cta" href="${link}" style="display:inline-flex;width:100%;justify-content:center">
            Go to My Predictions →
          </a>
        </div>
      </div>
    </div>`;
}

/* ============================================================
   LEADERBOARD PAGE
   ============================================================ */
async function renderLeaderboard() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">🏆 <span>Leaderboard</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap">
        <div id="leaderboard-content">
          <p style="color:var(--text-muted)">Loading…</p>
        </div>
      </div>
    </div>`;

  try {
    const data = await fetch(
      `${SUPABASE_URL}/rest/v1/leaderboard?select=*&order=total_pts.desc`,
      { headers: sbHeaders }
    ).then(r => r.json());

    if (!data.length) {
      $('leaderboard-content').innerHTML = '<p style="color:var(--text-muted)">No predictions submitted yet.</p>';
      return;
    }

    $('leaderboard-content').innerHTML = `
      <div class="lb-scroll-wrap"><table class="group-table pred-lb-table" style="background:var(--white);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);min-width:280px">
        <thead>
          <tr>
            <th style="text-align:left;padding-left:16px">Pos</th>
            <th style="text-align:left">Player</th>
            <th>Match Pts</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((row, i) => `
            <tr>
              <td style="padding-left:16px;font-weight:700;color:${i===0?'var(--gold)':i===1?'#aaa':i===2?'#cd7f32':'var(--text-muted)'}">${i+1}</td>
              <td style="font-weight:600;text-align:left">${row.username || row.name || '—'}</td>
              <td>${row.match_pts}</td>
              <td class="pts-cell">${row.total_pts}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  } catch(e) {
    $('leaderboard-content').innerHTML = '<p style="color:var(--text-muted)">Could not load leaderboard.</p>';
  }
}

/* ============================================================
   UNIVERSAL COMP LOGIN PAGE — tabbed Login / Register
   ============================================================ */
function renderCompLogin(redirectPage = 'comps') {
  const pageLabels = {
    predict: 'Score Predictions', buster: 'Busters Comp', comps: 'Competition Hub'
  };
  const scoring = redirectPage === 'predict' ? `
    <div class="info-card" style="max-width:560px;margin:20px auto 0">
      <h3 style="margin-bottom:14px">🎯 How Score Predictions Works</h3>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div class="fact-row"><span class="fact-label">Exact draw score</span><span class="fact-value" style="color:var(--gold)">10 pts</span></div>
        <div class="fact-row"><span class="fact-label">Exact win/loss score</span><span class="fact-value" style="color:var(--teal)">5 pts</span></div>
        <div class="fact-row"><span class="fact-label">Correct draw (wrong score)</span><span class="fact-value" style="color:var(--teal)">4 pts</span></div>
        <div class="fact-row"><span class="fact-label">Correct win/loss outcome</span><span class="fact-value" style="color:var(--teal)">2 pts</span></div>
        <div class="fact-row"><span class="fact-label">Correct group winner / qualifier</span><span class="fact-value" style="color:var(--teal)">4/2 pts</span></div>
        <div class="fact-row"><span class="fact-label">Round of 16</span><span class="fact-value" style="color:var(--teal)">5 pts</span></div>
        <div class="fact-row"><span class="fact-label">Quarter Final</span><span class="fact-value" style="color:var(--teal)">7 pts</span></div>
        <div class="fact-row"><span class="fact-label">Semi Final</span><span class="fact-value" style="color:var(--teal)">10 pts</span></div>
        <div class="fact-row"><span class="fact-label">Final</span><span class="fact-value" style="color:var(--teal)">15 pts</span></div>
        <div class="fact-row"><span class="fact-label">Tournament Winner</span><span class="fact-value" style="color:var(--gold)">20 pts</span></div>
      </div>
    </div>` : redirectPage === 'buster' ? `
    <div class="info-card" style="max-width:560px;margin:20px auto 0">
      <h3 style="margin-bottom:14px">🎲 How the Busters Comp Works</h3>
      <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:14px">Pick one team from each of 6 pots. Score points based on how far each team goes.</p>
      <div style="display:flex;flex-direction:column;gap:6px">
        <div class="fact-row"><span class="fact-label">Group Winner / 2nd / 3rd</span><span class="fact-value" style="color:var(--teal)">4/2/1 pts</span></div>
        <div class="fact-row"><span class="fact-label">R16 · QF · SF · Final · Winner</span><span class="fact-value" style="color:var(--teal)">5·8·12·17·25</span></div>
      </div>
    </div>` : '';

  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">🎯 <span>${pageLabels[redirectPage] || 'Competition'}</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap">
        <div class="info-card comp-login-card">
          <div class="comp-login-tabs">
            <button class="comp-tab active" id="tab-login" onclick="switchCompTab('login')">Login</button>
            <button class="comp-tab" id="tab-register" onclick="switchCompTab('register')">Register</button>
          </div>

          <!-- Login Panel -->
          <div id="panel-login">
            <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:20px">
              Welcome back — enter your details to access your picks.
            </p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
              <div>
                <label class="form-label">Username</label>
                <input class="form-input" id="comp-username" placeholder="yourname" autocomplete="off"
                  onkeydown="if(event.key==='Enter') compLogin('${redirectPage}')">
              </div>
              <div>
                <label class="form-label">Password</label>
                <input class="form-input" id="comp-password" type="password" placeholder="••••"
                  onkeydown="if(event.key==='Enter') compLogin('${redirectPage}')">
              </div>
            </div>
            <button class="hero-cta" onclick="compLogin('${redirectPage}')" style="width:100%;justify-content:center">Login →</button>
            <p style="color:var(--text-muted);font-size:0.78rem;margin-top:12px;text-align:center">
              Forgotten your password? Contact the admin to reset it.
            </p>
          </div>

          <!-- Register Panel -->
          <div id="panel-register" style="display:none">
            <p style="color:var(--teal);font-size:0.875rem;font-weight:700;margin-bottom:4px">✅ No email address required</p>
            <p style="color:var(--text-muted);font-size:0.82rem;margin-bottom:18px">
              Just pick a username and password to get started.
            </p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
              <div>
                <label class="form-label">Your Name</label>
                <input class="form-input" id="comp-name" placeholder="e.g. John Barry" autocomplete="off">
              </div>
              <div>
                <label class="form-label">Username</label>
                <input class="form-input" id="comp-reg-username" placeholder="e.g. johnb" autocomplete="off">
              </div>
            </div>
            <div style="margin-bottom:14px">
              <label class="form-label">Password</label>
              <input class="form-input" id="comp-reg-password" type="password" placeholder="At least 4 characters"
                onkeydown="if(event.key==='Enter') compRegister('${redirectPage}')">
            </div>
            <button class="hero-cta" onclick="compRegister('${redirectPage}')" style="width:100%;justify-content:center">
              Create Account →
            </button>
          </div>

          <p id="comp-login-error" style="display:none;color:#e63200;font-size:0.85rem;margin-top:10px;text-align:center"></p>
        </div>
        ${scoring}
      </div>
    </div>`;
}

function switchCompTab(tab) {
  const err = document.getElementById('comp-login-error');
  if (err) err.style.display = 'none';
  const isLogin = tab === 'login';
  document.getElementById('panel-login').style.display    = isLogin ? '' : 'none';
  document.getElementById('panel-register').style.display = isLogin ? 'none' : '';
  document.getElementById('tab-login').classList.toggle('active', isLogin);
  document.getElementById('tab-register').classList.toggle('active', !isLogin);
}
async function compLogin(redirectPage) {
  const username = $('comp-username')?.value.trim();
  const password = $('comp-password')?.value.trim();
  const err = $('comp-login-error');
  if (!username || !password) { err.textContent = 'Please enter username and password.'; err.style.display='block'; return; }
  try {
    const user = await loginUser(username, password);
    setSession(user);
    const dest = redirectPage === 'predict' ? '?predict=1' :
                 redirectPage === 'buster'  ? '?buster=1'  : '?comps=1';
    location.href = dest;
  } catch(e) {
    err.textContent = e.message || 'Incorrect username or password.';
    err.style.display = 'block';
  }
}

async function compRegister(redirectPage) {
  const name     = $('comp-name')?.value.trim();
  const username = $('comp-reg-username')?.value.trim();
  const password = $('comp-reg-password')?.value.trim();
  const err      = $('comp-login-error');
  if (!name) { err.textContent = 'Please enter your name.'; err.style.display='block'; return; }
  if (!username || username.length < 3) { err.textContent = 'Username must be at least 3 characters, no spaces.'; err.style.display='block'; return; }
  if (/\s/.test(username)) { err.textContent = 'Username cannot contain spaces.'; err.style.display='block'; return; }
  if (!password || password.length < 4) { err.textContent = 'Password must be at least 4 characters.'; err.style.display='block'; return; }
  try {
    const user = await registerUser(username, password, name);
    setSession(user);
    const dest = redirectPage === 'predict' ? '?predict=1' :
                 redirectPage === 'buster'  ? '?buster=1'  : '?comps=1';
    location.href = dest;
  } catch(e) {
    err.textContent = e.message || 'Username already taken — try another.';
    err.style.display = 'block';
  }
}

/* ============================================================
   COMPS HUB PAGE
   ============================================================ */
async function renderComps() {
  const session = getSession();
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">🎯 <span>Competition Hub</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap">
        ${getSession() ? `
          <div class="comp-session-bar">
            <span>👋 Logged in as <strong>${getSession().username}</strong></span>
            <button class="comp-action-btn" onclick="compLogout()">👋 Log Out</button>
          </div>` : `
          <div class="info-card comp-login-card" style="max-width:560px;margin:0 auto 24px">
            <div class="comp-login-tabs">
              <button class="comp-tab active" id="tab-login" onclick="switchCompTab('login')">Login</button>
              <button class="comp-tab" id="tab-register" onclick="switchCompTab('register')">Register</button>
            </div>
            <div id="panel-login">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
                <div><label class="form-label">Username</label>
                  <input class="form-input" id="comp-username" placeholder="yourname"
                    onkeydown="if(event.key==='Enter') compLogin('comps')"></div>
                <div><label class="form-label">Password</label>
                  <input class="form-input" id="comp-password" type="password" placeholder="••••"
                    onkeydown="if(event.key==='Enter') compLogin('comps')"></div>
              </div>
              <button class="hero-cta" onclick="compLogin('comps')" style="width:100%;justify-content:center">Login →</button>
            </div>
            <div id="panel-register" style="display:none">
              <p style="color:var(--teal);font-size:0.82rem;font-weight:700;margin-bottom:12px">✅ No email address required</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
                <div><label class="form-label">Your Name</label>
                  <input class="form-input" id="comp-name" placeholder="e.g. John Barry"></div>
                <div><label class="form-label">Username</label>
                  <input class="form-input" id="comp-reg-username" placeholder="one word, no spaces"></div>
              </div>
              <div style="margin-bottom:14px"><label class="form-label">Password</label>
                <input class="form-input" id="comp-reg-password" type="password" placeholder="At least 4 characters"
                  onkeydown="if(event.key==='Enter') compRegister('comps')"></div>
              <button class="hero-cta" onclick="compRegister('comps')" style="width:100%;justify-content:center">Create Account →</button>
            </div>
            <p id="comp-login-error" style="display:none;color:#e63200;font-size:0.85rem;margin-top:10px;text-align:center"></p>
          </div>`}
        <!-- Competition Cards -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-top:28px">

          <!-- Score Predictions Card -->
          <div class="info-card" style="padding:28px">
            <div style="font-size:2rem;margin-bottom:10px">🎯</div>
            <h3 style="margin-bottom:6px">Score Predictions</h3>
            <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:20px">
              Predict every match score from group stage all the way to the final
            </p>
            <div class="comp-card-btns">
              <a class="hero-cta comp-btn-primary" href="./?predict=1">
                ${session ? 'My Predictions →' : 'Enter →'}
              </a>
              <a class="comp-btn-secondary" href="./?leaderboard=predictions">🏅 Leaderboard</a>
              <a class="comp-btn-secondary" href="./?scoring=predictions">📋 How to Score</a>
            </div>
          </div>

          <!-- Buster Card -->
          <div class="info-card" style="padding:28px">
            <div style="font-size:2rem;margin-bottom:10px">🎲</div>
            <h3 style="margin-bottom:6px">Buster Competition</h3>
            <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:20px">
              Pick one team from each of 6 pots and score as they progress through the tournament
            </p>
            <div class="comp-card-btns">
              <a class="hero-cta comp-btn-primary" href="./?buster=1"
                style="background:var(--gold);color:var(--navy);box-shadow:none">
                ${session ? 'My Buster →' : 'Enter →'}
              </a>
              <a class="comp-btn-secondary" href="./?leaderboard=buster">🏅 Leaderboard</a>
              <a class="comp-btn-secondary" href="./?scoring=buster">📋 How to Score</a>
            </div>
          </div>

        </div>
      </div>
    </div>`;
}

/* ============================================================
   SCORING RULES PAGES
   ============================================================ */
function renderScoring(which) {
  const isPred = which === 'predictions';
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <a class="back-link" href="./?comps=1" style="padding:0;font-size:0.9rem">← Competition Hub</a>
        <h1 class="page-title">${isPred ? '🎯 Score <span>Predictions</span>' : '🎲 Buster <span>Competition</span>'} — Scoring</h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap" style="max-width:600px">
        ${isPred ? `
        <div class="info-card" style="margin-bottom:20px">
          <h3 style="margin-bottom:14px">Match Predictions</h3>
          <div style="display:flex;flex-direction:column;gap:0">
            <div class="fact-row"><span class="fact-label">🎯 Exact score — draw (e.g. 1-1 = 1-1)</span><span class="fact-value" style="color:var(--gold)">10 pts</span></div>
            <div class="fact-row"><span class="fact-label">⚽ Exact score — win or loss</span><span class="fact-value" style="color:var(--teal)">5 pts</span></div>
            <div class="fact-row"><span class="fact-label">🤝 Correct draw outcome (wrong score)</span><span class="fact-value" style="color:var(--teal)">4 pts</span></div>
            <div class="fact-row"><span class="fact-label">✅ Correct win/loss outcome (wrong score)</span><span class="fact-value" style="color:var(--teal)">2 pts</span></div>
            <div class="fact-row"><span class="fact-label">❌ Wrong outcome</span><span class="fact-value" style="color:var(--text-muted)">0 pts</span></div>
          </div>
          <div style="background:#f0f0fa;border-radius:var(--radius-sm);padding:10px 12px;margin-top:12px;font-size:0.82rem;color:var(--text-mid)">
            In knockout rounds — 2pts if the team you predicted to win actually progresses, regardless of who they played or how they qualified.
          </div>
        </div>
        <div class="info-card" style="margin-bottom:20px">
          <h3 style="margin-bottom:14px">Group Stage Bonuses</h3>
          <div style="display:flex;flex-direction:column;gap:0">
            <div class="fact-row"><span class="fact-label">🥇 Correct group winner</span><span class="fact-value" style="color:var(--teal)">4 pts</span></div>
            <div class="fact-row"><span class="fact-label">✔️ Correct qualifier (any position — 1st, 2nd or best 3rd)</span><span class="fact-value" style="color:var(--teal)">2 pts</span></div>
          </div>
        </div>
        <div class="info-card">
          <h3 style="margin-bottom:14px">Knockout Progression Bonuses</h3>
          <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:12px">
            Points awarded if a team you predicted reaches that stage — regardless of the route they took to get there.
          </p>
          <div style="display:flex;flex-direction:column;gap:0">
            <div class="fact-row"><span class="fact-label">Round of 16</span><span class="fact-value" style="color:var(--teal)">5 pts</span></div>
            <div class="fact-row"><span class="fact-label">Quarter Final</span><span class="fact-value" style="color:var(--teal)">7 pts</span></div>
            <div class="fact-row"><span class="fact-label">Semi Final</span><span class="fact-value" style="color:var(--teal)">10 pts</span></div>
            <div class="fact-row"><span class="fact-label">Final</span><span class="fact-value" style="color:var(--teal)">15 pts</span></div>
            <div class="fact-row"><span class="fact-label">🏆 Tournament Winner</span><span class="fact-value" style="color:var(--gold)">20 pts</span></div>
          </div>
          <div style="background:#f0f0fa;border-radius:var(--radius-sm);padding:12px;margin-top:14px;font-size:0.82rem;color:var(--text-mid)">
            <strong>Example:</strong> You predicted Spain to win the World Cup. They qualify as runners-up but go all the way — you still get: 5+7+10+15+20 = <strong style="color:var(--teal)">57 pts</strong>
          </div>
        </div>` : `
        <div class="info-card" style="margin-bottom:20px">
          <h3 style="margin-bottom:8px">How the Buster Works</h3>
          <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:16px">
            Pick one team from each of 6 pots before the tournament starts.
            Your Buster Score is the sum of points earned by all 6 teams.
          </p>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px">
            ${BUSTER_POTS.map(p => `
              <div style="background:#f0f0fa;border-radius:var(--radius-sm);padding:8px 10px;font-size:0.78rem">
                <div style="font-weight:700;color:var(--purple-dark)">Pot ${p.pot} — ${p.label}</div>
                <div style="color:var(--text-muted);margin-top:2px">${p.teams.slice(0,3).join(', ')}…</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="info-card" style="margin-bottom:20px">
          <h3 style="margin-bottom:14px">Points per Team</h3>
          <p style="color:var(--text-muted);font-size:0.82rem;margin-bottom:12px">Only the highest stage reached is scored</p>
          <div style="display:flex;flex-direction:column;gap:0">
            <div class="fact-row"><span class="fact-label">🥇 Group Winner</span><span class="fact-value" style="color:var(--teal)">4 pts</span></div>
            <div class="fact-row"><span class="fact-label">2️⃣ Group Runner-up</span><span class="fact-value" style="color:var(--teal)">2 pts</span></div>
            <div class="fact-row"><span class="fact-label">✔️ Qualifies as Best 3rd Place</span><span class="fact-value" style="color:var(--teal)">1 pt</span></div>
            <div class="fact-row"><span class="fact-label">Round of 16</span><span class="fact-value" style="color:var(--teal)">5 pts</span></div>
            <div class="fact-row"><span class="fact-label">Quarter Final</span><span class="fact-value" style="color:var(--teal)">8 pts</span></div>
            <div class="fact-row"><span class="fact-label">Semi Final</span><span class="fact-value" style="color:var(--teal)">12 pts</span></div>
            <div class="fact-row"><span class="fact-label">Finalist</span><span class="fact-value" style="color:var(--teal)">17 pts</span></div>
            <div class="fact-row"><span class="fact-label">🏆 World Cup Winner</span><span class="fact-value" style="color:var(--gold)">25 pts</span></div>
          </div>
        </div>
        <div class="info-card">
          <h3 style="margin-bottom:10px">Tie Break</h3>
          <ol style="padding-left:18px;color:var(--text-mid);font-size:0.875rem;line-height:1.8">
            <li>Highest scoring individual Buster team wins</li>
            <li>If still tied — player with the World Cup winner selected wins</li>
            <li>If still tied — players share the position</li>
          </ol>
          <div style="background:#f0f0fa;border-radius:var(--radius-sm);padding:12px;margin-top:14px;font-size:0.82rem;color:var(--text-mid)">
            <strong>Example total:</strong> SF (12) + QF (8) + R16 (5) + Best 3rd (1) = <strong style="color:var(--teal)">26 pts</strong>
          </div>
        </div>`}
      </div>
    </div>`;
}

/* ============================================================
   ABOUT PAGE
   ============================================================ */
async function renderAbout() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">About <span>This Site</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap" style="max-width:680px">

        <div class="info-card" style="margin-bottom:20px">
          <h3 style="margin-bottom:12px">Why Rowan's World Cup Zone?</h3>
          <p style="color:var(--text-mid);line-height:1.8;font-size:0.95rem">
            I wanted one place to find all the info for the World Cup, run a fun competition
            for friends and family, and share some interesting facts about the countries involved.
            That's it — hope you enjoy it! ⚽
          </p>
        </div>

        <div class="info-card" style="margin-bottom:20px">
          <h3 style="margin-bottom:14px">🛠️ Built With</h3>
          <div style="display:flex;flex-direction:column;gap:10px">
            <div class="fact-row"><span class="fact-label">Frontend</span><span class="fact-value" style="color:var(--text-mid)">HTML, CSS, JavaScript</span></div>
            <div class="fact-row"><span class="fact-label">Hosting</span><span class="fact-value" style="color:var(--text-mid)">GitHub</span></div>
            <div class="fact-row"><span class="fact-label">Database</span><span class="fact-value" style="color:var(--text-mid)">PostgreSQL</span></div>
            <div class="fact-row"><span class="fact-label">Analytics</span><span class="fact-value" style="color:var(--text-mid)">GoatCounter</span></div>
            <div class="fact-row"><span class="fact-label">Maps</span><span class="fact-value" style="color:var(--text-mid)">Leaflet.js</span></div>
          </div>
        </div>

        <div class="info-card">
          <h3 style="margin-bottom:14px">💬 Feedback</h3>
          <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:20px">
            Found a bug? Have an idea? Just want to say something? Let me know!
          </p>
          <div class="form-group">
            <label class="form-label">Your Name</label>
            <input class="form-input" id="fb-name" placeholder="e.g. John Barry">
          </div>
          <div class="form-group">
            <label class="form-label">Type</label>
            <select class="form-select" id="fb-type">
              <option value="feedback">💬 General Feedback</option>
              <option value="bug">🐛 Bug Report</option>
              <option value="idea">💡 Idea / Suggestion</option>
              <option value="other">📝 Other</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Message</label>
            <textarea class="form-textarea" id="fb-message" rows="4" placeholder="Tell us what's on your mind…"></textarea>
          </div>
          <button class="hero-cta" onclick="submitFeedback()" style="width:100%;justify-content:center">
            Send Feedback →
          </button>
          <p id="fb-success" style="display:none;color:var(--teal);font-weight:600;margin-top:12px;text-align:center">
            ✅ Thanks for your feedback!
          </p>
          <p id="fb-error" style="display:none;color:#e63200;font-size:0.85rem;margin-top:10px;text-align:center"></p>
        </div>
      </div>
    </div>`;
}

async function submitFeedback() {
  const name    = $('fb-name')?.value.trim();
  const type    = $('fb-type')?.value;
  const message = $('fb-message')?.value.trim();
  const err     = $('fb-error');

  if (!name)    { err.textContent = 'Please enter your name.';    err.style.display='block'; return; }
  if (!message) { err.textContent = 'Please enter a message.';    err.style.display='block'; return; }

  /* Save to Supabase blog_posts table as a feedback entry */
  const ok = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
    method: 'POST',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      title: `[FEEDBACK] ${type} from ${name}`,
      content: message,
      post_type: 'general',
      published: false  /* not shown publicly */
    })
  }).then(r => r.ok).catch(() => false);

  if (ok) {
    $('fb-name').value = '';
    $('fb-message').value = '';
    err.style.display = 'none';
    $('fb-success').style.display = 'block';
  } else {
    err.textContent = 'Could not send feedback. Please try again.';
    err.style.display = 'block';
  }
}

/* ============================================================
   LEADERBOARD HUB
   ============================================================ */
async function renderLeaderboard() {
  const params = new URLSearchParams(location.search);
  const which = params.get('leaderboard');

  if (which === 'predictions') { await renderLeaderboardPredictions(); return; }
  if (which === 'buster')      { await renderLeaderboardBuster();      return; }

  /* Hub */
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">🏅 <span>Leaderboards</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px">
          <a href="./?leaderboard=predictions" style="text-decoration:none">
            <div class="card" style="padding:28px;text-align:center;cursor:pointer">
              <div style="font-size:2.5rem;margin-bottom:12px">🎯</div>
              <div class="quick-card-title">Score Predictions</div>
              <p class="quick-card-desc">Full leaderboard for the score predictions competition</p>
            </div>
          </a>
          <a href="./?leaderboard=buster" style="text-decoration:none">
            <div class="card" style="padding:28px;text-align:center;cursor:pointer">
              <div style="font-size:2.5rem;margin-bottom:12px">🎲</div>
              <div class="quick-card-title">Buster Competition</div>
              <p class="quick-card-desc">Full leaderboard for the Buster team picks competition</p>
            </div>
          </a>
        </div>
      </div>
    </div>`;
}

async function renderLeaderboardPredictions() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <a class="back-link" href="./?leaderboard=1" style="padding:0;font-size:0.9rem">← Leaderboards</a>
        <h1 class="page-title">🎯 <span>Score Predictions</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap" id="pred-lb"><p style="color:var(--text-muted)">Loading…</p></div>
    </div>`;

  try {
    const data = await fetch(
      `${SUPABASE_URL}/rest/v1/leaderboard?select=*&order=total_pts.desc`,
      { headers: sbHeaders }
    ).then(r => r.json());

    if (!data.length) { $('pred-lb').innerHTML = '<p style="color:var(--text-muted)">No entries yet.</p>'; return; }

    $('pred-lb').innerHTML = `
      <div class="lb-scroll-wrap"><table class="group-table pred-lb-table" style="background:var(--white);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);min-width:280px">
        <thead><tr>
          <th style="text-align:center;width:48px">Pos</th>
          <th style="text-align:left;padding-left:12px">Player</th>
          <th>Match Pts</th><th>Total</th>
        </tr></thead>
        <tbody>
          ${data.map((row,i) => `
            <tr>
              <td style="text-align:center;font-weight:700;color:${i===0?'var(--gold)':i===1?'#aaa':i===2?'#cd7f32':'var(--text-muted)'}" class="lb-pos">
                ${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
              </td>
              <td style="font-weight:600;text-align:left;padding-left:12px">${row.username||'—'}</td>
              <td>${row.match_pts}</td>
              <td class="pts-cell">${row.total_pts}</td>
            </tr>`).join('')}
        </tbody>
      </table></div>`;
  } catch(e) { $('pred-lb').innerHTML = '<p style="color:var(--text-muted)">Could not load.</p>'; }
}

async function renderLeaderboardBuster() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <a class="back-link" href="./?leaderboard=1" style="padding:0;font-size:0.9rem">← Leaderboards</a>
        <h1 class="page-title">🎲 <span>Busters Comp</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap" id="buster-lb"><p style="color:var(--text-muted)">Loading…</p></div>
    </div>`;

  try {
    const data = await fetch(
      `${SUPABASE_URL}/rest/v1/buster_leaderboard?select=*`,
      { headers: sbHeaders }
    ).then(r => r.json());

    if (!data.length) { $('buster-lb').innerHTML = '<p style="color:var(--text-muted)">No entries yet.</p>'; return; }

    const rows = data.map(r => ({
      ...r,
      total: (r.pot1_pts||0)+(r.pot2_pts||0)+(r.pot3_pts||0)+(r.pot4_pts||0)+(r.pot5_pts||0)+(r.pot6_pts||0),
      best: Math.max(r.pot1_pts||0,r.pot2_pts||0,r.pot3_pts||0,r.pot4_pts||0,r.pot5_pts||0,r.pot6_pts||0)
    })).sort((a,b) => b.total-a.total || b.best-a.best);

    const teams = await loadTeams();
    const flagMap = {};
    teams.forEach(t => { flagMap[t.name] = t.flag; });

    const potLabel = (n) => ['Elite','Contenders','Challengers','Dark Horses','Underdogs','Minnows'][n-1] || `Pot ${n}`;

    $('buster-lb').innerHTML = `
      <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:16px">
        👆 Tap any player to see their full team selections
      </p>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${rows.map((row, i) => {
          const pots = [1,2,3,4,5,6].map(n => ({
            label: potLabel(n),
            team: row[`pot${n}_team`] || '—',
            pts: row[`pot${n}_pts`] || 0,
            flag: flagMap[row[`pot${n}_team`]] || ''
          }));

          return `
            <div class="buster-lb-row" onclick="this.querySelector('.buster-lb-detail').style.display=this.querySelector('.buster-lb-detail').style.display==='none'?'block':'none'">
              <div class="buster-lb-summary">
                <span class="lb-pos" style="color:${i===0?'var(--gold)':i===1?'#aaa':i===2?'#cd7f32':'var(--text-muted)'}">
                  ${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
                </span>
                <span style="font-weight:700;flex:1">${row.username}</span>
                <span class="pts-cell">${row.total} pts</span>
                <span style="color:var(--text-muted);font-size:0.8rem;margin-left:8px">▼</span>
              </div>
              <div class="buster-lb-detail" style="display:none">
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;padding:12px 0 4px">
                  ${pots.map(p => `
                    <div style="background:#f8f8fd;border:1px solid var(--border);border-radius:var(--radius-sm);padding:8px 10px">
                      <div style="font-size:0.65rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">${p.label}</div>
                      <div style="display:flex;align-items:center;gap:5px">
                        ${p.flag ? `<img src="${p.flag}" width="20" height="14" style="border-radius:2px;border:1px solid var(--border)">` : ''}
                        <span style="font-weight:700;font-size:0.82rem;color:var(--text-dark)">${p.team}</span>
                      </div>
                      <div style="font-size:0.72rem;color:var(--teal);font-weight:600;margin-top:3px">${p.pts} pts</div>
                    </div>`).join('')}
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  } catch(e) { $('buster-lb').innerHTML = '<p style="color:var(--text-muted)">Could not load.</p>'; }
}

async function renderLeaderboardPredictions() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <a class="back-link" href="./?leaderboard=1" style="padding:0;font-size:0.9rem">← Leaderboards</a>
        <h1 class="page-title">🎯 <span>Score Predictions</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap" id="pred-lb"><p style="color:var(--text-muted)">Loading…</p></div>
    </div>`;

  try {
    const data = await fetch(
      `${SUPABASE_URL}/rest/v1/leaderboard?select=*&order=total_pts.desc`,
      { headers: sbHeaders }
    ).then(r => r.json());

    if (!data.length) { $('pred-lb').innerHTML = '<p style="color:var(--text-muted)">No entries yet.</p>'; return; }

    $('pred-lb').innerHTML = `
      <div class="lb-scroll-wrap"><table class="group-table pred-lb-table" style="background:var(--white);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);min-width:280px">
        <thead><tr>
          <th style="text-align:center;width:48px">Pos</th>
          <th style="text-align:left;padding-left:12px">Player</th>
          <th>Match Pts</th><th>Total</th>
        </tr></thead>
        <tbody>
          ${data.map((row,i) => `
            <tr>
              <td style="text-align:center;font-weight:700;color:${i===0?'var(--gold)':i===1?'#aaa':i===2?'#cd7f32':'var(--text-muted)'}" class="lb-pos">
                ${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
              </td>
              <td style="font-weight:600;text-align:left;padding-left:12px">${row.username||'—'}</td>
              <td>${row.match_pts}</td>
              <td class="pts-cell">${row.total_pts}</td>
            </tr>`).join('')}
        </tbody>
      </table></div>`;
  } catch(e) { $('pred-lb').innerHTML = '<p style="color:var(--text-muted)">Could not load.</p>'; }
}


async function renderReview() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">Rowan's <span>Tournament Review</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap" id="review-content">
        <p style="color:var(--text-muted)">Loading…</p>
      </div>
    </div>`;

  try {
    const data = await fetch(
      `${SUPABASE_URL}/rest/v1/tournament_review?id=eq.1&select=*`,
      { headers: sbHeaders }
    ).then(r => r.json());

    const r = data[0] || {};

    const fields = [
      { key:'winner_pick',       label:'My Winner Pick',     icon:'🏆', desc:'Who I think will lift the trophy',         notesKey:'winner_notes'  },
      { key:'fav_team',          label:'Favourite Team',     icon:'❤️', desc:'The team I\'m supporting',                 notesKey:'fav_notes'     },
      { key:'player_to_watch',   label:'Player to Watch',    icon:'⭐', desc:'The standout player of the tournament',    notesKey:'player_notes'  },
      { key:'team_to_watch',     label:'Team to Watch',      icon:'👀', desc:'The most exciting team to follow',         notesKey:'team_notes'    },
      { key:'dark_horse',        label:'Dark Horse',         icon:'🐴', desc:'Could go further than anyone expects',     notesKey:'horse_notes'   },
      { key:'early_exit',        label:'Shock Early Exit',   icon:'😬', desc:'The big name who won\'t make it far',      notesKey:'exit_notes'    },
      { key:'golden_boot',       label:'Golden Boot Pick',   icon:'👟', desc:'Top scorer of the tournament',            notesKey:'boot_notes'    },
    ];

    const hasContent = fields.some(f => r[f.key]);

    $('review-content').innerHTML = `
      ${!hasContent ? `
        <div class="info-card" style="text-align:center;padding:40px">
          <div style="font-size:3rem;margin-bottom:12px">⚽</div>
          <h3>Rowan's review coming soon!</h3>
          <p style="color:var(--text-muted);margin-top:8px">Check back once the tournament gets underway.</p>
        </div>` : `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-bottom:28px">
          ${fields.filter(f => r[f.key]).map(f => `
            <div class="review-card">
              <div style="font-size:1.8rem;margin-bottom:8px">${f.icon}</div>
              <span class="review-card-label">${f.label}</span>
              <div class="review-card-value">${r[f.key]}</div>
              ${r[f.notesKey] ? `<div style="font-size:0.875rem;color:var(--text-mid);margin-top:10px;padding-top:10px;border-top:1px solid var(--border);line-height:1.6;white-space:pre-wrap">${r[f.notesKey]}</div>` : ''}
            </div>`).join('')}
        </div>
        ${r.overall_thoughts ? `
        <div class="review-card">
          <div style="font-size:1.8rem;margin-bottom:8px">📝</div>
          <span class="review-card-label">Overall Thoughts</span>
          <div class="review-card-text">${r.overall_thoughts}</div>
        </div>` : ''}
        ${r.rowan_comments ? `
        <div class="review-card" style="margin-top:8px">
          <div style="font-size:1.8rem;margin-bottom:8px">💬</div>
          <span class="review-card-label">Rowan's Comments</span>
          <div class="review-card-text">${r.rowan_comments}</div>
        </div>` : ''}
      `}`;
  } catch(e) {
    $('review-content').innerHTML = '<p style="color:var(--text-muted)">Could not load review.</p>';
  }
}

/* ============================================================
   BLOG PAGE — Rowan's rolling thoughts
   ============================================================ */
async function renderBlog() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">Rowan's <span>Blog</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap" id="blog-content">
        <p style="color:var(--text-muted)">Loading…</p>
      </div>
    </div>`;

  try {
    const posts = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?published=eq.true&order=created_at.desc&select=*`,
      { headers: sbHeaders }
    ).then(r => r.json());

    if (!posts.length) {
      $('blog-content').innerHTML = `
        <div class="info-card" style="text-align:center;padding:40px">
          <div style="font-size:3rem;margin-bottom:12px">✍️</div>
          <h3>Blog coming soon!</h3>
          <p style="color:var(--text-muted);margin-top:8px">Rowan's thoughts on the tournament will appear here.</p>
        </div>`;
      return;
    }

    $('blog-content').innerHTML = posts.map(post => {
      const typeLabels = {
        thought: 'Thought', preview: 'Match Preview',
        review: 'Match Review', general: 'General'
      };
      const date = new Date(post.created_at).toLocaleDateString('en-GB',
        { day:'numeric', month:'long', year:'numeric' });
      return `
        <div class="blog-post">
          <div class="blog-post-header">
            <div class="blog-post-meta">
              <span class="blog-post-type type-${post.post_type}">${typeLabels[post.post_type] || post.post_type}</span>
              <span class="blog-post-date">${date}</span>
            </div>
            <div class="blog-post-title">${post.title}</div>
          </div>
          <div class="blog-post-body">${post.content}</div>
        </div>`;
    }).join('');
  } catch(e) {
    $('blog-content').innerHTML = '<p style="color:var(--text-muted)">Could not load blog.</p>';
  }
}

/* ============================================================
   WALL CHART PAGE — newspaper style with groups left/right, bracket centre
   ============================================================ */
async function renderWallChart(predPicks = null, username = '') {
  app().innerHTML = `
    <div class="page-title-bar no-print">
      <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <h1 class="page-title">🗒️ <span>Wall Chart</span>${username ? ' — ' + username : ''}</h1>
        <button class="hero-cta no-print" onclick="window.print()" style="padding:10px 24px">🖨️ Print</button>
        <a href="images/wallchart-official.png" download="WorldCup2026-WallChart.png"
          class="comp-btn-secondary no-print" style="display:inline-flex;padding:10px 20px;width:auto">
          ⬇️ Download Official Chart
        </a>
      </div>
    </div>
    <div id="wc-content" style="padding:8px"><p style="color:var(--text-muted)">Building…</p></div>`;

  const [teams, results] = await Promise.all([loadTeams(), sbGet('results')]);
  const predMap = {};
  if (predPicks) predPicks.forEach(p => { predMap[p.match_id || p.matchId] = p; });

  const sc = (matchId, isHome) => {
    if (predPicks) {
      const p = predMap[matchId];
      if (!p) return '';
      const val = isHome ? (p.home_score ?? p.homeScore) : (p.away_score ?? p.awayScore);
      return val !== null && val !== undefined ? val : '';
    }
    const r = results.find(r => r.match_id == matchId);
    return r?.status === 'Played' ? (isHome ? r.home_score : r.away_score) : '';
  };

  const f = name => `<img src="https://flagcdn.com/w20/${flagCode(name)}.png" width="14" height="10" style="border-radius:1px;vertical-align:middle;margin-right:2px">`;

  const groupMatches = {};
  results.filter(r => r.match_id <= 72).forEach(r => {
    const g = r.group_name; if (!groupMatches[g]) groupMatches[g] = []; groupMatches[g].push(r);
  });

  const ko = id => results.find(r => r.match_id === id) || { match_id:id, home_team:'TBD', away_team:'TBD', match_date:'' };

  const groupBlock = (g, matches) => `
    <div style="margin-bottom:5px;border:1px solid #ccd;border-radius:4px;overflow:hidden;font-size:0.62rem">
      <div style="background:#0f0e2a;color:#f5c200;font-weight:800;padding:2px 5px;font-size:0.65rem;letter-spacing:0.06em">
        GROUP ${g.replace('Group ','')}
      </div>
      ${matches.map(m => `
        <div style="display:flex;align-items:center;padding:2px 4px;border-bottom:1px solid #eef;gap:2px">
          <span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f(m.home_team)}${m.home_team}</span>
          <span style="display:flex;gap:1px;flex-shrink:0">
            <input style="width:16px;height:16px;border:1px solid #bbc;border-radius:2px;text-align:center;font-size:0.6rem;font-weight:700;background:#f8f8ff;padding:0" value="${sc(m.match_id,true)}" readonly>
            <span style="color:#999;font-size:0.55rem;line-height:16px">-</span>
            <input style="width:16px;height:16px;border:1px solid #bbc;border-radius:2px;text-align:center;font-size:0.6rem;font-weight:700;background:#f8f8ff;padding:0" value="${sc(m.match_id,false)}" readonly>
          </span>
          <span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:right">${m.away_team}${f(m.away_team)}</span>
        </div>`).join('')}
    </div>`;

  const bracketMatch = (id, label) => {
    const r = ko(id);
    return `
      <div style="margin-bottom:3px">
        <div style="font-size:0.5rem;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">${label}</div>
        <div style="display:flex;align-items:center;gap:2px;padding:1px 0">
          <div style="flex:1;border-bottom:1px solid #0f0e2a;padding-bottom:1px;font-size:0.58rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f(r.home_team)}${r.home_team}</div>
          <input style="width:14px;height:14px;border:1px solid #bbc;border-radius:2px;text-align:center;font-size:0.55rem;background:#f8f8ff;flex-shrink:0;padding:0" value="${sc(id,true)}" readonly>
        </div>
        <div style="display:flex;align-items:center;gap:2px;padding:1px 0">
          <div style="flex:1;border-bottom:1px solid #0f0e2a;padding-bottom:1px;font-size:0.58rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f(r.away_team)}${r.away_team}</div>
          <input style="width:14px;height:14px;border:1px solid #bbc;border-radius:2px;text-align:center;font-size:0.55rem;background:#f8f8ff;flex-shrink:0;padding:0" value="${sc(id,false)}" readonly>
        </div>
      </div>`;
  };

  const groups = Object.entries(groupMatches).sort(([a],[b])=>a.localeCompare(b));
  const leftGroups  = groups.slice(0,6);   // A-F
  const rightGroups = groups.slice(6,12);  // G-L

  document.getElementById('wc-content').innerHTML = `
    <div style="max-width:1300px;margin:0 auto;background:white">
      <!-- Header -->
      <div style="text-align:center;padding:6px 0;background:#0f0e2a;color:#f5c200;font-family:'Bebas Neue',sans-serif;font-size:1.6rem;letter-spacing:0.08em;margin-bottom:8px;border-radius:6px">
        ⚽ ROWAN'S WORLD CUP ZONE — 2026 WALL CHART${username ? ' · ' + username.toUpperCase() : ''}
      </div>

      <div style="display:grid;grid-template-columns:0.7fr 2.6fr 0.7fr;gap:8px;align-items:stretch">

        <!-- LEFT: Groups A-F -->
        <div>
          <div style="background:#f5c200;color:#0f0e2a;font-weight:800;font-size:0.7rem;text-align:center;padding:3px;letter-spacing:0.06em;margin-bottom:4px;border-radius:3px">GROUP STAGE</div>
          ${leftGroups.map(([g,ms]) => groupBlock(g,ms)).join('')}
        </div>

        <!-- CENTRE: Bracket -->
        <div>
          <div style="background:#f5c200;color:#0f0e2a;font-weight:800;font-size:0.7rem;text-align:center;padding:3px;letter-spacing:0.06em;margin-bottom:4px;border-radius:3px">KNOCKOUT STAGES</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1.4fr 1fr 1fr;gap:8px;align-items:start">

            <!-- R32 left -->
            <div>
              <div style="font-size:0.55rem;font-weight:800;color:#0f0e2a;text-transform:uppercase;text-align:center;margin-bottom:3px;letter-spacing:0.05em">Rd of 32</div>
              ${[73,74,75,76,77,78,79,80].map(id=>bracketMatch(id,`M${id}`)).join('')}
            </div>

            <!-- R16 left -->
            <div>
              <div style="font-size:0.55rem;font-weight:800;color:#0f0e2a;text-transform:uppercase;text-align:center;margin-bottom:3px;letter-spacing:0.05em">Rd of 16</div>
              ${[89,90,91,92].map(id=>bracketMatch(id,`M${id}`)).join('')}
            </div>

            <!-- QF + SF + Final centre -->
            <div>
              <div style="font-size:0.55rem;font-weight:800;color:#0f0e2a;text-transform:uppercase;text-align:center;margin-bottom:3px;letter-spacing:0.05em">QF · SF · Final</div>
              ${[97,98].map(id=>bracketMatch(id,`QF M${id}`)).join('')}
              ${[101].map(id=>bracketMatch(id,`SF M${id}`)).join('')}
              <div style="background:#f5c200;border-radius:3px;padding:3px;margin:4px 0 2px">
                <div style="font-size:0.55rem;font-weight:800;color:#0f0e2a;text-align:center;letter-spacing:0.05em">🏆 FINAL · Sun 19 Jul</div>
              </div>
              ${bracketMatch(103,'M103')}
              ${[102].map(id=>bracketMatch(id,`SF M${id}`)).join('')}
              ${[99,100].map(id=>bracketMatch(id,`QF M${id}`)).join('')}
            </div>

            <!-- R16 right -->
            <div>
              <div style="font-size:0.55rem;font-weight:800;color:#0f0e2a;text-transform:uppercase;text-align:center;margin-bottom:3px;letter-spacing:0.05em">Rd of 16</div>
              ${[93,94,95,96].map(id=>bracketMatch(id,`M${id}`)).join('')}
            </div>

            <!-- R32 right -->
            <div>
              <div style="font-size:0.55rem;font-weight:800;color:#0f0e2a;text-transform:uppercase;text-align:center;margin-bottom:3px;letter-spacing:0.05em">Rd of 32</div>
              ${[81,82,83,84,85,86,87,88].map(id=>bracketMatch(id,`M${id}`)).join('')}
            </div>
          </div>
        </div>

        <!-- RIGHT: Groups G-L -->
        <div>
          <div style="background:#f5c200;color:#0f0e2a;font-weight:800;font-size:0.7rem;text-align:center;padding:3px;letter-spacing:0.06em;margin-bottom:4px;border-radius:3px">GROUP STAGE</div>
          ${rightGroups.map(([g,ms]) => groupBlock(g,ms)).join('')}
        </div>

      </div>
    </div>`;
}

/* ============================================================
   ADMIN — Blog management added to loadAdminPanel
   ============================================================ */
async function renderAdminBlog() {
  const posts = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?order=created_at.desc&select=*`,
    { headers: sbHeaders }
  ).then(r => r.json()).catch(() => []);

  const results = await sbGet('results').catch(() => []);

  return `
    <h2 class="section-title" style="margin:40px 0 20px">Rowan's <span>Blog</span></h2>

    <div class="admin-blog-form">
      <h3>Add New Post</h3>
      <div class="form-group">
        <label class="form-label">Title</label>
        <input class="form-input" id="blog-title" placeholder="e.g. England vs Croatia Preview">
      </div>
      <div class="form-group">
        <label class="form-label">Post Type</label>
        <select class="form-select" id="blog-type">
          <option value="thought">Tournament Thought</option>
          <option value="preview">Match Preview</option>
          <option value="review">Match Review</option>
          <option value="general">General</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Content</label>
        <textarea class="form-textarea" id="blog-content" rows="6" placeholder="Write your post here…"></textarea>
      </div>
      <button class="admin-save-btn" onclick="adminSaveBlogPost()" style="margin-top:8px">Publish Post</button>
      <span id="blog-save-msg" style="display:none;color:var(--teal);font-weight:600;margin-left:12px">✅ Published!</span>
    </div>

    <h2 class="section-title" style="margin:32px 0 16px">Existing <span>Posts</span></h2>
    ${!posts.length ? '<p style="color:var(--text-muted)">No posts yet.</p>' :
      posts.map(p => `
        <div class="admin-match-card" style="margin-bottom:10px">
          <div style="font-weight:700;color:var(--purple-dark);margin-bottom:4px">${p.title}</div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px">
            ${p.post_type} · ${new Date(p.created_at).toLocaleDateString('en-GB')}
          </div>
          <div style="font-size:0.875rem;color:var(--text-mid);margin-bottom:10px;white-space:pre-wrap">${p.content.slice(0,150)}${p.content.length>150?'…':''}</div>
          <button class="admin-save-btn" style="background:#e63200" onclick="adminDeletePost('${p.id}')">Delete</button>
        </div>`).join('')}

    <h2 class="section-title" style="margin:40px 0 20px">Tournament <span>Review</span></h2>
    <div class="admin-blog-form" id="review-form">
      <h3>Rowan's Tournament Review</h3>
      ${await renderReviewAdminForm()}
    </div>`;
}

async function renderReviewAdminForm() {
  const data = await fetch(
    `${SUPABASE_URL}/rest/v1/tournament_review?id=eq.1&select=*`,
    { headers: sbHeaders }
  ).then(r => r.json()).catch(() => [{}]);
  const r = data[0] || {};

  const fields = [
    { key:'winner_pick',     label:'Winner Pick',       notesKey:'winner_notes'  },
    { key:'fav_team',        label:'Favourite Team',    notesKey:'fav_notes'     },
    { key:'player_to_watch', label:'Player to Watch',   notesKey:'player_notes'  },
    { key:'team_to_watch',   label:'Team to Watch',     notesKey:'team_notes'    },
    { key:'dark_horse',      label:'Dark Horse',        notesKey:'horse_notes'   },
    { key:'early_exit',      label:'Shock Early Exit',  notesKey:'exit_notes'    },
    { key:'golden_boot',     label:'Golden Boot Pick',  notesKey:'boot_notes'    },
  ];

  return `
    ${fields.map(f => `
      <div class="form-group" style="background:#f8f8fd;border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;margin-bottom:12px">
        <label class="form-label" style="font-size:0.9rem;color:var(--purple-dark)">${f.label}</label>
        <input class="form-input" id="rev-${f.key}" value="${r[f.key] || ''}" placeholder="e.g. France" style="margin-bottom:8px">
        <textarea class="form-textarea" id="rev-${f.notesKey}" rows="3"
          placeholder="Rowan's thoughts on this pick…" style="min-height:70px">${r[f.notesKey] || ''}</textarea>
      </div>`).join('')}
    <div class="form-group">
      <label class="form-label">Overall Thoughts</label>
      <textarea class="form-textarea" id="rev-overall_thoughts" rows="5">${r.overall_thoughts || ''}</textarea>
    </div>
    <button class="admin-save-btn" onclick="adminSaveReview()">Save Review</button>
    <span id="review-save-msg" style="display:none;color:var(--teal);font-weight:600;margin-left:12px">✅ Saved!</span>`;
}

/* ============================================================
   ADMIN UTILITIES — Cancel results, Reset predictions, Delete users
   ============================================================ */
async function renderAdminUtilities() {
  const users = await fetch(
    `${SUPABASE_URL}/rest/v1/users?select=id,username,created_at&order=created_at`,
    { headers: sbHeaders }
  ).then(r => r.json()).catch(() => []);

  /* Get current lock state */
  const lockRes = await fetch(
    `${SUPABASE_URL}/rest/v1/settings?key=eq.competitions_locked&select=value`,
    { headers: sbHeaders }
  ).then(r => r.json()).catch(() => []);
  const isLocked = lockRes[0]?.value === 'true';

  return `
    <h2 class="section-title" style="margin:40px 0 16px">⚙️ <span>Admin Utilities</span></h2>

    <div class="admin-blog-form" style="margin-bottom:24px;border:3px solid ${isLocked ? '#e63200' : 'var(--teal)'};background:${isLocked ? '#fff5f5' : '#f5ffff'}">
      <h3 style="color:${isLocked ? '#e63200' : 'var(--teal-dark)'}">
        ${isLocked ? '🔒 Competitions are LOCKED' : '🔓 Competitions are OPEN'}
      </h3>
      <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:16px">
        ${isLocked
          ? 'All competition entry is currently disabled. Users cannot save predictions or buster picks.'
          : 'Competitions are open. Click to lock before the tournament starts.'}
      </p>
      <button class="hero-cta" onclick="adminToggleLock(${!isLocked})"
        style="background:${isLocked ? 'var(--teal)' : '#e63200'};box-shadow:none;padding:12px 32px">
        ${isLocked ? '🔓 Unlock Competitions' : '🔒 Lock All Competitions'}
      </button>
      <span id="lock-msg" style="display:none;font-weight:600;margin-left:12px">✅ Done!</span>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-bottom:32px">

      <div class="admin-blog-form">
        <h3>🗑️ Cancel ALL Results</h3>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:14px">
          Reset every match back to Upcoming and clear all scores.
        </p>
        <button class="admin-save-btn" style="background:#e63200;width:100%" onclick="adminCancelAllResults()">
          Cancel All Results
        </button>
      </div>

      <div class="admin-blog-form">
        <h3>🎲 Reset All Buster Progress</h3>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:14px">
          Set every team back to Eliminated in the Buster competition.
        </p>
        <button class="admin-save-btn" style="background:#e63200;width:100%" onclick="adminResetAllBuster()">
          Reset All Buster Progress
        </button>
      </div>

      <div class="admin-blog-form">
        <h3>🗑️ Cancel a Single Result</h3>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:14px">
          Reset one match back to Upcoming.
        </p>
        <div class="form-group">
          <label class="form-label">Match ID (1–72)</label>
          <input class="form-input" id="cancel-match-id" type="number" min="1" max="72" placeholder="e.g. 1">
        </div>
        <button class="admin-save-btn" style="background:#e63200" onclick="adminCancelResult()">Cancel Result</button>
        <span id="cancel-msg" style="display:none;color:var(--teal);font-weight:600;margin-left:8px">✅ Done!</span>
      </div>

      <div class="admin-blog-form">
        <h3>🔄 Reset User Predictions</h3>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:14px">
          Wipe all predictions for a specific user.
        </p>
        <div class="form-group">
          <label class="form-label">Select User</label>
          <select class="form-select" id="reset-pred-user">
            <option value="">— pick user —</option>
            ${users.map(u => `<option value="${u.id}">${u.username}</option>`).join('')}
          </select>
        </div>
        <button class="admin-save-btn" style="background:#e63200" onclick="adminResetUserPredictions()">Reset Predictions</button>
        <span id="reset-pred-msg" style="display:none;color:var(--teal);font-weight:600;margin-left:8px">✅ Done!</span>
      </div>

      <div class="admin-blog-form">
        <h3>❌ Delete User</h3>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:14px">
          Permanently delete a user and all their data.
        </p>
        <div class="form-group">
          <label class="form-label">Select User</label>
          <select class="form-select" id="delete-user-select">
            <option value="">— pick user —</option>
            ${users.map(u => `<option value="${u.id}">${u.username}</option>`).join('')}
          </select>
        </div>
        <button class="admin-save-btn" style="background:#e63200" onclick="adminDeleteUser()">Delete User</button>
        <span id="delete-user-msg" style="display:none;color:var(--teal);font-weight:600;margin-left:8px">✅ Done!</span>
      </div>

    </div>

    <h2 class="section-title" style="margin:24px 0 16px">👥 <span>All Users</span></h2>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${users.map(u => `
        <div style="background:var(--white);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px;display:flex;align-items:center;justify-content:space-between">
          <span style="font-weight:600">${u.username}</span>
          <div style="display:flex;gap:8px;align-items:center">
            <span style="font-size:0.75rem;color:var(--text-muted)">${new Date(u.created_at).toLocaleDateString('en-GB')}</span>
            <input class="form-input" id="newpw-${u.id}" placeholder="New password" style="width:130px;padding:6px 10px;font-size:0.8rem">
            <button class="admin-save-btn" onclick="adminResetPassword('${u.id}','${u.username}')" style="padding:6px 12px">Reset PW</button>
            <span id="pw-msg-${u.id}" style="display:none;color:var(--teal);font-size:0.78rem">✅</span>
          </div>
        </div>`).join('')}
    </div>`;
}

async function adminCancelResult() {
  const matchId = parseInt($('cancel-match-id')?.value);
  if (!matchId || matchId < 1 || matchId > 72) { alert('Please enter a valid match ID (1–72)'); return; }
  if (!confirm(`Reset match ${matchId} to Upcoming?`)) return;
  const ok = await fetch(`${SUPABASE_URL}/rest/v1/results?match_id=eq.${matchId}`, {
    method: 'PATCH',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ home_score: null, away_score: null, status: 'Upcoming' })
  }).then(r => r.ok);
  if (ok) { $('cancel-msg').style.display='inline'; setTimeout(()=>$('cancel-msg').style.display='none',3000); }
}

async function adminResetUserPredictions() {
  const userId = $('reset-pred-user')?.value;
  if (!userId) { alert('Please select a user'); return; }
  if (!confirm('Reset all predictions for this user?')) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/match_predictions?user_id=eq.${userId}`, {
    method: 'DELETE', headers: sbHeaders
  });
  if (res.ok || res.status === 204) {
    $('reset-pred-msg').style.display='inline';
    setTimeout(()=>$('reset-pred-msg').style.display='none',3000);
  } else {
    const err = await res.text();
    alert('Could not reset: ' + err);
  }
}

async function adminDeleteUser() {
  const userId = $('delete-user-select')?.value;
  if (!userId) { alert('Please select a user'); return; }
  if (!confirm('Permanently delete this user and ALL their data? This cannot be undone.')) return;
  /* Delete predictions first, then buster picks, then user */
  await fetch(`${SUPABASE_URL}/rest/v1/match_predictions?user_id=eq.${userId}`, { method: 'DELETE', headers: sbHeaders });
  await fetch(`${SUPABASE_URL}/rest/v1/buster_picks?user_id=eq.${userId}`, { method: 'DELETE', headers: sbHeaders });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, { method: 'DELETE', headers: sbHeaders });
  if (res.ok || res.status === 204) {
    alert('User deleted.');
    loadAdminPanel();
  } else {
    const err = await res.text();
    alert('Could not delete user: ' + err);
  }
}

async function adminToggleLock(lock) {
  const action = lock ? 'lock' : 'unlock';
  if (!confirm(`Are you sure you want to ${action} all competitions?`)) return;
  const ok = await fetch(`${SUPABASE_URL}/rest/v1/settings?key=eq.competitions_locked`, {
    method: 'PATCH',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ value: lock ? 'true' : 'false', updated_at: new Date().toISOString() })
  }).then(r => r.ok || r.status === 204);
  if (ok) {
    window._competitionsLocked = lock;
    $('lock-msg').style.display = 'inline';
    setTimeout(() => loadAdminPanel(), 1000);
  }
}

async function adminCancelAllResults() {
  if (!confirm('Cancel ALL results? This will reset every match to Upcoming and clear all scores.')) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/results?match_id=gte.1`, {
    method: 'PATCH',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ home_score: null, away_score: null, status: 'Upcoming' })
  });
  if (res.ok || res.status === 204) {
    alert('All results cancelled.');
    loadAdminPanel();
  } else {
    alert('Could not cancel results.');
  }
}

async function adminResetAllBuster() {
  if (!confirm('Reset ALL team progress for Buster? This sets every team back to Eliminated.')) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/team_progress?id=gte.0`, {
    method: 'PATCH',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ best_stage: 'eliminated', updated_at: new Date().toISOString() })
  });
  /* Also try with a different filter */
  const res2 = await fetch(`${SUPABASE_URL}/rest/v1/team_progress?best_stage=neq.eliminated`, {
    method: 'PATCH',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ best_stage: 'eliminated', updated_at: new Date().toISOString() })
  });
  alert('All buster progress reset.');
  loadAdminPanel();
}

async function adminSaveBlogPost() {
  const title   = $('blog-title')?.value.trim();
  const content = $('blog-content')?.value.trim();
  const type    = $('blog-type')?.value;
  if (!title || !content) { alert('Please fill in title and content.'); return; }

  const ok = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
    method: 'POST',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ title, content, post_type: type, published: true })
  }).then(r => r.ok);

  if (ok) {
    $('blog-title').value = '';
    $('blog-content').value = '';
    $('blog-save-msg').style.display = 'inline';
    setTimeout(() => $('blog-save-msg').style.display = 'none', 3000);
  }
}

async function adminDeletePost(id) {
  if (!confirm('Delete this post?')) return;
  await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${id}`, {
    method: 'DELETE', headers: sbHeaders
  });
  loadAdminPanel();
}

async function adminSaveReview() {
  const fields = ['winner_pick','fav_team','player_to_watch','team_to_watch',
                  'dark_horse','early_exit','golden_boot','overall_thoughts',
                  'winner_notes','fav_notes','player_notes','team_notes',
                  'horse_notes','exit_notes','boot_notes'];
  const data = {};
  fields.forEach(f => { data[f] = $(`rev-${f}`)?.value.trim() || null; });

  const ok = await fetch(`${SUPABASE_URL}/rest/v1/tournament_review?id=eq.1`, {
    method: 'PATCH',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify(data)
  }).then(r => r.ok);

  if (ok) {
    $('review-save-msg').style.display = 'inline';
    setTimeout(() => $('review-save-msg').style.display = 'none', 3000);
  }
}

/* Reset all predictions for a user */
async function confirmResetPredictions(userId) {
  if (!confirm('Are you sure you want to delete ALL your predictions? This cannot be undone.')) return;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/match_predictions?user_id=eq.${userId}`,
    { method: 'DELETE', headers: sbHeaders }
  );
  if (res.ok || res.status === 204) {
    alert('All predictions cleared. The page will now reload.');
    location.reload();
  } else {
    const err = await res.text();
    alert('Could not reset predictions: ' + err);
  }
}

/* ============================================================
   BUSTER ALL PICKS VIEW
   ============================================================ */
async function renderBusterPicks() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <a class="back-link" href="./?leaderboard=buster" style="padding:0;font-size:0.9rem">← Buster Leaderboard</a>
        <h1 class="page-title">🎲 <span>All Buster Picks</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap" id="all-picks-content">
        <p style="color:var(--text-muted)">Loading…</p>
      </div>
    </div>`;

  try {
    const [picks, progress] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/buster_picks?select=*,users(username)`, { headers: sbHeaders }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/team_progress?select=*`, { headers: sbHeaders }).then(r => r.json())
    ]);

    const progressMap = {};
    progress.forEach(p => { progressMap[p.team_name] = p.best_stage; });

    const teams = await loadTeams();
    const flagMap = {};
    teams.forEach(t => { flagMap[t.name] = t.flag; });

    const stageLabel = s => STAGE_LABELS[s] || s;
    const stageColour = s => s === 'winner' ? 'var(--gold)' : s === 'eliminated' ? 'var(--text-muted)' : 'var(--teal)';

    $('all-picks-content').innerHTML = picks.map(p => {
      const username = p.users?.username || '—';
      const pots = [
        { label: 'Pot 1 — Elite',       team: p.pot1_team },
        { label: 'Pot 2 — Contenders',  team: p.pot2_team },
        { label: 'Pot 3 — Challengers', team: p.pot3_team },
        { label: 'Pot 4 — Dark Horses', team: p.pot4_team },
        { label: 'Pot 5 — Underdogs',   team: p.pot5_team },
        { label: 'Pot 6 — Minnows',     team: p.pot6_team },
      ];
      const total = pots.reduce((sum, pot) => {
        const stage = progressMap[pot.team] || 'eliminated';
        return sum + (BUSTER_POINTS[stage] || 0);
      }, 0);

      return `
        <div class="info-card" style="margin-bottom:16px;padding:20px 24px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px">
            <div style="font-family:var(--font-display);font-size:1.2rem;color:var(--purple-dark);letter-spacing:0.04em">
              ${username}
            </div>
            <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--teal)">
              ${total} pts
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px">
            ${pots.map(pot => {
              const stage = progressMap[pot.team] || 'eliminated';
              const pts = BUSTER_POINTS[stage] || 0;
              const flag = flagMap[pot.team] || '';
              return `
                <div style="background:#f8f8fd;border:1px solid var(--border);border-radius:var(--radius-sm);padding:8px 10px">
                  <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);margin-bottom:4px">${pot.label}</div>
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
                    ${flag ? `<img src="${flag}" width="20" height="14" style="border-radius:2px;border:1px solid var(--border)">` : ''}
                    <span style="font-weight:700;font-size:0.875rem;color:var(--text-dark)">${pot.team}</span>
                  </div>
                  <div style="font-size:0.72rem;color:${stageColour(stage)};font-weight:600">${stageLabel(stage)} · ${pts} pts</div>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    }).join('') || '<p style="color:var(--text-muted)">No picks yet.</p>';
  } catch(e) {
    $('all-picks-content').innerHTML = '<p style="color:var(--text-muted)">Could not load picks.</p>';
  }
}

/* ============================================================
   BUSTER COMPETITION
   ============================================================ */



async function renderBuster() {
  await loadLockState();
  const session = getSession();
  const locked  = isPastCutoff();

  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <a class="back-link" href="./?comps=1" style="padding:0;font-size:0.9rem">← Competition Hub</a>
        <h1 class="page-title">🎲 <span>Busters Comp</span></h1>
      </div>
    </div>
    <div class="${locked ? 'comp-status-bar locked' : 'comp-status-bar'}">
      <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:14px 0">
        <div style="display:flex;align-items:center;gap:10px">
          ${locked
            ? `<span style="font-size:1.1rem">🔒</span><strong style="font-size:0.95rem">Buster picks are locked</strong>`
            : `<span style="font-size:1.1rem">⏰</span><strong style="font-size:0.95rem">Locks Thu 11 Jun at 7pm Irish time</strong>`}
        </div>
        <button onclick="compLogout()" class="comp-action-btn">👋 Log Out</button>
      </div>
    </div>
    <div class="section">
      <div class="wrap" id="buster-content">
        <p style="color:var(--text-muted)">Loading…</p>
      </div>
    </div>`;

  /* Need to be logged in */
  if (!session) {
    renderCompLogin('buster');
    return;
  }

  const user = session;

  /* Load existing picks */
  const existingPicks = await fetch(
    `${SUPABASE_URL}/rest/v1/buster_picks?user_id=eq.${user.id}&select=*`,
    { headers: sbHeaders }
  ).then(r => r.json());

  const picks = existingPicks[0] || {};

  /* Load team progress */
  const progress = await fetch(
    `${SUPABASE_URL}/rest/v1/team_progress?select=*`,
    { headers: sbHeaders }
  ).then(r => r.json());

  const progressMap = {};
  progress.forEach(p => { progressMap[p.team_name] = p.best_stage; });

  /* Get flag for team */
  const teamFlag = name => {
    const team = (window._predTeams || []).find(t => t.name === name);
    return team ? `<img src="${team.flag}" width="20" height="14" style="border-radius:2px;border:1px solid var(--border);vertical-align:middle;margin-right:4px">` : '';
  };

  $('buster-content').innerHTML = `

    <div class="info-card" style="margin-bottom:24px;padding:16px 20px;margin-top:16px">
      <p style="font-size:0.875rem;color:var(--text-muted)">
        Pick <strong>one team from each pot</strong>. Your Buster Score is the sum of points earned by all 6 teams as they progress.
        ${locked ? '<span style="color:#e63200;font-weight:600"> — Selections are now locked.</span>' : '<span style="color:var(--teal);font-weight:600"> Selections lock 1 hour before tournament kickoff.</span>'}
      </p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-bottom:32px">
      ${BUSTER_POTS.map(pot => {
        const savedPick = picks[`pot${pot.pot}_team`] || '';
        return `
          <div class="group-card">
            <div class="group-card-header">
              <div>
                <div class="group-letter" style="font-size:1.2rem">Pot ${pot.pot}</div>
                <div style="color:var(--white);font-weight:700;font-size:0.95rem">${pot.label}</div>
                <div class="group-label">${pot.desc}</div>
              </div>
            </div>
            <div style="padding:12px">
              ${locked && savedPick ? `
                <div style="display:flex;align-items:center;gap:8px;padding:10px;background:rgba(0,180,180,0.1);border-radius:var(--radius-sm);border:1px solid var(--teal)">
                  ${teamFlag(savedPick)}
                  <span style="font-weight:700;color:var(--purple-dark)">${savedPick}</span>
                  <span style="margin-left:auto;font-size:0.75rem;color:var(--teal)">${STAGE_LABELS[progressMap[savedPick]||'eliminated']}</span>
                </div>` : `
              <select class="form-select" id="buster-pot${pot.pot}" ${locked ? 'disabled' : ''}>
                <option value="">— Pick a team —</option>
                ${pot.teams.map(team => `
                  <option value="${team}" ${savedPick === team ? 'selected' : ''}>
                    ${team} ${progressMap[team] && progressMap[team] !== 'eliminated' ? '· ' + STAGE_LABELS[progressMap[team]] : ''}
                  </option>`).join('')}
              </select>`}
            </div>
          </div>`;
      }).join('')}
    </div>

    ${!locked ? `
    <div style="text-align:center;margin-bottom:40px;display:flex;flex-direction:column;align-items:center;gap:12px">
      <button class="hero-cta" onclick="saveBusterPicks('${user.id}')" id="buster-save-btn"
        style="min-width:260px;justify-content:center;font-size:1.1rem;padding:16px 32px;background:var(--gold);color:var(--navy);box-shadow:0 4px 24px rgba(245,194,0,0.4)">
        💾 Save My Buster Picks
      </button>
      <p id="buster-save-msg" style="display:none;color:var(--teal);font-weight:600">✅ Picks saved!</p>
      <button onclick="confirmResetBuster('${user.id}')" class="comp-action-btn danger">🗑️ Reset My Buster Picks</button>
    </div>` : ''}

    <h2 class="section-title" style="margin-bottom:20px">🎲 <span>Buster Leaderboard</span></h2>
    <div id="buster-leaderboard"><p style="color:var(--text-muted)">Loading…</p></div>`;

  /* Load teams for flags */
  if (!window._predTeams) {
    window._predTeams = await loadTeams();
  }

  /* Load leaderboard */
  loadBusterLeaderboard();
}

async function confirmResetBuster(userId) {
  if (!confirm('Reset all your Buster picks? This cannot be undone.')) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/buster_picks?user_id=eq.${userId}`, {
    method: 'DELETE', headers: sbHeaders
  });
  if (res.ok || res.status === 204) {
    alert('Buster picks cleared. The page will now reload.');
    location.reload();
  } else {
    alert('Could not reset. Please try again.');
  }
}

async function saveBusterPicks(userId) {
  const btn = $('buster-save-btn');
  const msg = $('buster-save-msg');
  btn.textContent = 'Saving…'; btn.disabled = true;

  const picks = {};
  let valid = true;
  for (let i = 1; i <= 6; i++) {
    const val = $(`buster-pot${i}`)?.value;
    if (!val) {
      alert(`Please pick a team from Pot ${i}`);
      btn.textContent = '💾 Save My Buster Picks'; btn.disabled = false;
      valid = false; break;
    }
    picks[`pot${i}_team`] = val;
  }
  if (!valid) return;

  picks.user_id = userId;
  picks.updated_at = new Date().toISOString();

  const ok = await fetch(`${SUPABASE_URL}/rest/v1/buster_picks`, {
    method: 'POST',
    headers: { ...sbHeaders, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(picks)
  }).then(r => r.ok);

  btn.textContent = '💾 Save My Buster Picks'; btn.disabled = false;
  if (ok) {
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 3000);
  } else {
    alert('Could not save picks. Please try again.');
  }
}

async function loadBusterLeaderboard() {
  try {
    const data = await fetch(
      `${SUPABASE_URL}/rest/v1/buster_leaderboard?select=*`,
      { headers: sbHeaders }
    ).then(r => r.json());

    if (!data.length) {
      $('buster-leaderboard').innerHTML = '<p style="color:var(--text-muted)">No entries yet — be the first!</p>';
      return;
    }

    /* Calculate totals and sort */
    const rows = data.map(r => ({
      ...r,
      total: r.pot1_pts + r.pot2_pts + r.pot3_pts + r.pot4_pts + r.pot5_pts + r.pot6_pts,
      best: Math.max(r.pot1_pts, r.pot2_pts, r.pot3_pts, r.pot4_pts, r.pot5_pts, r.pot6_pts)
    })).sort((a,b) => b.total - a.total || b.best - a.best);

    $('buster-leaderboard').innerHTML = `
      <div style="overflow-x:auto">
        <table class="group-table" style="background:var(--white);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);min-width:500px">
          <thead>
            <tr>
              <th style="text-align:center;width:40px">Pos</th>
              <th style="text-align:left;padding-left:12px">Player</th>
              <th title="Pot 1">P1</th><th title="Pot 2">P2</th>
              <th title="Pot 3">P3</th><th title="Pot 4">P4</th>
              <th title="Pot 5">P5</th><th title="Pot 6">P6</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, i) => `
              <tr>
                <td style="text-align:center;font-weight:700;
                  color:${i===0?'var(--gold)':i===1?'#aaa':i===2?'#cd7f32':'var(--text-muted)'}">
                  ${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
                </td>
                <td style="text-align:left;padding-left:12px;font-weight:600">${row.username}</td>
                <td title="${row.pot1_team}">${row.pot1_pts}</td>
                <td title="${row.pot2_team}">${row.pot2_pts}</td>
                <td title="${row.pot3_team}">${row.pot3_pts}</td>
                <td title="${row.pot4_team}">${row.pot4_pts}</td>
                <td title="${row.pot5_team}">${row.pot5_pts}</td>
                <td title="${row.pot6_team}">${row.pot6_pts}</td>
                <td class="pts-cell">${row.total}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <p style="font-size:0.75rem;color:var(--text-muted);margin-top:8px">Hover over P1-P6 columns to see team names</p>`;
  } catch(e) {
    $('buster-leaderboard').innerHTML = '<p style="color:var(--text-muted)">Could not load leaderboard.</p>';
  }
}

/* Admin — update team progress */
async function renderAdminBuster() {
  const progress = await fetch(
    `${SUPABASE_URL}/rest/v1/team_progress?select=*&order=team_name`,
    { headers: sbHeaders }
  ).then(r => r.json()).catch(() => []);

  const stages = [
    { value:'eliminated',   label:'Eliminated' },
    { value:'group_winner', label:'Group Winner' },
    { value:'group_second', label:'Group Runner-up' },
    { value:'best_third',   label:'Best 3rd Place' },
    { value:'r16',          label:'Round of 16' },
    { value:'qf',           label:'Quarter Final' },
    { value:'sf',           label:'Semi Final' },
    { value:'final',        label:'Finalist' },
    { value:'winner',       label:'🏆 World Cup Winner' },
  ];

  return `
    <h2 class="section-title" style="margin:40px 0 16px">🎲 <span>Buster — Team Progress</span></h2>
    <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:8px">Update stages manually or use the auto-calculation from results. Click Save All when done.</p>
    <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:20px">
      Update each team's furthest stage reached. Buster scores update automatically.
    </p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin-bottom:20px">
      ${progress.map(p => `
        <div style="background:var(--white);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 12px;display:flex;align-items:center;gap:8px">
          <span style="font-weight:600;font-size:0.875rem;flex:1;color:var(--text-dark)">${p.team_name}</span>
          <select class="form-select" id="prog-${p.team_name.replace(/[^a-z]/gi,'_')}"
            style="flex:1;padding:6px 8px;font-size:0.78rem"
            onchange="updateTeamProgress('${p.team_name}', this.value)">
            ${stages.map(s => `<option value="${s.value}" ${p.best_stage===s.value?'selected':''}>${s.label}</option>`).join('')}
          </select>
        </div>`).join('')}
    </div>
    <div style="margin-top:16px">
      <button class="hero-cta" id="buster-save-all-btn" onclick="adminSaveAllBusterProgress()"
        style="background:var(--gold);color:var(--navy);box-shadow:none;padding:12px 32px">
        💾 Save All Progress
      </button>
    </div>`;
}

async function adminSaveAllBusterProgress() {
  const btn = $('buster-save-all-btn');
  if (btn) { btn.textContent = 'Saving…'; btn.disabled = true; }
  const selects = document.querySelectorAll('[id^="prog-"]');
  const updates = Array.from(selects).map(sel => {
    const teamName = sel.id.replace('prog-','').replace(/_/g,' ');
    return fetch(`${SUPABASE_URL}/rest/v1/team_progress?team_name=eq.${encodeURIComponent(teamName)}`, {
      method: 'PATCH',
      headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ best_stage: sel.value, updated_at: new Date().toISOString() })
    });
  });
  await Promise.all(updates);
  if (btn) { btn.textContent = '✅ All Saved!'; setTimeout(() => { btn.textContent = '💾 Save All Progress'; btn.disabled = false; }, 2000); }
}

async function updateTeamProgress(teamName, stage) {
  await fetch(`${SUPABASE_URL}/rest/v1/team_progress?team_name=eq.${encodeURIComponent(teamName)}`, {
    method: 'PATCH',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ best_stage: stage, updated_at: new Date().toISOString() })
  });
}
