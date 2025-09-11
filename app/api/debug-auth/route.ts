import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await supabaseServer();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      return NextResponse.json({
        error: 'Auth error',
        details: userError.message,
        user: null
      });
    }

    if (!user) {
      return NextResponse.json({
        error: 'No user found - not logged in',
        user: null
      });
    }

    // Check profiles table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'profiles')
      .eq('table_schema', 'public');

    // Test profiles query
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get all profiles to see what exists
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('profiles')
      .select('*');

    return NextResponse.json({
      success: true,
      user: { 
        id: user.id, 
        email: user.email,
        created_at: user.created_at 
      },
      tableStructure: {
        data: tableInfo,
        error: tableError?.message || null
      },
      userProfile: {
        data: profile,
        error: profileError?.message || null
      },
      allProfiles: {
        data: allProfiles,
        error: allProfilesError?.message || null,
        count: allProfiles?.length || 0
      }
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Internal server error',
      details: (error as Error).message
    }, { status: 500 });
  }
}