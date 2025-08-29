import { createClient } from "@/utils/supabaseClient/client";

const supabase = createClient();

export const uploadFile = async (file: File) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `/${fileName}`; // pasta dentro do bucket

  const { data, error } = await supabase.storage
    .from("posts-images") // nome do bucket
    .upload(filePath, file);

  if (error) throw error;

  // Retorna a URL pública da imagem
  const {
    data: { publicUrl },
  } = supabase.storage.from("posts-images").getPublicUrl(filePath);
  return publicUrl;
};
