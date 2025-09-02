import database from "../lib/db";

export async function getProfileById(id: string) {
  try {
    const { rows } = await database.query(
      `
      SELECT p.*, u.email
      FROM profiles p
      JOIN auth.users u ON u.id = p.user_id
      WHERE p.user_id = $1
      `,
      [id]
    );
    return rows[0];
  } catch (err) {
    throw err;
  }
}

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

export async function updateAvatarProfile(user_id: string, avatar: { publicUrl: string; filePath: string }) {
  try {
    await database.query("UPDATE profiles SET avatar = $2, avatar_path = $3 WHERE user_id = $1", [
      user_id,
      avatar.publicUrl,
      avatar.filePath,
    ]);
  } catch (err) {
    throw err;
  }
}

export async function updateBannerProfile(user_id: string, banner: { publicUrl: string; filePath: string }) {
  try {
    await database.query("UPDATE profiles SET banner = $2, banner_path = $3 WHERE user_id = $1", [
      user_id,
      banner.publicUrl,
      banner.filePath,
    ]);
  } catch (err) {
    throw err;
  }
}

export async function deleteAvatar(user_id: string) {
  try {
    await database.query("UPDATE profiles SET avatar=NULL, avatar_path=NULL WHERE user_id = $1", [user_id]);
  } catch (err) {
    throw err;
  }
}

export async function deleteBanner(user_id: string) {
  try {
    await database.query("UPDATE profiles SET banner=NULL, banner_path=NULL WHERE user_id = $1", [user_id]);
  } catch (err) {
    throw err;
  }
}
