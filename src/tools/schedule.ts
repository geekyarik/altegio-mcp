import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.ALTEGIO_LOCATION_ID ?? '';

export function registerScheduleTools(server: McpServer) {
  server.tool('get_staff_schedule', 'Get schedule for a staff member over a date range', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
    start_date: z.string().describe('Format: YYYY-MM-DD'),
    end_date: z.string().describe('Format: YYYY-MM-DD'),
  }, async ({ location_id, team_member_id, start_date, end_date }) => {
    try {
      const { data } = await client.get(`/schedule/${location_id}/${team_member_id}/${start_date}/${end_date}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_staff_schedule', 'Update schedule for a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    schedule: z.array(z.object({
      date: z.string(),
      work_start: z.string().optional(),
      work_end: z.string().optional(),
      is_day_off: z.boolean().optional(),
    })),
  }, async ({ location_id, team_member_id, start_date, end_date, schedule }) => {
    try {
      const { data } = await client.put(`/schedule/${location_id}/${team_member_id}/${start_date}/${end_date}`, { schedule });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_available_dates', 'Get available booking dates for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    date: z.string().describe('Starting date, format: YYYY-MM-DD'),
    service_ids: z.array(z.number()).optional(),
    staff_id: z.number().optional(),
  }, async ({ location_id, date, ...params }) => {
    try {
      const { data } = await client.get(`/timetable/dates/${location_id}/${date}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_available_timeslots', 'Get available timeslots for a staff member on a given date', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
    date: z.string().describe('Format: YYYY-MM-DD'),
    service_ids: z.array(z.number()).optional(),
  }, async ({ location_id, team_member_id, date, ...params }) => {
    try {
      const { data } = await client.get(`/timetable/seances/${location_id}/${team_member_id}/${date}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_resources', 'List bookable resources for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/resources/${location_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_team_member_schedules', 'Get schedule configuration for all team members', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/staff/schedule`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('set_team_member_schedules', 'Set schedule configuration for team members', {
    location_id: z.string().default(DEFAULT_LOCATION),
    schedules: z.array(z.object({
      staff_id: z.number(),
      schedule_type: z.string().optional(),
    })),
  }, async ({ location_id, schedules }) => {
    try {
      const { data } = await client.put(`/company/${location_id}/staff/schedule`, { schedules });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('search_event_schedule', 'Search schedule for a specific entity (staff/resource)', {
    location_id: z.string().default(DEFAULT_LOCATION),
    entity_type: z.string().describe('e.g. staff or resource'),
    entity_id: z.string(),
  }, async ({ location_id, entity_type, entity_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/schedules/search/${entity_type}/${entity_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_schedule', 'Create a recurring schedule', {
    location_id: z.string().default(DEFAULT_LOCATION),
    title: z.string().optional(),
    entity_type: z.string().optional(),
    entity_id: z.number().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/company/${location_id}/schedules`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_schedule', 'Update a recurring schedule', {
    location_id: z.string().default(DEFAULT_LOCATION),
    schedule_id: z.string(),
    title: z.string().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, schedule_id, ...body }) => {
    try {
      const { data } = await client.patch(`/company/${location_id}/schedules/${schedule_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_schedule', 'Delete a recurring schedule', {
    location_id: z.string().default(DEFAULT_LOCATION),
    schedule_id: z.string(),
  }, async ({ location_id, schedule_id }) => {
    try {
      const { data } = await client.delete(`/company/${location_id}/schedules/${schedule_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_schedule_series', 'Create schedule day series for a recurring schedule', {
    location_id: z.string().default(DEFAULT_LOCATION),
    schedule_id: z.string(),
    days: z.array(z.object({
      date: z.string(),
      work_start: z.string().optional(),
      work_end: z.string().optional(),
    })),
  }, async ({ location_id, schedule_id, days }) => {
    try {
      const { data } = await client.post(`/company/${location_id}/schedules/${schedule_id}/days`, { days });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_schedule_events', 'List events for a specific day in a schedule', {
    location_id: z.string().default(DEFAULT_LOCATION),
    schedule_id: z.string(),
    day_id: z.string(),
  }, async ({ location_id, schedule_id, day_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/schedules/${schedule_id}/days/${day_id}/events`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
