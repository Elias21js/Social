import { postBody } from "../controllers/postController";
import database from "../lib/db";

export async function getAllPosts(limit = 5) {
  try {
    const { rows } = await database.query("SELECT * FROM posts LIMIT $1", [limit]);
    return rows;
  } catch (err) {
    throw err;
  }
}

interface PostModel extends postBody {
  user_id: string;
}

export async function addPost({ user_id, content, image, keywords }: PostModel) {
  try {
    await database.query("INSERT INTO posts (user_id, content, image, keywords) VALUES ($1, $2, $3, $4)", [
      user_id,
      content,
      image,
      keywords,
    ]);
  } catch (err) {
    throw err;
  }
}
