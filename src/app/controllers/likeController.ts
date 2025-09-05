import { addLike, alreadyLiked, removeLike } from "../models/likes.model";

export async function handleActionLike(user_id: string, post_id: string) {
  try {
    const userAlreadyLiked = await alreadyLiked(user_id, post_id);
    if (userAlreadyLiked) {
      console.log(userAlreadyLiked);
      await removeLike(user_id, post_id);
      return { liked: false };
    } else {
      await addLike(user_id, post_id);
      return { liked: true };
    }
  } catch (err) {
    throw err;
  }
}
