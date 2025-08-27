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

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const notyf = useNotyf();

  const handleLogOut = async () => {
    try {
      const {
        data: { success },
      } = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/logout");

      if (success) {
        notyf?.success("Deslogado com sucesso.");
        return router.push("/auth");
      }
    } catch (err) {
      console.error(err);
      notyf?.error("Ocorreu um erro interno.");
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

            <Link href="/perfil" className={style.link}>
              <Button selected={pathname === "/perfil" && true} className={style.b_t}>
                <UserIcon size="18" />
                Perfil
              </Button>
            </Link>
          </div>
        </div>
        <div className={style.l_s}>
          <ButtonTheme />
          <span>Olá, elias_silva</span>
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
