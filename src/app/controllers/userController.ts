"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  deleteAvatar,
  deleteBanner,
  getProfileById,
  updateAvatarProfile,
  updateBannerProfile,
} from "../models/users.models";

export async function getUser() {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch {}
          },
        },
        cookieEncoding: "base64url",
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Usuário não autenticado");

    const { id, email, created_at, user_metadata } = user;
    const { name } = user_metadata;

    const { avatar, banner, username } = await getProfileById(id);

    return { user_id: id, name, email, avatar, banner, username, created_at };
  } catch (err) {
    throw err;
  }
}

export async function handleUpdateAvatar(user_id: string, avatar: { publicUrl: string; filePath: string }) {
  try {
    if (avatar.filePath.startsWith("/")) avatar.filePath = avatar.filePath.slice(1);
    await updateAvatarProfile(user_id, avatar);

    return { success: true };
  } catch (err) {
    throw err;
  }
}

export async function handleUpdateBanner(user_id: string, banner: { publicUrl: string; filePath: string }) {
  try {
    if (banner.filePath.startsWith("/")) banner.filePath = banner.filePath.slice(1);
    await updateBannerProfile(user_id, banner);

    return { success: true };
  } catch (err) {
    throw err;
  }
}

export async function handleDeleteAvatar(user_id: string) {
  try {
    await deleteAvatar(user_id);

    return { success: true };
  } catch (err) {
    throw err;
  }
}

export async function handleDeleteBanner(user_id: string) {
  try {
    await deleteBanner(user_id);

    return { success: true };
  } catch (err) {
    throw err;
  }
}
