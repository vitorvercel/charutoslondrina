# Configuração do Supabase para Degustações

## Passos para configurar o banco de dados

### 1. Acesse o Supabase Dashboard
- Vá para [supabase.com](https://supabase.com)
- Faça login na sua conta
- Selecione seu projeto

### 2. Execute o Schema SQL
- No menu lateral, clique em "SQL Editor"
- Clique em "New Query"
- Copie e cole o conteúdo do arquivo `database-schema.sql`
- Clique em "Run" para executar

### 3. Verificar a Tabela
- No menu lateral, clique em "Table Editor"
- Você deve ver a tabela `degustacoes` criada
- Verifique se as políticas RLS estão ativas

### 4. Configurar Variáveis de Ambiente
Certifique-se de que seu arquivo `.env.local` contenha:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 5. Testar a Funcionalidade
- Inicie uma nova degustação
- Verifique se os dados são salvos no Supabase
- Finalize uma degustação e verifique se os dados são atualizados

## Estrutura da Tabela

A tabela `degustacoes` contém os seguintes campos:

- **id**: Identificador único da degustação
- **charuto_id**: ID do charuto sendo degustado
- **nome**: Nome do charuto
- **marca**: Marca do charuto
- **pais_origem**: País de origem
- **data_inicio**: Data/hora de início da degustação
- **data_fim**: Data/hora de finalização (quando aplicável)
- **status**: Status da degustação ('em-degustacao' ou 'finalizado')
- **user_id**: ID do usuário (referência à tabela auth.users)

### Campos opcionais:
- **corte**: Tipo de corte feito
- **momento**: Momento do dia
- **fluxo**: Fluxo de ar
- **vitola**: Tamanho/vitola do charuto
- **sabores**: Array de sabores identificados
- **avaliacao**: Nota de 1 a 10
- **duracao_fumo**: Tempo fumado em minutos
- **compraria_novamente**: Se compraria novamente
- **observacoes**: Observações gerais
- **foto_anilha**: URL da foto da anilha
- **notas**: Notas pessoais

## Segurança

- **RLS (Row Level Security)** está habilitado
- Usuários só podem acessar suas próprias degustações
- Todas as operações são validadas pelo usuário autenticado

## Performance

Índices criados para otimizar consultas por:
- user_id
- status
- data_inicio
- charuto_id
