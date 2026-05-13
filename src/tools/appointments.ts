import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.ALTEGIO_LOCATION_ID ?? '';

export function registerAppointmentsTools(server: McpServer) {
  server.tool('list_appointments', 'List appointments for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string().optional().describe('Format: YYYY-MM-DD'),
    end_date: z.string().optional().describe('Format: YYYY-MM-DD'),
    staff_id: z.number().optional(),
    client_id: z.number().optional(),
    page: z.number().optional(),
    count: z.number().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/records/${location_id}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_appointment', 'Create a new appointment', {
    location_id: z.string().default(DEFAULT_LOCATION),
    staff_id: z.number(),
    services: z.array(z.object({ id: z.number(), amount: z.number().optional() })),
    client: z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
    }).optional(),
    datetime: z.string().describe('ISO 8601 datetime'),
    comment: z.string().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/records/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_appointment', 'Get a specific appointment by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    record_id: z.string(),
  }, async ({ location_id, record_id }) => {
    try {
      const { data } = await client.get(`/record/${location_id}/${record_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_appointment', 'Update an appointment', {
    location_id: z.string().default(DEFAULT_LOCATION),
    record_id: z.string(),
    staff_id: z.number().optional(),
    datetime: z.string().optional(),
    comment: z.string().optional(),
    attendance: z.number().optional().describe('0=waiting, 1=arrived, 2=no-show, 3=confirmed'),
  }, async ({ location_id, record_id, ...body }) => {
    try {
      const { data } = await client.put(`/record/${location_id}/${record_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_appointment', 'Delete an appointment', {
    location_id: z.string().default(DEFAULT_LOCATION),
    record_id: z.string(),
  }, async ({ location_id, record_id }) => {
    try {
      const { data } = await client.delete(`/record/${location_id}/${record_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_visit', 'Get visit details by visit ID', {
    visit_id: z.string(),
  }, async ({ visit_id }) => {
    try {
      const { data } = await client.get(`/visits/${visit_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_visit_details', 'Get detailed visit info including services and billing', {
    location_id: z.string().default(DEFAULT_LOCATION),
    record_id: z.string(),
    visit_id: z.string(),
  }, async ({ location_id, record_id, visit_id }) => {
    try {
      const { data } = await client.get(`/visit/details/${location_id}/${record_id}/${visit_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_visit', 'Update visit attendance and payment status', {
    visit_id: z.string(),
    record_id: z.string(),
    attendance: z.number().optional().describe('0=waiting, 1=arrived, 2=no-show, 3=confirmed'),
  }, async ({ visit_id, record_id, ...body }) => {
    try {
      const { data } = await client.put(`/visits/${visit_id}/${record_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_visit_receipt', 'Get a printable receipt for a visit', {
    visit_id: z.string(),
  }, async ({ visit_id }) => {
    try {
      const { data } = await client.get(`/attendance/receipt_print/${visit_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_comments', 'List all appointment comments for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    page: z.number().optional(),
    count: z.number().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/comments/${location_id}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_recurring_appointments', 'Create recurring appointments for a client schedule', {
    location_id: z.string().default(DEFAULT_LOCATION),
    schedule_id: z.string(),
    client_id: z.number(),
    services: z.array(z.number()).describe('Service IDs'),
  }, async ({ location_id, schedule_id, ...body }) => {
    try {
      const { data } = await client.post(`/company/${location_id}/schedules/${schedule_id}/client_schedules`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_recurring_appointments', 'Update recurring appointment settings for a client', {
    location_id: z.string().default(DEFAULT_LOCATION),
    schedule_id: z.string(),
    client_schedule_id: z.string(),
    services: z.array(z.number()).optional(),
  }, async ({ location_id, schedule_id, client_schedule_id, ...body }) => {
    try {
      const { data } = await client.patch(`/company/${location_id}/schedules/${schedule_id}/client_schedules/${client_schedule_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_recurring_appointments', 'Delete recurring appointments for a client', {
    location_id: z.string().default(DEFAULT_LOCATION),
    schedule_id: z.string(),
    client_schedule_id: z.string(),
  }, async ({ location_id, schedule_id, client_schedule_id }) => {
    try {
      const { data } = await client.delete(`/company/${location_id}/schedules/${schedule_id}/client_schedules/${client_schedule_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
