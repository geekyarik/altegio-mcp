import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerServicesTools(server: McpServer) {
  server.tool('list_services', 'List all services for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/services/${location_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_service', 'Create a new service', {
    location_id: z.string().default(DEFAULT_LOCATION),
    title: z.string(),
    category_id: z.number().optional(),
    price_min: z.number().optional(),
    price_max: z.number().optional(),
    duration: z.number().optional().describe('Duration in minutes'),
    comment: z.string().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/services/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_service', 'Update a service (full update)', {
    location_id: z.string().default(DEFAULT_LOCATION),
    service_id: z.string(),
    title: z.string().optional(),
    category_id: z.number().optional(),
    price_min: z.number().optional(),
    price_max: z.number().optional(),
    duration: z.number().optional(),
    comment: z.string().optional(),
  }, async ({ location_id, service_id, ...body }) => {
    try {
      const { data } = await client.put(`/services/${location_id}/${service_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('patch_service', 'Partially update a service', {
    location_id: z.string().default(DEFAULT_LOCATION),
    service_id: z.string(),
    title: z.string().optional(),
    price_min: z.number().optional(),
    price_max: z.number().optional(),
    duration: z.number().optional(),
    comment: z.string().optional(),
  }, async ({ location_id, service_id, ...body }) => {
    try {
      const { data } = await client.patch(`/services/${location_id}/${service_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_service', 'Delete a service', {
    location_id: z.string().default(DEFAULT_LOCATION),
    service_id: z.string(),
  }, async ({ location_id, service_id }) => {
    try {
      const { data } = await client.delete(`/services/${location_id}/${service_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_service', 'Get a single service by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    service_id: z.string(),
  }, async ({ location_id, service_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/services/${service_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_service_categories', 'List service categories for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    id: z.string().default('0').describe('Parent category ID (0 for root)'),
  }, async ({ location_id, id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/service_categories/${id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_service_category', 'Get a service category by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    id: z.string(),
  }, async ({ location_id, id }) => {
    try {
      const { data } = await client.get(`/service_category/${location_id}/${id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_service_category', 'Create a new service category', {
    location_id: z.string().default(DEFAULT_LOCATION),
    title: z.string(),
    parent_id: z.number().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/service_categories/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_service_category', 'Update a service category', {
    location_id: z.string().default(DEFAULT_LOCATION),
    id: z.string(),
    title: z.string().optional(),
    parent_id: z.number().optional(),
  }, async ({ location_id, id, ...body }) => {
    try {
      const { data } = await client.put(`/service_category/${location_id}/${id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_service_category', 'Delete a service category', {
    location_id: z.string().default(DEFAULT_LOCATION),
    id: z.string(),
  }, async ({ location_id, id }) => {
    try {
      const { data } = await client.delete(`/service_category/${location_id}/${id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('assign_service_to_staff', 'Assign a service to a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    service_id: z.string(),
    team_member_id: z.string(),
    price: z.number().optional(),
    duration: z.number().optional(),
  }, async ({ location_id, service_id, ...body }) => {
    try {
      const { data } = await client.post(`/company/${location_id}/services/${service_id}/staff`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_service_staff_link', 'Update the link between a service and a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    service_id: z.string(),
    team_member_id: z.string(),
    price: z.number().optional(),
    duration: z.number().optional(),
  }, async ({ location_id, service_id, team_member_id, ...body }) => {
    try {
      const { data } = await client.put(`/company/${location_id}/services/${service_id}/staff/${team_member_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('remove_service_from_staff', 'Remove a service from a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    service_id: z.string(),
    team_member_id: z.string(),
  }, async ({ location_id, service_id, team_member_id }) => {
    try {
      const { data } = await client.delete(`/company/${location_id}/services/${service_id}/staff/${team_member_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
