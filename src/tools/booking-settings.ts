import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerBookingSettingsTools(server: McpServer) {
  server.tool('get_online_booking_settings', 'Get online booking configuration for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/settings/online`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_online_booking_settings', 'Update online booking configuration', {
    location_id: z.string().default(DEFAULT_LOCATION),
    is_active: z.boolean().optional(),
    min_booking_time: z.number().optional().describe('Minutes before appointment when booking is blocked'),
    max_booking_time: z.number().optional().describe('Days in advance booking is allowed'),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.patch(`/company/${location_id}/settings/online`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_timeslot_settings', 'Get timetable/timeslot settings for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/settings/timetable`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_booking_widgets', 'List booking form widgets for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/booking_forms`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_booking_widget', 'Create a new booking form widget', {
    location_id: z.string().default(DEFAULT_LOCATION),
    title: z.string(),
    services: z.array(z.number()).optional(),
    staff: z.array(z.number()).optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/company/${location_id}/booking_forms`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_booking_widget', 'Get a booking form widget by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    form_id: z.string(),
  }, async ({ location_id, form_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/booking_forms/${form_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_booking_widget', 'Update a booking form widget', {
    location_id: z.string().default(DEFAULT_LOCATION),
    form_id: z.string(),
    title: z.string().optional(),
    services: z.array(z.number()).optional(),
    staff: z.array(z.number()).optional(),
  }, async ({ location_id, form_id, ...body }) => {
    try {
      const { data } = await client.patch(`/company/${location_id}/booking_forms/${form_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_booking_widget', 'Delete a booking form widget', {
    location_id: z.string().default(DEFAULT_LOCATION),
    form_id: z.string(),
  }, async ({ location_id, form_id }) => {
    try {
      const { data } = await client.delete(`/company/${location_id}/booking_forms/${form_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
