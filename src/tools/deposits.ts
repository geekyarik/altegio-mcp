import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.ALTEGIO_LOCATION_ID ?? '';

export function registerDepositsTools(server: McpServer) {
  server.tool('list_client_accounts', 'List deposit accounts for a client at a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    client_id: z.string(),
  }, async ({ location_id, client_id }) => {
    try {
      const { data } = await client.get(`/deposits/company/${location_id}/client/${client_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_chain_accounts', 'List deposit accounts for a chain', {
    chain_id: z.string(),
  }, async ({ chain_id }) => {
    try {
      const { data } = await client.get(`/deposits/chain/${chain_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_account_by_phone', 'Get a client deposit account by phone number in a chain', {
    chain_id: z.string(),
    phone: z.string(),
  }, async ({ chain_id, phone }) => {
    try {
      const { data } = await client.get(`/deposits/chain/${chain_id}/phone/${phone}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_topup_operation', 'Top up a client deposit account', {
    location_id: z.string().default(DEFAULT_LOCATION),
    client_id: z.number(),
    amount: z.number(),
    account_id: z.number().optional(),
    comment: z.string().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/deposits_operations/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_account_history', 'Get transaction history for a deposit account', {
    chain_id: z.string(),
    deposit_id: z.string(),
    page: z.number().optional(),
    count: z.number().optional(),
  }, async ({ chain_id, deposit_id, ...params }) => {
    try {
      const { data } = await client.get(`/chain/${chain_id}/deposits/${deposit_id}/history`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
