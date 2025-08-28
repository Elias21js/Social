import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabaseMiddleware/middleware";

export async function sessionMiddleware(request: NextRequest) {
  return await updateSession(request);
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // executa em ordem
  const middlewares = [sessionMiddleware];

  for (const mw of middlewares) {
    const result = await mw(req);
    if (result instanceof NextResponse) {
      return result; // se um middleware "interceptar", encerra
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/perfil",
    "/auth",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
