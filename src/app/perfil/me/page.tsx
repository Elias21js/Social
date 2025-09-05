// Feed.tsx
import { usePosts } from "@/app/contexts/PostContext";
import PerfilClient from "../perfilClient"; // client-side
import Loading from "@/app/loading";
import { getUser } from "@/app/controllers/userController";

// Componente server-side
export default async function Perfil() {
  const profileFromDB = await getUser();

  const initialData = {
    user_id: profileFromDB.user_id,
    name: profileFromDB.name,
    username: profileFromDB.username ?? null,
    email: profileFromDB.email,
    avatar: profileFromDB.avatar ?? null,
    avatar_path: profileFromDB.avatar_path ?? null,
    banner: profileFromDB.banner ?? null,
    banner_path: profileFromDB.banner_path ?? null,
    created_at: profileFromDB.created_at,
    isOwner: profileFromDB.isOwner ?? true,
  };

  return <PerfilClient initialData={initialData} />;
}
