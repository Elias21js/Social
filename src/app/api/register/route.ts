import { userSchema } from "@/utils/joi/userSchema";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { value, error } = userSchema.validate(body);
    const { name, email, password } = value;

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

    const { data, error: errSignup } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) return NextResponse.json({ error: error.message, success: false }, { status: 400 });
    if (errSignup) return NextResponse.json({ error: errSignup.message, success: false }, { status: 400 });

    return NextResponse.json({ message: "Usuário registrado. Verifique o e-mail para confirmar.", success: true });
  } catch (err) {
    throw err;
  }
}
