---
name: new-usecase
description: Scaffold a new usecase end to end in this repo (domain type, application impl, infra schema/repository, controller, factories, HTTP route, MCP tool and tests). Use when adding any new behavior or endpoint.
---

# New usecase

Work outward from the domain. Copy the closest existing usecase (tasks/_ for authenticated resources, auth/_ otherwise) instead of inventing a new shape.

1. **Domain** — `src/domain/usecases/<area>/<name>-usecase.ts`: `export type XUsecase = Usecase<XUsecase.Input, XUsecase.Output>` plus a namespace with `Input`/`Output`. Authenticated usecases take `Auth & {...}`.
2. **Ports** — if the impl needs persistence or crypto, add one narrow interface per capability in `src/application/contracts/...`.
3. **Application** — `src/application/usecases/<area>/<name>-usecase-impl.ts`, constructor-injected ports only. Throw `NotFoundError`/`UnauthorizedError`/`DomainError`.
4. **Unit test** next to the impl with `makeSut()`; add mocks for new ports in `src/infra/mocks` and new entities in `src/domain/mocks`.
5. **Infra** — implement the port on the TypeORM repository; add a zod schema in `src/infra/libs/zod` with `.describe()` on each field (descriptions become the MCP tool docs). New tables/columns need a migration registered in `infra/libs/typeorm/config.ts`.
6. **Presentation** — controller: validate `requestInput(request)`, spread `requireAuth(request)` last, reply with a helper from `presentation/helpers/http.ts`.
7. **Main** — factories for usecase and controller, then:
   - HTTP: route in `src/main/http/routes.ts` (wrap with `authenticated` when needed).
   - MCP: entry in `src/main/mcp/tools.ts` with `inputSchema: <schema>.shape`, accurate `annotations` (`readOnlyHint`, `destructiveHint`, `idempotentHint`) and a description written for a model.
8. **Integration** — extend `src/main/http/server.integration.spec.ts` and `src/main/mcp/server.integration.spec.ts` (the MCP spec asserts the exact tool list).
9. Run `npm run typecheck && npm run lint && npm run test:commit` and fix everything before reporting done.
