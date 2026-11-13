# CollabCode

CollabCode is a full-stack, cloud-based collaborative IDE engineered for real-time multiplayer coding, workspace management, and sandboxed execution directly within the browser.

Designed as a modern development environment, CollabCode enables teams and individual developers to spin up isolated workspaces, collaborate concurrently with live cursor tracking, manage project file trees, and interact with terminal runners without local environment setup.

---

## Key Capabilities & Architecture

### 1. In-Browser Monaco IDE Experience

- **VS Code Core:** Built on Monaco Editor, providing out-of-the-box syntax highlighting, autocompletion, multi-cursor support, and keybindings.
- **Dynamic Tab Management:** Multi-file tab switching with active dirty state indicators and file-type icons.
- **Breadcrumb Navigation:** Real-time path breadcrumbs (`workspace > src > components > ...`) with direct segment navigation.
- **Configurable Layouts:** Collapsible sidebars, bottom execution drawers, and side panels for workspace navigation and search.

### 2. Real-Time Collaboration & Presence

- **Multiplayer State Sync:** WebSocket-driven communication layer handling live document updates and state broadcasts.
- **Peer Presence:** Live collaborator avatars, active tab tracking, and peer cursor positions inside the editor buffer.
- **Workspace Access Control:** Role-based access control (Owner, Editor, Viewer) with invitation links and permission management.

### 3. File System & Workspace Management

- **Hierarchical File Tree:** Interactive explorer supporting nested folders, inline file/folder creation, renaming, and deletions.
- **Workspace Isolation:** Every workspace operates with its own isolated directory structure and metadata tracking.
- **Fast File Search:** Search by filename and search inside workspace files with direct line-highlight navigation.

### 4. Sandboxed Code Execution & Terminals

- **Containerized Runners:** Docker-backed container environments providing secure execution isolation per workspace.
- **Integrated Terminal:** Interactive shell access connected directly to the workspace container to run commands, install packages, and execute scripts.

---

## Tech Stack & Architecture

### Monorepo Structure

The project is organized as an npm / Turborepo monorepo:

```text
collabcode/
├── apps/
│   ├── web/                    # Next.js (App Router) frontend application
│   │   ├── app/                # Route definitions & IDE views
│   │   ├── components/         # Atomic UI components, Monaco wrappers & sidebars
│   │   ├── store/              # Zustand stores (IDE layout, sockets, explorer state)
│   │   └── queries/            # TanStack Query hooks for asynchronous APIs
│   │
│   └── server/                 # NestJS modular backend application
│       ├── src/
│       │   ├── auth/           # Authentication & session verification
│       │   ├── workspace/      # Workspace lifecycle & permissions
│       │   ├── file-explorer/  # File tree CRUD & directory disk operations
│       │   ├── file-search/    # Workspace text search endpoints
│       │   ├── socket/         # WebSocket gateways for real-time collaboration
│       │   └── docker/         # Container runner management
│       └── prisma/             # PostgreSQL schema and migration files
│
├── packages/
│   ├── ui/                     # Shared UI components built with Tailwind CSS & Radix UI
│   ├── types/                  # Shared TypeScript models, DTOs, and socket events
│   ├── eslint-config/          # Shared linting standards
│   └── typescript-config/      # Base TypeScript configurations
│
└── compose.yaml                # Docker Compose services (Redis, etc.)
```

### Core Technologies

- **Frontend:** Next.js (App Router), React 19, Tailwind CSS, Monaco Editor, Zustand, TanStack Query, Radix UI.
- **Backend:** NestJS, WebSockets (`@nestjs/websockets`, Socket.IO), Prisma ORM, PostgreSQL, Redis.
- **Execution & Storage:** Docker Engine API for container runners, local volume mounts for file trees.
- **Monorepo Tooling:** Turborepo, npm workspaces, TypeScript project references.

---

## Getting Started

### Prerequisites

Make sure you have the following tools installed locally:

- **Node.js:** `>= 20.9.0`
- **npm:** `>= 10.x`
- **Docker Desktop / Docker Engine:** Running locally (required for Redis and container runners)
- **PostgreSQL Database:** Running locally or a managed cloud database instance

---

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/collabcode.git
cd collabcode
```

#### 2. Install Dependencies

Install all dependencies across all apps and packages in the monorepo:

```bash
npm install
```

#### 3. Environment Configuration

Copy or create the `.env` files for both frontend and backend services:

**Backend (`apps/server/.env`):**

```env
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/collabcode?schema=public"
REDIS_HOST="localhost"
REDIS_PORT=6379
JWT_SECRET="your-jwt-secret"
```

**Frontend (`apps/web/.env`):**

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:4000"
```

#### 4. Start Infrastructure Services

Start Redis and background support services via Docker Compose:

```bash
docker compose up -d
```

#### 5. Database Setup & Migrations

Run Prisma migrations to generate the database schema and Prisma Client:

```bash
cd apps/server
npx prisma migrate dev
npx prisma generate
cd ../..
```

#### 6. Run Development Servers

Start both the Next.js web application and NestJS backend concurrently:

```bash
npm run dev
```

Once started:

- **Web Client:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:4000](http://localhost:4000)

---

## Useful Commands

| Command                | Scope    | Description                                               |
| :--------------------- | :------- | :-------------------------------------------------------- |
| `npm run dev`          | Monorepo | Runs all applications in hot-reloading development mode   |
| `npm run build`        | Monorepo | Compiles and builds all packages and applications         |
| `npm run lint`         | Monorepo | Runs ESLint checks across the codebase                    |
| `npm run format:check` | Monorepo | Checks file formatting with Prettier                      |
| `npm run format:fix`   | Monorepo | Auto-fixes file formatting issues across all files        |
| `npm run typecheck`    | Monorepo | Runs `tsc --noEmit` to verify type safety across packages |
