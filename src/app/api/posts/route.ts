import { addPost, getAllPosts } from "@/app/models/posts.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const posts = await getAllPosts(); // pega todos os posts do DB
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const user_id = req.headers.get("x-user-id");
  const body = await req.json();

  console.log("post: ", body);

  try {
    await addPost({ user_id, ...body });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err });
  }
}
