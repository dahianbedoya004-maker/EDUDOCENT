import { createClient } from '@supabase/supabase-js';

// URL y Anon Key del proyecto Supabase de EDUDOCENT:
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://gqbpjqjxrwmeziulefaq.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxYnBqcWp4cndtZXppdWxlZmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MTI0ODgsImV4cCI6MjEwNDM4ODQ4OH0.UH8ho6NkzpwhwET79GdMawxgyAk8t91SMJB2Xt8PNNc';

// Inicialización de cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper para verificar estado de conexión en vivo
export const checkSupabaseStatus = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      return { isConnected: true, url: SUPABASE_URL, details: "Conectado a la API de Supabase" };
    }
    return { isConnected: true, url: SUPABASE_URL, data };
  } catch (err) {
    return { isConnected: false, reason: err.message };
  }
};
