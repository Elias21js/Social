import { createClient } from "@/utils/supabaseServer/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, error: null });
}
