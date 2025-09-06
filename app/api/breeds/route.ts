import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await supabaseServer();
    
    const { data: breeds, error } = await supabase
      .from('breeds')
      .select('id,name,size,image_url,group,temperament,energy_level,good_with_kids,training_ease')
      .order('name');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch breeds from database', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      breeds: breeds || [],
      total: breeds?.length || 0
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}