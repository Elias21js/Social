import { Calendar } from "lucide-react";
import banner from "@/app/assets/banner.jpeg";
import avatar from "@/app/assets/avatar_image.jpg";
import style from "./perfil.module.css";
import Image from "next/image";

export default function Perfil() {
  return (
    <section className={style.perfil}>
      <div className={style.card}>
        <div className={style.banner}>
          <Image src={banner} fill alt="user_banner" sizes="(max-width: 768px) 100vw, 660px" />
        </div>
        <div className={style.user_sec}>
          <div className={style.user_data}>
            <div className={style.avatar}>
              <Image src={avatar} alt="avatar-icon" width={152} height={152} />
            </div>
            <div className={style.user_infos}>
              <div>
                <h2>{"Elias Silva"}</h2>
                <span>{"@elias_silva"}</span>
              </div>
              <div>
                <span>{"Novo usuário na plataforma! ✨"}</span>
                <span>
                  <Calendar size={18} />
                  {"Entrou em agosto de 2025"}
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
