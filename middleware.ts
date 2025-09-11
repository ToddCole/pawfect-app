import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/auth?redirect=/admin', request.url));
    }

    // Hardcode Todd as admin (primary method)
    if (user.email === 'todd@mensfitnessonline.com.au') {
      console.log(`Admin access granted to Todd: ${user.email}`);
      return response;
    }

    // Check if user has admin role in database (fallback)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      // Redirect to dashboard for non-admin users
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    console.log(`Admin access granted to user: ${user.email}`);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*']
};