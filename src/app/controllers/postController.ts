import axios from "axios";
import { uploadFile } from "../storage/post.storage";
export interface postBody {
  user_id: string | undefined;
  content: string | null;
  imageFile: File | null;
  keywords: string[] | null;
}

export async function handleAddPost({ user_id, content, imageFile, keywords }: postBody) {
  let imageUrl: { publicUrl: string; filePath: string } | null;
  if (imageFile) {
    imageUrl = await uploadFile(imageFile, user_id);
  } else {
    imageUrl = null;
  }

  try {
    const {
      data: { success },
    } = await axios.post<{ success: boolean }>(process.env.NEXT_PUBLIC_API_URL + "/posts", {
      content,
      image: imageUrl?.publicUrl,
      image_path: imageUrl?.filePath,
      keywords,
    });
    return success;
  } catch (err) {
    throw err;
  }
}

export async function handleDeletePost({
  postId: post_id,
  postOwnerId: owner_id,
}: {
  postId: string;
  postOwnerId: string;
}) {
  try {
    const {
      data: { success },
    } = await axios.delete<{ success: boolean }>(process.env.NEXT_PUBLIC_API_URL + `/posts/${owner_id}/${post_id}`);

    return success;
  } catch (err) {
    throw err;
  }
}
