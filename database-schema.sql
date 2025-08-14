CREATE TABLE IF NOT EXISTS degustacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  charuto_id TEXT NOT NULL,
  nome TEXT NOT NULL,
  marca TEXT NOT NULL,
  pais_origem TEXT,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('em-degustacao', 'finalizado')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  corte TEXT,
  momento TEXT,
  fluxo TEXT,
  vitola TEXT,
  
  sabores TEXT[],
  avaliacao INTEGER CHECK (avaliacao >= 1 AND avaliacao <= 10),
  duracao_fumo INTEGER,
  compraria_novamente TEXT,
  observacoes TEXT,
  foto_anilha TEXT,
  notas TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_degustacoes_user_id ON degustacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_degustacoes_status ON degustacoes(status);
CREATE INDEX IF NOT EXISTS idx_degustacoes_data_inicio ON degustacoes(data_inicio);
CREATE INDEX IF NOT EXISTS idx_degustacoes_charuto_id ON degustacoes(charuto_id);

ALTER TABLE degustacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own degustacoes" ON degustacoes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own degustacoes" ON degustacoes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own degustacoes" ON degustacoes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own degustacoes" ON degustacoes
  FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_degustacoes_updated_at
  BEFORE UPDATE ON degustacoes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
