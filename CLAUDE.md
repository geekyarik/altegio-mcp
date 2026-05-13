# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build      # Compile TypeScript with esbuild → dist/index.js
npm run typecheck  # Type-check without emitting (tsc --noEmit)
npm start          # Run the built server (dist/index.js)
```

There are no tests. There is no lint script.

## Architecture

This is a **Model Context Protocol (MCP) server** that wraps the [Altegio B2B API v1](https://api.alteg.io/api/v1). It runs over stdio and is consumed by MCP clients such as Claude Desktop.

### Entry point and tool registration

`src/index.ts` is the entry point. It:
1. Calls `authenticate()` at startup to obtain a `user_token`.
2. Creates an `McpServer` instance from `@modelcontextprotocol/sdk`.
3. Calls each `register*Tools(server)` function from `src/tools/`.
4. Connects the server to a `StdioServerTransport`.

### Authentication (`src/auth.ts`)

Two-layer auth:
- **Partner token** — static env var `PARTNER_TOKEN`, sent as `Bearer <token>` in every request.
- **User token** — obtained at startup via `POST /api/v1/auth` using `USER_LOGIN` / `USER_PASSWORD`. Stored in module-level state. Auto-refreshed on 401 responses by an axios response interceptor in `src/api-client.ts`.

The combined Authorization header format is: `Bearer <PARTNER_TOKEN>, User <user_token>`.

### API client (`src/api-client.ts`)

A singleton axios instance with `baseURL = https://api.alteg.io/api/v1`. Two interceptors:
- **Request**: injects the dual Authorization header.
- **Response**: re-authenticates and retries on 401.

### Tool modules (`src/tools/`)

Each file exports a single `register*Tools(server: McpServer)` function. Inside, tools are registered with `server.tool(name, description, zodSchema, handler)`. The pattern is uniform across all modules:
- `location_id` defaults to `process.env.LOCATION_ID` and is extracted from params before the remainder is forwarded to the API.
- Errors are caught and returned as `{ content: [{ type: 'text', text: 'Error: ...' }], isError: true }`.

### Adding a new tool

1. Add `server.tool(...)` inside the relevant `src/tools/*.ts` file, following the existing pattern.
2. If creating a new domain file, export a `register*Tools` function and import + call it in `src/index.ts`.

### Build

`build.js` uses **esbuild** to bundle everything into a single `dist/index.js` (CJS, Node 20 target) with a sourcemap. No dependencies are marked external, so the bundle is self-contained.

### Environment variables

| Variable | Purpose |
|---|---|
| `PARTNER_TOKEN` | Altegio partner API token |
| `PARTNER_ID` | Partner ID (available but not used in requests) |
| `USER_LOGIN` | Phone number used for user authentication |
| `USER_PASSWORD` | Password for user authentication |
| `LOCATION_ID` | Default location/company ID used as fallback in tool params |
