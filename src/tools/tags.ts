import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerTagsTools(server: McpServer) {
  server.tool('list_tags', 'List tags/labels for an entity type (deprecated v1, still functional)', {
    location_id: z.string().default(DEFAULT_LOCATION),
    entity: z.string().describe('Entity type, e.g. client, record'),
  }, async ({ location_id, entity }) => {
    try {
      const { data } = await client.get(`/labels/${location_id}/${entity}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_tag', 'Create a new tag/label', {
    location_id: z.string().default(DEFAULT_LOCATION),
    title: z.string(),
    entity: z.string().describe('Entity type this tag applies to'),
    color: z.string().optional().describe('Hex color code'),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/labels/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_tag', 'Update a tag/label', {
    location_id: z.string().default(DEFAULT_LOCATION),
    tag_id: z.string(),
    title: z.string().optional(),
    color: z.string().optional(),
  }, async ({ location_id, tag_id, ...body }) => {
    try {
      const { data } = await client.put(`/labels/${location_id}/${tag_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_tag', 'Delete a tag/label', {
    location_id: z.string().default(DEFAULT_LOCATION),
    tag_id: z.string(),
  }, async ({ location_id, tag_id }) => {
    try {
      const { data } = await client.delete(`/labels/${location_id}/${tag_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
