"use client";

import { useState } from "react";
import style from "./auth.module.css";

export default function Auth() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className={style.container}>
      <div className={style.card}>
        <h1 className={style.logo}>Social</h1>

        <div className={style.tabs}>
          <button
            className={`${style.tab} ${activeTab === "login" ? style.active : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`${style.tab} ${activeTab === "register" ? style.active : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Registrar
          </button>
        </div>

        {/* Login */}
        {activeTab === "login" && (
          <form className={`${style.form} ${style.active}`}>
            <input type="email" placeholder="Email" className={style.input} required />
            <input type="password" placeholder="Senha" className={style.input} required />
            <button type="submit" className={style.btn}>
              Entrar
            </button>
            <p className={style.switchText}>
              Não tem conta? <span onClick={() => setActiveTab("register")}>Registrar</span>
            </p>
          </form>
        )}

        {/* Registrar */}
        {activeTab === "register" && (
          <form className={`${style.form} ${style.active}`}>
            <input type="text" placeholder="Nome de usuário" className={style.input} required />
            <input type="email" placeholder="Email" className={style.input} required />
            <input type="password" placeholder="Senha" className={style.input} required />
            <button type="submit" className={style.btn}>
              Criar conta
            </button>
            <p className={style.switchText}>
              Já tem conta? <span onClick={() => setActiveTab("login")}>Login</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
