import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.LOCATION_ID ?? '209563';

export function registerProductsTools(server: McpServer) {
  server.tool('search_products', 'Search for products/goods', {
    location_id: z.string().default(DEFAULT_LOCATION),
    query: z.string().optional(),
    category_id: z.number().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/goods/search/${location_id}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_products', 'List all products for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    page: z.number().optional(),
    count: z.number().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/goods/${location_id}`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_product', 'Get a product by ID', {
    location_id: z.string().default(DEFAULT_LOCATION),
    product_id: z.string(),
  }, async ({ location_id, product_id }) => {
    try {
      const { data } = await client.get(`/goods/${location_id}/${product_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_product', 'Create a new product', {
    location_id: z.string().default(DEFAULT_LOCATION),
    title: z.string(),
    category_id: z.number().optional(),
    price: z.number().optional(),
    cost_price: z.number().optional(),
    barcode: z.string().optional(),
    unit: z.string().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/goods/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_product', 'Update a product', {
    location_id: z.string().default(DEFAULT_LOCATION),
    product_id: z.string(),
    title: z.string().optional(),
    category_id: z.number().optional(),
    price: z.number().optional(),
    cost_price: z.number().optional(),
    barcode: z.string().optional(),
  }, async ({ location_id, product_id, ...body }) => {
    try {
      const { data } = await client.put(`/goods/${location_id}/${product_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_product', 'Delete a product', {
    location_id: z.string().default(DEFAULT_LOCATION),
    product_id: z.string(),
  }, async ({ location_id, product_id }) => {
    try {
      const { data } = await client.delete(`/goods/${location_id}/${product_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_product_categories', 'List product categories', {
    location_id: z.string().default(DEFAULT_LOCATION),
    parent_category_id: z.string().default('0').describe('Parent category ID (0 for root)'),
  }, async ({ location_id, parent_category_id }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/goods_categories/${parent_category_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_product_category_composition', 'Get products in a category node', {
    location_id: z.string().default(DEFAULT_LOCATION),
    category_id: z.string(),
  }, async ({ location_id, category_id }) => {
    try {
      const { data } = await client.get(`/goods/category_node/${location_id}/${category_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_product_categories_by_ids', 'List product categories by multiple IDs', {
    location_id: z.string().default(DEFAULT_LOCATION),
    ids: z.array(z.number()).describe('Array of category IDs'),
  }, async ({ location_id, ids }) => {
    try {
      const { data } = await client.get(`/goods_categories/multiple/${location_id}`, { params: { ids } });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_product_category', 'Create a product category', {
    location_id: z.string().default(DEFAULT_LOCATION),
    title: z.string(),
    parent_id: z.number().optional(),
  }, async ({ location_id, ...body }) => {
    try {
      const { data } = await client.post(`/goods_categories/${location_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_product_category', 'Update a product category', {
    location_id: z.string().default(DEFAULT_LOCATION),
    category_id: z.string(),
    title: z.string().optional(),
    parent_id: z.number().optional(),
  }, async ({ location_id, category_id, ...body }) => {
    try {
      const { data } = await client.put(`/goods_categories/${location_id}/${category_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_product_category', 'Delete a product category', {
    location_id: z.string().default(DEFAULT_LOCATION),
    category_id: z.string(),
  }, async ({ location_id, category_id }) => {
    try {
      const { data } = await client.delete(`/goods_categories/${location_id}/${category_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
