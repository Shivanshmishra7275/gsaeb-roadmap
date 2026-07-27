const EXAM_COMPRESSION_PROTOCOL = [
  "Do 1 coding problem (20–30 min): arrays/strings, SQL, or API debug.",
  "Read or write 1 short engineering note (10 min): architecture, tradeoff, or bug postmortem.",
  "Ship 1 tiny GitHub proof-of-work commit (10–20 min).",
  "On weekends, run one 60-minute recovery block to catch up backlog."
];

const RESOURCES = [
  { name: "FastAPI Docs", url: "https://fastapi.tiangolo.com/" },
  { name: "PostgreSQL Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" },
  { name: "SQLBolt", url: "https://sqlbolt.com/" },
  { name: "Docker Docs", url: "https://docs.docker.com/" },
  { name: "GitHub Actions Docs", url: "https://docs.github.com/actions" },
  { name: "Roadmap.sh Backend", url: "https://roadmap.sh/backend" },
  { name: "OpenAI API Docs", url: "https://platform.openai.com/docs/overview" },
  { name: "LangChain Concepts", url: "https://python.langchain.com/docs/concepts/" },
  { name: "NeetCode DSA Patterns", url: "https://neetcode.io/practice" }
];

const WEEKLY_ROADMAP = [
  { title: "Python Core + Tooling", goal: "Write clean Python and use venv, pip, lint, format." },
  { title: "FastAPI Foundations", goal: "Build CRUD API with routing, schemas, validation." },
  { title: "SQL + PostgreSQL Basics", goal: "Design tables, joins, indexes, constraints." },
  { title: "Auth + Security Basics", goal: "JWT auth, hashing, environment configuration." },
  { title: "Testing + Debugging", goal: "Unit/integration tests and robust error handling." },
  { title: "Git/GitHub Workflow", goal: "Branching, PR hygiene, issue-driven development." },
  { title: "Dockerization", goal: "Containerize app with PostgreSQL and local compose setup." },
  { title: "CI + Quality Gates", goal: "Run tests/lint on PR using GitHub Actions." },
  { title: "Deployment Fundamentals", goal: "Deploy API and connect managed PostgreSQL." },
  { title: "Observability Basics", goal: "Logging, metrics mindset, uptime checks." },
  { title: "LLM API Integration", goal: "Add AI-assisted endpoint with guardrails." },
  { title: "Prompt Engineering + Evaluation", goal: "Prompt templates, eval set, failure tracking." },
  { title: "RAG Basics", goal: "Ingestion, embeddings, retrieval, answer synthesis." },
  { title: "System Design for Freshers", goal: "Explain architecture, scale and tradeoffs." },
  { title: "Interview Sprint", goal: "Targeted DSA + backend interview narratives." },
  { title: "Portfolio + Application Sprint", goal: "Finalize projects, outreach, and mock interviews." }
];

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const NORMAL_TEMPLATE = [
  ["Core topic study (60m)", "Hands-on implementation (90m)", "Notes + commit (30m)"],
  ["Feature build (120m)", "1 SQL/DSA problem (30m)", "Refactor/readme update (20m)"],
  ["Revision (45m)", "Mini project increment (120m)", "Test/debug (30m)"],
  ["Deep work block: project feature (150m)", "Engineering explanation note (20m)"],
  ["Interview prep (60m)", "Project polish + commit (90m)", "Resource review (20m)"],
  ["Weekly capstone task (180m)", "Push demo/screenshots (20m)"],
  ["Light review + plan next week (45m)", "Backlog cleanup (30m)"]
];

const BUSY_TEMPLATE = [
  ["Core concept recap (20m)", "Focused implementation (45m)", "Commit + note (10m)"],
  ["Feature slice (50m)", "1 SQL/DSA pattern (20m)"],
  ["Revision (20m)", "Bug fix or test (40m)", "Commit (10m)"],
  ["Single deep task (60m)", "Tradeoff note (10m)"],
  ["Interview prep (30m)", "Project polish (40m)"],
  ["Weekly mini-capstone (70m)", "Push evidence (10m)"],
  ["Review and reset (30m)", "Plan next 3 days (15m)"]
];

const WEEKS = WEEKLY_ROADMAP.map((week, idx) => ({
  week: idx + 1,
  title: week.title,
  goal: week.goal,
  normal: NORMAL_TEMPLATE.map((d) => d.map((x) => `${x} — ${week.title}`)),
  busy: BUSY_TEMPLATE.map((d) => d.map((x) => `${x} — ${week.title}`)),
  continuityTask: `Minimum continuity: one focused task + one commit related to ${week.title}.`
}));
