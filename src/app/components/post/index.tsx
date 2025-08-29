"use client";

import style from "./post.module.css";
import avatar from "@/app/assets/avatar.svg";
import Image from "next/image";
import { RefreshCw, Image as ImageIcon, Send } from "lucide-react";
import { Button } from "../button";
import { useRef, useState } from "react";
import KeywordsInput, { KeywordsInputHandle } from "../keywords";
import { useNotyf } from "@/utils/toast/notyf";
import { getErrorMessage } from "@/utils/error/errorCatch";
import { handleAddPost } from "@/app/controllers/postController";
import { mutate } from "swr";
import { useUser } from "@/app/contexts/UserContext";

export function Post() {
  const keywordsRef = useRef<KeywordsInputHandle>(null);
  const notyf = useNotyf();
  const { user } = useUser();

  const [content, setContent] = useState("");
  // const [imageURL, setImageURL] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [txtCount, setTxtCount] = useState(0);
  const [spinning, setSpinning] = useState(false);
  // const [imgValid, setImgValid] = useState(true);

  // const isValidImage = (url: string) => /\.(jpeg|jpg|gif|png|webp)$/i.test(url);

  const reset = () => {
    setContent("");
    // setImageURL("");
    setTxtCount(0);
    keywordsRef.current?.reset();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleNewPost = async () => {
    try {
      const success = await handleAddPost({ content, imageFile: file, keywords });
      if (success) {
        notyf?.success("Post adicionado com sucesso.");
        reset();
        mutate("/posts");
      } else notyf?.error("Ocorreu um erro interno");
    } catch (err) {
      console.error(err);
      notyf?.error(getErrorMessage(err));
    }
  };

  const handleRefresh = async () => {
    setSpinning(true);
    await mutate("/posts");
    setSpinning(false);
  };

  return (
    <>
      <div className={style.f_t}>
        <span>Feed</span>
        <button className={style.r} onClick={handleRefresh}>
          <RefreshCw className={spinning ? style.spin : ""} />
          Atualizar
        </button>
      </div>

      <section className={style.p}>
        <div className={style.f_left}>
          <Image src={user?.avatar ?? avatar} alt="avatar-icon" width={52} height={52} className={style.avatar} />
        </div>

        <div className={style.f_right}>
          <textarea
            maxLength={280}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setTxtCount(e.target.value.length);
            }}
            className={style.t_a}
            name="post_content"
            id="post_content"
            spellCheck={false}
            placeholder="O que você está pensando?"
          />

          <input type="file" accept="image/*" className={style.file_i} onChange={handleFileChange} />

          {/* <input
            className={style.url_i}
            type="text"
            value={imageURL}
            onChange={(e) => {
              setImageURL(e.target.value);
              setImgValid(true);
            }}
            placeholder="URL da imagem (opcional)"
            name="url"
            id="url"
            autoComplete="off"
          />

          {imageURL.trim() && isValidImage(imageURL) && imgValid && (
            <div className={style.preview_image}>
              <img src={imageURL} alt="Preview da URL" onError={() => setImgValid(false)} />
            </div>
          )} */}

          <KeywordsInput ref={keywordsRef} onChange={setKeywords} />

          <div className={style.p_s}>
            <Button onClick={reset}>
              <ImageIcon size={18} />
              <span>{txtCount}/280</span>
            </Button>

            <Button onClick={handleNewPost} selected disabled={!content.trim()}>
              <Send size={18} />
              <span>Publicar</span>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
