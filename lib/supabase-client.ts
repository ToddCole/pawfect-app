import { createBrowserClient } from '@supabase/ssr';

// Check for required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. ' +
    'Get these values from your Supabase dashboard: https://supabase.com/dashboard/project/_/settings/api'
  );
}

export const supabaseClient = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);