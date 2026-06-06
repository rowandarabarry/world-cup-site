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
      <div class="hero-title-overlay">
        <div class="wrap">
          <div class="hero-site-name">ROWAN'S <span>WORLD CUP ZONE</span></div>
          <a class="hero-cta hero-cta-banner" href="./?teams=1">Explore Teams →</a>
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

            ${team.interestingFact ? `
            <div class="interesting-fact">
              <span class="fact-tag">💡 Did You Know?</span>
              <p>${team.interestingFact}</p>
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
      date:'Thu 11 Jun',  time:'15:00 ET', stadium:'SoFi Stadium, Los Angeles',       group:'Group A', result:null },
    { home:'Korea Republic',     homeFlag:'https://flagcdn.com/w40/kr.png',
      away:'Czechia',            awayFlag:'https://flagcdn.com/w40/cz.png',
      date:'Thu 11 Jun',  time:'22:00 ET', stadium:'SoFi Stadium, Los Angeles',       group:'Group A', result:null },
    { home:'Mexico',             homeFlag:'https://flagcdn.com/w40/mx.png',
      away:'Korea Republic',     awayFlag:'https://flagcdn.com/w40/kr.png',
      date:'Mon 16 Jun',  time:'21:00 ET', stadium:'Estadio Azteca, Mexico City',     group:'Group A', result:null },
    { home:'Czechia',            homeFlag:'https://flagcdn.com/w40/cz.png',
      away:'South Africa',       awayFlag:'https://flagcdn.com/w40/za.png',
      date:'Tue 17 Jun',  time:'15:00 ET', stadium:'SoFi Stadium, Los Angeles',       group:'Group A', result:null },
    { home:'Czechia',            homeFlag:'https://flagcdn.com/w40/cz.png',
      away:'Mexico',             awayFlag:'https://flagcdn.com/w40/mx.png',
      date:'Sat 21 Jun',  time:'21:00 ET', stadium:'Estadio Azteca, Mexico City',     group:'Group A', result:null },
    { home:'South Africa',       homeFlag:'https://flagcdn.com/w40/za.png',
      away:'Korea Republic',     awayFlag:'https://flagcdn.com/w40/kr.png',
      date:'Sat 21 Jun',  time:'21:00 ET', stadium:'SoFi Stadium, Los Angeles',       group:'Group A', result:null },

    /* ── Group B ── */
    { home:'Canada',             homeFlag:'https://flagcdn.com/w40/ca.png',
      away:'Bosnia & Herz.',     awayFlag:'https://flagcdn.com/w40/ba.png',
      date:'Fri 12 Jun',  time:'15:00 ET', stadium:'BMO Field, Toronto',              group:'Group B', result:null },
    { home:'Qatar',              homeFlag:'https://flagcdn.com/w40/qa.png',
      away:'Switzerland',        awayFlag:'https://flagcdn.com/w40/ch.png',
      date:'Fri 12 Jun',  time:'21:00 ET', stadium:'Levi\'s Stadium, San Francisco',  group:'Group B', result:null },
    { home:'Switzerland',        homeFlag:'https://flagcdn.com/w40/ch.png',
      away:'Bosnia & Herz.',     awayFlag:'https://flagcdn.com/w40/ba.png',
      date:'Wed 18 Jun',  time:'15:00 ET', stadium:'Seattle Stadium',                 group:'Group B', result:null },
    { home:'Canada',             homeFlag:'https://flagcdn.com/w40/ca.png',
      away:'Qatar',              awayFlag:'https://flagcdn.com/w40/qa.png',
      date:'Wed 18 Jun',  time:'22:00 ET', stadium:'BMO Field, Toronto',              group:'Group B', result:null },
    { home:'Bosnia & Herz.',     homeFlag:'https://flagcdn.com/w40/ba.png',
      away:'Qatar',              awayFlag:'https://flagcdn.com/w40/qa.png',
      date:'Sun 22 Jun',  time:'15:00 ET', stadium:'Levi\'s Stadium, San Francisco',  group:'Group B', result:null },
    { home:'Switzerland',        homeFlag:'https://flagcdn.com/w40/ch.png',
      away:'Canada',             awayFlag:'https://flagcdn.com/w40/ca.png',
      date:'Sun 22 Jun',  time:'21:00 ET', stadium:'BMO Field, Toronto',              group:'Group B', result:null },

    /* ── Group C ── */
    { home:'Brazil',             homeFlag:'https://flagcdn.com/w40/br.png',
      away:'Morocco',            awayFlag:'https://flagcdn.com/w40/ma.png',
      date:'Sat 13 Jun',  time:'18:00 ET', stadium:'MetLife Stadium, New York',       group:'Group C', result:null },
    { home:'Haiti',              homeFlag:'https://flagcdn.com/w40/ht.png',
      away:'Scotland',           awayFlag:'https://flagcdn.com/w40/gb-sct.png',
      date:'Sun 14 Jun',  time:'15:00 ET', stadium:'AT&T Stadium, Dallas',            group:'Group C', result:null },
    { home:'Brazil',             homeFlag:'https://flagcdn.com/w40/br.png',
      away:'Haiti',              awayFlag:'https://flagcdn.com/w40/ht.png',
      date:'Thu 19 Jun',  time:'20:30 ET', stadium:'Hard Rock Stadium, Miami',        group:'Group C', result:null },
    { home:'Scotland',           homeFlag:'https://flagcdn.com/w40/gb-sct.png',
      away:'Morocco',            awayFlag:'https://flagcdn.com/w40/ma.png',
      date:'Thu 19 Jun',  time:'18:00 ET', stadium:'AT&T Stadium, Dallas',            group:'Group C', result:null },
    { home:'Scotland',           homeFlag:'https://flagcdn.com/w40/gb-sct.png',
      away:'Brazil',             awayFlag:'https://flagcdn.com/w40/br.png',
      date:'Mon 23 Jun',  time:'18:00 ET', stadium:'Hard Rock Stadium, Miami',        group:'Group C', result:null },
    { home:'Morocco',            homeFlag:'https://flagcdn.com/w40/ma.png',
      away:'Haiti',              awayFlag:'https://flagcdn.com/w40/ht.png',
      date:'Mon 23 Jun',  time:'18:00 ET', stadium:'AT&T Stadium, Dallas',            group:'Group C', result:null },

    /* ── Group D ── */
    { home:'USA',                homeFlag:'https://flagcdn.com/w40/us.png',
      away:'Paraguay',           awayFlag:'https://flagcdn.com/w40/py.png',
      date:'Sun 14 Jun',  time:'21:00 ET', stadium:'Levi\'s Stadium, San Francisco',  group:'Group D', result:null },
    { home:'Australia',          homeFlag:'https://flagcdn.com/w40/au.png',
      away:'Türkiye',            awayFlag:'https://flagcdn.com/w40/tr.png',
      date:'Mon 15 Jun',  time:'12:00 ET', stadium:'Seattle Stadium',                 group:'Group D', result:null },
    { home:'USA',                homeFlag:'https://flagcdn.com/w40/us.png',
      away:'Australia',          awayFlag:'https://flagcdn.com/w40/au.png',
      date:'Fri 20 Jun',  time:'15:00 ET', stadium:'Levi\'s Stadium, San Francisco',  group:'Group D', result:null },
    { home:'Türkiye',            homeFlag:'https://flagcdn.com/w40/tr.png',
      away:'Paraguay',           awayFlag:'https://flagcdn.com/w40/py.png',
      date:'Fri 20 Jun',  time:'21:00 ET', stadium:'Seattle Stadium',                 group:'Group D', result:null },
    { home:'Türkiye',            homeFlag:'https://flagcdn.com/w40/tr.png',
      away:'USA',                awayFlag:'https://flagcdn.com/w40/us.png',
      date:'Tue 24 Jun',  time:'22:00 ET', stadium:'Seattle Stadium',                 group:'Group D', result:null },
    { home:'Paraguay',           homeFlag:'https://flagcdn.com/w40/py.png',
      away:'Australia',          awayFlag:'https://flagcdn.com/w40/au.png',
      date:'Tue 24 Jun',  time:'18:00 ET', stadium:'Levi\'s Stadium, San Francisco',  group:'Group D', result:null },

    /* ── Group E ── */
    { home:'Germany',            homeFlag:'https://flagcdn.com/w40/de.png',
      away:'Curaçao',            awayFlag:'https://flagcdn.com/w40/cw.png',
      date:'Mon 15 Jun',  time:'21:00 ET', stadium:'NRG Stadium, Houston',            group:'Group E', result:null },
    { home:'Côte d\'Ivoire',     homeFlag:'https://flagcdn.com/w40/ci.png',
      away:'Ecuador',            awayFlag:'https://flagcdn.com/w40/ec.png',
      date:'Mon 15 Jun',  time:'13:00 ET', stadium:'Arrowhead Stadium, Kansas City',  group:'Group E', result:null },
    { home:'Germany',            homeFlag:'https://flagcdn.com/w40/de.png',
      away:'Côte d\'Ivoire',     awayFlag:'https://flagcdn.com/w40/ci.png',
      date:'Sat 21 Jun',  time:'20:00 ET', stadium:'NRG Stadium, Houston',            group:'Group E', result:null },
    { home:'Ecuador',            homeFlag:'https://flagcdn.com/w40/ec.png',
      away:'Curaçao',            awayFlag:'https://flagcdn.com/w40/cw.png',
      date:'Sat 21 Jun',  time:'16:00 ET', stadium:'Arrowhead Stadium, Kansas City',  group:'Group E', result:null },
    { home:'Ecuador',            homeFlag:'https://flagcdn.com/w40/ec.png',
      away:'Germany',            awayFlag:'https://flagcdn.com/w40/de.png',
      date:'Wed 25 Jun',  time:'22:00 ET', stadium:'NRG Stadium, Houston',            group:'Group E', result:null },
    { home:'Curaçao',            homeFlag:'https://flagcdn.com/w40/cw.png',
      away:'Côte d\'Ivoire',     awayFlag:'https://flagcdn.com/w40/ci.png',
      date:'Wed 25 Jun',  time:'22:00 ET', stadium:'Arrowhead Stadium, Kansas City',  group:'Group E', result:null },

    /* ── Group F ── */
    { home:'Netherlands',        homeFlag:'https://flagcdn.com/w40/nl.png',
      away:'Japan',              awayFlag:'https://flagcdn.com/w40/jp.png',
      date:'Mon 15 Jun',  time:'16:00 ET', stadium:'AT&T Stadium, Dallas',            group:'Group F', result:null },
    { home:'Sweden',             homeFlag:'https://flagcdn.com/w40/se.png',
      away:'Tunisia',            awayFlag:'https://flagcdn.com/w40/tn.png',
      date:'Tue 17 Jun',  time:'12:00 ET', stadium:'Estadio Azteca, Mexico City',     group:'Group F', result:null },
    { home:'Netherlands',        homeFlag:'https://flagcdn.com/w40/nl.png',
      away:'Sweden',             awayFlag:'https://flagcdn.com/w40/se.png',
      date:'Sun 22 Jun',  time:'13:00 ET', stadium:'AT&T Stadium, Dallas',            group:'Group F', result:null },
    { home:'Tunisia',            homeFlag:'https://flagcdn.com/w40/tn.png',
      away:'Japan',              awayFlag:'https://flagcdn.com/w40/jp.png',
      date:'Sun 22 Jun',  time:'19:00 ET', stadium:'Estadio Azteca, Mexico City',     group:'Group F', result:null },
    { home:'Tunisia',            homeFlag:'https://flagcdn.com/w40/tn.png',
      away:'Netherlands',        awayFlag:'https://flagcdn.com/w40/nl.png',
      date:'Thu 26 Jun',  time:'16:00 ET', stadium:'AT&T Stadium, Dallas',            group:'Group F', result:null },
    { home:'Japan',              homeFlag:'https://flagcdn.com/w40/jp.png',
      away:'Sweden',             awayFlag:'https://flagcdn.com/w40/se.png',
      date:'Thu 26 Jun',  time:'19:00 ET', stadium:'Estadio Azteca, Mexico City',     group:'Group F', result:null },

    /* ── Group G ── */
    { home:'Belgium',            homeFlag:'https://flagcdn.com/w40/be.png',
      away:'Egypt',              awayFlag:'https://flagcdn.com/w40/eg.png',
      date:'Tue 16 Jun',  time:'15:00 ET', stadium:'Vancouver Stadium',               group:'Group G', result:null },
    { home:'IR Iran',            homeFlag:'https://flagcdn.com/w40/ir.png',
      away:'New Zealand',        awayFlag:'https://flagcdn.com/w40/nz.png',
      date:'Tue 16 Jun',  time:'21:00 ET', stadium:'Seattle Stadium',                 group:'Group G', result:null },
    { home:'Belgium',            homeFlag:'https://flagcdn.com/w40/be.png',
      away:'IR Iran',            awayFlag:'https://flagcdn.com/w40/ir.png',
      date:'Sun 22 Jun',  time:'13:00 ET', stadium:'Vancouver Stadium',               group:'Group G', result:null },
    { home:'New Zealand',        homeFlag:'https://flagcdn.com/w40/nz.png',
      away:'Egypt',              awayFlag:'https://flagcdn.com/w40/eg.png',
      date:'Sun 22 Jun',  time:'21:00 ET', stadium:'Seattle Stadium',                 group:'Group G', result:null },
    { home:'New Zealand',        homeFlag:'https://flagcdn.com/w40/nz.png',
      away:'Belgium',            awayFlag:'https://flagcdn.com/w40/be.png',
      date:'Thu 26 Jun',  time:'16:00 ET', stadium:'Vancouver Stadium',               group:'Group G', result:null },
    { home:'Egypt',              homeFlag:'https://flagcdn.com/w40/eg.png',
      away:'IR Iran',            awayFlag:'https://flagcdn.com/w40/ir.png',
      date:'Thu 26 Jun',  time:'23:00 ET', stadium:'Seattle Stadium',                 group:'Group G', result:null },

    /* ── Group H ── */
    { home:'Spain',              homeFlag:'https://flagcdn.com/w40/es.png',
      away:'Cabo Verde',         awayFlag:'https://flagcdn.com/w40/cv.png',
      date:'Wed 17 Jun',  time:'13:00 ET', stadium:'Hard Rock Stadium, Miami',        group:'Group H', result:null },
    { home:'Saudi Arabia',       homeFlag:'https://flagcdn.com/w40/sa.png',
      away:'Uruguay',            awayFlag:'https://flagcdn.com/w40/uy.png',
      date:'Wed 17 Jun',  time:'18:00 ET', stadium:'Levi\'s Stadium, San Francisco',  group:'Group H', result:null },
    { home:'Spain',              homeFlag:'https://flagcdn.com/w40/es.png',
      away:'Saudi Arabia',       awayFlag:'https://flagcdn.com/w40/sa.png',
      date:'Mon 23 Jun',  time:'18:00 ET', stadium:'Hard Rock Stadium, Miami',        group:'Group H', result:null },
    { home:'Uruguay',            homeFlag:'https://flagcdn.com/w40/uy.png',
      away:'Cabo Verde',         awayFlag:'https://flagcdn.com/w40/cv.png',
      date:'Mon 23 Jun',  time:'13:00 ET', stadium:'Levi\'s Stadium, San Francisco',  group:'Group H', result:null },
    { home:'Uruguay',            homeFlag:'https://flagcdn.com/w40/uy.png',
      away:'Spain',              awayFlag:'https://flagcdn.com/w40/es.png',
      date:'Fri 27 Jun',  time:'20:00 ET', stadium:'Hard Rock Stadium, Miami',        group:'Group H', result:null },
    { home:'Cabo Verde',         homeFlag:'https://flagcdn.com/w40/cv.png',
      away:'Saudi Arabia',       awayFlag:'https://flagcdn.com/w40/sa.png',
      date:'Fri 27 Jun',  time:'23:00 ET', stadium:'Levi\'s Stadium, San Francisco',  group:'Group H', result:null },

    /* ── Group I ── */
    { home:'France',             homeFlag:'https://flagcdn.com/w40/fr.png',
      away:'Senegal',            awayFlag:'https://flagcdn.com/w40/sn.png',
      date:'Thu 18 Jun',  time:'18:00 ET', stadium:'MetLife Stadium, New York',       group:'Group I', result:null },
    { home:'Iraq',               homeFlag:'https://flagcdn.com/w40/iq.png',
      away:'Norway',             awayFlag:'https://flagcdn.com/w40/no.png',
      date:'Thu 18 Jun',  time:'21:00 ET', stadium:'BMO Field, Toronto',              group:'Group I', result:null },
    { home:'France',             homeFlag:'https://flagcdn.com/w40/fr.png',
      away:'Iraq',               awayFlag:'https://flagcdn.com/w40/iq.png',
      date:'Tue 24 Jun',  time:'17:00 ET', stadium:'MetLife Stadium, New York',       group:'Group I', result:null },
    { home:'Norway',             homeFlag:'https://flagcdn.com/w40/no.png',
      away:'Senegal',            awayFlag:'https://flagcdn.com/w40/sn.png',
      date:'Tue 24 Jun',  time:'20:00 ET', stadium:'BMO Field, Toronto',              group:'Group I', result:null },
    { home:'Norway',             homeFlag:'https://flagcdn.com/w40/no.png',
      away:'France',             awayFlag:'https://flagcdn.com/w40/fr.png',
      date:'Sat 28 Jun',  time:'20:00 ET', stadium:'MetLife Stadium, New York',       group:'Group I', result:null },
    { home:'Senegal',            homeFlag:'https://flagcdn.com/w40/sn.png',
      away:'Iraq',               awayFlag:'https://flagcdn.com/w40/iq.png',
      date:'Sat 28 Jun',  time:'17:00 ET', stadium:'BMO Field, Toronto',              group:'Group I', result:null },

    /* ── Group J ── */
    { home:'Argentina',          homeFlag:'https://flagcdn.com/w40/ar.png',
      away:'Algeria',            awayFlag:'https://flagcdn.com/w40/dz.png',
      date:'Fri 19 Jun',  time:'21:00 ET', stadium:'Mercedes-Benz Stadium, Atlanta',  group:'Group J', result:null },
    { home:'Austria',            homeFlag:'https://flagcdn.com/w40/at.png',
      away:'Jordan',             awayFlag:'https://flagcdn.com/w40/jo.png',
      date:'Fri 19 Jun',  time:'12:00 ET', stadium:'Levi\'s Stadium, San Francisco',  group:'Group J', result:null },
    { home:'Argentina',          homeFlag:'https://flagcdn.com/w40/ar.png',
      away:'Austria',            awayFlag:'https://flagcdn.com/w40/at.png',
      date:'Wed 25 Jun',  time:'13:00 ET', stadium:'Mercedes-Benz Stadium, Atlanta',  group:'Group J', result:null },
    { home:'Jordan',             homeFlag:'https://flagcdn.com/w40/jo.png',
      away:'Algeria',            awayFlag:'https://flagcdn.com/w40/dz.png',
      date:'Wed 25 Jun',  time:'21:00 ET', stadium:'Levi\'s Stadium, San Francisco',  group:'Group J', result:null },
    { home:'Jordan',             homeFlag:'https://flagcdn.com/w40/jo.png',
      away:'Argentina',          awayFlag:'https://flagcdn.com/w40/ar.png',
      date:'Sun 29 Jun',  time:'22:00 ET', stadium:'Mercedes-Benz Stadium, Atlanta',  group:'Group J', result:null },
    { home:'Algeria',            homeFlag:'https://flagcdn.com/w40/dz.png',
      away:'Austria',            awayFlag:'https://flagcdn.com/w40/at.png',
      date:'Sun 29 Jun',  time:'19:30 ET', stadium:'Levi\'s Stadium, San Francisco',  group:'Group J', result:null },

    /* ── Group K ── */
    { home:'Portugal',           homeFlag:'https://flagcdn.com/w40/pt.png',
      away:'Congo DR',           awayFlag:'https://flagcdn.com/w40/cd.png',
      date:'Sat 20 Jun',  time:'13:00 ET', stadium:'NRG Stadium, Houston',            group:'Group K', result:null },
    { home:'Uzbekistan',         homeFlag:'https://flagcdn.com/w40/uz.png',
      away:'Colombia',           awayFlag:'https://flagcdn.com/w40/co.png',
      date:'Sat 20 Jun',  time:'22:00 ET', stadium:'Arrowhead Stadium, Kansas City',  group:'Group K', result:null },
    { home:'Portugal',           homeFlag:'https://flagcdn.com/w40/pt.png',
      away:'Uzbekistan',         awayFlag:'https://flagcdn.com/w40/uz.png',
      date:'Thu 26 Jun',  time:'13:00 ET', stadium:'NRG Stadium, Houston',            group:'Group K', result:null },
    { home:'Colombia',           homeFlag:'https://flagcdn.com/w40/co.png',
      away:'Congo DR',           awayFlag:'https://flagcdn.com/w40/cd.png',
      date:'Thu 26 Jun',  time:'22:00 ET', stadium:'Arrowhead Stadium, Kansas City',  group:'Group K', result:null },
    { home:'Colombia',           homeFlag:'https://flagcdn.com/w40/co.png',
      away:'Portugal',           awayFlag:'https://flagcdn.com/w40/pt.png',
      date:'Mon 30 Jun',  time:'22:00 ET', stadium:'NRG Stadium, Houston',            group:'Group K', result:null },
    { home:'Congo DR',           homeFlag:'https://flagcdn.com/w40/cd.png',
      away:'Uzbekistan',         awayFlag:'https://flagcdn.com/w40/uz.png',
      date:'Mon 30 Jun',  time:'19:00 ET', stadium:'Arrowhead Stadium, Kansas City',  group:'Group K', result:null },

    /* ── Group L ── */
    { home:'England',            homeFlag:'https://flagcdn.com/w40/gb-eng.png',
      away:'Croatia',            awayFlag:'https://flagcdn.com/w40/hr.png',
      date:'Sun 21 Jun',  time:'16:00 ET', stadium:'MetLife Stadium, New York',       group:'Group L', result:null },
    { home:'Ghana',              homeFlag:'https://flagcdn.com/w40/gh.png',
      away:'Panama',             awayFlag:'https://flagcdn.com/w40/pa.png',
      date:'Sun 21 Jun',  time:'19:00 ET', stadium:'BMO Field, Toronto',              group:'Group L', result:null },
    { home:'England',            homeFlag:'https://flagcdn.com/w40/gb-eng.png',
      away:'Ghana',              awayFlag:'https://flagcdn.com/w40/gh.png',
      date:'Fri 27 Jun',  time:'17:00 ET', stadium:'MetLife Stadium, New York',       group:'Group L', result:null },
    { home:'Panama',             homeFlag:'https://flagcdn.com/w40/pa.png',
      away:'Croatia',            awayFlag:'https://flagcdn.com/w40/hr.png',
      date:'Fri 27 Jun',  time:'19:00 ET', stadium:'BMO Field, Toronto',              group:'Group L', result:null },
    { home:'Panama',             homeFlag:'https://flagcdn.com/w40/pa.png',
      away:'England',            awayFlag:'https://flagcdn.com/w40/gb-eng.png',
      date:'Tue 1 Jul',   time:'17:00 ET', stadium:'MetLife Stadium, New York',       group:'Group L', result:null },
    { home:'Croatia',            homeFlag:'https://flagcdn.com/w40/hr.png',
      away:'Ghana',              awayFlag:'https://flagcdn.com/w40/gh.png',
      date:'Tue 1 Jul',   time:'17:00 ET', stadium:'BMO Field, Toronto',              group:'Group L', result:null },
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

async function sbUpdate(table, match_id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?match_id=eq.${match_id}`, {
    method: 'PATCH',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify(data)
  });
  return res.ok;
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
      const g = r.Group || 'Other';
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
      `<p style="color:var(--text-muted)">Could not load results. Make sure the Google Sheet is set up correctly.</p>`;
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
            <input type="number" min="0" max="20" class="score-input" id="home-${m.match_id}" value="0">
            <span class="admin-vs">–</span>
            <input type="number" min="0" max="20" class="score-input" id="away-${m.match_id}" value="0">
            <span class="admin-team-name">${m.away_team}</span>
            <img src="https://flagcdn.com/w40/${flagCode(m.away_team)}.png" class="fixture-flag" alt="">
          </div>
          <div class="admin-match-meta">${m.group_name} · ${m.match_date}</div>
          <button class="admin-save-btn" onclick="saveResult(${m.match_id})">Save Result</button>
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
    document.getElementById('admin-content').innerHTML += blogHtml + busterHtml;

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
    } else {
      throw new Error('Update failed');
    }
  } catch(e) {
    alert('Could not connect to server.');
    btn.textContent = 'Save Result';
    btn.disabled = false;
  }
}

