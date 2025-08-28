"use client";

import style from "./post.module.css";
import avatar from "@/app/assets/avatar_image.jpg";
import Image from "next/image";
import { RefreshCw, Image as ImageIcon, Send } from "lucide-react";
import { Button } from "../button";
import { useEffect, useRef, useState } from "react";
import KeywordsInput from "../keywords";
import { useNotyf } from "@/utils/toast/notyf";
import { getErrorMessage } from "@/utils/error/errorCatch";
import { handleAddPost } from "@/app/controllers/postController";

export function Post() {
  const publicRef = useRef<HTMLButtonElement | null>(null);
  const imageURL = useRef<HTMLInputElement | null>(null);
  const resetRef = useRef<HTMLButtonElement | null>(null);
  const notyf = useNotyf();
  const [keywords, setKeywords] = useState<string[]>([]);
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

  const handleNewPost = async () => {
    try {
      const success = await handleAddPost({ content: state, image: imageURL?.current?.value, keywords });
      console.log(state, imageURL?.current?.value, keywords);
      if (success) notyf?.success("Post adicionado com sucesso.");
      else notyf?.error("Ocorreu um erro interno");
    } catch (err) {
      console.error(err);
      notyf?.error(getErrorMessage(err));
    }
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
            spellCheck="false"
            placeholder="O que você está pensando?"
          />
          <input
            className={style.url_i}
            type="text"
            ref={imageURL}
            placeholder="URL da imagem (opcional)"
            name="url"
            id="url"
            autoComplete="off"
          />
          <KeywordsInput onChange={setKeywords} />
          <div className={style.p_s}>
            <Button className={style.b_img_ch} ref={resetRef} onClick={reset}>
              <ImageIcon size="18" />
              <span>{txtCount}/280</span>
            </Button>
            <Button ref={publicRef} selected onClick={handleNewPost}>
              <Send size="18" />
              <span>Publicar</span>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
