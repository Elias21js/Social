import { supabase } from "@/app/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) return NextResponse.json({ error: "Email obrigatório", success: false }, { status: 400 });

    const { data, error } = await supabase.auth.signUp({
      email,
      password: "qualquerSenhaTemporaria123",
    });

    if (error?.message.includes("already registered")) {
      await supabase.auth.signUp({ email, password: "qualquerSenhaTemporaria123" });
    }

    return NextResponse.json({ message: "Código reenviado, verifique seu e-mail.", success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno", success: false }, { status: 500 });
  }
}
