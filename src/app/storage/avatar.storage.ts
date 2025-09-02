import { createClient } from "@/utils/supabaseClient/client";
import { clearUserFolder } from "./storage";

const supabase = createClient();

export const uploadAvatar = async (user_id: string, file: File) => {
  await clearUserFolder(user_id, "avatars");
  const fileExt = file.name.split(".").pop();
  const fileName = `${user_id}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  return { publicUrl, filePath: fileName };
};

export const removeAvatar = async (avatar_path: string) => {
  try {
    const { error: removeError } = await supabase.storage.from("avatars").remove([avatar_path]);

    if (removeError) throw removeError;

    return { success: true };
  } catch (err) {
    throw err;
  }
};
