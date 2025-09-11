import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client using the service role key for privileged operations.
// IMPORTANT: Never expose the service role key to the browser. Ensure it exists in server env (.env.local)
// as SUPABASE_SERVICE_ROLE_KEY.
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY (server env)');
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
