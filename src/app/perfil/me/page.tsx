// Feed.tsx
import { getUser } from "../../controllers/userController";
import PerfilClient from "../perfilClient"; // client-side

// Componente server-side
export default async function Perfil() {
  const user = await getUser();

  // 2️⃣ Renderizamos o componente client-side passando os posts iniciais
  return <PerfilClient initialData={user} />;
}
