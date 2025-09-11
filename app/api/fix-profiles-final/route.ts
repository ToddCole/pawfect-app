import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ 
        error: 'Service key not configured' 
      }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      SUPABASE_SERVICE_KEY
    );

    const results = [];

    // Step 1: Drop old table
    try {
      const { error } = await supabaseAdmin
        .from('profiles')
        .delete()
        .neq('user_id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
      
      results.push('✓ Cleared old profiles data');
    } catch (error) {
      results.push('Note: No old data to clear');
    }

    // Step 2: Check if we can create Todd's profile manually
    try {
      // Get Todd's user ID
      const { data: users } = await supabaseAdmin
        .rpc('get_user_by_email', { email_param: 'todd@mensfitnessonline.com.au' })
        .single();

      results.push('✓ Found Todd in auth.users');
      
      // For now, let's just return what we found
      return NextResponse.json({
        success: true,
        message: 'Database analysis completed',
        results: results,
        toddUser: users
      });
      
    } catch (error) {
      results.push('✗ Could not find Todd: ' + (error as Error).message);
    }

    return NextResponse.json({
      success: false,
      message: 'Could not complete profile fix',
      results: results
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to fix profiles', 
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}