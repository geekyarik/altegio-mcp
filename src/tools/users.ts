import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerUsersTools(server: McpServer) {
  server.tool('list_location_users', 'List users with access to a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/users`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('remove_user_from_location', 'Remove a user from a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    user_id: z.string(),
  }, async ({ location_id, user_id }) => {
    try {
      const { data } = await client.delete(`/company/${location_id}/users/${user_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_user_roles', 'List all available user roles for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/users/roles`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_user_roles', 'Get the roles assigned to a specific user', {
    location_id: z.string().default(DEFAULT_LOCATION),
    user_id: z.string(),
  }, async ({ location_id, user_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/users/${user_id}/roles`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_user_permissions', 'Get the permissions of a specific user', {
    location_id: z.string().default(DEFAULT_LOCATION),
    user_id: z.string(),
  }, async ({ location_id, user_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/users/${user_id}/permissions`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_user_permissions', 'Update permissions for a specific user', {
    location_id: z.string().default(DEFAULT_LOCATION),
    user_id: z.string(),
    permissions: z.record(z.boolean()).describe('Map of permission names to boolean values'),
  }, async ({ location_id, user_id, permissions }) => {
    try {
      const { data } = await client.put(`/company/${location_id}/users/${user_id}/permissions`, { permissions });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('invite_user', 'Invite a user to a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    email: z.string(),
    role_id: z.number().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/user/invite/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('copy_user_to_locations', 'Copy a user to other locations', {
    location_id: z.string().default(DEFAULT_LOCATION),
    user_id: z.string(),
    company_ids: z.array(z.number()).describe('List of location IDs to copy the user to'),
  }, async ({ location_id, user_id, company_ids }) => {
    try {
      const { data } = await client.post(`/company/${location_id}/users/${user_id}/copy_to_companies`, { company_ids });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('remove_user_from_locations', 'Remove a user from multiple locations', {
    location_id: z.string().default(DEFAULT_LOCATION),
    user_id: z.string(),
    company_ids: z.array(z.number()).describe('List of location IDs to remove the user from'),
  }, async ({ location_id, user_id, company_ids }) => {
    try {
      const { data } = await client.post(`/company/${location_id}/users/${user_id}/remove_from_companies`, { company_ids });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
