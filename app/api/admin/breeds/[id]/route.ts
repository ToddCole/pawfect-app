import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabaseServer } from '@/lib/supabase-server';

// Basic admin check: allowlisted email or role=admin in profiles
async function requireAdmin() {
  const supabase = await supabaseServer();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { ok: false, reason: 'Not authenticated' } as const;

  // Primary allowlist check
  if (user.email === 'todd@mensfitnessonline.com.au') {
    return { ok: true, user } as const;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'admin') return { ok: true, user } as const;
  return { ok: false, reason: 'Not authorized' } as const;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.reason }, { status: 401 });
    }

    const id = params.id;
    const body = await req.json().catch(() => ({}));

    // Sanitize payload: keep only known columns and drop id
    const allowedCols = new Set([
      'name','size','group','origin','breed_type','coat_type',
      'weight_min','weight_max','height_min','height_max','lifespan_min','lifespan_max',
      'monthly_cost_aud','popularity_rank',
      'energy_level','good_with_kids','good_with_pets','training_ease','grooming_needs','shedding_level','barking_level','apartment_friendly','drooling_tendency','separation_anxiety_risk','climate_suitability','noise_sensitivity',
      'description','temperament','exercise_needs','grooming','training','lifespan','shedding_description',
      'data_source','image_url','last_updated'
    ]);

    const cleaned = Object.fromEntries(
      Object.entries(body || {})
        .filter(([k]) => allowedCols.has(k))
        .map(([k, v]) => {
          if (v === '') return [k, null];
          if (typeof v === 'number' && Number.isNaN(v)) return [k, null];
          return [k, v];
        })
    );

    const admin = supabaseAdmin();
    const { error } = await admin
      .from('breeds')
      .update(cleaned)
      .eq('id', id);

    if (error) {
      console.error('Admin update error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin update exception:', err);
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}