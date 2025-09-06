import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const supabase = await supabaseServer();
    const { data: breed, error } = await supabase
      .from("breeds")
      .select("*")
      .eq("id", id)
      .single();

    return NextResponse.json({
      id: id,
      breed: breed,
      error: error,
      hasBreed: !!breed,
      hasError: !!error
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Exception occurred", 
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}