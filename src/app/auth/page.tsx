"use client";

import { useEffect, useState } from "react";
import style from "./auth.module.css";
import axios from "axios";
import ConfirmSignup from "./confirm";
import { RegisterResponse } from "@/utils/interfaces/interfaces";
import { useRouter } from "next/navigation";
import { useNotyf } from "@/utils/toast/notyf";

export default function Auth() {
  const notyf = useNotyf();
  const router = useRouter();
  const [registered, setRegistered] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (submited: string) => {
    if (!form.email || !form.password) return notyf?.error("Você deve preencher todos os campos.");
    if (!form.name && submited === "register") return notyf?.error("Você deve inserir um nome válido.");

    if (submited === "register") {
      const { data } = await axios.post<RegisterResponse>(process.env.NEXT_PUBLIC_API_URL + "/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (data.success) {
        notyf?.success("Usuário registrado com sucesso.");
        return setRegistered(true);
      } else {
        notyf?.error("Ocorreu um erro ao registrar este usuário.");
        return setRegistered(false);
      }
    } else if (submited === "login") {
      const {
        data: { success },
      } = await axios.post<RegisterResponse>(process.env.NEXT_PUBLIC_API_URL + "/login", {
        email: form.email,
        password: form.password,
      });

      if (success) {
        notyf?.success("Logado com sucesso.");
        router.push("/");
      } else {
        notyf?.error("Ocorreu um erro no login.");
      }
    }
  };

  return (
    <>
      {!registered && (
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
                <input
                  type="email"
                  placeholder="Email"
                  className={style.input}
                  value={form.email}
                  name="email"
                  onChange={(e) => handleChange(e)}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  className={style.input}
                  value={form.password}
                  name="password"
                  onChange={(e) => handleChange(e)}
                  required
                />
                <button
                  type="submit"
                  className={style.btn}
                  onClick={async (e) => {
                    e.preventDefault();
                    await handleSubmit("login");
                  }}
                >
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
                <input
                  type="text"
                  placeholder="Nome de usuário"
                  className={style.input}
                  value={form.name}
                  name="name"
                  onChange={(e) => handleChange(e)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className={style.input}
                  value={form.email}
                  name="email"
                  onChange={(e) => handleChange(e)}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  className={style.input}
                  value={form.password}
                  name="password"
                  onChange={(e) => handleChange(e)}
                  required
                />
                <button
                  type="submit"
                  className={style.btn}
                  onClick={async (e) => {
                    e.preventDefault();
                    await handleSubmit("register");
                  }}
                >
                  Criar conta
                </button>
                <p className={style.switchText}>
                  Já tem conta? <span onClick={() => setActiveTab("login")}>Login</span>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
      {registered && <ConfirmSignup email={form.email} name={form.name} notify={notyf} />}
    </>
  );
}
