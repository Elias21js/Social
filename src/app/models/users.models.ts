import database from "../lib/db";

export async function getProfileById(id: string) {
  try {
    const { rows } = await database.query("SELECT * FROM profiles WHERE user_id=$1", [id]);
    return rows[0];
  } catch (err) {
    throw err;
  }
}
