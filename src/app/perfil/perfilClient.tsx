"use client";

import { Calendar } from "lucide-react";
import default_banner from "@/app/assets/default_banner.jpeg";
import default_avatar from "@/app/assets/avatar.svg";
import style from "./perfil.module.css";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import useSWR from "swr";
import { useRef, useState } from "react";
import { Menu } from "../components/menu";
import { useUser } from "../contexts/UserContext";

dayjs.locale("pt-br");
dayjs.extend(relativeTime);

export interface Perfil {
  initialData: {
    user_id: string;
    name: string;
    username: string | null;
    email: string | undefined;
    avatar: string | null;
    banner: string | null;
    created_at: string;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Perfil({ initialData }: Perfil) {
  const { user } = useUser();
  const { data: profile } = useSWR(`/api/users/${initialData.user_id}`, fetcher, { fallbackData: initialData });
  const [stateMenu, setStateMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const avatarRef = useRef<HTMLDivElement | null>(null);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
                perfilOwner={user?.id === profile.user_id}
                state={stateMenu}
                setStateMenu={() => setStateMenu(null)}
                position={menuPosition}
                user={profile}
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
                    perfilOwner={user?.id === profile.user_id}
                    state={stateMenu}
                    setStateMenu={() => setStateMenu(null)}
                    position={menuPosition}
                    user={profile}
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
              <span>{0}</span>
              <span>Posts</span>
            </div>
            <div>
              <span>{0}</span>
              <span>Seguidores</span>
            </div>
            <div>
              <span>{0}</span>
              <span>Seguindo</span>
            </div>
          </div>
        </div>
      </div>
      <div className={style.list_menu}></div>
    </section>
  );
}
