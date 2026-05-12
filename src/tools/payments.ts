import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerPaymentsTools(server: McpServer) {
  server.tool('list_accounts', 'List payment accounts/cash registers for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/accounts/${location_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_transactions', 'List financial transactions for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    page: z.number().optional(),
    count: z.number().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/transactions/${location_id}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_transactions_by_visit', 'Get financial transactions linked to a specific visit', {
    location_id: z.string().default(DEFAULT_LOCATION),
    visit_id: z.number().optional(),
    record_id: z.number().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/timetable/transactions/${location_id}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_document_financial_transactions', 'Get financial transactions for an inventory document', {
    document_id: z.string(),
  }, async ({ document_id }) => {
    try {
      const { data } = await client.get(`/storage_operations/documents/finance_transactions/${document_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_financial_transaction', 'Create a financial transaction', {
    location_id: z.string().default(DEFAULT_LOCATION),
    account_id: z.number(),
    amount: z.number(),
    type: z.string().describe('income or expense'),
    comment: z.string().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/finance_transactions/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_financial_transaction', 'Get a financial transaction by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    transaction_id: z.string(),
  }, async ({ location_id, transaction_id }) => {
    try {
      const { data } = await client.get(`/finance_transactions/${location_id}/${transaction_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_financial_transaction', 'Update a financial transaction', {
    location_id: z.string().default(DEFAULT_LOCATION),
    transaction_id: z.string(),
    amount: z.number().optional(),
    comment: z.string().optional(),
  }, async ({ location_id, transaction_id, ...body }) => {
    try {
      const { data } = await client.put(`/finance_transactions/${location_id}/${transaction_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_financial_transaction', 'Delete a financial transaction', {
    location_id: z.string().default(DEFAULT_LOCATION),
    transaction_id: z.string(),
  }, async ({ location_id, transaction_id }) => {
    try {
      const { data } = await client.delete(`/finance_transactions/${location_id}/${transaction_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
