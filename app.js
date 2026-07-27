const STORAGE_KEY = "gsaeb-roadmap-state-v1";

const defaultState = {
  startDate: "",
  mode: "normal",
  completed: {},
  applications: [],
  interview: { solved: 0, revisions: 0, mocks: 0, nextMockDate: "" }
};

const state = loadState();

const startDateEl = document.getElementById("startDate");
const modeEl = document.getElementById("mode");
const todayEl = document.getElementById("today");
const roadmapEl = document.getElementById("roadmap");
const resourcesEl = document.getElementById("resources");
const kpiEl = document.getElementById("kpi");
const applicationsEl = document.getElementById("applications");
const interviewEl = document.getElementById("interview");

init();

function init() {
  bindTabs();
  startDateEl.value = state.startDate;
  modeEl.value = state.mode;
  startDateEl.addEventListener("change", () => updateState({ startDate: startDateEl.value }));
  modeEl.addEventListener("change", () => updateState({ mode: modeEl.value }));
  renderAll();
}

function bindTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.target).classList.add("active");
    });
  });
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      ...defaultState,
      ...parsed,
      interview: { ...defaultState.interview, ...(parsed.interview || {}) },
      applications: Array.isArray(parsed.applications) ? parsed.applications : []
    };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updateState(patch) {
  Object.assign(state, patch);
  saveState();
  renderAll();
}

function renderAll() {
  renderToday();
  renderRoadmap();
  renderResources();
  renderKpi();
  renderApplications();
  renderInterview();
}

function getCurrentPointer() {
  if (!state.startDate) return null;
  const start = new Date(state.startDate + "T00:00:00");
  const now = new Date();
  const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return null;
  return {
    week: Math.floor(diffDays / 7) + 1,
    day: diffDays % 7
  };
}

function taskId(week, day, idx) {
  return `${state.mode}-${week}-${day}-${idx}`;
}

function renderToday() {
  const pointer = getCurrentPointer();
  if (!pointer) {
    todayEl.innerHTML = `
      <h2>Today</h2>
      <p class="meta">Set your start date to unlock daily roadmap tasks.</p>
      <p class="pill">Exam Compression Protocol</p>
      <ul class="task-list">${EXAM_COMPRESSION_PROTOCOL.map((t) => `<li>${t}</li>`).join("")}</ul>
    `;
    return;
  }

  if (pointer.week > WEEKS.length) {
    todayEl.innerHTML = `<h2>Today</h2><p class="ok">You completed the 16-week cycle. Restart with a new start date and raise targets.</p>`;
    return;
  }

  const week = WEEKS[pointer.week - 1];
  const tasks = week[state.mode][pointer.day];
  todayEl.innerHTML = `
    <h2>Today</h2>
    <p class="pill">Week ${week.week} • ${DAY_NAMES[pointer.day]} • ${state.mode === "normal" ? "Normal" : "Busy"} mode</p>
    <p><strong>${week.title}</strong></p>
    <p class="meta">${week.goal}</p>
    <ul class="task-list">
      ${tasks
        .map((task, idx) => {
          const id = taskId(week.week, pointer.day, idx);
          const done = !!state.completed[id];
          return `<li class="task-item ${done ? "done" : ""}">
            <input type="checkbox" data-taskid="${id}" ${done ? "checked" : ""} />
            <span>${task}</span>
          </li>`;
        })
        .join("")}
    </ul>
    <p class="meta"><strong>Exam continuity:</strong> ${week.continuityTask}</p>
  `;

  todayEl.querySelectorAll("input[type=checkbox]").forEach((box) => {
    box.addEventListener("change", () => {
      state.completed[box.dataset.taskid] = box.checked;
      saveState();
      renderAll();
    });
  });
}

function renderRoadmap() {
  roadmapEl.innerHTML = `<h2>Week-by-week roadmap</h2>${WEEKS.map(renderWeekCard).join("")}`;
  roadmapEl.querySelectorAll(".week-title").forEach((btn) => {
    btn.addEventListener("click", () => {
      const body = roadmapEl.querySelector(`#week-body-${btn.dataset.week}`);
      body.classList.toggle("open");
    });
  });
}

