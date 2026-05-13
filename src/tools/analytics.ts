import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.ALTEGIO_LOCATION_ID ?? '';

export function registerAnalyticsTools(server: McpServer) {
  server.tool('get_analytics_overview', 'Get overall analytics summary for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string().optional().describe('Format: YYYY-MM-DD'),
    end_date: z.string().optional().describe('Format: YYYY-MM-DD'),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/analytics/overall`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_daily_occupancy', 'Get daily occupancy/fullness chart data', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/analytics/overall/charts/fullness_daily`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_daily_revenue', 'Get daily revenue chart data', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/analytics/overall/charts/income_daily`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_appointments_by_source', 'Get appointment count breakdown by booking source', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/analytics/overall/charts/record_source`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_appointments_by_status', 'Get appointment count breakdown by status', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/analytics/overall/charts/record_status`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_daily_appointments', 'Get daily appointment count chart data', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/analytics/overall/charts/records_daily`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_loyalty_revenue_stats', 'Get revenue statistics from loyalty programs', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/analytics/loyalty_programs/income`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_loyalty_staff_stats', 'Get staff performance stats related to loyalty programs', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/analytics/loyalty_programs/staff`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_day_end_report', 'Get end-of-day (Z-report) for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    date: z.string().optional().describe('Format: YYYY-MM-DD, defaults to today'),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/reports/z_report/${location_id}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
