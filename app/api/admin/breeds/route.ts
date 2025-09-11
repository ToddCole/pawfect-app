import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const size = searchParams.get('size') || '';
    const group = searchParams.get('group') || '';
    const filter = searchParams.get('filter') || '';

    let query = supabase
      .from('breeds')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (size) {
      query = query.eq('size', size);
    }

    if (group) {
      query = query.eq('"group"', group);
    }

    if (filter === 'missing-images') {
      query = query.or('image_url.is.null,image_url.eq.""');
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: breeds, error, count } = await query
      .range(from, to)
      .order('name');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch breeds', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      breeds: breeds || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const breedData = await request.json();

    // Add metadata
    breedData.last_updated = {
      updated_at: new Date().toISOString(),
      updated_by: user.email
    };

    const { data: breed, error } = await supabase
      .from('breeds')
      .insert([breedData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create breed', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      breed
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}