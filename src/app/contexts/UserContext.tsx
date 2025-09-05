// app/contexts/UserContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/utils/supabaseClient/client";

const supabase = createClient();

// Interface do usuário que vamos disponibilizar
export interface UserProfile {
  id?: string; // ID do Auth
  email?: string; // email do Auth
  name?: string; // do profile
  avatar?: string; // do profile
  banner?: string; // do profile
  [key: string]: any; // outros campos da tabela profiles
}

// Estado do contexto
interface UserContextProps {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>; // função pra atualizar manualmente
}

// Contexto
const UserContext = createContext<UserContextProps>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

// Provider
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Função pra buscar user + profile
  const fetchUser = async () => {
    setLoading(true);

    // 1️⃣ Pega user do Auth
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    // 2️⃣ Busca profile completo na tabela "profiles"
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", authUser.id);

    if (error) {
      console.error("Erro ao buscar profile:", error);
      setUser(authUser); // fallback só com Auth
    } else {
      const formatProfile = profile?.[0] ?? {}; // se não existir, usa objeto vazio
      setUser({ ...authUser, ...formatProfile });
    }

    setLoading(false);
  };

  // 3️⃣ useEffect para inicializar e escutar mudanças de sessão
  useEffect(() => {
    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUser(); // atualiza sempre que o usuário loga ou desloga
    });

    return () => subscription.unsubscribe();
  }, []);

  return <UserContext.Provider value={{ user, loading, refreshUser: fetchUser }}>{children}</UserContext.Provider>;
}

// Hook de consumow
export const useUser = () => useContext(UserContext);
