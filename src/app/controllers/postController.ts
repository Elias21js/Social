import axios from "axios";
import { uploadFile } from "../storage/post.storage";
export interface postBody {
  content: string | null;
  imageFile: File | null;
  keywords: string[] | null;
}

export async function handleAddPost({ content, imageFile, keywords }: postBody) {
  let imageUrl: string | null = null;
  if (imageFile) {
    imageUrl = await uploadFile(imageFile);
  }

  try {
    const {
      data: { success },
    } = await axios.post<{ success: boolean }>(process.env.NEXT_PUBLIC_API_URL + "/posts", {
      content,
      image: imageUrl,
      keywords,
    });
    return success;
  } catch (err) {
    throw err;
  }
}
