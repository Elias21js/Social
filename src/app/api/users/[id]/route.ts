import { NextRequest, NextResponse } from "next/server";
import { getProfileById } from "@/app/models/users.models";

// GET /api/users/[id] → busca o perfil
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const param = await params;
    const profile = await getProfileById(param.id);

    if (!profile) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 });
  }
}