async function adminResetPassword(userId, username) {
  const input = $(`pw-${userId}`);
  const msg   = $(`pw-msg-${userId}`);
  const newPw = input?.value.trim();

  if (!newPw || newPw.length < 4) {
    alert('Password must be at least 4 characters.');
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
    else if (params.has('wallchart'))  { await renderWallChart();              }
    else if (params.has('comps'))      { await renderComps();                  }
    else if (params.has('buster'))     { await renderBuster();                 }
    else if (params.has('review'))     { await renderReview();                 }
    else if (params.has('blog'))       { await renderBlog();                   }
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
      (page === 'review'      && params.has('review'));
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

const CUTOFF = new Date('2026-06-11T14:00:00Z'); // 1hr before first match (15:00 UTC)

function isPastCutoff() {
  return new Date() > CUTOFF;
}

/* Hash a string with SHA-256 */
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

/* Generate token from username — same username always gives same token */
async function usernameToToken(username) {
  return (await sha256(username.toLowerCase().trim() + 'wc2026token')).slice(0, 32);
}

/* Register a new user */
async function registerUser(username, password) {
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
    body: JSON.stringify({ username, password_hash, token })
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
    user_id:   userId,
    match_id:  p.matchId,
    home_score: p.homeScore,
    away_score: p.awayScore,
    et_winner:  p.etWinner || null,
    stage:      p.stage,
    updated_at: new Date().toISOString()
  }));

  return fetch(`${SUPABASE_URL}/rest/v1/match_predictions`, {
    method: 'POST',
    headers: { ...sbHeaders, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(rows)
  });
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
    if (!home || !away || p.home_score === '' || p.away_score === '') return;
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
      { matchId:73, home: winners['A'], away: runners['B'],  stage:'r32', date:'Sun 29 Jun' },
      { matchId:74, home: winners['C'], away: runners['D'],  stage:'r32', date:'Sun 29 Jun' },
      { matchId:75, home: winners['E'], away: runners['F'],  stage:'r32', date:'Mon 30 Jun' },
      { matchId:76, home: winners['G'], away: runners['H'],  stage:'r32', date:'Mon 30 Jun' },
      { matchId:77, home: winners['I'], away: runners['J'],  stage:'r32', date:'Tue 1 Jul'  },
      { matchId:78, home: winners['K'], away: runners['L'],  stage:'r32', date:'Tue 1 Jul'  },
      { matchId:79, home: winners['B'], away: runners['A'],  stage:'r32', date:'Wed 2 Jul'  },
      { matchId:80, home: winners['D'], away: runners['C'],  stage:'r32', date:'Wed 2 Jul'  },
      { matchId:81, home: winners['F'], away: runners['E'],  stage:'r32', date:'Thu 3 Jul'  },
      { matchId:82, home: winners['H'], away: runners['G'],  stage:'r32', date:'Thu 3 Jul'  },
      { matchId:83, home: winners['J'], away: runners['I'],  stage:'r32', date:'Fri 4 Jul'  },
      { matchId:84, home: winners['L'], away: runners['K'],  stage:'r32', date:'Fri 4 Jul'  },
      { matchId:85, home: third(0),    away: third(1),       stage:'r32', date:'Sat 5 Jul'  },
      { matchId:86, home: third(2),    away: third(3),       stage:'r32', date:'Sat 5 Jul'  },
      { matchId:87, home: third(4),    away: third(5),       stage:'r32', date:'Sun 6 Jul'  },
      { matchId:88, home: third(6),    away: third(7),       stage:'r32', date:'Sun 6 Jul'  },
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
    if (!p) return `Winner Match ${fix.matchId}`;
    const hs = parseInt(p.homeScore ?? p.home_score);
    const as_ = parseInt(p.awayScore ?? p.away_score);
    if (isNaN(hs) || isNaN(as_)) return `Winner Match ${fix.matchId}`;
    if (hs > as_) return fix.home;
    if (hs < as_) return fix.away;
    return `Winner Match ${fix.matchId}`; /* draw — needs extra time */
  }

  return [
    { matchId:89, home: winner(r32Fixtures[0]), away: winner(r32Fixtures[1]),  stage:'r16', date:'Tue 7 Jul'  },
    { matchId:90, home: winner(r32Fixtures[2]), away: winner(r32Fixtures[3]),  stage:'r16', date:'Tue 7 Jul'  },
    { matchId:91, home: winner(r32Fixtures[4]), away: winner(r32Fixtures[5]),  stage:'r16', date:'Wed 8 Jul'  },
    { matchId:92, home: winner(r32Fixtures[6]), away: winner(r32Fixtures[7]),  stage:'r16', date:'Wed 8 Jul'  },
    { matchId:93, home: winner(r32Fixtures[8]), away: winner(r32Fixtures[9]),  stage:'r16', date:'Thu 9 Jul'  },
    { matchId:94, home: winner(r32Fixtures[10]),away: winner(r32Fixtures[11]), stage:'r16', date:'Thu 9 Jul'  },
    { matchId:95, home: winner(r32Fixtures[12]),away: winner(r32Fixtures[13]), stage:'r16', date:'Fri 10 Jul' },
    { matchId:96, home: winner(r32Fixtures[14]),away: winner(r32Fixtures[15]), stage:'r16', date:'Fri 10 Jul' },
  ];
}

