import { postBody } from "../controllers/postController";
import database from "../lib/db";

export async function getAllPosts(limit = 15, user_id?: string | null, filter?: string | null) {
  try {
    const { rows } = await database.query(
      `
      SELECT 
        posts.*, 
        profiles.name AS user_name,
        auth.users.email AS user_email,
        profiles.avatar AS user_avatar,
        CASE WHEN l.user_id IS NOT NULL THEN true ELSE false END AS liked,
        CASE WHEN posts.user_id = $2 THEN true ELSE false END AS "isOwner"
      FROM posts
      JOIN auth.users ON posts.user_id = auth.users.id
      JOIN profiles ON posts.user_id = profiles.user_id
      LEFT JOIN likes l 
        ON l.post_id = posts.post_id AND l.user_id = $2
      ${filter ? "WHERE posts.user_id = $2" : ""}
      ORDER BY posts.created_at DESC
      LIMIT $1;
      `,
      [limit, user_id ?? null]
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
