import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { v4 as uuidv4 } from 'uuid';

// Save quiz results
export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Get user (might be null for guests)
    const { data: { user } } = await supabase.auth.getUser();
    
    const body = await request.json();
    const { answers, matches, sessionId } = body;

    const resultData = {
      user_id: user?.id || null,
      session_id: sessionId || uuidv4(), // Generate session ID for guests
      answers,
      matches,
      is_guest: !user,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: result, error } = await supabase
      .from('quiz_results')
      .insert([resultData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save quiz results', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result,
      sessionId: result.session_id,
      message: user ? 'Results saved to your account' : 'Results saved temporarily'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Get user's quiz results
export async function GET(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: results, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch quiz results', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      results: results || []
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}