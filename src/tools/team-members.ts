import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.ALTEGIO_LOCATION_ID ?? '';

export function registerTeamMembersTools(server: McpServer) {
  server.tool('list_staff', 'List all staff members for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/staff/${location_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_staff_member', 'Get a specific staff member by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
  }, async ({ location_id, team_member_id }) => {
    try {
      const { data } = await client.get(`/staff/${location_id}/${team_member_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_staff_member', 'Create a new staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    name: z.string(),
    specialization: z.string().optional(),
    position: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/staff/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_staff_member', 'Update a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
    name: z.string().optional(),
    specialization: z.string().optional(),
    position: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }, async ({ location_id, team_member_id, ...body }) => {
    try {
      const { data } = await client.put(`/staff/${location_id}/${team_member_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_staff_member', 'Delete a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
  }, async ({ location_id, team_member_id }) => {
    try {
      const { data } = await client.delete(`/staff/${location_id}/${team_member_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('quick_create_staff', 'Quickly create a staff member with minimal info', {
    location_id: z.string().default(DEFAULT_LOCATION),
    name: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/company/${location_id}/staff/quick`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_positions', 'List available staff positions/roles', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/staff/positions`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
