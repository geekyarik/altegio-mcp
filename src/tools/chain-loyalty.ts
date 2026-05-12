import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import client from '../api-client';

export function registerChainLoyaltyTools(server: McpServer) {
  server.tool('freeze_membership', 'Freeze a membership/abonement', {
    chain_id: z.string(),
    membership_id: z.string(),
    freeze_date: z.string().optional().describe('Format: YYYY-MM-DD'),
    unfreeze_date: z.string().optional().describe('Format: YYYY-MM-DD'),
  }, async ({ chain_id, membership_id, ...body }) => {
    try {
      const { data } = await client.post(`/chain/${chain_id}/loyalty/abonements/${membership_id}/freeze`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('unfreeze_membership', 'Unfreeze a frozen membership/abonement', {
    chain_id: z.string(),
    membership_id: z.string(),
  }, async ({ chain_id, membership_id }) => {
    try {
      const { data } = await client.post(`/chain/${chain_id}/loyalty/abonements/${membership_id}/unfreeze`, {});
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('set_membership_balance', 'Set the balance/visits remaining on a membership', {
    chain_id: z.string(),
    membership_id: z.string(),
    balance: z.number(),
  }, async ({ chain_id, membership_id, balance }) => {
    try {
      const { data } = await client.post(`/chain/${chain_id}/loyalty/abonements/${membership_id}/set_balance`, { balance });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('set_membership_period', 'Set the validity period of a membership', {
    chain_id: z.string(),
    membership_id: z.string(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }, async ({ chain_id, membership_id, ...body }) => {
    try {
      const { data } = await client.post(`/chain/${chain_id}/loyalty/abonements/${membership_id}/set_period`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_chain_membership_types', 'List membership/abonement types for a chain', {
    chain_id: z.string(),
  }, async ({ chain_id }) => {
    try {
      const { data } = await client.get(`/chain/${chain_id}/loyalty/abonement_types`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_chain_membership_type', 'Create a membership type at chain level', {
    chain_id: z.string(),
    title: z.string(),
    period: z.number().optional().describe('Validity period in days'),
    services: z.array(z.number()).optional(),
    visit_limit: z.number().optional(),
    price: z.number().optional(),
  }, async ({ chain_id, ...body }) => {
    try {
      const { data } = await client.post(`/chain/${chain_id}/loyalty/abonement_types`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_chain_membership_type', 'Get a chain membership type by ID', {
    chain_id: z.string(),
    loyalty_membership_type_id: z.string(),
  }, async ({ chain_id, loyalty_membership_type_id }) => {
    try {
      const { data } = await client.get(`/chain/${chain_id}/loyalty/abonement_types/${loyalty_membership_type_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_chain_membership_type', 'Update a chain membership type', {
    chain_id: z.string(),
    loyalty_membership_type_id: z.string(),
    title: z.string().optional(),
    period: z.number().optional(),
    visit_limit: z.number().optional(),
    price: z.number().optional(),
  }, async ({ chain_id, loyalty_membership_type_id, ...body }) => {
    try {
      const { data } = await client.put(`/chain/${chain_id}/loyalty/abonement_types/${loyalty_membership_type_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_chain_membership_type', 'Delete a chain membership type', {
    chain_id: z.string(),
    loyalty_membership_type_id: z.string(),
  }, async ({ chain_id, loyalty_membership_type_id }) => {
    try {
      const { data } = await client.delete(`/chain/${chain_id}/loyalty/abonement_types/${loyalty_membership_type_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_chain_certificate_types', 'List gift card/certificate types for a chain', {
    chain_id: z.string(),
  }, async ({ chain_id }) => {
    try {
      const { data } = await client.get(`/chain/${chain_id}/loyalty/certificate_types`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_chain_certificate_type', 'Create a gift card type at chain level', {
    chain_id: z.string(),
    title: z.string(),
    amount: z.number().optional(),
    period: z.number().optional(),
    services: z.array(z.number()).optional(),
  }, async ({ chain_id, ...body }) => {
    try {
      const { data } = await client.post(`/chain/${chain_id}/loyalty/certificate_types`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_chain_certificate_type', 'Get a chain gift card type by ID', {
    chain_id: z.string(),
    type_id: z.string(),
  }, async ({ chain_id, type_id }) => {
    try {
      const { data } = await client.get(`/chain/${chain_id}/loyalty/certificate_types/${type_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_chain_certificate_type', 'Update a chain gift card type', {
    chain_id: z.string(),
    type_id: z.string(),
    title: z.string().optional(),
    amount: z.number().optional(),
    period: z.number().optional(),
  }, async ({ chain_id, type_id, ...body }) => {
    try {
      const { data } = await client.put(`/chain/${chain_id}/loyalty/certificate_types/${type_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('delete_chain_certificate_type', 'Delete a chain gift card type', {
    chain_id: z.string(),
    type_id: z.string(),
  }, async ({ chain_id, type_id }) => {
    try {
      const { data } = await client.delete(`/chain/${chain_id}/loyalty/certificate_types/${type_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('create_chain_loyalty_program', 'Create a loyalty program at chain level', {
    chain_id: z.string(),
    title: z.string(),
    type: z.string().optional().describe('Program type: discount, cashback, etc.'),
  }, async ({ chain_id, ...body }) => {
    try {
      const { data } = await client.post(`/chain/${chain_id}/loyalty/programs`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('get_chain_loyalty_program', 'Get a chain loyalty program by ID', {
    chain_id: z.string(),
    loyalty_program_id: z.string(),
  }, async ({ chain_id, loyalty_program_id }) => {
    try {
      const { data } = await client.get(`/chain/${chain_id}/loyalty/programs/${loyalty_program_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('update_chain_loyalty_program', 'Update a chain loyalty program', {
    chain_id: z.string(),
    loyalty_program_id: z.string(),
    title: z.string().optional(),
    type: z.string().optional(),
  }, async ({ chain_id, loyalty_program_id, ...body }) => {
    try {
      const { data } = await client.put(`/chain/${chain_id}/loyalty/programs/${loyalty_program_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });

  server.tool('list_chain_loyalty_transactions', 'List loyalty transactions at chain level', {
    chain_id: z.string(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    page: z.number().optional(),
    count: z.number().optional(),
  }, async ({ chain_id, ...params }) => {
    try {
      const { data } = await client.get(`/chain/${chain_id}/loyalty/transactions`, { params });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    } catch (err: any) {
      return { content: [{ type: 'text', text: `Error: ${err.response?.data?.meta?.message ?? err.message}` }], isError: true };
    }
  });
}
