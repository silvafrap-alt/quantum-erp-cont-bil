import { createClient } from '@supabase/supabase-js'

// [SEGURANÇA] Configuração para um ambiente de produção com processo de build (Vite).
// A URL e a chave anónima são injetadas de forma segura a partir de um ficheiro .env.
//
// Exemplo de ficheiro .env:
// VITE_SUPABASE_URL="https://your-ref.supabase.co"
// VITE_SUPABASE_ANON_KEY="your-anon-key"
//
// [IMPORTANTE] A chave anónima (anon key) do Supabase é segura para ser pública APENAS
// se você ATIVAR as Políticas de Segurança a Nível de Linha (RLS) em todas as suas tabelas.
// Sem RLS, qualquer pessoa com esta chave pode aceder a todos os seus dados.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação para garantir que as variáveis de ambiente foram carregadas
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Configuração do Supabase em falta. Verifique as suas variáveis de ambiente (.env).");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
