import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerSubscriptionsTools(server: McpServer) {
  server.tool('get_client_memberships', 'Get memberships/abonements for a client', {
    client_id: z.number().optional(),
    location_id: z.string().optional(),
  }, async (params) => {
    try {
      const { data } = await client.get('/loyalty/abonements', { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_memberships', 'List all memberships for a chain', {
    chain_id: z.string(),
    page: z.number().optional(),
    count: z.number().optional(),
  }, async ({ chain_id, ...params }) => {
    try {
      const { data } = await client.get(`/chain/${chain_id}/loyalty/abonements`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_membership_types', 'Search membership/abonement types for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    query: z.string().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/loyalty/abonement_types/search`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_membership_types_by_id', 'Get membership types by IDs', {
    location_id: z.string().default(DEFAULT_LOCATION),
    ids: z.array(z.number()),
  }, async ({ location_id, ids }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/loyalty/abonement_types/fetch`, { params: { ids } });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_client_gift_cards', 'Get gift cards/certificates for a client', {
    client_id: z.number().optional(),
    location_id: z.string().optional(),
  }, async (params) => {
    try {
      const { data } = await client.get('/loyalty/certificates', { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_gift_card_types', 'Search gift card/certificate types for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    query: z.string().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/loyalty/certificate_types/search`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_gift_card_types_by_id', 'Get gift card types by IDs', {
    location_id: z.string().default(DEFAULT_LOCATION),
    ids: z.array(z.number()),
  }, async ({ location_id, ids }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/loyalty/certificate_types/fetch`, { params: { ids } });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('search_memberships_for_event', 'Search memberships applicable to a group event for a client', {
    location_id: z.string().default(DEFAULT_LOCATION),
    client_id: z.string(),
    activity_id: z.number().optional(),
  }, async ({ location_id, client_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/client/${client_id}/loyalty/abonements/search_for_activity`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('check_membership_for_event', 'Check if a specific membership is valid for a group event', {
    location_id: z.string().default(DEFAULT_LOCATION),
    client_id: z.string(),
    membership_id: z.string(),
    activity_id: z.number().optional(),
  }, async ({ location_id, client_id, membership_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/client/${client_id}/loyalty/abonements/${membership_id}/check_for_activity`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
