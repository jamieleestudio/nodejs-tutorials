# nodejs-tutorials

This repository is a collection of independent Node.js + TypeScript learning projects.

Each top-level folder is its own project with its own `package.json`, `tsconfig.json`, code, and runnable demos.

## Projects

- `basics/`: TypeScript syntax, variables, control flow, and types
- `core-api/`: Node.js core modules — `fs`, `path`, `http`, `events`, `crypto`
- `async/`: async programming — callbacks, Promises, async/await
- `oop/`: object-oriented programming with TypeScript — classes, inheritance, generics
- `web/`: HTTP servers and web frameworks — raw `http`, Express, REST, middleware
- `database/`: database integration — SQLite/SQL, ORMs
- `auth/`: authentication and authorization — JWT, bcrypt, sessions, OAuth
- `testing/`: testing — Vitest, unit and integration tests
- `architecture/`: architecture patterns — monolith, microservice, distributed
- `docker/`: containerization — Dockerfile, docker-compose
- `ai/`: AI integration — OpenAI SDK, LangChain, [Mastra](./ai/mastra/README.md) (26 modules: agents, tools, workflows, memory, RAG, MCP, evals, patterns)

## Quick Start

Run a project from its own directory:

```bash
cd basics
npm install
npm start
```

Or run from the repository root (npm workspaces):

```bash
npm install
npm start -w basics
npm start -w web
```

## Project Layout

Each module follows the same structure:

```
<module>/
  package.json
  tsconfig.json
  src/
    main.ts        # entry point, aggregates all demos
    <demo>.ts      # individual demo (exports DESCRIPTION + run)
```

Every demo file exports a `DESCRIPTION` constant and a `run()` function. The `main.ts` entry point registers them in a `DEMOS` map and runs each in turn.

## Prerequisites

- Node.js >= 20
- npm >= 10