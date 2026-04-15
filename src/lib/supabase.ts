import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eadskqzrzwkwixyqkrot.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhZHNrcXpyendrd2l4eXFrcm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDgxMzcsImV4cCI6MjA3OTA4NDEzN30.vPm9tPhhqcbGuRHynZ1i7bJj4pAVkrnnftQqqqbbYwU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
};
