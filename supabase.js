// ============================================================
// SEMCENSURA — SUPABASE CLIENT
// Inclua este arquivo no index.html com:
// <script src="supabase.js"></script>
// ============================================================

const SUPABASE_URL = 'https://jazmbacnjeczxcvkylrr.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imphem1iYWNuamVjenhjdmt5bHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NDYzMzgsImV4cCI6MjA5NTQyMjMzOH0.IzOK46SrD-TRxXoKx6uy2zzJousJ19lSWAqxoyL8E4k';

// Helper: faz requisição REST ao Supabase
async function sbReq(method, table, opts = {}) {
  const { filter, body, select, order } = opts;
  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  const params = [];
  if (select) params.push(`select=${select}`);
  if (filter) params.push(filter);
  if (order) params.push(`order=${order}`);
  if (params.length) url += '?' + params.join('&');

  const res = await fetch(url, {
    method,
    headers: {
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase ${method} ${table}: ${err}`);
  }
  if (method === 'DELETE' || (method === 'PATCH' && !opts.select)) return true;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ============================================================
// PRODUTOS
// ============================================================
const DB = {
  async getProdutos() {
    try {
      const data = await sbReq('GET', 'produtos', { order: 'criado_em.asc' });
      return data || [];
    } catch (e) {
      console.warn('Supabase offline, usando localStorage', e);
      return JSON.parse(localStorage.getItem('sc_produtos') || '[]');
    }
  },

  async salvarProduto(produto) {
    try {
      const result = await sbReq('POST', 'produtos', { body: produto });
      return result;
    } catch (e) {
      console.error('Erro ao salvar produto:', e);
      return null;
    }
  },

  async atualizarEstoque(produtoId, estoque) {
    try {
      await sbReq('PATCH', `produtos?id=eq.${produtoId}`, { body: { estoque } });
      return true;
    } catch (e) {
      console.error('Erro ao atualizar estoque:', e);
      return false;
    }
  },

  async atualizarCliques(produtoId, cliques) {
    try {
      await sbReq('PATCH', `produtos?id=eq.${produtoId}`, { body: { cliques } });
    } catch (e) {
      // silencia — cliques não são críticos
    }
  },

  async deletarProduto(produtoId) {
    try {
      await sbReq('DELETE', `produtos?id=eq.${produtoId}`);
      return true;
    } catch (e) {
      console.error('Erro ao deletar produto:', e);
      return false;
    }
  },

  // ============================================================
  // CLIENTES
  // ============================================================
  async getClientes() {
    try {
      const data = await sbReq('GET', 'clientes', { order: 'criado_em.desc' });
      return data || [];
    } catch (e) {
      return JSON.parse(localStorage.getItem('sc_clientes') || '[]');
    }
  },

  async buscarClientePorTel(tel) {
    const cleanTel = tel.replace(/\D/g, '');
    try {
      // busca por qualquer formato que contenha os dígitos
      const todos = await sbReq('GET', 'clientes');
      if (!todos) return null;
      return todos.find(c => (c.tel || '').replace(/\D/g, '') === cleanTel) || null;
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('sc_clientes') || '[]');
      return local.find(c => (c.tel || '').replace(/\D/g, '') === cleanTel) || null;
    }
  },

  async salvarCliente(nome, tel) {
    const cli = {
      id: crypto.randomUUID(),
      nome,
      tel,
      criado_em: new Date().toISOString()
    };
    try {
      await sbReq('POST', 'clientes', { body: cli });
      return cli;
    } catch (e) {
      console.error('Erro ao salvar cliente:', e);
      // fallback local
      const local = JSON.parse(localStorage.getItem('sc_clientes') || '[]');
      local.push({ ...cli, data: new Date().toLocaleDateString('pt-BR') });
      localStorage.setItem('sc_clientes', JSON.stringify(local));
      return cli;
    }
  },

  async atualizarClienteTel(clienteId, novoTel) {
    try {
      await sbReq('PATCH', `clientes?id=eq.${clienteId}`, { body: { tel: novoTel } });
      return true;
    } catch (e) {
      return false;
    }
  },

  // ============================================================
  // PEDIDOS
  // ============================================================
  async getPedidos() {
    try {
      const data = await sbReq('GET', 'pedidos', { order: 'criado_em.desc' });
      return data || [];
    } catch (e) {
      return JSON.parse(localStorage.getItem('sc_pedidos') || '[]');
    }
  },

  async getPedidosPorCliente(clienteNome) {
    try {
      const data = await sbReq('GET', 'pedidos', {
        filter: `cliente_nome=eq.${encodeURIComponent(clienteNome)}`,
        order: 'criado_em.desc'
      });
      return data || [];
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('sc_pedidos') || '[]');
      return local.filter(p => p.clienteNome === clienteNome || p.cliente_nome === clienteNome);
    }
  },

  async salvarPedido(pedido) {
    const row = {
      id: pedido.id,
      cliente_nome: pedido.clienteNome,
      cliente_tel: pedido.clienteTel,
      itens: pedido.itens,
      total_itens: pedido.totalItens,
      status: pedido.status || 'pendente',
      data: pedido.data,
      criado_em: new Date().toISOString()
    };
    try {
      await sbReq('POST', 'pedidos', { body: row });
      return true;
    } catch (e) {
      console.error('Erro ao salvar pedido:', e);
      // fallback local
      const local = JSON.parse(localStorage.getItem('sc_pedidos') || '[]');
      local.push(pedido);
      localStorage.setItem('sc_pedidos', JSON.stringify(local));
      return false;
    }
  },

  async atualizarStatusPedido(pedidoId, status) {
    try {
      await sbReq('PATCH', `pedidos?id=eq.${pedidoId}`, { body: { status } });
      return true;
    } catch (e) {
      return false;
    }
  },

  async deletarPedido(pedidoId) {
    try {
      await sbReq('DELETE', `pedidos?id=eq.${pedidoId}`);
      return true;
    } catch (e) {
      return false;
    }
  }
};
