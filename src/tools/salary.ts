import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerSalaryTools(server: McpServer) {
  server.tool('get_staff_salary_daily', 'Get daily salary breakdown for a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
    date: z.string().optional().describe('Format: YYYY-MM-DD'),
  }, async ({ location_id, team_member_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/salary/calculation/staff/daily/${team_member_id}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_staff_salary', 'Get salary calculation for a staff member over a period', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, team_member_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/salary/calculation/staff/${team_member_id}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_salary_schemes_count', 'Get count of salary schemes assigned to a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
  }, async ({ location_id, team_member_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/salary/calculation/staff/${team_member_id}/salary_schemes_count`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('search_payroll_calculations', 'Search payroll calculations for a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, team_member_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/salary/payroll/staff/${team_member_id}/calculation`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_payroll_calculation', 'Get a specific payroll calculation by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
    calculation_id: z.string(),
  }, async ({ location_id, team_member_id, calculation_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/salary/payroll/staff/${team_member_id}/calculation/${calculation_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_period_salary_daily', 'Get daily salary period summary for a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
    date: z.string().optional(),
  }, async ({ location_id, team_member_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/salary/period/staff/daily/${team_member_id}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_period_salary', 'Get period salary summary for a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, team_member_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/salary/period/staff/${team_member_id}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_own_salary_calculation', 'Get salary calculation visible to the staff member themselves', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, team_member_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/salary/staff/${team_member_id}/calculation`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_own_salary_schemes', 'Get salary schemes assigned to a staff member', {
    location_id: z.string().default(DEFAULT_LOCATION),
    team_member_id: z.string(),
  }, async ({ location_id, team_member_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/salary/staff/${team_member_id}/salary_schemes`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
