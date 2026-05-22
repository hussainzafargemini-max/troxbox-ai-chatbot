import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase credentials for token validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We gate any path starting with /admin (except for /admin/login) 
  // and any private administrative API endpoint starting with /api/admin.
  const isAdminPath = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApiPath = pathname.startsWith('/api/admin');

  if (isAdminPath || isAdminApiPath) {
    let isAuthenticated = false;

    // Retrieve token from request cookies
    const tokenCookie = request.cookies.get('sb-access-token');
    const token = tokenCookie?.value;

    if (token && supabaseUrl && supabaseAnonKey) {
      try {
        // Create an isolated instance of Supabase inside middleware to check token validity
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: false,
          },
        });
        
        // Fetch user matching the access token
        const { data, error } = await supabase.auth.getUser(token);
        if (!error && data?.user) {
          isAuthenticated = true;
        }
      } catch (err) {
        console.error('Middleware auth check failed:', err);
      }
    }

    // If verification fails, redirect or return unauthorized
    if (!isAuthenticated) {
      if (isAdminApiPath) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized: Admin authentication required.' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        const loginUrl = new URL('/admin/login', request.url);
        // Store current path as search param to redirect back after successful login
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Continue standard routing
  return NextResponse.next();
}

// Config to specify matching route paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
