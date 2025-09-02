"use client";

import Link from "next/link";
import style from "./header.module.css";
import { Button } from "../button";

import { Home, User as UserIcon, LogOut } from "lucide-react";
import { ButtonTheme } from "../theme";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useNotyf } from "@/utils/toast/notyf";
import { getErrorMessage } from "@/utils/error/errorCatch";
import { useLoading } from "@/app/contexts/loading/loadingContext";
import { useUser } from "@/app/contexts/UserContext";

export function Header() {
  const { setLoading } = useLoading();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const notyf = useNotyf();

  const handleLogOut = async () => {
    try {
      setLoading(true);
      const {
        data: { success },
      } = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/logout");

      if (success) {
        notyf?.success("Deslogado com sucesso.");

        router.replace("/auth");
        setTimeout(() => setLoading(false), 500);
      }
    } catch (err: unknown) {
      console.error(err);
      setLoading(false);

      notyf?.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <header className={style.h}>
        <div className={style.h_c}>
          <div className={style.logo}>
            <h2>Social</h2>
          </div>
          <div className={style.b_c}>
            <Link href="/" className={style.link}>
              <Button selected={pathname === "/" && true}>
                <Home size="18" />
                Feed
              </Button>
            </Link>

            <Link href="/perfil/me" className={style.link}>
              <Button selected={pathname === "/perfil/me" && true} className={style.b_t}>
                <UserIcon size="18" />
                Perfil
              </Button>
            </Link>
          </div>
        </div>
        <div className={style.l_s}>
          <ButtonTheme />
          <span>Olá, {user?.name}</span>
          <Link href="/auth">
            <button className={style.l} onClick={handleLogOut}>
              <LogOut size="17" />
              Sair
            </button>
          </Link>
        </div>
      </header>
    </>
  );
}
