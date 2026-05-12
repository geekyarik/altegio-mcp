import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerLoyaltyCardsTools(server: McpServer) {
  server.tool('get_client_loyalty_cards', 'Get all loyalty cards for a client', {
    client_id: z.string(),
  }, async ({ client_id }) => {
    try {
      const { data } = await client.get(`/loyalty/client_cards/${client_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_loyalty_cards_by_phone', 'Get loyalty cards by client phone number', {
    phone: z.string(),
    chain_id: z.string(),
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ phone, chain_id, location_id }) => {
    try {
      const { data } = await client.get(`/loyalty/cards/${phone}/${chain_id}/${location_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_card_types_for_location', 'List loyalty card types available at a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/loyalty/card_types/salon/${location_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_card_types_for_client', 'List loyalty card types available for a specific client phone', {
    location_id: z.string().default(DEFAULT_LOCATION),
    phone: z.string(),
  }, async ({ location_id, phone }) => {
    try {
      const { data } = await client.get(`/loyalty/card_types/client/${location_id}/${phone}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('issue_loyalty_card', 'Issue a loyalty card to a client', {
    location_id: z.string().default(DEFAULT_LOCATION),
    client_id: z.number(),
    card_type_id: z.number(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/loyalty/cards/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('remove_loyalty_card', 'Remove a loyalty card from a client', {
    location_id: z.string().default(DEFAULT_LOCATION),
    card_id: z.string(),
  }, async ({ location_id, card_id }) => {
    try {
      const { data } = await client.delete(`/loyalty/cards/${location_id}/${card_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('loyalty_card_manual_transaction', 'Add a manual loyalty transaction to a card at a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    card_id: z.string(),
    amount: z.number(),
    comment: z.string().optional(),
  }, async ({ location_id, card_id, ...body }) => {
    try {
      const { data } = await client.post(`/company/${location_id}/loyalty/cards/${card_id}/manual_transaction`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('chain_loyalty_card_transaction', 'Add a manual loyalty transaction to a card at chain level', {
    chain_id: z.string(),
    card_id: z.string(),
    amount: z.number(),
    comment: z.string().optional(),
  }, async ({ chain_id, card_id, ...body }) => {
    try {
      const { data } = await client.post(`/chain/${chain_id}/loyalty/cards/${card_id}/manual_transaction`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
