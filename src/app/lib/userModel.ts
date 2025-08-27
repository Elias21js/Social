import database from "./db";

interface Profile {
  user_id: string | undefined;
  name: string;
}

export async function createUserProfile({ user_id, name }: Profile) {
  try {
    await database.query("INSERT INTO profiles (user_id, name) VALUES ($1, $2)", [user_id, name]);
  } catch (err) {
    throw err;
  }
}

interface Exists {
  email: string;
}

export async function userExists({ email }: Exists) {
  try {
    const { rows } = await database.query("SELECT * FROM auth.users WHERE email = $1", [email]);
    return rows[0];
  } catch (err) {
    throw err;
  }
}
