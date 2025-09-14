import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await supabaseServer();
    
    // Test basic database connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('breeds')
      .select('count', { count: 'exact', head: true });

    if (healthError) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        details: healthError.message,
        suggestions: [
          'Check that your Supabase project is active',
          'Verify your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
          'Ensure the breeds table exists in your database'
        ]
      }, { status: 500 });
    }

    // Test authentication service
    const { error: authError } = await supabase.auth.getSession();
    
    const authStatus = authError ? 'error' : 'ok';
    
    // Check if auth is properly configured
    const response = {
      status: 'ok',
      database: {
        connection: 'ok',
        breedsTable: healthCheck !== null ? 'ok' : 'missing'
      },
      authentication: {
        service: authStatus,
        error: authError?.message || null
      },
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing'
      },
      suggestions: authError ? [
        'Check Supabase authentication settings in your dashboard',
        'Ensure Row Level Security (RLS) policies are properly configured',
        'Verify that authentication is enabled for your project',
        'Check that your Site URL and Redirect URLs are correct'
      ] : []
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestions: [
        'Check your environment variables (.env.local)',
        'Ensure Supabase project is properly configured',
        'Verify network connectivity'
      ]
    }, { status: 500 });
  }
}