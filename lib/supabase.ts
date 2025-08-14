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
