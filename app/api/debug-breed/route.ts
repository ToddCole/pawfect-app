import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('User:', user?.email, 'Auth Error:', authError);
    
    const body = await request.json();
    const { breedId, updateData } = body;
    
    console.log('Attempting to update breed:', breedId);
    console.log('With data:', updateData);

    // Try a simple update
    const result = await supabase
      .from('breeds')
      .update(updateData)
      .eq('id', breedId)
      .select()
      .single();

    console.log('Update result:', result);

    return NextResponse.json({
      success: !result.error,
      data: result.data,
      error: result.error,
      user: user?.email
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}