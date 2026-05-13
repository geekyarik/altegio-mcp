import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.ALTEGIO_LOCATION_ID ?? '';

export function registerEventsTools(server: McpServer) {
  server.tool('search_events', 'Search for group events/activities', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    staff_id: z.number().optional(),
    page: z.number().optional(),
    count: z.number().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/activity/${location_id}/search`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('search_event_dates', 'Search for available event dates', {
    location_id: z.string().default(DEFAULT_LOCATION),
    service_id: z.number().optional(),
    staff_id: z.number().optional(),
    month: z.string().optional().describe('Format: YYYY-MM'),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/activity/${location_id}/search_dates`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_event_date_range', 'Get events within a date range', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string(),
    end_date: z.string(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/activity/${location_id}/search_dates_range`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_event_filters', 'Get available filter options for events', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/activity/${location_id}/filters`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('search_event_services', 'Search services available for group events', {
    location_id: z.string().default(DEFAULT_LOCATION),
    query: z.string().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/activity/${location_id}/services`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_duplication_strategies', 'List event duplication strategies', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/activity/${location_id}/duplication_strategy`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_duplication_strategy', 'Create an event duplication strategy', {
    location_id: z.string().default(DEFAULT_LOCATION),
    name: z.string(),
    frequency: z.string().optional(),
    count: z.number().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/activity/${location_id}/duplication_strategy`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_duplication_strategy', 'Update an event duplication strategy', {
    location_id: z.string().default(DEFAULT_LOCATION),
    strategy_id: z.string(),
    name: z.string().optional(),
    frequency: z.string().optional(),
    count: z.number().optional(),
  }, async ({ location_id, strategy_id, ...body }) => {
    try {
      const { data } = await client.post(`/activity/${location_id}/duplication_strategy/${strategy_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('duplicate_event', 'Duplicate an existing event', {
    location_id: z.string().default(DEFAULT_LOCATION),
    event_id: z.string(),
    strategy_id: z.number().optional(),
  }, async ({ location_id, event_id, ...body }) => {
    try {
      const { data } = await client.post(`/activity/${location_id}/${event_id}/duplicate`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
