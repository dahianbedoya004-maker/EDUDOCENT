import { createClient } from '@supabase/supabase-js';

// URL del proyecto Supabase del usuario:
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://gqbpjqjxrwmeziulefaq.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Inicialización de cliente Supabase
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Helper para verificar estado de conexión
export const checkSupabaseStatus = async () => {
  if (!SUPABASE_ANON_KEY) {
    return { isConnected: false, reason: "Falta la clave pública VITE_SUPABASE_ANON_KEY" };
  }
  try {
    const { error } = await supabase.from('_healthcheck_').select('*').limit(1);
    if (error && error.code === 'PGRST301') {
      return { isConnected: false, reason: "Error de permisos JWT o Anon Key inválida" };
    }
    return { isConnected: true, url: SUPABASE_URL };
  } catch (err) {
    return { isConnected: false, reason: err.message };
  }
};
