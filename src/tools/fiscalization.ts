import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerFiscalizationTools(server: McpServer) {
  server.tool('list_fiscal_transactions', 'List fiscal/KKM transactions for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    page: z.number().optional(),
    count: z.number().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/kkm_transactions/${location_id}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('print_fiscal_receipt', 'Print a fiscal receipt for a document bill', {
    location_id: z.string().default(DEFAULT_LOCATION),
    document_id: z.number(),
    payment_type: z.string().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/kkm_transactions/${location_id}/print_document_bill`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_tax_systems', 'List available tax systems for a country', {
    country_id: z.string().describe('Country ID, e.g. 1 for Ukraine'),
  }, async ({ country_id }) => {
    try {
      const { data } = await client.get(`/integration/kkm/references/tax_system/${country_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_document_product_transactions', 'Get goods transactions associated with an inventory document', {
    document_id: z.string(),
  }, async ({ document_id }) => {
    try {
      const { data } = await client.get(`/storage_operations/documents/goods_transactions/${document_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
