import { addPost, getAllPosts } from "@/app/models/posts.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user_id = req.headers.get("x-user-id");
  const url = new URL(req.url);
  const filter = url.searchParams.get("filter"); // "true" ou null
  const param_id = url.searchParams.get("user_id"); // "true" ou null
  const posts = await getAllPosts(10, param_id ?? user_id, filter); // pega todos os posts do DB
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
