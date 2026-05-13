import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

const DEFAULT_LOCATION = process.env.ALTEGIO_LOCATION_ID ?? '';

export function registerLoyaltyProgramsTools(server: McpServer) {
  server.tool('list_loyalty_programs', 'Search/list loyalty programs for a location', {
    location_id: z.string().default(DEFAULT_LOCATION),
    query: z.string().optional(),
  }, async ({ location_id, ...params }) => {
    try {
      const { data } = await client.get(`/company/${location_id}/loyalty/programs/search`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_loyalty_transactions_by_visit', 'Get loyalty transactions for a specific visit', {
    visit_id: z.string(),
  }, async ({ visit_id }) => {
    try {
      const { data } = await client.get(`/visit/loyalty/transactions/${visit_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('generate_loyalty_code', 'Generate a loyalty discount code for a product', {
    location_id: z.string().default(DEFAULT_LOCATION),
    product_id: z.string(),
  }, async ({ location_id, product_id }) => {
    try {
      const { data } = await client.get(`/loyalty/generate_code/${location_id}/${product_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('apply_loyalty_card_deduction', 'Apply a loyalty card withdrawal/deduction to a visit', {
    location_id: z.string().default(DEFAULT_LOCATION),
    card_id: z.string(),
    visit_id: z.number(),
    amount: z.number(),
  }, async ({ location_id, card_id, ...body }) => {
    try {
      const { data } = await client.post(`/visit/loyalty/apply_card_withdrawal/${location_id}/${card_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('cancel_loyalty_card_withdrawal', 'Cancel a loyalty card withdrawal', {
    location_id: z.string().default(DEFAULT_LOCATION),
    card_id: z.string(),
    transaction_id: z.number(),
  }, async ({ location_id, card_id, ...body }) => {
    try {
      const { data } = await client.post(`/visit/loyalty/cancel_card_withdrawal/${location_id}/${card_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('apply_discount_program', 'Apply a discount program to a visit via loyalty card', {
    location_id: z.string().default(DEFAULT_LOCATION),
    card_id: z.string(),
    program_id: z.string(),
    visit_id: z.number(),
  }, async ({ location_id, card_id, program_id, ...body }) => {
    try {
      const { data } = await client.post(`/visit/loyalty/apply_discount_program/${location_id}/${card_id}/${program_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('cancel_discount_program', 'Cancel an applied discount program', {
    location_id: z.string().default(DEFAULT_LOCATION),
    card_id: z.string(),
    program_id: z.string(),
    visit_id: z.number(),
  }, async ({ location_id, card_id, program_id, ...body }) => {
    try {
      const { data } = await client.post(`/visit/loyalty/cancel_discount_program/${location_id}/${card_id}/${program_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('apply_referral_program', 'Apply a referral loyalty program', {
    location_id: z.string().default(DEFAULT_LOCATION),
    chain_id: z.string(),
    visit_id: z.number(),
    referral_phone: z.string().optional(),
  }, async ({ location_id, chain_id, ...body }) => {
    try {
      const { data } = await client.post(`/visit/loyalty/apply_referral_program/${location_id}/${chain_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
