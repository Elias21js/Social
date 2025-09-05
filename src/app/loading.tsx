"use client";
import { useEffect, useState } from "react";
import style from "./loading.module.css";

export default function Loading() {
  const [fadeOut, setFadeOut] = useState(false);

  // Simula fim do loading (ou use props/next/navigation)
  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1500); // exemplo
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${style.loader_wrapper} ${fadeOut ? style["fade-out"] : ""}`}>
      <div className={style.loader_container}>
        <div className={style.logo}>
          <h2>Social</h2>
        </div>
        <div className={style.content}>
          <p>Carregando sua experiência...</p>
        </div>
        <div className={style.loader}></div>
      </div>
    </div>
  );
}
