import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.ALTEGIO_LOCATION_ID ?? '';

export function registerInventoryTools(server: McpServer) {
  server.tool('list_inventories', 'List storage/inventory locations', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/storages/${location_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('search_product_transactions', 'Search product stock transactions', {
    location_id: z.string().default(DEFAULT_LOCATION),
    product_id: z.number().optional(),
    storage_id: z.number().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/storages/transactions/${location_id}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_inventory_operation', 'Create an inventory operation (e.g. write-off, correction)', {
    location_id: z.string().default(DEFAULT_LOCATION),
    operation_type: z.string().describe('Type of operation'),
    storage_id: z.number().optional(),
    goods: z.array(z.object({
      good_id: z.number(),
      amount: z.number(),
      price: z.number().optional(),
    })),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/storage_operations/operation/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_document', 'Create an inventory document (e.g. supply or transfer)', {
    location_id: z.string().default(DEFAULT_LOCATION),
    document_type: z.string(),
    storage_id: z.number().optional(),
    supplier: z.string().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/storage_operations/documents/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_document', 'Get an inventory document by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    document_id: z.string(),
  }, async ({ location_id, document_id }) => {
    try {
      const { data } = await client.get(`/storage_operations/documents/${location_id}/${document_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_document', 'Update an inventory document', {
    location_id: z.string().default(DEFAULT_LOCATION),
    document_id: z.string(),
    supplier: z.string().optional(),
    comment: z.string().optional(),
  }, async ({ location_id, document_id, ...body }) => {
    try {
      const { data } = await client.put(`/storage_operations/documents/${location_id}/${document_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_document', 'Delete an inventory document', {
    location_id: z.string().default(DEFAULT_LOCATION),
    document_id: z.string(),
  }, async ({ location_id, document_id }) => {
    try {
      const { data } = await client.delete(`/storage_operations/documents/${location_id}/${document_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_goods_transaction', 'Create a goods transaction for a document', {
    location_id: z.string().default(DEFAULT_LOCATION),
    document_id: z.number(),
    good_id: z.number(),
    amount: z.number(),
    price: z.number().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/storage_operations/goods_transactions/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_goods_transaction', 'Get a goods transaction by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    transaction_id: z.string(),
  }, async ({ location_id, transaction_id }) => {
    try {
      const { data } = await client.get(`/storage_operations/goods_transactions/${location_id}/${transaction_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_goods_transaction', 'Update a goods transaction', {
    location_id: z.string().default(DEFAULT_LOCATION),
    transaction_id: z.string(),
    amount: z.number().optional(),
    price: z.number().optional(),
  }, async ({ location_id, transaction_id, ...body }) => {
    try {
      const { data } = await client.put(`/storage_operations/goods_transactions/${location_id}/${transaction_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_goods_transaction', 'Delete a goods transaction', {
    location_id: z.string().default(DEFAULT_LOCATION),
    transaction_id: z.string(),
  }, async ({ location_id, transaction_id }) => {
    try {
      const { data } = await client.delete(`/storage_operations/goods_transactions/${location_id}/${transaction_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_bill_of_materials', 'List technological cards (bill of materials for services)', {
    location_id: z.string().default(DEFAULT_LOCATION),
  }, async ({ location_id }) => {
    try {
      const { data } = await client.get(`/technological_cards/${location_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_appointment_consumables', 'Get consumable products used in an appointment', {
    location_id: z.string().default(DEFAULT_LOCATION),
    record_id: z.string(),
  }, async ({ location_id, record_id }) => {
    try {
      const { data } = await client.get(`/technological_cards/record_consumables/${location_id}/${record_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_appointment_consumables', 'Update consumable products for an appointment service', {
    location_id: z.string().default(DEFAULT_LOCATION),
    record_id: z.string(),
    service_id: z.string(),
    consumables: z.array(z.object({
      good_id: z.number(),
      amount: z.number(),
    })),
  }, async ({ location_id, record_id, service_id, consumables }) => {
    try {
      const { data } = await client.put(`/technological_cards/record_consumables/consumables/${location_id}/${record_id}/${service_id}`, { consumables });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
