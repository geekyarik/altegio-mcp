import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.ALTEGIO_LOCATION_ID ?? '';

export function registerClientsTools(server: McpServer) {
  server.tool('search_clients', 'Search for clients by various criteria', {
    location_id: z.string().default(DEFAULT_LOCATION),
    query: z.string().optional().describe('Search query (name, phone, email)'),
    page: z.number().optional(),
    count: z.number().optional().describe('Results per page'),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/company/${location_id}/clients/search`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_client', 'Create a new client', {
    location_id: z.string().default(DEFAULT_LOCATION),
    name: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
    comment: z.string().optional(),
    birthday: z.string().optional().describe('Format: YYYY-MM-DD'),
    sex: z.number().optional().describe('0 = unknown, 1 = male, 2 = female'),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/clients/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('bulk_create_clients', 'Create multiple clients at once', {
    location_id: z.string().default(DEFAULT_LOCATION),
    clients: z.array(z.object({
      name: z.string(),
      phone: z.string().optional(),
      email: z.string().optional(),
    })).describe('Array of client objects'),
  }, async ({ location_id, clients }) => {
    try {
      const { data } = await client.post(`/clients/${location_id}/bulk`, { clients });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_client', 'Get a client by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    id: z.string(),
  }, async ({ location_id, id }) => {
    try {
      const { data } = await client.get(`/client/${location_id}/${id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_client', 'Update a client\'s details', {
    location_id: z.string().default(DEFAULT_LOCATION),
    id: z.string(),
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    comment: z.string().optional(),
    birthday: z.string().optional(),
    sex: z.number().optional(),
  }, async ({ location_id, id, ...body }) => {
    try {
      const { data } = await client.put(`/client/${location_id}/${id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_client', 'Delete a client', {
    location_id: z.string().default(DEFAULT_LOCATION),
    id: z.string(),
  }, async ({ location_id, id }) => {
    try {
      const { data } = await client.delete(`/client/${location_id}/${id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_client_comments', 'List comments for a client', {
    location_id: z.string().default(DEFAULT_LOCATION),
    client_id: z.string(),
  }, async ({ location_id, client_id }) => {
    try {
      const { data } = await client.get(`/clients/${location_id}/clients/${client_id}/comments`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('add_client_comment', 'Add a comment to a client', {
    location_id: z.string().default(DEFAULT_LOCATION),
    client_id: z.string(),
    text: z.string(),
  }, async ({ location_id, client_id, text }) => {
    try {
      const { data } = await client.post(`/clients/${location_id}/clients/${client_id}/comments`, { text });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_client_comment', 'Delete a client comment', {
    location_id: z.string().default(DEFAULT_LOCATION),
    client_id: z.string(),
    comment_id: z.string(),
  }, async ({ location_id, client_id, comment_id }) => {
    try {
      const { data } = await client.delete(`/clients/${location_id}/clients/${client_id}/comments/${comment_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('search_client_visits', 'Search visit history for a client', {
    location_id: z.string().default(DEFAULT_LOCATION),
    client_id: z.string().optional(),
    start_date: z.string().optional().describe('Format: YYYY-MM-DD'),
    end_date: z.string().optional().describe('Format: YYYY-MM-DD'),
    page: z.number().optional(),
    count: z.number().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/company/${location_id}/clients/visits/search`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
