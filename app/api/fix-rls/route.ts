import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ 
        error: 'Service key not configured. Please run the SQL commands in Supabase dashboard instead.' 
      }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Check current policies
    const { data: policies, error: policiesError } = await supabaseAdmin
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'breeds');

    console.log('Current policies:', policies);

    // For now, just return the diagnostic info
    return NextResponse.json({
      message: 'RLS diagnostic completed',
      policies: policies,
      serviceKeyConfigured: !!SUPABASE_SERVICE_KEY,
      instructions: 'Please run the SQL commands in the Supabase dashboard as shown in the console.'
    });

  } catch (error: any) {
    console.error('RLS fix error:', error);
    return NextResponse.json(
      { error: 'Failed to fix RLS', details: error.message },
      { status: 500 }
    );
  }
}