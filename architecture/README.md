# Architecture — NestJS + DDD + Clean Architecture

Four independent projects demonstrating different backend architecture patterns, all following Clean Architecture with DDD layered structure.

## Layer Structure (shared by all projects)

```
src/
├── domain/            # Pure TypeScript — entities, value objects, repository ports
├── application/       # Use cases / CQRS command & query handlers, DTOs
├── interfaces/        # Controllers, HTTP request DTOs (driving adapters)
└── infrastructure/    # Prisma, repository implementations, external clients (driven adapters)
```

**Dependency rule**: dependencies point inward only. `domain/` depends on nothing. `infrastructure/` implements interfaces defined in `domain/`.

## Projects

| Project | Architecture | CQRS | Domain | Communication |
|---------|-------------|:----:|--------|---------------|
| `monolith/` | Single process, direct DI | No | User | Direct function call |
| `modular-monolith/` | Single process, event-bus | Yes | Order + User | EventBus (pub/sub) |
| `distributed/` | Multi-process, master + workers | No | Task | HTTP (fetch) |
| `microservice/` | Independent services | Yes | Order + User | TCP (ClientProxy) |

## Prerequisites

- Node.js >= 20
- Docker (for PostgreSQL)
- PostgreSQL running via `docker compose up -d`

## Quick Start

```bash
# 1. Start PostgreSQL
cd architecture
docker compose up -d

# 2. Install dependencies
npm install

# 3. Generate Prisma client + run migrations (per project)
npx prisma generate --schema monolith/prisma/schema.prisma
npx prisma migrate dev --schema monolith/prisma/schema.prisma --name init

# 4. Run a project
npm start -w monolith
npm start -w modular-monolith
npm start -w distributed
npm start -w microservice
```

## Environment

Copy `.env.example` to `.env` and ensure PostgreSQL is running:

```
DATABASE_URL=postgresql://tutorial:tutorial@localhost:5432/architecture?schema=public
```