import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.getSession();
    if (error) throw error;
    return NextResponse.json({
      ok: true,
      supabase: "connected",
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
