import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClientComponentClient({
  supabaseUrl,
  supabaseKey: supabaseAnonKey,
})

// Tipos para o estoque de charutos
export interface CharutoEstoque {
  id: string
  user_id: string
  nome: string
  marca: string
  pais_origem?: string
  preco?: number
  quantidade: number
  data_compra?: string
  foto?: string
  created_at: string
  updated_at: string
}

// Tipos para os produtos
export interface Produto {
  id: number
  nome: string
  descricao: string
  preco: number
  categoria: string
  marca: string
  origem: string
  imagem_url: string
  estoque: number
  ativo: boolean
  created_at: string
}

export interface Categoria {
  id: number
  nome: string
  descricao: string
  ativo: boolean
}

// Tipos para autenticação
export interface UserProfile {
  id: string
  email: string
  nome: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// Tipos para degustação
export interface CharutoDegustacao {
  id: string
  charuto_id: string
  nome: string
  marca: string
  pais_origem: string
  data_inicio: string
  data_fim?: string
  status: "em-degustacao" | "finalizado"
  user_id: string

  // Dados da etapa 2 (início da degustação)
  corte?: string
  momento?: string
  fluxo?: string
  vitola?: string

  // Dados da etapa 3 (finalização)
  sabores?: string[]
  avaliacao?: number
  duracao_fumo?: number
  compraria_novamente?: string
  observacoes?: string
  foto_anilha?: string
  notas?: string

  created_at: string
  updated_at: string
}

// Funções para gerenciar estoque de charutos
export const estoqueService = {
  async getCharutos(userId: string): Promise<CharutoEstoque[]> {
    const { data, error } = await supabase
      .from('estoque_charutos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar estoque:', error)
      throw error
    }

    return data || []
  },

  async createCharuto(charuto: Omit<CharutoEstoque, 'id' | 'created_at' | 'updated_at'>): Promise<CharutoEstoque> {
    const { data, error } = await supabase
      .from('estoque_charutos')
      .insert([charuto])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar charuto no estoque:', error)
      throw error
    }

    return data
  },

  async updateCharuto(id: string, updates: Partial<CharutoEstoque>): Promise<CharutoEstoque> {
    const { data, error } = await supabase
      .from('estoque_charutos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar charuto no estoque:', error)
      throw error
    }

    return data
  },

  async deleteCharuto(id: string): Promise<void> {
    const { error } = await supabase
      .from('estoque_charutos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao excluir charuto no estoque:', error)
      throw error
    }
  },

  async decrementQuantidade(id: string, decremento: number = 1): Promise<CharutoEstoque> {
    // Tenta usar função RPC para update atômico
    const { data: rpcData, error: rpcError } = await supabase.rpc('decrement_estoque_charuto', {
      p_charuto_id: id,
      p_decremento: decremento,
    })

    if (!rpcError && rpcData) {
      return rpcData as CharutoEstoque
    }

    // Fallback: ler e atualizar com verificação
    const { data: atual, error: readError } = await supabase
      .from('estoque_charutos')
      .select('*')
      .eq('id', id)
      .single()

    if (readError) {
      console.error('Erro ao ler charuto para decrementar:', readError)
      throw readError
    }

    const novaQuantidade = Math.max(0, (atual?.quantidade || 0) - decremento)

    const { data: atualizado, error: updateError } = await supabase
      .from('estoque_charutos')
      .update({ quantidade: novaQuantidade, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Erro ao decrementar quantidade:', updateError)
      throw updateError
    }

    return atualizado as CharutoEstoque
  }
}

// Funções para gerenciar degustações
export const degustacaoService = {
  // Buscar todas as degustações do usuário
  async getDegustacoes(userId: string): Promise<CharutoDegustacao[]> {
    const { data, error } = await supabase
      .from('degustacoes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar degustações:', error)
      throw error
    }

    return data || []
  },

  // Buscar degustações por status
  async getDegustacoesByStatus(userId: string, status: "em-degustacao" | "finalizado"): Promise<CharutoDegustacao[]> {
    const { data, error } = await supabase
      .from('degustacoes')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar degustações por status:', error)
      throw error
    }

    return data || []
  },

  // Criar nova degustação
  async createDegustacao(degustacao: Omit<CharutoDegustacao, 'id' | 'created_at' | 'updated_at'>): Promise<CharutoDegustacao> {
    const { data, error } = await supabase
      .from('degustacoes')
      .insert([degustacao])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar degustação:', error)
      throw error
    }

    return data
  },

  // Atualizar degustação
  async updateDegustacao(id: string, updates: Partial<CharutoDegustacao>): Promise<CharutoDegustacao> {
    const { data, error } = await supabase
      .from('degustacoes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar degustação:', error)
      throw error
    }

    return data
  },

  // Finalizar degustação
  async finalizarDegustacao(id: string, dadosFinais: {
    sabores?: string[]
    avaliacao?: number
    duracao_fumo?: number
    compraria_novamente?: string
    observacoes?: string
    foto_anilha?: string
    notas?: string
  }): Promise<CharutoDegustacao> {
    const { data, error } = await supabase
      .from('degustacoes')
      .update({
        ...dadosFinais,
        status: 'finalizado',
        data_fim: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao finalizar degustação:', error)
      throw error
    }

    return data
  },

  // Remover degustação
  async deleteDegustacao(id: string): Promise<void> {
    const { error } = await supabase
      .from('degustacoes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao remover degustação:', error)
      throw error
    }
  }
}
