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

## Development

```bash
npm run build      # Build with esbuild
npm run typecheck  # TypeScript type check
npm start          # Run the built server
```

## API Reference

This server implements the [Altegio B2B API v1](https://altegio.com/api/). Authentication uses partner token + user credentials and handles token refresh automatically.
