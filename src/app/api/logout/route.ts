import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabaseServer/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut(); // limpa session + cookies automaticamente

  return NextResponse.json({ success: true });
}
