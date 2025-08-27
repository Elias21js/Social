"use client";

import { useState, useRef } from "react";
import style from "./confirm.module.css";
import axios, { AxiosError } from "axios";
import { Notyf } from "notyf";
import { useRouter } from "next/navigation";
import { useLoading } from "@/utils/loading/loadingContext";

interface ConfirmSignupProps {
  email: string;
  name: string;
  notify: Notyf | null;
}

export default function ConfirmSignup({ email, name, notify }: ConfirmSignupProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const { setLoading } = useLoading();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // apenas números

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return; // só números
    const newCode = pasteData.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(newCode);
    newCode.forEach((digit, i) => {
      if (digit) inputsRef.current[i]?.focus();
    });
  };

  interface SignupResponse {
    success: boolean;
    session: any;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = code.join("");
    try {
      setLoading(true);
      const response = await axios.post<SignupResponse>(process.env.NEXT_PUBLIC_API_URL + "/confirm-otp", {
        email,
        token,
        name,
      });

      const { success, session } = response.data;

      if (success) notify?.success("Código confirmado e sessão iniciada.");
      setLoading(false);
      router.push("/");
      return;
    } catch (error) {
      const err = error as AxiosError<{ error: string; success: boolean }>;
      setLoading(false);
      console.log(err);
      return notify?.error(err.response?.data.error ?? "Erro interno.");
    }
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        <h1 className={style.logo}>Social</h1>
        <p className={style.subtitle}>Digite o código enviado para seu email 📩</p>

        <form onSubmit={(e) => handleSubmit(e)} className={style.form}>
          <div className={style.codeInputs}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          <button type="submit" className={style.btn}>
            Confirmar código
          </button>
        </form>

        <p className={style.resend}>
          Não recebeu o código?{" "}
          <span
            onClick={async () => {
              try {
                const { data } = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/resend-otp", { email });

                if (data.success) notify?.success(data.message);
                else notify?.error(data.error);
              } catch {
                notify?.error("Erro ao reenviar código.");
              }
            }}
          >
            Reenviar
          </span>
        </p>
      </div>
    </div>
  );
}
