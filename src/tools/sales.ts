import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerSalesTools(server: McpServer) {
  server.tool('get_sale_transaction', 'Get a sale/payment document by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    document_id: z.string(),
  }, async ({ location_id, document_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/sale/${document_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_payment', 'Create a payment for a sale document', {
    location_id: z.string().default(DEFAULT_LOCATION),
    document_id: z.string(),
    payment_type_id: z.number(),
    amount: z.number(),
  }, async ({ location_id, document_id, ...body }) => {
    try {
      const { data } = await client.post(`/company/${location_id}/sale/${document_id}/payment`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_loyalty_payment', 'Delete a loyalty transaction payment from a sale', {
    location_id: z.string().default(DEFAULT_LOCATION),
    document_id: z.string(),
    payment_transaction_id: z.string(),
  }, async ({ location_id, document_id, payment_transaction_id }) => {
    try {
      const { data } = await client.delete(`/company/${location_id}/sale/${document_id}/payment/loyalty_transaction/${payment_transaction_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
