const storageKey = "gsaeb-roadmap-v1";

const weeklyThemes = [
  ["Python foundations", "Python, problem-solving basics, clean coding habits"],
  ["Advanced Python", "OOP, error handling, typing, modules, packaging basics"],
  ["SQL foundations", "SELECT/JOIN/GROUP BY, relational modeling, indexing intro"],
  ["PostgreSQL in practice", "Schema design, migrations, transactions, query tuning"],
  ["FastAPI fundamentals", "Routing, validation, dependency injection, docs"],
  ["FastAPI architecture", "Service/repository layering, auth, config management"],
  ["Testing APIs", "Pytest, integration tests, test data strategy"],
  ["Git/GitHub workflow", "Branching, PR hygiene, code reviews, release tagging"],
  ["Docker essentials", "Dockerfiles, compose, local orchestration"],
  ["CI/CD and quality gates", "GitHub Actions, lint/test pipelines, failure analysis"],
  ["Deployment", "Deploy API + DB, env config, secrets handling, rollback checks"],
  ["Observability basics", "Logging, metrics, health checks, alert thinking"],
  ["LLM API integration", "Prompt design, tool calling, reliability patterns"],
  ["RAG basics", "Embeddings, retrieval, chunking, eval basics"],
  ["Targeted DSA sprint", "Arrays/strings/hash/maps/2-pointers/sliding window"],
  ["Interview + portfolio finish", "System explanations, mock interviews, resume proof"],
];

const baseDayPlan = [
  "Concept learning + notes",
  "Guided implementation from resource",
  "Independent coding task",
  "Debugging + refactor day",
  "Mini project increment",
  "DSA/interview communication drills",
  "Review + retrospective + next-week plan",
];

const roadmap = weeklyThemes.map((theme, index) => {
  const resources = [
    { label: "FastAPI docs", url: "https://fastapi.tiangolo.com/" },
    { label: "SQLBolt", url: "https://sqlbolt.com/" },
    { label: "PostgreSQL docs", url: "https://www.postgresql.org/docs/" },
    { label: "GitHub Skills", url: "https://skills.github.com/" },
    { label: "Docker docs", url: "https://docs.docker.com/" },
    { label: "GitHub Actions docs", url: "https://docs.github.com/actions" },
    { label: "OpenAI API docs", url: "https://platform.openai.com/docs" },
    { label: "LangChain docs", url: "https://python.langchain.com/docs/introduction/" },
    { label: "NeetCode roadmap", url: "https://neetcode.io/roadmap" },
  ];
  return {
    week: index + 1,
    title: theme[0],
    outcome: theme[1],
    resources,
    daily: baseDayPlan.map((task, dayIndex) => ({
      day: dayIndex + 1,
      task,
      normal: "3.5h (90m learn + 120m build + 30m review)",
      busy: "90m (30m learn + 50m build + 10m notes)",
      exam: "45m minimum continuity (20m review + 25m focused task)",
    })),
  };
});

const state = loadState();

function loadState() {
  const fallback = {
    startDate: "",
    mode: "normal",
    kpis: { hours: 0, projects: 0, applications: 0, mocks: 0 },
    checklist: [
      { text: "Ship 4 production-ready FastAPI services", done: false },
      { text: "Maintain 16-week GitHub commit consistency", done: false },
      { text: "Solve 180 targeted DSA problems with notes", done: false },
      { text: "Complete 12 mock interviews", done: false },
      { text: "Submit 120 internship applications", done: false },
    ],
    applications: [],
    interviews: [],
  };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function renderToday() {
  const startInput = document.getElementById("startDate");
  const modeInput = document.getElementById("mode");
  const target = document.getElementById("todayCard");
  startInput.value = state.startDate;
  modeInput.value = state.mode;

  if (!state.startDate) {
    target.innerHTML = "<strong>Set a start date</strong><div class='tiny'>We will map current week/day automatically.</div>";
    return;
  }

  const start = new Date(state.startDate + "T00:00:00");
  const now = new Date();
  const dayOffset = Math.max(0, Math.floor((now - start) / 86400000));
  const weekIndex = Math.min(roadmap.length - 1, Math.floor(dayOffset / 7));
  const dayIndex = dayOffset % 7;
  const week = roadmap[weekIndex];
  const day = week.daily[dayIndex];
  target.innerHTML = `
    <strong>Week ${week.week}: ${week.title}</strong>
    <div>${day.task}</div>
    <div class="tiny">${state.mode.toUpperCase()} · ${day[state.mode]}</div>
  `;
}

function renderKpis() {
  ["hours", "projects", "applications", "mocks"].forEach((k) => {
    const id = `kpi${k[0].toUpperCase()}${k.slice(1)}`;
    document.getElementById(id).value = state.kpis[k];
  });
  const score = Math.round(
    (Number(state.kpis.hours) / 20) * 25 +
      (Number(state.kpis.projects) / 4) * 25 +
      (Number(state.kpis.applications) / 30) * 25 +
      (Number(state.kpis.mocks) / 4) * 25,
  );
  document.getElementById("kpiSummary").innerHTML = `<strong>Readiness Score: ${Math.max(0, score)}%</strong>
  <div class='tiny'>Balanced for practical hiring readiness: build + apply + communicate.</div>`;
}

function renderChecklist() {
  const ul = document.getElementById("checklist");
  ul.innerHTML = "";
  state.checklist.forEach((item, index) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.addEventListener("change", () => {
      state.checklist[index].done = checkbox.checked;
      saveState();
      renderKpis();
    });
    li.appendChild(checkbox);
    li.append(` ${item.text}`);
    ul.appendChild(li);
  });
}

