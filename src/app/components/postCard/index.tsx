import style from "./postCard.module.css";
import Image from "next/image";
import avatar from "@/app/assets/avatar.svg";
import { Button } from "../button";
import { Ellipsis, Heart, MessageCircle, Share2 } from "lucide-react";
import ResponsiveImage from "@/utils/responsiveImages/responsiveImage";
import clsx from "clsx";
import { PostPopup } from "../feed/postOptions";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useNotyf } from "@/utils/toast/notyf";
import { getErrorMessage } from "@/utils/error/errorCatch";
import axios from "axios";
import { Perfil } from "@/app/contexts/PostContext";
import { useRef, useState } from "react";
import { KeyedMutator } from "swr";
import { Post } from "../feed/Feed";

interface PostType {
  post_id: string | undefined;
  content: string | undefined;
  user_avatar: string | null | undefined;
  user_name: string | undefined;
  user_email: string | undefined;
  created_at: Date | undefined;
  image: string | undefined;
  post_owner_id: string | undefined;
  like_count: number | undefined;
  liked: boolean | undefined;
  index: number;
  profile: Perfil;
  mutate_posts: KeyedMutator<Post[]>;
}

export function PostCard({
  post_id,
  content,
  user_avatar,
  user_name,
  user_email,
  created_at,
  image,
  post_owner_id,
  like_count,
  liked,
  index,
  profile,
  mutate_posts,
}: PostType) {
  const [stateMenu, setStateMenu] = useState<string | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const router = useRouter();
  const notyf = useNotyf();

  function openConfig(post_id: string) {
    setStateMenu((prev) => (prev === post_id ? null : post_id));
  }

  async function handleComment() {}
  async function handleShare() {}

  async function handleLike(post_id: string) {
    try {
      if (!profile?.user_id) return notyf?.error("Identification Authenticated user error.");
      const {
        data: { success, liked },
      } = await axios.post<{ success: boolean; liked: boolean }>(process.env.NEXT_PUBLIC_API_URL + "/likes", {
        user_id: profile?.user_id,
        post_id,
      });

      if (success) {
        if (liked) {
          mutate_posts(
            (prev) =>
              prev?.map((p) => (p.post_id === post_id ? { ...p, like_count: (p.like_count ?? 0) + 1, liked } : p)),
            false // false = não revalida ainda
          );
        } else {
          mutate_posts(
            (prev) =>
              prev?.map((p) => (p.post_id === post_id ? { ...p, like_count: (p.like_count ?? 0) - 1, liked } : p)),
            false // false = não revalida ainda
          );
        }
      }
    } catch (err) {
      notyf?.error(getErrorMessage(err));
    }
  }

  return (
    <section key={post_id} className={style.f}>
      <div className={style.post_sec}>
        <div className={style.post_info}>
          <div
            className={style.avatar_sec}
            onClick={() => {
              console.log(post_owner_id);
              router.replace(`/perfil/${post_owner_id}`);
            }}
          >
            <Image
              src={user_avatar ?? avatar}
              alt="avatar-icon"
              width={64}
              height={64}
              className={style.avatar}
              priority={index === 0}
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
              postOwner={post_owner_id === profile?.user_id}
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
        <Button className={style.like} onClick={() => handleLike(post_id!)}>
          <Heart size="18" className={clsx(style.like, liked ? style.liked : "")} />
          {like_count}
        </Button>
        <Button className={style.comment} onClick={handleComment}>
          <MessageCircle size="18" />0
        </Button>
        <Button className={style.share} onClick={handleShare}>
          <Share2 size="18" />0
        </Button>
      </div>
    </section>
  );
}
