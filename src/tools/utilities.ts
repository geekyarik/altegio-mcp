import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerUtilitiesTools(server: McpServer) {
  server.tool('get_location_license', 'Get the license/subscription info for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/license/${location_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('validate_phone', 'Validate a phone number format', {
    phone: z.string().describe('Phone number to validate'),
  }, async ({ phone }) => {
    try {
      const { data } = await client.get(`/validation/validate_phone/${encodeURIComponent(phone)}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('upload_image', 'Upload an image for an entity (NOTE: requires multipart/form-data; use base64 or URL)', {
    entity: z.string().describe('Entity type, e.g. staff, service, goods'),
    image_url: z.string().optional().describe('URL of the image to upload'),
  }, async ({ entity, image_url }) => {
    try {
      const { data } = await client.post(`/images/${entity}`, { image_url });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_image', 'Delete an image for an entity', {
    entity: z.string(),
    image_id: z.string().optional(),
  }, async ({ entity, image_id }) => {
    try {
      const { data } = await client.delete(`/images/${entity}`, { data: { image_id } });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_tip_settings', 'List tip configuration settings for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/tips/${location_id}/settings`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('disable_tips', 'Disable tips for a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    master_tips_settings_id: z.string(),
  }, async ({ location_id, master_tips_settings_id }) => {
    try {
      const { data } = await client.post(`/tips/${location_id}/settings/${master_tips_settings_id}/disable`, {});
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('enable_tips', 'Enable tips for a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    master_tips_settings_id: z.string(),
  }, async ({ location_id, master_tips_settings_id }) => {
    try {
      const { data } = await client.get(`/tips/${location_id}/settings/${master_tips_settings_id}/enable`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