/* Generate QF from R16 predictions */
function generateQF(r16Fixtures, r16Preds) {
  const predMap = {};
  r16Preds.forEach(p => { predMap[p.matchId || p.match_id] = p; });
  function winner(fix) {
    const p = predMap[fix.matchId];
    if (!p) return `Winner Match ${fix.matchId}`;
    const hs = parseInt(p.homeScore ?? p.home_score);
    const as_ = parseInt(p.awayScore ?? p.away_score);
    if (isNaN(hs) || isNaN(as_)) return `Winner Match ${fix.matchId}`;
    return hs >= as_ ? fix.home : fix.away;
  }
  return [
    { matchId:97,  home: winner(r16Fixtures[0]), away: winner(r16Fixtures[1]), stage:'qf', date:'Mon 13 Jul' },
    { matchId:98,  home: winner(r16Fixtures[2]), away: winner(r16Fixtures[3]), stage:'qf', date:'Mon 13 Jul' },
    { matchId:99,  home: winner(r16Fixtures[4]), away: winner(r16Fixtures[5]), stage:'qf', date:'Tue 14 Jul' },
    { matchId:100, home: winner(r16Fixtures[6]), away: winner(r16Fixtures[7]), stage:'qf', date:'Tue 14 Jul' },
  ];
}

