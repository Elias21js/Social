"use client"; // obrigatório para hooks

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import PostSkeleton from "./skelet";
import { usePosts } from "@/app/contexts/PostContext";
import Loading from "@/app/loading";
import { PostCard } from "../postCard";

dayjs.locale("pt-br");
dayjs.extend(relativeTime);

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
  like_count?: number;
  keywords?: string[];
  liked?: boolean;
}

export default function Feed() {
  const { profile, posts, isLoadingPosts, mutate_posts } = usePosts();

  if (!profile?.user_id) return <Loading />;

  // 3️⃣ Renderizando feed
  if (isLoadingPosts || !posts || posts.length === 0) {
    return (
      <>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </>
    );
  }

  return (
    <>
      {posts.map(
        (
          {
            post_id,
            content,
            user_avatar,
            user_name,
            user_email,
            created_at,
            image,
            user_id: post_owner_id,
            like_count,
            liked,
          },
          index
        ) => (
          <PostCard
            key={post_id}
            {...{
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
            }}
          />
        )
      )}
    </>
  );
}
