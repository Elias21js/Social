"use client"; // obrigatório para hooks

import useSWR from "swr"; // SWR: fetch + cache inteligente
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import style from "./feed.module.css";
import Image from "next/image";
import avatar from "@/app/assets/avatar.svg";
import { Button } from "../button";
import { Ellipsis, Heart, MessageCircle, Share2 } from "lucide-react";
import PostSkeleton from "./skelet";
import { PostPopup } from "./postOptions";
import { useUser } from "@/app/contexts/UserContext";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ResponsiveImage from "@/utils/responsiveImages/responsiveImage";

dayjs.locale("pt-br");
dayjs.extend(relativeTime);

// Função fetcher para SWR
const fetcher = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/posts"); // sua rota API que retorna todos os posts
  return res.json();
};

// Interface Post
export interface Post {
  user_id?: string;
  user_name?: string;
  user_email?: string;
  user_avatar?: string | null;
  post_id?: string;
  content?: string;
  image?: string;
  created_at?: Date;
  updated_at?: null;
  keywords?: string[];
}

// Props do feed client
interface FeedClientProps {
  initialPosts: Post[];
}

export default function FeedClient({ initialPosts }: FeedClientProps) {
  const [stateMenu, setStateMenu] = useState<string | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const router = useRouter();

  const { user } = useUser();
  // 1️⃣ SWR para buscar posts, inicializamos com SSR
  const {
    data: posts,
    mutate,
    isLoading,
  } = useSWR<Post[]>("/posts", fetcher, {
    fallbackData: initialPosts, // posts iniciais do server-side
    revalidateOnFocus: false, // não faz fetch toda vez que a aba volta
    refreshInterval: 60000, // atualiza a cada 60s automaticamente
  });

  // 2️⃣ Função para adicionar post instantaneamente no topo
  function handleNewPostAdded(novoPost: Post) {
    mutate([novoPost, ...(posts ?? [])], false); // false = não faz re-fetch imediato
  }

  function openConfig(post_id: string) {
    setStateMenu((prev) => (prev === post_id ? null : post_id));
  }

  // 3️⃣ Renderizando feed
  if (isLoading || !posts || posts.length === 0) {
    return (
      <>
        <PostSkeleton />
      </>
    );
  }

  return (
    <>
      {posts.map(
        (
          { post_id, content, user_avatar, user_name, user_email, created_at, image, user_id: post_owner_id },
          index
        ) => {
          return (
            <section key={post_id} className={style.f}>
              <div className={style.post_sec}>
                <div className={style.post_info}>
                  <div
                    className={style.avatar_sec}
                    onClick={() => {
                      console.log(post_owner_id);
                      router.push(`/perfil/${post_owner_id}`);
                    }}
                  >
                    <Image
                      src={user_avatar ?? avatar}
                      alt="avatar-icon"
                      width={64}
                      height={64}
                      className={style.avatar}
                    />
                  </div>
                  <div className={style.author_sec}>
                    <span className={style.author_title}>{user_name}</span>
                    <span className={style.author_arroba}>{user_email!.split("@")[0]}</span>
                  </div>
                  <div className={style.author_posted}>
                    <span>{dayjs(created_at).fromNow()}</span>
                  </div>
                </div>
                <Button
                  ref={(el) => {
                    buttonRefs.current[post_id!] = el;
                  }}
                  onClick={() => openConfig(post_id!)}
                >
                  <Ellipsis size="18" />
                </Button>
                {stateMenu === post_id && (
                  <>
                    <PostPopup
                      postOwner={post_owner_id === user?.id}
                      setStateMenu={() => setStateMenu(null)}
                      ignoreRef={{ current: buttonRefs.current[post_id] }}
                      postId={post_id}
                      postOwnerId={post_owner_id!}
                    />
                  </>
                )}
              </div>

              <div className={style.content}>
                <p>{content}</p>
              </div>

              {image?.length! > 0 && (
                <ResponsiveImage
                  key={image}
                  src={image!}
                  alt="post-image"
                  sizes="(max-width: 640px) 590px, 590px"
                  priority={index === 0}
                />
              )}

              <div className={style.actions}>
                <Button className={style.like}>
                  <Heart size="18" />0
                </Button>
                <Button className={style.comment}>
                  <MessageCircle size="18" />0
                </Button>
                <Button className={style.share}>
                  <Share2 size="18" />0
                </Button>
              </div>
            </section>
          );
        }
      )}
    </>
  );
}
