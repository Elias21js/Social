import { Ellipsis, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "../button";
import post_image from "@/app/assets/post_image.jpg";
import style from "./feed.module.css";
import avatar from "@/app/assets/avatar_image.jpg";
import Image from "next/image";

export function Feed() {
  return (
    <section className={style.f}>
      <div className={style.post_sec}>
        <div className={style.post_info}>
          <div className={style.avatar_sec}>
            <Image src={avatar} alt="avatar-icon" width={52} height={52} className={style.avatar} />
          </div>
          <div className={style.author_sec}>
            <span className={style.author_title}>elias_silva</span>
            <span className={style.author_arroba}>@elias_silva</span>
          </div>
          <div className={style.author_posted}>
            <span>20 de ago., 06:24</span>
          </div>
        </div>

        <Button>
          <Ellipsis size="18" />
        </Button>
      </div>
      <div className={style.content}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni aut unde dolorem reprehenderit iusto cumque sit
          minus sapiente dolores quisquam, maiores hic eos distinctio aliquam earum mollitia alias libero veniam.
        </p>
      </div>
      <div className={style.post_image}>
        <Image src={post_image} alt="post_image" fill sizes="(max-width: 640px) 590px, 590px" />
      </div>
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
