import database from "@/app/lib/db";
import { deletePost } from "@/app/models/posts.model";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context: { params: { owner_id?: string; post_id?: string } }) {
  const { owner_id, post_id } = await context.params; // sem await

  if (!owner_id || !post_id) {
    return NextResponse.json({ success: false, error: "Parâmetros inválidos" }, { status: 400 });
  }

  const user_id = req.headers.get("x-user-id");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  );

  if (owner_id !== user_id) {
    return NextResponse.json({
      success: false,
      error: "Não pode apagar posts de outros usuários.",
    });
  }

  try {
    // pega o post pra saber o path da imagem
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("image_path")
      .eq("post_id", post_id)
      .single();

    if (fetchError) {
      return NextResponse.json({ success: false, err: fetchError }, { status: 400 });
    }

    let image_path = post.image_path;
    if (image_path.startsWith("/")) image_path = image_path.slice(1);

    if (image_path) {
      // deleta a imagem do storage
      const { error: storageError, data } = await supabase.storage.from("posts-images").remove([image_path]);
      if (storageError) {
        return NextResponse.json({ success: false, err: storageError }, { status: 400 });
      }
    }

    // deleta o post do banco
    await deletePost({ post_id });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, err }, { status: 500 });
  }
}
