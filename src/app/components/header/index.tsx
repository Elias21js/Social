"use client";

import Link from "next/link";
import style from "./header.module.css";
import { Button } from "../button";
import { Home, User as UserIcon, LogOut } from "lucide-react";
import { ButtonTheme } from "../theme";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

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
            <button className={style.l}>
              <LogOut size="17" />
              Sair
            </button>
          </Link>
        </div>
      </header>
    </>
  );
}
