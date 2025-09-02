// src/hooks/useProfile.ts
import useSWR from "swr";

interface Profile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  banner?: string;
  username?: string;
  created_at: string;
}

const fetcher = async (url: string): Promise<Profile> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar perfil");
  return res.json();
};

export function useProfile(userId: string) {
  const { data, error, mutate, isLoading } = useSWR<Profile>(`/api/users/${userId}`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 60000, // atualiza a cada minuto
  });

  return {
    profile: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
