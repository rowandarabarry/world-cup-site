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
          <div class="hero-site-name">ROWAN'S <span>WORLD CUP HUB</span></div>
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
   SHEET API URL — replace with your deployed Apps Script URL
   ============================================================ */
const SHEET_API = 'https://script.google.com/macros/s/AKfycbzC6dP9U2x6sSE1WkZ3SD6x2QvgFiGOhJI3ao5kMv7dkIhWXMpztOSwc3Pd2FqHchUK/exec';

/* JSONP helper — bypasses CORS restriction on Google Apps Script */
function fetchSheet(params) {
  return new Promise((resolve, reject) => {
    const cbName = 'cb_' + Math.random().toString(36).slice(2);
    const url = SHEET_API + '?' + new URLSearchParams({...params, callback: cbName});
    window[cbName] = (data) => {
      delete window[cbName];
      document.head.removeChild(script);
      resolve(data);
    };
    const script = document.createElement('script');
    script.src = url;
    script.onerror = () => reject(new Error('Script load failed'));
    document.head.appendChild(script);
    setTimeout(() => reject(new Error('Timeout')), 10000);
  });
}

/* Parse CSV from Google Sheets into array of objects */
function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] || '');
    return obj;
  });
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
    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTz224Prn4SdoE-52id9MEMgUkgUuCE1_Rrz6rq7TeQLLPCKAH2ev1pOnVK0kOPuwG7eGVWQOECnW3S/pub?gid=0&single=true&output=csv';
    const res = await fetch(CSV_URL);
    const csv = await res.text();
    const results = parseCSV(csv);

    /* Group by group */
    const groups = {};
    results.forEach(r => {
      const g = r.Group || 'Other';
      if (!groups[g]) groups[g] = [];
      groups[g].push(r);
    });

    const played = results.filter(r => r.Status === 'Played');
    const upcoming = results.filter(r => r.Status !== 'Played');

    document.getElementById('results-content').innerHTML = `
      <div class="results-summary">
        <div class="rs-item"><strong>${played.length}</strong> Played</div>
        <div class="rs-item"><strong>${upcoming.length}</strong> Remaining</div>
      </div>

      ${Object.entries(groups).sort(([a],[b]) => a.localeCompare(b)).map(([group, matches]) => `
        <div class="fixture-group">
          <div class="fixture-group-title">${group}</div>
          ${matches.map(m => `
            <div class="fixture-card ${m.Status === 'Played' ? 'fixture-played' : ''}">
              <div class="fixture-team home">
                <span>${m.HomeTeam}</span>
                <img class="fixture-flag" src="https://flagcdn.com/w40/${flagCode(m.HomeTeam)}.png" alt="${m.HomeTeam}">
              </div>
              <div class="fixture-score">
                ${m.Status === 'Played'
                  ? `<div class="fixture-result">${m.HomeScore} – ${m.AwayScore}</div>`
                  : `<div class="fixture-vs">VS</div>`}
                <div class="fixture-time">${m.Date}</div>
              </div>
              <div class="fixture-team away">
                <img class="fixture-flag" src="https://flagcdn.com/w40/${flagCode(m.AwayTeam)}.png" alt="${m.AwayTeam}">
                <span>${m.AwayTeam}</span>
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
  /* Verify PIN via Apps Script */
  try {
    const res = await fetch(`${SHEET_API}?action=verifyPin&pin=${pin}&callback=x`, {mode:'no-cors'});
    /* no-cors means we can't read the response — so just accept the PIN and let
       the server reject individual saveResult calls if PIN is wrong */
    adminPin = pin;
    loadAdminPanel();
  } catch(e) {
    /* If Apps Script completely unreachable, still allow entry — server will reject bad PINs */
    adminPin = pin;
    loadAdminPanel();
  }
}

async function loadAdminPanel() {
  document.getElementById('admin-content').innerHTML =
    `<p style="color:var(--text-muted)">Loading matches…</p>`;

  try {
    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTz224Prn4SdoE-52id9MEMgUkgUuCE1_Rrz6rq7TeQLLPCKAH2ev1pOnVK0kOPuwG7eGVWQOECnW3S/pub?gid=0&single=true&output=csv';
    const res = await fetch(CSV_URL);
    const csv = await res.text();
    const results = parseCSV(csv);
    const upcoming = results.filter(r => r.Status !== 'Played');
    const played   = results.filter(r => r.Status === 'Played');

    document.getElementById('admin-content').innerHTML = `
      <div class="admin-header">
        <p style="color:var(--text-muted);margin-bottom:24px">
          ✅ ${played.length} results entered &nbsp;·&nbsp; ⏳ ${upcoming.length} remaining
        </p>
      </div>

      <h2 class="section-title" style="margin-bottom:16px">Enter <span>Results</span></h2>
      ${upcoming.length === 0 ? '<p style="color:var(--text-muted)">All results entered!</p>' : ''}
      ${upcoming.map(m => `
        <div class="admin-match-card" id="match-${m.MatchID}">
          <div class="admin-match-teams">
            <img src="https://flagcdn.com/w40/${flagCode(m.HomeTeam)}.png" class="fixture-flag" alt="">
            <span class="admin-team-name">${m.HomeTeam}</span>
            <input type="number" min="0" max="20" class="score-input" id="home-${m.MatchID}" placeholder="0">
            <span class="admin-vs">–</span>
            <input type="number" min="0" max="20" class="score-input" id="away-${m.MatchID}" placeholder="0">
            <span class="admin-team-name">${m.AwayTeam}</span>
            <img src="https://flagcdn.com/w40/${flagCode(m.AwayTeam)}.png" class="fixture-flag" alt="">
          </div>
          <div class="admin-match-meta">${m.Group} · ${m.Date}</div>
          <button class="admin-save-btn" onclick="saveResult(${m.MatchID})">Save Result</button>
          <span class="admin-saved" id="saved-${m.MatchID}" style="display:none">✅ Saved!</span>
        </div>`).join('')}

      ${played.length > 0 ? `
      <h2 class="section-title" style="margin-top:40px;margin-bottom:16px">Entered <span>Results</span></h2>
      ${played.map(m => `
        <div class="admin-match-card admin-match-played">
          <div class="admin-match-teams">
            <img src="https://flagcdn.com/w40/${flagCode(m.HomeTeam)}.png" class="fixture-flag" alt="">
            <span class="admin-team-name">${m.HomeTeam}</span>
            <span class="admin-score-display">${m.HomeScore} – ${m.AwayScore}</span>
            <span class="admin-team-name">${m.AwayTeam}</span>
            <img src="https://flagcdn.com/w40/${flagCode(m.AwayTeam)}.png" class="fixture-flag" alt="">
          </div>
          <div class="admin-match-meta">${m.Group} · ${m.Date}</div>
        </div>`).join('')}` : ''}`;

  } catch(e) {
    document.getElementById('admin-content').innerHTML =
      `<p style="color:var(--text-muted)">Could not load matches.</p>`;
  }
}

async function saveResult(matchId) {
  const homeScore = document.getElementById(`home-${matchId}`).value;
  const awayScore = document.getElementById(`away-${matchId}`).value;

  if (homeScore === '' || awayScore === '') {
    alert('Please enter both scores before saving.');
    return;
  }

  const btn = document.querySelector(`#match-${matchId} .admin-save-btn`);
  btn.textContent = 'Saving…';
  btn.disabled = true;

  try {
    await fetch(`${SHEET_API}?action=saveResult&pin=${adminPin}&matchId=${matchId}&homeScore=${parseInt(homeScore)}&awayScore=${parseInt(awayScore)}`, {mode:'no-cors'});
    /* no-cors means we can't read response but request goes through */
    document.getElementById(`saved-${matchId}`).style.display = 'inline';
    btn.style.display = 'none';
    document.getElementById(`match-${matchId}`).style.opacity = '0.6';
  } catch(e) {
    alert('Could not connect to server.');
    btn.textContent = 'Save Result';
    btn.disabled = false;
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
    if (params.has('about'))         { renderAbout();                        }
    else if (params.has('fixtures')) { renderFixtures();                     }
    else if (params.has('groups'))   { await renderGroups();                 }
    else if (params.has('results'))  { await renderResults();                }
    else if (params.has('admin'))    { await renderAdmin();                  }
    else if (params.get('team'))     { await renderTeam(params.get('team')); }
    else if (params.has('teams'))    { await renderList();                   }
    else                             { renderHome();                         }
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
      (page === 'home'     && !params.has('teams') && !params.has('fixtures') && !params.has('groups') && !params.has('about') && !params.has('results') && !params.get('team')) ||
      (page === 'teams'    && (params.has('teams') || params.get('team'))) ||
      (page === 'fixtures' && params.has('fixtures')) ||
      (page === 'groups'   && params.has('groups')) ||
      (page === 'results'  && params.has('results')) ||
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
