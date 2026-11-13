# over-engineered-crud

Auth + Tasks CRUD in TypeScript built with Clean Architecture. The same controllers are served by two drivers: a REST API (Express) and an MCP server (stdio and Streamable HTTP).

## Commands

- `npm run test:commit` — all tests once (unit + integration on in-memory SQLite). Run before saying work is done.
- `npm run typecheck` / `npm run lint` / `npm run format` (eslint --fix)
- `npm run dev` — API with reload (needs Postgres: `docker compose up app_db -d` and a `.env` from `.env.example`)
- `npm run mcp:stdio` — MCP over stdio (needs `MCP_ACCESS_TOKEN`; get one with `npm run mcp:token -- --email <e> --password <p>`)
- `npm run mcp:inspect` — MCP Inspector against the stdio server

## Layers and the dependency rule

Imports only point inward: `main → presentation → application → domain`, with `infra` implementing contracts from `application`/`domain`.

- `src/domain` — entities, usecase **types** (`Usecase<Input, Output>` + namespace with `Input`/`Output`), errors, mocks. No libraries.
- `src/application` — usecase implementations (`*-usecase-impl.ts`) and the ports they need (`contracts/repositories`, `contracts/cryptography`). One small interface per capability (`TaskFinderByIdRepository`, `TaskRemoverRepository`, …), not a fat repository.
- `src/infra` — TypeORM entities/migrations/repositories, zod schemas (`libs/zod`), bcrypt, jwt, validator.
- `src/presentation` — controllers, `AuthMiddleware`, error-handling decorator, reply helpers. Knows nothing about Express or MCP.
- `src/main` — composition root: factories, configs, and **adapters** (`express-controller-adapter`, `express-middleware-adapter`, `mcp-tool-adapter`). `main/mcp/tools.ts` is the MCP tool catalog.

## Conventions

- Always use the `@/` alias; relative imports are lint errors (only exception: `../boot` in entrypoints).
- Every usecase gets a factory in `main/factories` and is wired with `new` there — no DI container.
- Controllers validate `requestInput(request)` (query + body + params, params win), then spread `requireAuth(request)` **last** so input can never override `userId`.
- Errors: throw `DomainError` (422), `NotFoundError` (404) or `UnauthorizedError` (401) from usecases; the decorator maps them. Unknown errors become a generic 500.
- Never return `User` directly; map with `toPublicUser`.
- Tests: vitest + faker, `makeSut()` factory, mocks live in `<layer>/mocks`. Integration specs are `*.integration.spec.ts`.
- TypeORM columns need an explicit `type` (vitest does not emit decorator metadata). Schema changes need a new migration that works on Postgres and SQLite (see `migrations/helpers.ts`) and must be registered in `infra/libs/typeorm/config.ts`.
- Commits follow Conventional Commits (commitlint). The pre-commit hook runs the test suite.

## Adding a feature

Use the `new-usecase` skill (`.claude/skills/new-usecase`). A feature is only done when it is reachable both via an HTTP route and an MCP tool, with tests.
