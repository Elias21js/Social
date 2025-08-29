// Feed.tsx
import FeedClient from "./feedClient"; // client-side
import { getAllPosts } from "@/app/models/posts.model";

// Componente server-side
export default async function Feed() {
  // 1️⃣ Buscamos posts iniciais no servidor (SSR) para SEO e primeira renderização rápida
  const initialPosts = await getAllPosts();

  // 2️⃣ Renderizamos o componente client-side passando os posts iniciais
  return <FeedClient initialPosts={initialPosts} />;
}
