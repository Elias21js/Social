import database from "../lib/db";

export async function getAllPosts(limit = 5) {
  try {
    const { rows } = await database.query("SELECT * FROM posts LIMIT $1", [limit]);
    return rows;
  } catch (err) {
    throw err;
  }
}
