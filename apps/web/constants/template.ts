export interface StarterTemplate {
  id: string
  title: string
  description: string
  tags: string[]
  category: "All" | "Frontend" | "Fullstack" | "Backend & AI"
  iconName: "Box" | "Component" | "TerminalSquare" | "Bot" | "Code2" | "Layers"
  color: string
}

export const WORKSPACE_TEMPLATES: StarterTemplate[] = [
  {
    id: "NEXTJS",
    title: "Next.js 14",
    description: "App Router, Tailwind CSS, TypeScript, fast compilation.",
    tags: ["v14.2", "Node 20", "Fullstack"],
    category: "Fullstack",
    iconName: "Box",
    color: "from-sky-500/20 to-blue-500/20 text-sky-400",
  },
  {
    id: "REACT",
    title: "React + Vite",
    description: "Lightning-fast HMR, Tailwind, SWC compiler & Vitest.",
    tags: ["Vite 5", "React 18", "SPA"],
    category: "Frontend",
    iconName: "Component",
    color: "from-cyan-500/20 to-teal-500/20 text-cyan-400",
  },
  {
    id: "NODE",
    title: "Node.js + Express",
    description: "REST API boilerplate, TypeScript 5, Prisma ORM ready.",
    tags: ["Express 4.x", "Prisma", "REST"],
    category: "Backend & AI",
    iconName: "TerminalSquare",
    color: "from-emerald-500/20 to-green-500/20 text-emerald-400",
  },
  {
    id: "PYTHON",
    title: "Python Data Science",
    description: "Jupyter Notebooks, Pandas, NumPy, Scikit-learn runtime.",
    tags: ["JupyterLab", "Python 3.11", "Data"],
    category: "Backend & AI",
    iconName: "Bot",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400",
  },
  {
    id: "FASTAPI",
    title: "FastAPI + Python 3.11",
    description: "Async ASGI, Pydantic v2, Swagger docs & Alembic migrations.",
    tags: ["Python 3.11", "REST", "Async"],
    category: "Backend & AI",
    iconName: "Code2",
    color: "from-teal-500/20 to-emerald-500/20 text-teal-400",
  },
  {
    id: "NESTJS",
    title: "NestJS Architecture",
    description: "Progressive TypeScript enterprise framework with modular DI.",
    tags: ["Node 20", "TypeScript", "Microservices"],
    category: "Backend & AI",
    iconName: "Layers",
    color: "from-rose-500/20 to-pink-500/20 text-rose-400",
  },
]
