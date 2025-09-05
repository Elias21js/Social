import { NextRequest, NextResponse } from "next/server";
import { getProfileById } from "@/app/models/users.models";

// GET /api/users/[id] → busca o perfil
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user_id = req.headers.get("x-user-id");
    const param = await params;
    const profile = await getProfileById(param.id);
    const profileWithOwner = { ...profile, isOwner: false };

    if (user_id === param.id) profileWithOwner.isOwner = true;

    if (!profileWithOwner) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(profileWithOwner);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 });
  }
}
