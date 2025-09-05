import database from "../lib/db";

export async function addLike(user_id: string, post_id: string) {
  try {
    const query = `WITH ins AS (
        INSERT INTO likes (user_id, post_id)
        VALUES ($1, $2)
        RETURNING post_id
        )
        UPDATE posts
        SET like_count = like_count + 1
        WHERE post_id = (SELECT post_id FROM ins);`;
    await database.query(query, [user_id, post_id]);
  } catch (err) {
    throw err;
  }
}

export async function alreadyLiked(user_id: string, post_id: string) {
  try {
    const query = `SELECT EXISTS (SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2) AS liked`;
    const { rows } = await database.query(query, [user_id, post_id]);
    return rows[0].liked;
  } catch (err) {
    throw err;
  }
}

export async function removeLike(user_id: string, post_id: string) {
  try {
    const query = `
        WITH ins AS (
        DELETE FROM likes 
        WHERE user_id=$1 AND post_id=$2 
        RETURNING post_id
        )
        UPDATE posts
        SET like_count = GREATEST(like_count - 1, 0)
        WHERE post_id = (SELECT post_id FROM ins);
        `;
    await database.query(query, [user_id, post_id]);
  } catch (err) {
    throw err;
  }
}
