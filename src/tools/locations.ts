import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.ALTEGIO_LOCATION_ID ?? '';

export function registerLocationsTools(server: McpServer) {
  server.tool('list_locations', 'List all company locations', {}, async () => {
    try {
      const { data } = await client.get('/companies');
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_location', 'Create a new company location', {
    title: z.string().describe('Location name'),
    timezone: z.string().optional().describe('Timezone, e.g. Europe/Kiev'),
    country_id: z.number().optional().describe('Country ID'),
    city: z.string().optional().describe('City name'),
    address: z.string().optional().describe('Street address'),
    phone: z.string().optional().describe('Contact phone'),
    email: z.string().optional().describe('Contact email'),
  }, async (params) => {
    try {
      const { data } = await client.post('/companies', params);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_location', 'Get details of a specific location', {
    location_id: z.string().default(DEFAULT_LOCATION).describe('Location (company) ID'),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_location', 'Update a location\'s details', {
    location_id: z.string().default(DEFAULT_LOCATION).describe('Location (company) ID'),
    title: z.string().optional(),
    timezone: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.put(`/company/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_location', 'Delete a location', {
    location_id: z.string().describe('Location (company) ID to delete'),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.delete(`/company/${location_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
