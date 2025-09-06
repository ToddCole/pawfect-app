import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("breeds")
      .select("id")
      .order("name")
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: false });
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
    });
  } catch (error) {
    return NextResponse.json({ ok: false });
  }
}