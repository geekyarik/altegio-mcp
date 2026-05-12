import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { authenticate } from './auth';
import { registerLocationsTools } from './tools/locations';
import { registerServicesTools } from './tools/services';
import { registerTeamMembersTools } from './tools/team-members';
import { registerClientsTools } from './tools/clients';
import { registerUsersTools } from './tools/users';
import { registerAppointmentsTools } from './tools/appointments';
import { registerEventsTools } from './tools/events';
import { registerScheduleTools } from './tools/schedule';
import { registerProductsTools } from './tools/products';
import { registerInventoryTools } from './tools/inventory';
import { registerSalesTools } from './tools/sales';
import { registerPaymentsTools } from './tools/payments';
import { registerNotificationsTools } from './tools/notifications';
import { registerBookingSettingsTools } from './tools/booking-settings';
import { registerAnalyticsTools } from './tools/analytics';
import { registerTagsTools } from './tools/tags';
import { registerDepositsTools } from './tools/deposits';
import { registerLoyaltyCardsTools } from './tools/loyalty-cards';
import { registerSubscriptionsTools } from './tools/subscriptions';
import { registerLoyaltyProgramsTools } from './tools/loyalty-programs';
import { registerSalaryTools } from './tools/salary';
import { registerCustomFieldsTools } from './tools/custom-fields';
import { registerChainsTools } from './tools/chains';
import { registerChainLoyaltyTools } from './tools/chain-loyalty';
import { registerFiscalizationTools } from './tools/fiscalization';
import { registerUtilitiesTools } from './tools/utilities';

async function main() {
  await authenticate();
  console.error('Authenticated successfully');

  const server = new McpServer({
    name: 'altegio-mcp',
    version: '1.0.0',
  });

  registerLocationsTools(server);
  registerServicesTools(server);
  registerTeamMembersTools(server);
  registerClientsTools(server);
  registerUsersTools(server);
  registerAppointmentsTools(server);
  registerEventsTools(server);
  registerScheduleTools(server);
  registerProductsTools(server);
  registerInventoryTools(server);
  registerSalesTools(server);
  registerPaymentsTools(server);
  registerNotificationsTools(server);
  registerBookingSettingsTools(server);
  registerAnalyticsTools(server);
  registerTagsTools(server);
  registerDepositsTools(server);
  registerLoyaltyCardsTools(server);
  registerSubscriptionsTools(server);
  registerLoyaltyProgramsTools(server);
  registerSalaryTools(server);
  registerCustomFieldsTools(server);
  registerChainsTools(server);
  registerChainLoyaltyTools(server);
  registerFiscalizationTools(server);
  registerUtilitiesTools(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Altegio MCP server running on stdio');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
