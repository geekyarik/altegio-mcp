# Altegio MCP Server

Model Context Protocol (MCP) server for the [Altegio](https://altegio.com) CRM platform. Provides full coverage of the Altegio B2B v1 API as MCP tools, enabling AI assistants to manage bookings, clients, staff, services, and more.

## Features

- **Appointments** — create, update, delete, search appointments
- **Clients** — manage clients, comments, loyalty cards, memberships
- **Services & Staff** — manage services, categories, team members, schedules
- **Products & Inventory** — products, categories, goods transactions, inventory
- **Sales & Payments** — financial transactions, payment processing
- **Analytics** — revenue, occupancy, and loyalty statistics
- **Loyalty & Subscriptions** — loyalty programs, cards, membership types
- **Notifications** — message status, notification settings
- **Booking Settings** — online booking widget configuration
- **Fiscalization** — fiscal receipts and transactions
- **Chains** — multi-location chain management
- **Utilities** — timeslot settings, available dates, resources

## Setup

### 1. Clone and install

```bash
git clone https://github.com/ystanislavchuk/altegio-mcp.git
cd altegio-mcp
npm install
```

### 2. Configure credentials

```bash
cp .env.example .env
```

Edit `.env` with your Altegio credentials:

```env
ALTEGIO_PARTNER_TOKEN=your_partner_token
ALTEGIO_PARTNER_ID=your_partner_id
ALTEGIO_USER_LOGIN=+380000000000
ALTEGIO_USER_PASSWORD=your_password
ALTEGIO_LOCATION_ID=your_location_id
# Optional: use a user token directly instead of login/password
ALTEGIO_USER_TOKEN=
```

The partner token is in the Altegio Marketplace Developer Account under Account settings → Account details. If `ALTEGIO_USER_TOKEN` is set, the server skips the `/auth` login call and uses that token.

### 3. Build

```bash
npm run build
```

### 4. Configure your MCP client

Add to your Claude Desktop / MCP client config:

```json
{
  "mcpServers": {
    "altegio": {
      "command": "node",
      "args": ["/path/to/altegio-mcp/dist/index.js"],
      "env": {
        "DOTENV_CONFIG_PATH": "/path/to/altegio-mcp/.env",
        "DOTENV_CONFIG_OVERRIDE": "true"
      }
    }
  }
}
```

## Alternative: Altegio Pro connector (hosted)

A hosted Altegio MCP connector, **Altegio Pro**, is available in claude.ai / Claude Code as a connector (tools appear as `mcp__claude_ai_Altegio_Pro__*`). It needs no partner token or `.env`: it authenticates with the delegated Altegio identity of the signed-in user, so it works even when this server's partner token is rejected.

**Connecting:** enable the Altegio Pro connector in your Claude connector settings and sign in with your Altegio account. In Claude Code it then loads alongside local MCP servers.

**Coverage:**
- Locations, team members and positions, services and categories, work schedules, appointments, resources, location settings
- Client base: segment reports (first/last visit date, lifetime spend, visit count), client cards, visit history, lookup
- Analytics: key metrics, daily series, occupancy, sales per team member, forecasts, day-end report
- A generic read executor (`api_search_operations` → `api_describe_operation` → `api_call_operation`) for any documented GET operation, and a guided onboarding flow

**Access rights:** the connector acts with the signed-in user's rights per location. The `analytics_*` tools require the **Analytics** access right. Without it they fail with "no Analytics access right", and statistics must be derived from `schedules_get` and `appointments_list`.

**Practical notes:**
- Start with `locations_list` (`managed_only: true`) to get the `location_id`.
- `appointments_list` can't filter by team member. Fetch the location with `page_size: 300` and filter by `team_member_id` on the client side.
- `api_call_operation` returns full, unprojected objects and truncates large results (for example only 4 appointments per call), so prefer the curated tools for bulk reads.
- Pages are 1-based. Follow `pagination.next_page` until it is `null`.

| | This server | Altegio Pro connector |
|---|---|---|
| Auth | Partner token + user token/login | Signed-in Altegio user |
| Writes | Full B2B v1 API | Curated tools only (the executor is read-only) |
| Hosting | Local stdio | Remote (hosted connector) |

## Development

```bash
npm run build      # Build with esbuild
npm run typecheck  # TypeScript type check
npm start          # Run the built server
```

## API Reference

This server implements the [Altegio B2B API v1](https://altegio.com/api/). Authentication uses partner token + user credentials and handles token refresh automatically.