/* Generate SF from QF predictions */
function generateSF(qfFixtures, qfPreds) {
  const predMap = {};
  qfPreds.forEach(p => { predMap[p.matchId || p.match_id] = p; });
  function winner(fix) {
    const p = predMap[fix.matchId];
    if (!p) return `Winner Match ${fix.matchId}`;
    const hs = parseInt(p.homeScore ?? p.home_score);
    const as_ = parseInt(p.awayScore ?? p.away_score);
    if (isNaN(hs) || isNaN(as_)) return `Winner Match ${fix.matchId}`;
    return hs >= as_ ? fix.home : fix.away;
  }
  return [
    { matchId:101, home: winner(qfFixtures[0]), away: winner(qfFixtures[1]), stage:'sf', date:'Fri 17 Jul' },
    { matchId:102, home: winner(qfFixtures[2]), away: winner(qfFixtures[3]), stage:'sf', date:'Sat 18 Jul' },
  ];
}

/* Generate Final from SF predictions */
function generateFinal(sfFixtures, sfPreds) {
  const predMap = {};
  sfPreds.forEach(p => { predMap[p.matchId || p.match_id] = p; });
  function winner(fix) {
    const p = predMap[fix.matchId];
    if (!p) return `Winner Match ${fix.matchId}`;
    const hs = parseInt(p.homeScore ?? p.home_score);
    const as_ = parseInt(p.awayScore ?? p.away_score);
    if (isNaN(hs) || isNaN(as_)) return `Winner Match ${fix.matchId}`;
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
    const saved  = predMap[fix.matchId] || predMap[fix.match_id];
    const hScore = saved ? (saved.home_score ?? saved.homeScore ?? 0) : 0;
    const aScore = saved ? (saved.away_score ?? saved.awayScore ?? 0) : 0;
    const etWinner = saved ? (saved.et_winner || '') : '';
    const hFlag  = flagCode(fix.home_team || fix.home);
    const aFlag  = flagCode(fix.away_team || fix.away);
    const homeTeam = fix.home_team || fix.home;
    const awayTeam = fix.away_team || fix.away;
    const isDraw = parseInt(hScore) === parseInt(aScore);

    return `
      <div class="pred-match-card" id="pred-${fix.matchId}">
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
              oninput="onKnockoutChange(${fix.matchId}, '${homeTeam}', '${awayTeam}')">
            <span class="admin-vs">–</span>
            <input type="number" min="0" max="20" class="score-input pred-score"
              id="pa-${fix.matchId}" value="${aScore}"
              ${readOnly ? 'disabled' : ''}
              oninput="onKnockoutChange(${fix.matchId}, '${homeTeam}', '${awayTeam}')">
          </div>
          <div class="pred-team away">
            <span class="pred-team-name">${awayTeam}</span>
            <img src="https://flagcdn.com/w40/${aFlag}.png" class="fixture-flag" alt="">
          </div>
        </div>
        <div class="et-winner-row" id="et-${fix.matchId}" style="${isDraw ? '' : 'display:none'}">
          <span class="et-label">After extra time, winner:</span>
          <select class="et-select" id="et-sel-${fix.matchId}" ${readOnly ? 'disabled' : ''}>
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
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  /* ── Step 1: Registration / Login ── */
  if (!token) {
    app().innerHTML = `
      <div class="page-title-bar">
        <div class="wrap">
          <h1 class="page-title">Make Your <span>Predictions</span></h1>
        </div>
      </div>
      <div class="section">
        <div class="wrap">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:700px;margin:0 auto">

            <!-- Register -->
            <div class="info-card">
              <h3 style="margin-bottom:6px">New? Register</h3>
              <p style="color:var(--text-muted);font-size:0.82rem;margin-bottom:18px">
                Pick a username (one word, unique) and a password.
                You'll get a personal link to bookmark.
              </p>
              <div style="display:flex;flex-direction:column;gap:12px">
                <div>
                  <label style="font-size:0.78rem;font-weight:600;color:var(--text-muted);display:block;margin-bottom:5px">Username</label>
                  <input class="search" id="reg-username" placeholder="e.g. johndec" style="padding:11px 14px" autocomplete="off">
                </div>
                <div>
                  <label style="font-size:0.78rem;font-weight:600;color:var(--text-muted);display:block;margin-bottom:5px">Password</label>
                  <input class="search" id="reg-password" type="password" placeholder="Choose a password" style="padding:11px 14px">
                </div>
                <button onclick="handleRegister()" class="hero-cta" style="width:100%;justify-content:center">
                  Register →
                </button>
                <p id="reg-error" style="color:#e63200;font-size:0.82rem;display:none;text-align:center"></p>
              </div>
            </div>

            <!-- Login -->
            <div class="info-card">
              <h3 style="margin-bottom:6px">Already registered?</h3>
              <p style="color:var(--text-muted);font-size:0.82rem;margin-bottom:18px">
                Enter your username and password to get back to your predictions.
              </p>
              <div style="display:flex;flex-direction:column;gap:12px">
                <div>
                  <label style="font-size:0.78rem;font-weight:600;color:var(--text-muted);display:block;margin-bottom:5px">Username</label>
                  <input class="search" id="login-username" placeholder="Your username" style="padding:11px 14px" autocomplete="off">
                </div>
                <div>
                  <label style="font-size:0.78rem;font-weight:600;color:var(--text-muted);display:block;margin-bottom:5px">Password</label>
                  <input class="search" id="login-password" type="password" placeholder="Your password" style="padding:11px 14px">
                </div>
                <button onclick="handleLogin()" class="hero-cta" style="width:100%;justify-content:center;background:var(--purple-mid)">
                  Login →
                </button>
                <p id="login-error" style="color:#e63200;font-size:0.82rem;display:none;text-align:center"></p>
              </div>
            </div>

          </div>
          <p style="text-align:center;color:var(--text-muted);font-size:0.8rem;margin-top:20px">
            Forgotten your password? Contact the admin to reset it.
          </p>
        </div>
      </div>`;

    /* Enter key support */
    setTimeout(() => {
      $('reg-password')?.addEventListener('keydown', e => { if(e.key==='Enter') handleRegister(); });
      $('login-password')?.addEventListener('keydown', e => { if(e.key==='Enter') handleLogin(); });
    }, 100);
    return;
  }

  /* ── Step 2: Load user from token ── */
  const userRes = await fetch(
    `${SUPABASE_URL}/rest/v1/users?token=eq.${token}&select=*`,
    { headers: sbHeaders }
  ).then(r => r.json());

  if (!userRes.length) {
    app().innerHTML = `<div class="wrap" style="padding:2rem"><p>Invalid prediction link. Please <a href="?predict=1">register again</a>.</p></div>`;
    return;
  }

  const user = userRes[0];
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
  const groupPreds = groupFixtures.map(fix => ({
    ...fix,
    home_score: predMap[fix.match_id]?.home_score ?? '',
    away_score: predMap[fix.match_id]?.away_score ?? ''
  }));
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

  const cutoffStr = CUTOFF.toLocaleDateString('en-GB', { day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' });

  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <h1 class="page-title">🏆 <span>${user.username}'s</span> Predictions</h1>
        ${locked
          ? `<span class="tag" style="background:#e63200;color:#fff;font-size:0.85rem">Predictions Locked</span>`
          : `<span style="font-size:0.85rem;color:rgba(255,255,255,0.6)">Locks ${cutoffStr}</span>`}
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
          ${!locked ? `
          <div style="text-align:center;margin-top:24px">
            <button class="hero-cta" onclick="saveSection('final')" id="save-final"
              style="background:var(--gold);color:var(--navy);box-shadow:0 4px 20px rgba(245,194,0,0.4)">
              🏆 Save Final Prediction
            </button>
            <p id="save-final-msg" style="margin-top:10px;font-size:0.85rem;color:var(--teal);display:none">✅ All predictions saved! Good luck!</p>
          </div>` : ''}
        </div>

      </div>
    </div>`;

  /* Store user in window for save functions */
  window._predUser = user;
  window._predTeams = teams;
  window._results = results;
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

/* Show/hide ET winner picker when knockout score changes */
function onKnockoutChange(matchId, homeTeam, awayTeam) {
  const hVal = parseInt($(`ph-${matchId}`)?.value ?? 0);
  const aVal = parseInt($(`pa-${matchId}`)?.value ?? 0);
  const etRow = $(`et-${matchId}`);
  const etSel = $(`et-sel-${matchId}`);
  if (!etRow) return;
  if (hVal === aVal) {
    etRow.style.display = 'flex';
    /* Update options in case team names changed */
    etSel.options[1].value = homeTeam; etSel.options[1].text = homeTeam;
    etSel.options[2].value = awayTeam; etSel.options[2].text = awayTeam;
  } else {
    etRow.style.display = 'none';
    etSel.value = '';
  }
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
      <table class="group-table" style="background:var(--white);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm)">
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
   COMPS PAGE — predictions entry + leaderboard
   ============================================================ */
async function renderComps() {
  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">🎯 <span>Competition</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap">

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-bottom:40px">
          <div class="info-card" style="text-align:center;padding:32px">
            <div style="font-size:2.5rem;margin-bottom:12px">🎯</div>
            <h3 style="margin-bottom:8px">Score Predictions</h3>
            <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:20px">
              Predict every match score and follow your bracket through the tournament
            </p>
            <a class="hero-cta" href="./?predict=1" style="display:inline-flex;justify-content:center;width:100%">
              Make My Predictions →
            </a>
          </div>
          <div class="info-card" style="text-align:center;padding:32px">
            <div style="font-size:2.5rem;margin-bottom:12px">🎲</div>
            <h3 style="margin-bottom:8px">Buster Competition</h3>
            <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:20px">
              Pick one team from each of 6 pots and score points as they progress
            </p>
            <a class="hero-cta" id="buster-link" href="./?buster=1" style="display:inline-flex;justify-content:center;width:100%;background:var(--gold);color:var(--navy);box-shadow:0 4px 20px rgba(245,194,0,0.3)">
              Enter Buster →
            </a>
          </div>
          <div class="info-card" style="padding:24px">
            <h3 style="margin-bottom:4px">How to Score Points</h3>
            <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px">
              <div class="fact-row"><span class="fact-label">⚽ Exact score</span><span class="fact-value" style="color:var(--teal)">5 pts</span></div>
              <div class="fact-row"><span class="fact-label">✅ Correct outcome</span><span class="fact-value" style="color:var(--teal)">2 pts</span></div>
              <div class="fact-row"><span class="fact-label">🥇 Correct group winner</span><span class="fact-value" style="color:var(--teal)">4 pts</span></div>
              <div class="fact-row"><span class="fact-label">✔️ Correct qualifier</span><span class="fact-value" style="color:var(--teal)">2 pts</span></div>
              <div class="fact-row"><span class="fact-label">🔟 Round of 16</span><span class="fact-value" style="color:var(--teal)">5 pts</span></div>
              <div class="fact-row"><span class="fact-label">⚡ Quarter Final</span><span class="fact-value" style="color:var(--teal)">7 pts</span></div>
              <div class="fact-row"><span class="fact-label">🌟 Semi Final</span><span class="fact-value" style="color:var(--teal)">10 pts</span></div>
              <div class="fact-row"><span class="fact-label">🏅 Final</span><span class="fact-value" style="color:var(--teal)">15 pts</span></div>
              <div class="fact-row"><span class="fact-label">🏆 Winner</span><span class="fact-value" style="color:var(--gold)">20 pts</span></div>
            </div>
          </div>
        </div>

        <h2 class="section-title" style="margin-bottom:20px">🥇 <span>Leaderboard</span></h2>
        <div id="comps-leaderboard"><p style="color:var(--text-muted)">Loading…</p></div>
      </div>
    </div>`;

  try {
    const data = await fetch(
      `${SUPABASE_URL}/rest/v1/leaderboard?select=*&order=total_pts.desc`,
      { headers: sbHeaders }
    ).then(r => r.json());

    if (!data.length) {
      $('comps-leaderboard').innerHTML = '<p style="color:var(--text-muted)">No predictions submitted yet — be the first!</p>';
    const tkn = new URLSearchParams(location.search).get('token');
    if (tkn && $('buster-link')) $('buster-link').href = `./?buster=1&token=${tkn}`;
      return;
    }

    $('comps-leaderboard').innerHTML = `
      <table class="group-table" style="background:var(--white);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm)">
        <thead>
          <tr>
            <th style="text-align:center;padding-left:16px;width:40px">Pos</th>
            <th style="text-align:left;padding-left:12px">Player</th>
            <th>Match Pts</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((row, i) => `
            <tr>
              <td style="padding-left:16px;font-weight:700;font-size:1rem;
                color:${i===0?'var(--gold)':i===1?'#aaa':i===2?'#cd7f32':'var(--text-muted)'}">
                ${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
              </td>
              <td style="font-weight:600;text-align:left;padding-left:12px">${row.username || '—'}</td>
              <td>${row.match_pts}</td>
              <td class="pts-cell">${row.total_pts}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  } catch(e) {
    $('comps-leaderboard').innerHTML = '<p style="color:var(--text-muted)">Could not load leaderboard.</p>';
  }
}

/* ============================================================
   TOURNAMENT REVIEW PAGE — Rowan's opinions
   ============================================================ */
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
      { key:'winner_pick',       label:'My Winner Pick',     icon:'🏆', desc:'Who I think will lift the trophy' },
      { key:'fav_team',          label:'Favourite Team',     icon:'❤️', desc:'The team I\'m supporting' },
      { key:'player_to_watch',   label:'Player to Watch',    icon:'⭐', desc:'The standout player of the tournament' },
      { key:'team_to_watch',     label:'Team to Watch',      icon:'👀', desc:'The most exciting team to follow' },
      { key:'dark_horse',        label:'Dark Horse',         icon:'🐴', desc:'Could go further than anyone expects' },
      { key:'early_exit',        label:'Shock Early Exit',   icon:'😬', desc:'The big name who won\'t make it far' },
      { key:'golden_boot',       label:'Golden Boot Pick',   icon:'👟', desc:'Top scorer of the tournament' },
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
              <div style="font-size:0.78rem;color:var(--text-muted);margin-top:4px">${f.desc}</div>
            </div>`).join('')}
        </div>
        ${r.overall_thoughts ? `
        <div class="review-card">
          <div style="font-size:1.8rem;margin-bottom:8px">📝</div>
          <span class="review-card-label">Overall Thoughts</span>
          <div class="review-card-text">${r.overall_thoughts}</div>
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
   WALL CHART PAGE
   ============================================================ */
async function renderWallChart(filledPreds = null, username = '') {
  app().innerHTML = `
    <div class="page-title-bar no-print">
      <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <h1 class="page-title">🗒️ <span>Wall Chart</span>${username ? ` — ${username}` : ''}</h1>
        <button class="hero-cta no-print" onclick="window.print()" style="padding:10px 24px">
          🖨️ Print / Download
        </button>
      </div>
    </div>
    <div class="wall-chart-wrap">
      <div class="wc-title">ROWAN'S WORLD CUP ZONE</div>
      <div class="wc-subtitle">FIFA World Cup 2026 · USA · Canada · Mexico${username ? ` · ${username}'s Predictions` : ' · Wall Chart'}</div>
      <div id="wc-content"><p style="color:var(--text-muted)">Building chart…</p></div>
    </div>`;

  const [teams, results] = await Promise.all([
    loadTeams(),
    sbGet('results')
  ]);

  /* Build group fixtures map */
  const groupFixtures = {};
  results.filter(r => parseInt(r.match_id) <= 72).forEach(r => {
    const g = r.group_name.replace('Group ','');
    if (!groupFixtures[g]) groupFixtures[g] = [];
    groupFixtures[g].push(r);
  });

  /* Prediction map if filled */
  const predMap = {};
  if (filledPreds) filledPreds.forEach(p => { predMap[p.match_id || p.matchId] = p; });

  const scoreDisplay = (matchId, isHome) => {
    if (filledPreds) {
      const p = predMap[matchId];
      if (p) return isHome ? (p.home_score ?? '') : (p.away_score ?? '');
    }
    const r = results.find(r => r.match_id == matchId);
    if (r && r.status === 'Played') return isHome ? r.home_score : r.away_score;
    return '';
  };

  /* Group stage HTML */
  const groupsHtml = Object.entries(groupFixtures)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([g, matches]) => `
      <div class="wc-group">
        <div class="wc-group-header">
          <span>GROUP ${g}</span>
        </div>
        ${matches.map(m => `
          <div class="wc-match-row">
            <div class="wc-match-teams">
              <img src="https://flagcdn.com/w20/${flagCode(m.home_team)}.png" width="16" height="11" style="border-radius:1px">
              <span>${m.home_team}</span>
              <span style="color:var(--text-muted);margin:0 2px">v</span>
              <span>${m.away_team}</span>
              <img src="https://flagcdn.com/w20/${flagCode(m.away_team)}.png" width="16" height="11" style="border-radius:1px">
            </div>
            <div class="wc-score-box">
              <input class="wc-score-input" value="${scoreDisplay(m.match_id, true)}" readonly>
              <span class="wc-dash">–</span>
              <input class="wc-score-input" value="${scoreDisplay(m.match_id, false)}" readonly>
            </div>
          </div>`).join('')}
      </div>`).join('');

  /* Knockout bracket */
  const r32Matches = results.filter(r => r.match_id >= 73 && r.match_id <= 88);
  const r16Matches = results.filter(r => r.match_id >= 89 && r.match_id <= 96);
  const qfMatches  = results.filter(r => r.match_id >= 97 && r.match_id <= 100);
  const sfMatches  = results.filter(r => r.match_id >= 101 && r.match_id <= 102);
  const finalMatch = results.find(r => r.match_id === 103);

  const bracketMatch = (matchId, label, homeLabel, awayLabel) => {
    const hs = scoreDisplay(matchId, true);
    const as_ = scoreDisplay(matchId, false);
    return `
      <div class="wc-bracket-match">
        <div class="wc-bracket-match-label">${label}</div>
        <div class="wc-bracket-team">
          <span class="wc-bracket-team-name">${homeLabel}</span>
          <input class="wc-bracket-score" value="${hs}" readonly>
        </div>
        <div class="wc-bracket-team">
          <span class="wc-bracket-team-name">${awayLabel}</span>
          <input class="wc-bracket-score" value="${as_}" readonly>
        </div>
      </div>`;
  };

  $('wc-content').innerHTML = `
    <div class="wc-groups-grid">${groupsHtml}</div>

    <div class="wc-bracket">
      <div class="wc-bracket-header">ROUND OF 32</div>
      <div class="wc-bracket-grid">
        ${Array.from({length:16}, (_,i) => {
          const m = results.find(r => r.match_id === 73+i) || {match_id:73+i,home_team:'TBD',away_team:'TBD'};
          return bracketMatch(m.match_id, `Match ${m.match_id}`, m.home_team || 'TBD', m.away_team || 'TBD');
        }).join('')}
      </div>
    </div>

    <div class="wc-bracket">
      <div class="wc-bracket-header">ROUND OF 16</div>
      <div class="wc-bracket-grid">
        ${Array.from({length:8}, (_,i) => {
          const m = results.find(r => r.match_id === 89+i) || {match_id:89+i,home_team:'TBD',away_team:'TBD'};
          return bracketMatch(m.match_id, `Match ${m.match_id}`, m.home_team||'TBD', m.away_team||'TBD');
        }).join('')}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="wc-bracket">
        <div class="wc-bracket-header">QUARTER FINALS</div>
        <div class="wc-bracket-grid" style="grid-template-columns:1fr 1fr">
          ${Array.from({length:4}, (_,i) => {
            const m = results.find(r => r.match_id === 97+i) || {match_id:97+i,home_team:'TBD',away_team:'TBD'};
            return bracketMatch(m.match_id, `Match ${m.match_id}`, m.home_team||'TBD', m.away_team||'TBD');
          }).join('')}
        </div>
      </div>
      <div class="wc-bracket">
        <div class="wc-bracket-header">SEMI FINALS</div>
        <div class="wc-bracket-grid" style="grid-template-columns:1fr 1fr">
          ${Array.from({length:2}, (_,i) => {
            const m = results.find(r => r.match_id === 101+i) || {match_id:101+i,home_team:'TBD',away_team:'TBD'};
            return bracketMatch(m.match_id, `Match ${m.match_id}`, m.home_team||'TBD', m.away_team||'TBD');
          }).join('')}
        </div>
      </div>
    </div>

    <div class="wc-bracket" style="border:2px solid var(--gold)">
      <div class="wc-bracket-header" style="background:var(--gold);color:var(--navy);font-size:1.2rem">🏆 THE FINAL — Sunday 19 July</div>
      <div class="wc-bracket-grid" style="grid-template-columns:1fr">
        ${bracketMatch(103, 'Match 103 · MetLife Stadium', finalMatch?.home_team||'TBD', finalMatch?.away_team||'TBD')}
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
    { key:'winner_pick',     label:'Winner Pick'       },
    { key:'fav_team',        label:'Favourite Team'    },
    { key:'player_to_watch', label:'Player to Watch'   },
    { key:'team_to_watch',   label:'Team to Watch'     },
    { key:'dark_horse',      label:'Dark Horse'        },
    { key:'early_exit',      label:'Shock Early Exit'  },
    { key:'golden_boot',     label:'Golden Boot Pick'  },
  ];

  return `
    ${fields.map(f => `
      <div class="form-group">
        <label class="form-label">${f.label}</label>
        <input class="form-input" id="rev-${f.key}" value="${r[f.key] || ''}" placeholder="${f.label}">
      </div>`).join('')}
    <div class="form-group">
      <label class="form-label">Overall Thoughts</label>
      <textarea class="form-textarea" id="rev-overall_thoughts" rows="5">${r.overall_thoughts || ''}</textarea>
    </div>
    <button class="admin-save-btn" onclick="adminSaveReview()">Save Review</button>
    <span id="review-save-msg" style="display:none;color:var(--teal);font-weight:600;margin-left:12px">✅ Saved!</span>`;
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
                  'dark_horse','early_exit','golden_boot','overall_thoughts'];
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

/* ============================================================
   BUSTER COMPETITION
   ============================================================ */

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
  r16: 5, best_third: 1, group_second: 2, group_winner: 3, eliminated: 0
};

const STAGE_LABELS = {
  winner: '🏆 World Cup Winner', final: '🥈 Finalist',
  sf: '🌟 Semi Final', qf: '⚡ Quarter Final',
  r16: '🔟 Round of 16', best_third: '✔️ Best 3rd Place',
  group_second: '2️⃣ Group Runner-up', group_winner: '1️⃣ Group Winner',
  eliminated: '❌ Eliminated'
};

async function renderBuster() {
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  app().innerHTML = `
    <div class="page-title-bar">
      <div class="wrap">
        <h1 class="page-title">🎲 <span>Buster Competition</span></h1>
      </div>
    </div>
    <div class="section">
      <div class="wrap" id="buster-content">
        <p style="color:var(--text-muted)">Loading…</p>
      </div>
    </div>`;

  /* Need to be logged in */
  if (!token) {
    $('buster-content').innerHTML = `
      <div class="info-card" style="max-width:480px;margin:0 auto;text-align:center;padding:32px">
        <div style="font-size:2.5rem;margin-bottom:12px">🎲</div>
        <h3 style="margin-bottom:8px">Buster Competition</h3>
        <p style="color:var(--text-muted);margin-bottom:20px;font-size:0.9rem">
          Pick one team from each of the 6 pots. Score points as your teams progress through the tournament!
        </p>
        <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:20px">
          You need to be logged in via the Predictions page first to enter.
        </p>
        <a class="hero-cta" href="./?predict=1" style="display:inline-flex;justify-content:center;width:100%">
          Login via Predictions →
        </a>
      </div>`;
    return;
  }

  /* Load user */
  const userRes = await fetch(
    `${SUPABASE_URL}/rest/v1/users?token=eq.${token}&select=*`,
    { headers: sbHeaders }
  ).then(r => r.json());

  if (!userRes.length) {
    $('buster-content').innerHTML = `<p>Invalid link. <a href="?predict=1">Login again</a>.</p>`;
    return;
  }

  const user = userRes[0];
  const locked = isPastCutoff();

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
    <div class="info-card" style="margin-bottom:24px;padding:16px 20px">
      <p style="font-size:0.875rem;color:var(--text-muted)">
        Pick <strong>one team from each pot</strong>. Your Buster Score is the sum of points earned by all 6 teams as they progress through the tournament.
        ${locked ? '<span style="color:#e63200;font-weight:600"> — Selections are now locked.</span>' : '<span style="color:var(--teal);font-weight:600"> Selections lock 1 hour before kickoff.</span>'}
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
    <div style="text-align:center;margin-bottom:40px">
      <button class="hero-cta" onclick="saveBusterPicks('${user.id}')" id="buster-save-btn">
        💾 Save My Buster Picks
      </button>
      <p id="buster-save-msg" style="display:none;color:var(--teal);font-weight:600;margin-top:10px">✅ Picks saved!</p>
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
    <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:20px">
      Update each team's furthest stage reached. Buster scores update automatically.
    </p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">
      ${progress.map(p => `
        <div style="background:var(--white);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 12px;display:flex;align-items:center;gap:8px">
          <span style="font-weight:600;font-size:0.875rem;flex:1;color:var(--text-dark)">${p.team_name}</span>
          <select class="form-select" id="prog-${p.team_name.replace(/[^a-z]/gi,'_')}"
            style="flex:1;padding:6px 8px;font-size:0.78rem"
            onchange="updateTeamProgress('${p.team_name}', this.value)">
            ${stages.map(s => `<option value="${s.value}" ${p.best_stage===s.value?'selected':''}>${s.label}</option>`).join('')}
          </select>
        </div>`).join('')}
    </div>`;
}

async function updateTeamProgress(teamName, stage) {
  await fetch(`${SUPABASE_URL}/rest/v1/team_progress?team_name=eq.${encodeURIComponent(teamName)}`, {
    method: 'PATCH',
    headers: { ...sbHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ best_stage: stage, updated_at: new Date().toISOString() })
  });
}