function renderTrackers() {
  const applicationList = document.getElementById("applicationList");
  applicationList.innerHTML = state.applications
    .map((a, i) => `<li>${a.date} · ${a.company} · ${a.role} · ${a.status} <button data-app="${i}">Remove</button></li>`)
    .join("");
  const interviewList = document.getElementById("interviewList");
  interviewList.innerHTML = state.interviews
    .map((v, i) => `<li>${v.date} · ${v.topic} · score ${v.score}/10 <button data-int="${i}">Remove</button></li>`)
    .join("");
}

function renderRoadmap() {
  const holder = document.getElementById("roadmap");
  holder.innerHTML = roadmap
    .map(
      (w) => `<article class="week">
      <h3>Week ${w.week}: ${w.title}</h3>
      <div>${w.outcome}</div>
      <ul class="days">
        ${w.daily
          .map(
            (d) =>
              `<li>Day ${d.day}: ${d.task}<div class="tiny">Normal: ${d.normal} | Busy: ${d.busy} | Exam: ${d.exam}</div></li>`,
          )
          .join("")}
      </ul>
      <div class="resources"><strong>Resources:</strong> ${w.resources
        .map((r) => `<a href="${r.url}" target="_blank" rel="noreferrer">${r.label}</a>`)
        .join(" • ")}</div>
    </article>`,
    )
    .join("");
}

function attachEvents() {
  document.getElementById("startDate").addEventListener("change", (e) => {
    state.startDate = e.target.value;
    saveState();
    renderToday();
  });
  document.getElementById("mode").addEventListener("change", (e) => {
    state.mode = e.target.value;
    saveState();
    renderToday();
  });

  ["hours", "projects", "applications", "mocks"].forEach((k) => {
    const id = `kpi${k[0].toUpperCase()}${k.slice(1)}`;
    document.getElementById(id).addEventListener("change", (e) => {
      state.kpis[k] = Number(e.target.value || 0);
      saveState();
      renderKpis();
    });
  });

  document.getElementById("applicationForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    state.applications.unshift({
      company: data.get("company"),
      role: data.get("role"),
      date: data.get("date"),
      status: data.get("status"),
    });
    saveState();
    e.target.reset();
    renderTrackers();
  });

  document.getElementById("interviewForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    state.interviews.unshift({
      topic: data.get("topic"),
      date: data.get("date"),
      score: Number(data.get("score")),
    });
    saveState();
    e.target.reset();
    renderTrackers();
  });

  document.body.addEventListener("click", (e) => {
    const appIndex = e.target.getAttribute("data-app");
    const intIndex = e.target.getAttribute("data-int");
    if (appIndex !== null) {
      state.applications.splice(Number(appIndex), 1);
      saveState();
      renderTrackers();
    }
    if (intIndex !== null) {
      state.interviews.splice(Number(intIndex), 1);
      saveState();
      renderTrackers();
    }
  });
}

attachEvents();
renderToday();
renderKpis();
renderChecklist();
renderTrackers();
renderRoadmap();
