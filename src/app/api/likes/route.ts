import { handleActionLike } from "@/app/controllers/likeController";
import { canLike } from "@/app/lib/canLike";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { user_id, post_id } = body;

  if (!canLike(user_id)) {
    return NextResponse.json({ success: false, message: "Devagar aí! 😅" }, { status: 429 });
  }

  try {
    const { liked } = await handleActionLike(user_id, post_id);

    return NextResponse.json({ success: true, liked }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: true, err }, { status: 400 });
  }
}
