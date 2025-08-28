import axios, { AxiosResponse } from "axios";

export interface postBody {
  content: string | null;
  image: string | undefined;
  keywords: string[] | null;
}

export async function handleAddPost(post: postBody) {
  try {
    const {
      data: { success },
    } = await axios.post<{ success: boolean }>(process.env.NEXT_PUBLIC_API_URL + "/posts", post);
    return success;
  } catch (err) {
    throw err;
  }
}
