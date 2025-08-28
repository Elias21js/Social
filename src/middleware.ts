import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  console.log("➡️ pathname:", pathname);
  console.log("➡️ session:", session);

  if (!session && ["/", "/perfil"].includes(pathname)) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (session) {
    res.headers.set("x-user-id", session.user.id);
    console.log(session.user.id);
  }

  return res;
}

// rotas que o middleware vai checar
export const config = {
  matcher: ["/", "/perfil", "/auth"],
};
