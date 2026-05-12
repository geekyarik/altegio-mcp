import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerNotificationsTools(server: McpServer) {
  server.tool('send_sms_to_clients', 'Send SMS to specific clients by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    client_ids: z.array(z.number()),
    message: z.string(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/sms/clients/by_id/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('send_sms_campaign', 'Send an SMS campaign to clients matching a filter', {
    location_id: z.string().default(DEFAULT_LOCATION),
    message: z.string(),
    filter: z.record(z.any()).optional().describe('Filter criteria for selecting clients'),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/sms/clients/by_filter/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('send_email_to_clients', 'Send email to specific clients by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    client_ids: z.array(z.number()),
    subject: z.string(),
    message: z.string(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/email/clients/by_id/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('send_email_campaign', 'Send an email campaign to clients matching a filter', {
    location_id: z.string().default(DEFAULT_LOCATION),
    subject: z.string(),
    message: z.string(),
    filter: z.record(z.any()).optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/email/clients/by_filter/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_message_statuses', 'Get delivery statuses for sent messages', {
    message_ids: z.array(z.string()).describe('List of message IDs to check'),
  }, async ({ message_ids }) => {
    try {
      const { data } = await client.post('/delivery/status', { message_ids });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_notification_settings', 'Get notification type settings for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/notification_settings/${location_id}/notification_types`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_user_notification_settings', 'Get notification settings for a specific user', {
    location_id: z.string().default(DEFAULT_LOCATION),
    user_id: z.string(),
  }, async ({ location_id, user_id }) => {
    try {
      const { data } = await client.get(`/notification_settings/${location_id}/users/${user_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
