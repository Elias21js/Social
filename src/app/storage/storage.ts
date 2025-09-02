import { createClient } from "@/utils/supabaseClient/client";

const supabase = createClient();

export const clearUserFolder = async (user_id: string, bucket: string) => {
  const folder = `${user_id}/`; // pasta do usuário

  // 1️⃣ listar arquivos existentes
  const { data: existingFiles, error: listError } = await supabase.storage.from(bucket).list(folder);

  if (listError) throw listError;

  // 2️⃣ remover todos os arquivos encontrados
  if (existingFiles?.length) {
    const oldFiles = existingFiles.map((f) => `${folder}${f.name}`);
    const { error: removeError } = await supabase.storage.from(bucket).remove(oldFiles);
    if (removeError) throw removeError;
  }

  // ✅ todos os arquivos antigos foram removidos
};
