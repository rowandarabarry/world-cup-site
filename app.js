const byId = (id) => document.getElementById(id);
document.getElementById("year").textContent = new Date().getFullYear();

const qs = new URLSearchParams(location.search);
const teamCode = qs.get("team");
const showAbout = qs.get("about");

async function loadTeams() {
  const res = await fetch("teams.json");
  if (!res.ok) throw new Error("Failed to load teams.json");
  return res.json();
}

function renderList(teams) {
  const app = byId("app");
  app.innerHTML = `
    <input class="search" placeholder="Search teams..." aria-label="Search teams" />
    <div class="grid"></div>
  `;
  const search = app.querySelector(".search");
  const grid = app.querySelector(".grid");

  function draw(filter = "") {
    const q = filter.trim().toLowerCase();
    grid.innerHTML = teams
      .filter(t => !q || t.name.toLowerCase().includes(q) || t.group.toLowerCase().includes(q))
      .map(t => `
        <article class="card">
          <a href="?team=${encodeURIComponent(t.code)}" aria-label="Open ${t.name}">
            <h3><img class="flag" src="${t.flag}" alt="${t.name} flag"> ${t.name}</h3>
            <p><span class="tag">Group ${t.group}</span></p>
            <p>${t.blurb}</p>
          </a>
        </article>
      `).join("");
  }

  search.addEventListener("input", (e) => draw(e.target.value));
  draw();
}

function renderTeam(team, teams) {
  const app = byId("app");
  app.innerHTML = `
    <a class="back" href="./">← All teams</a>
    <article class="card">
      <h2><img class="flag" src="${team.flag}" alt="${team.name} flag"> ${team.name}</h2>
      <p><span class="tag">Group ${team.group}</span></p>
      <p>${team.description || team.blurb}</p>
      ${team.players?.length ? `
        <h3>Key Players</h3>
        <ul>${team.players.map(p => `<li>${p}</li>`).join("")}</ul>` : ``}
      ${team.links?.length ? `
        <h3>Official Links</h3>
        <ul>${team.links.map(l => `<li><a target="_blank" rel="noopener" href="${l.url}">${l.label}</a></li>`).join("")}</ul>` : ``}
    </article>
    <h3>More teams</h3>
    <div class="grid">
      ${teams.filter(t => t.code !== team.code).slice(0, 6).map(t => `
        <article class="card">
          <a href="?team=${encodeURIComponent(t.code)}">
            <h4><img class="flag" src="${t.flag}" alt="${t.name} flag"> ${t.name}</h4>
            <p><span class="tag">Group ${t.group}</span></p>
          </a>
        </article>
      `).join("")}
    </div>
  `;
}

function renderAbout() {
  const app = byId("app");
  app.innerHTML = `
    <a class="back" href="./">← Back</a>
    <article class="card">
      <h2>About this site</h2>
      <p>Made at home, for fun, to learn web basics. No trackers, no cookies, just HTML/CSS/JS.</p>
      <p>Want to add a team? Edit <code>teams.json</code> and push changes to GitHub.</p>
    </article>
  `;
}

(async function init() {
  try {
    const teams = await loadTeams();
    if (showAbout) return renderAbout();
    if (teamCode) {
      const team = teams.find(t => t.code.toLowerCase() === teamCode.toLowerCase());
      if (team) return renderTeam(team, teams);
    }
    renderList(teams);
  } catch (e) {
    byId("app").innerHTML = `<p>Oops: ${e.message}</p>`;
  }
})();

/* ---- Header tab activation + scroll shadow ---- */
(function () {
  const params = new URLSearchParams(location.search);
  const tabs = document.querySelectorAll('.tabs .tab');

  function applyActive() {
    const isAbout = params.has('about');
    const isFixtures = params.has('fixtures');
    const isTeam = params.has('team');

    tabs.forEach(t => t.classList.remove('active'));
    // Order matches the header: Home, Teams, Fixtures, About
    if (isAbout) tabs[3].classList.add('active');
    else if (isFixtures) tabs[2].classList.add('active');
    else if (isTeam) tabs[1].classList.add('active');     // Teams when viewing a team
    else tabs[0].classList.add('active');                 // Home
  }

  applyActive();

  // Update on history changes (if you add navigation without reload later)
  window.addEventListener('popstate', applyActive);

  // Scroll shadow
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    header.style.boxShadow = window.scrollY > 6 ? '0 6px 24px rgba(0,0,0,0.06)' : 'none';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
