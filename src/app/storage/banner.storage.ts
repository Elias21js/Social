import { createClient } from "@/utils/supabaseClient/client";
import { clearUserFolder } from "./storage";

const supabase = createClient();

export const uploadBanner = async (user_id: string, file: File) => {
  await clearUserFolder(user_id, "banners");

  const fileExt = file.name.split(".").pop();
  const fileName = `${user_id}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from("banners").upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("banners").getPublicUrl(fileName);

  return { publicUrl, filePath: fileName };
};

export const removeBanner = async (banner_path: string) => {
  try {
    const { error: removeError } = await supabase.storage.from("banners").remove([banner_path]);

    if (removeError) throw removeError;

    return { success: true };
  } catch (err) {
    throw err;
  }
};
