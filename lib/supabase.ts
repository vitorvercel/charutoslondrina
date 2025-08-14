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
