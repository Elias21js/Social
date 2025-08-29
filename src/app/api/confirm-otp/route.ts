// src/app/api/auth/confirm-otp/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createUserProfile } from "@/app/models/users.models";

export async function POST(req: NextRequest) {
  const { email, token, name } = await req.json();

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {}
        },
      },
      cookieEncoding: "base64url",
    }
  );

  // verifica OTP e loga automaticamente
  const { data, error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  if (verifyError) {
    return NextResponse.json({ success: false, error: verifyError.message }, { status: 400 });
  }

  // cria perfil do usuário
  await createUserProfile({ user_id: data.user?.id, name });

  // o helper já setou os cookies, então só retornamos sucesso
  return NextResponse.json({ success: true, user: data.user });
}
