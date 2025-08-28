import { addPost } from "@/app/models/posts.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user_id = req.headers.get("x-user-id");
  const body = await req.json();

  console.log(user_id, body);

  try {
    // await addPost({ user_id, ...post });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err });
  }
}
