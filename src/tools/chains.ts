import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

export function registerChainsTools(server: McpServer) {
  server.tool('list_chains', 'List all chains (groups of locations)', {}, async () => {
    try {
      const { data } = await client.get('/groups');
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_chain_client_by_phone', 'Get a client in a chain by phone number', {
    chain_id: z.string(),
    phone: z.string(),
  }, async ({ chain_id, phone }) => {
    try {
      const { data } = await client.get(`/group/${chain_id}/clients`, { params: { phone } });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_chain_service_categories', 'List service categories at chain level', {
    chain_id: z.string(),
  }, async ({ chain_id }) => {
    try {
      const { data } = await client.get(`/chain/${chain_id}/service_categories`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