function renderWeekCard(week) {
  const modeTasks = week[state.mode]
    .map((d, i) => `<li><strong>${DAY_NAMES[i]}:</strong> ${d.join(" • ")}</li>`)
    .join("");
  return `
    <article class="week-card">
      <button class="week-title" data-week="${week.week}">Week ${week.week}: ${week.title}</button>
      <div class="week-body" id="week-body-${week.week}">
        <p class="meta">${week.goal}</p>
        <ul>${modeTasks}</ul>
        <p class="meta"><strong>Exam continuity:</strong> ${week.continuityTask}</p>
      </div>
    </article>
  `;
}

function renderResources() {
  resourcesEl.innerHTML = `
    <h2>Resource links</h2>
    <ul class="list">
      ${RESOURCES.map((r) => `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.name}</a></li>`).join("")}
    </ul>
  `;
}

function renderKpi() {
  const total = WEEKS.reduce((sum, week) => sum + week[state.mode].reduce((dSum, d) => dSum + d.length, 0), 0);
  const completedCount = Object.keys(state.completed).filter((k) => k.startsWith(state.mode) && state.completed[k]).length;
  const completionRate = total ? Math.round((completedCount / total) * 100) : 0;
  const applied = state.applications.length;
  const interviewed = state.applications.filter((a) => a.status === "Interview").length;
  kpiEl.innerHTML = `
    <h2>KPI Dashboard</h2>
    <div class="kpi-grid">
      <div class="kpi"><span>Task completion</span><strong>${completionRate}%</strong></div>
      <div class="kpi"><span>Tasks done</span><strong>${completedCount}/${total}</strong></div>
      <div class="kpi"><span>Applications sent</span><strong>${applied}</strong></div>
      <div class="kpi"><span>Interview calls</span><strong>${interviewed}</strong></div>
      <div class="kpi"><span>DSA solved</span><strong>${state.interview.solved}</strong></div>
      <div class="kpi"><span>Mocks completed</span><strong>${state.interview.mocks}</strong></div>
    </div>
  `;
}

function renderApplications() {
  applicationsEl.innerHTML = `
    <h2>Internship application tracker</h2>
    <form id="appForm" class="tracker-form">
      <input name="company" placeholder="Company" required />
      <input name="role" placeholder="Role" required />
      <div class="inline">
        <input name="date" type="date" required />
        <select name="status">
          <option>Applied</option>
          <option>OA</option>
          <option>Interview</option>
          <option>Rejected</option>
          <option>Offer</option>
        </select>
      </div>
      <button type="submit">Add application</button>
    </form>
    <ul class="list">
      ${state.applications
        .map(
          (a, i) => `<li><span><strong>${a.company}</strong> • ${a.role}<br><span class="meta">${a.date} • ${a.status}</span></span>
            <button class="danger" data-remove-app="${i}">Delete</button></li>`
        )
        .join("")}
    </ul>
  `;

  const appForm = document.getElementById("appForm");
  appForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData(appForm);
    state.applications.unshift({
      company: form.get("company"),
      role: form.get("role"),
      date: form.get("date"),
      status: form.get("status")
    });
    saveState();
    renderAll();
  });

  applicationsEl.querySelectorAll("[data-remove-app]").forEach((button) => {
    button.addEventListener("click", () => {
      state.applications.splice(Number(button.dataset.removeApp), 1);
      saveState();
      renderAll();
    });
  });
}

function renderInterview() {
  interviewEl.innerHTML = `
    <h2>Interview prep tracker</h2>
    <form id="interviewForm" class="tracker-form">
      <div class="inline">
        <label>DSA solved<input name="solved" type="number" min="0" value="${state.interview.solved}" /></label>
        <label>Revisions<input name="revisions" type="number" min="0" value="${state.interview.revisions}" /></label>
      </div>
      <div class="inline">
        <label>Mocks done<input name="mocks" type="number" min="0" value="${state.interview.mocks}" /></label>
        <label>Next mock date<input name="nextMockDate" type="date" value="${state.interview.nextMockDate}" /></label>
      </div>
      <button type="submit">Save prep tracker</button>
    </form>
    <p class="meta">Target: 2 mock interviews/week in Weeks 14–16.</p>
  `;

  document.getElementById("interviewForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    state.interview = {
      solved: Number(form.get("solved") || 0),
      revisions: Number(form.get("revisions") || 0),
      mocks: Number(form.get("mocks") || 0),
      nextMockDate: form.get("nextMockDate") || ""
    };
    saveState();
    renderAll();
  });
}
