"use client";

import { Calendar } from "lucide-react";
import default_banner from "@/app/assets/default_banner.jpeg";
import default_avatar from "@/app/assets/avatar.svg";
import style from "./perfil.module.css";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import useSWR, { mutate } from "swr";
import { useEffect, useRef, useState } from "react";
import { Menu } from "../components/menu";
import clsx from "clsx";
import axios from "axios";
import { Post } from "../components/feed/Feed";
import { PerfilSkelet } from "../skeletons/perfil/PerfilSkelet";

dayjs.locale("pt-br");
dayjs.extend(relativeTime);

export interface Perfil {
  initialData: {
    user_id: string;
    name: string;
    username: string | null;
    email: string | undefined;
    avatar: string | null;
    avatar_path: string | null;
    banner: string | null;
    banner_path: string | null;
    created_at: string;
    isOwner: boolean;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Perfil({ initialData }: Perfil) {
  const {
    data: profile,
    mutate: mutate_profile,
    isLoading,
  } = useSWR(`/api/users/${initialData.user_id}`, fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: false,
    refreshInterval: 120000,
  });
  const [stateMenu, setStateMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [showItemMenu, setShowItemMenu] = useState<"posts" | "followers" | "following">("posts");
  const [userPosts, setUserPosts] = useState<Post[] | []>([]);
  const [userFollowers, setUserFollowers] = useState<number>(0);
  const [userFollowing, setUserFollowing] = useState<number>(0);

  const avatarRef = useRef<HTMLDivElement | null>(null);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getPost = async () => {
      const params = new URLSearchParams({
        user_id: initialData.user_id,
        filter: "true",
      });

      const { data } = await axios.get<Post[]>(process.env.NEXT_PUBLIC_API_URL + "/posts?" + params.toString());

      setUserPosts(data);
    };

    getPost();
  }, []);

  if (isLoading) return <PerfilSkelet />;

  const { name, email, avatar, banner, created_at } = profile!;
  const dataCadastro = dayjs(created_at);
  const hoje = dayjs();

  const diff = hoje.diff(dataCadastro, "day");

  function handleMenu(action: string, e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();

    setMenuPosition((prev) => {
      // se o menu estiver aberto no mesmo action, não muda a posição
      if (stateMenu === action) return prev;
      return { x: e.clientX, y: e.clientY };
    });

    if (stateMenu === action) return;
    setStateMenu((prev) => (prev === action ? null : action));
  }

  async function handleGetMenu(itemMenu: "posts" | "followers" | "following") {
    setShowItemMenu(itemMenu);
  }

  return (
    <section className={style.perfil}>
      <div className={style.card}>
        <div className={style.banner} ref={bannerRef} onClick={(e) => handleMenu("banner", e)}>
          <Image
            src={banner ?? default_banner}
            fill
            alt="user_banner"
            priority
            sizes="(max-width: 768px) 100vw, 660px"
          />
          {stateMenu === "banner" && (
            <>
              <Menu
                ref={menuRef}
                key={menuPosition?.x ?? stateMenu}
                ignoreRef={[bannerRef]}
                perfilOwner={profile.isOwner}
                state={stateMenu}
                setStateMenu={() => setStateMenu(null)}
                position={menuPosition}
                user={profile}
                mutate_profile={mutate_profile}
              />
            </>
          )}
        </div>
        <div className={style.user_sec}>
          <div className={style.user_data}>
            <div className={style.avatar} ref={avatarRef} onClick={(e) => handleMenu("avatar", e)}>
              <Image src={avatar ?? default_avatar} alt="avatar-icon" width={152} height={152} />
              {stateMenu === "avatar" && (
                <>
                  <Menu
                    ref={menuRef}
                    key={stateMenu}
                    ignoreRef={[avatarRef]}
                    perfilOwner={profile.isOwner}
                    state={stateMenu}
                    setStateMenu={() => setStateMenu(null)}
                    position={menuPosition}
                    user={profile}
                    mutate_profile={mutate_profile}
                  />
                </>
              )}
            </div>
            <div className={style.user_infos}>
              <div>
                <h2>{name}</h2>
                <span>{email}</span>
              </div>
              <div>
                <span>{diff < 7 ? "Usuário novo na plataforma! ✨" : ""}</span>
                <span>
                  <Calendar size={18} />
                  Entrou {dayjs(created_at).fromNow()}
                </span>
              </div>
            </div>
          </div>
          <div className={style.card_menu}>
            <div>
              <span>{userPosts.length}</span>
              <span>Posts</span>
            </div>
            <div>
              <span>{userFollowers}</span>
              <span>Seguidores</span>
            </div>
            <div>
              <span>{userFollowing}</span>
              <span>Seguindo</span>
            </div>
          </div>
        </div>
      </div>
      <div className={style.list_menu}>
        <div
          className={clsx(style.menu_item, showItemMenu === "posts" ? style.active : "")}
          onClick={() => handleGetMenu("posts")}
        >
          Posts ({userPosts.length})
        </div>
        <div
          className={clsx(style.menu_item, showItemMenu === "followers" ? style.active : "")}
          onClick={() => handleGetMenu("followers")}
        >
          Seguidores (0)
        </div>
        <div
          className={clsx(style.menu_item, showItemMenu === "following" ? style.active : "")}
          onClick={() => handleGetMenu("following")}
        >
          Seguindo (0)
        </div>
      </div>
    </section>
  );
}
