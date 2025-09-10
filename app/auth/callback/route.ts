import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirect = url.searchParams.get('redirect') || '/';

  const response = NextResponse.redirect(new URL(redirect, url.origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // No need to read cookies for initial exchange
          return [];
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    // This will parse the code/type in the URL and set the session cookies
    await supabase.auth.exchangeCodeForSession(request.url);
  } catch (e) {
    // If exchange fails, still redirect; client UI will handle auth state
    console.error('Auth callback exchange failed:', e);
  }

  return response;
}
