"use client";

import style from "./post.module.css";
import avatar from "@/app/assets/avatar_image.jpg";
import Image from "next/image";
import { RefreshCw, Image as ImageIcon, Send } from "lucide-react";
import { Button } from "../button";
import { useEffect, useRef, useState } from "react";

export function Post() {
  const publicRef = useRef<HTMLButtonElement | null>(null);
  const resetRef = useRef<HTMLButtonElement | null>(null);
  const [state, setState] = useState<string>("");
  const [txtCount, setTxtCount] = useState<number>(0);

  useEffect(() => {
    if (state.trim() !== "" && publicRef.current) {
      publicRef.current.disabled = false;
      setTxtCount(state.length);
    } else {
      if (publicRef.current) {
        publicRef.current.disabled = true;
        setTxtCount(state.length);
      }
    }
  }, [state]);

  const reset = () => {
    setState("");
  };

  return (
    <>
      <div className={style.f_t}>
        <span>Feed</span>
        <button className={style.r}>
          <RefreshCw />
          Atualizar
        </button>
      </div>
      <section className={style.p}>
        <div className={style.f_left}>
          <Image src={avatar} alt="avatar-icon" width={52} height={52} className={style.avatar} />
        </div>
        <div className={style.f_right}>
          <textarea
            maxLength={280}
            onChange={(e) => setState(e.target.value)}
            value={state}
            className={style.t_a}
            name="post_content"
            id="post_content"
            placeholder="O que você está pensando?"
          />
          <input
            className={style.url_i}
            type="text"
            placeholder="URL da imagem (opcional)"
            name="url"
            id="url"
            autoComplete="off"
          />
          <div className={style.p_s}>
            <Button className={style.b_img_ch} ref={resetRef} onClick={reset}>
              <ImageIcon size="18" />
              <span>{txtCount}/280</span>
            </Button>
            <Button ref={publicRef} disabled selected>
              <Send size="18" />
              <span>Publicar</span>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
