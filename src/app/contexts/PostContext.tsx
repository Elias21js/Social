"use client"; // precisa disso pq tem hooks

import { createContext, useContext, useState, ReactNode, SetStateAction, Dispatch } from "react";
import { useUser } from "./UserContext";
import useSWR, { KeyedMutator } from "swr";
import { Post } from "../components/feed/Feed";

interface ContextProps {
  posts: Post[] | undefined;
  profile: Perfil | undefined;
  mutate_perfil: KeyedMutator<Perfil>;
  mutate_posts: KeyedMutator<Post[]>;
  isLoadingPosts: boolean;
}

export interface Perfil {
  user_id: string;
  name: string;
  username: string | null;
  email: string | undefined;
  avatar: string | null;
  avatar_path: string | null;
  banner: string | null;
  banner_path: string | null;
  created_at: string;
  isOwner?: boolean;
}

const PostContext = createContext<ContextProps>({
  posts: [],
  profile: undefined,
  mutate_perfil: async () => undefined,
  mutate_posts: async () => undefined,
  isLoadingPosts: false,
});
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PostProvider({
  children,
  initialPosts,
  initialProfile,
}: {
  children: ReactNode;
  initialPosts: Post[];
  initialProfile: Perfil;
}) {
  const { user } = useUser();
  const {
    data: profile,
    mutate: mutate_perfil,
    isLoading: isLoadingPerfil,
  } = useSWR(user ? `/api/users/${user.user_id}` : null, fetcher, {
    fallbackData: initialProfile,
    revalidateOnFocus: false,
    refreshInterval: 120000,
  });
  const {
    data: posts,
    mutate: mutate_posts,
    isLoading: isLoadingPosts,
  } = useSWR<Post[]>("/api/posts", fetcher, {
    fallbackData: initialPosts,
    revalidateOnFocus: false,
    refreshInterval: 60000,
  });

  return (
    <PostContext.Provider value={{ posts, mutate_posts, isLoadingPosts, profile, mutate_perfil }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
}
