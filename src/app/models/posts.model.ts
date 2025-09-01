import { postBody } from "../controllers/postController";
import database from "../lib/db";

export async function getAllPosts(limit = 15) {
  try {
    const { rows } = await database.query(
      `
    SELECT 
      posts.*, 
      profiles.name AS user_name,
      auth.users.email AS user_email,
      profiles.avatar AS user_avatar
    FROM posts
    JOIN auth.users ON posts.user_id = auth.users.id
    JOIN profiles ON posts.user_id = profiles.user_id
    ORDER BY posts.created_at DESC
    LIMIT $1;
      `,
      [limit]
    );
    return rows;
  } catch (err) {
    throw err;
  }
}

interface PostModel extends postBody {
  user_id: string;
  image: string;
  image_path: string;
}

export async function addPost({ user_id, content, image, image_path, keywords }: PostModel) {
  try {
    await database.query(
      "INSERT INTO posts (user_id, content, image, image_path, keywords) VALUES ($1, $2, $3, $4, $5)",
      [user_id, content, image, image_path, keywords]
    );
  } catch (err) {
    throw err;
  }
}

export async function deletePost({ post_id }: { post_id: string }) {
  try {
    await database.query("DELETE FROM posts WHERE post_id=$1", [post_id]);
  } catch (err) {
    throw err;
  }
}
