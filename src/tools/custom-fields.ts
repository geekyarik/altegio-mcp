import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerCustomFieldsTools(server: McpServer) {
  server.tool('list_custom_fields', 'List custom fields for an entity category', {
    location_id: z.string().default(DEFAULT_LOCATION),
    field_category: z.string().describe('Entity category, e.g. client, record, staff'),
  }, async ({ location_id, field_category }) => {
    try {
      const { data } = await client.get(`/custom_fields/${field_category}/${location_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_custom_field', 'Create a custom field for an entity category', {
    location_id: z.string().default(DEFAULT_LOCATION),
    field_category: z.string(),
    name: z.string(),
    field_type: z.string().describe('Field type: text, number, date, list, etc.'),
    required: z.boolean().optional(),
  }, async ({ location_id, field_category, ...body }) => {
    try {
      const { data } = await client.post(`/custom_fields/${field_category}/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_custom_field', 'Update a custom field', {
    location_id: z.string().default(DEFAULT_LOCATION),
    field_category: z.string(),
    field_id: z.string(),
    name: z.string().optional(),
    required: z.boolean().optional(),
  }, async ({ location_id, field_category, field_id, ...body }) => {
    try {
      const { data } = await client.put(`/custom_fields/${field_category}/${location_id}/${field_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_custom_field', 'Delete a custom field', {
    location_id: z.string().default(DEFAULT_LOCATION),
    field_category: z.string(),
    field_id: z.string(),
  }, async ({ location_id, field_category, field_id }) => {
    try {
      const { data } = await client.delete(`/custom_fields/${field_category}/${location_id}/${field_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
