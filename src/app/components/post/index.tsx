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
import { Post as PostType } from "../feed/feedClient";
import { usePosts } from "@/app/contexts/PostContext";

export function Post() {
  const keywordsRef = useRef<KeywordsInputHandle>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const notyf = useNotyf();
  const { profile, mutate_posts } = usePosts();

  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [txtCount, setTxtCount] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const reset = () => {
    setContent("");
    setTxtCount(0);
    if (fileRef.current) fileRef.current.value = "";
    keywordsRef.current?.reset();
  };

  const handleNewPost = async () => {
    try {
      const success = await handleAddPost({ user_id: profile?.user_id, content, imageFile: file, keywords });
      if (success) {
        notyf?.success("Post adicionado com sucesso.");
        reset();

        const tempPost: PostType = {
          post_id: "temp-" + Date.now(),
          user_id: profile?.user_id ?? "unknown",
          user_name: profile?.name ?? "Você",
          user_email: profile?.email ?? "desconhecido",
          user_avatar: profile?.avatar ?? null,
          content,
          image: file ? URL.createObjectURL(file) : "", // transforma File em URL temporária
          created_at: new Date(),
          updated_at: null,
          keywords,
        };

        mutate_posts((postsAtual?: PostType[]) => [tempPost, ...(postsAtual ?? [])]);
      } else notyf?.error("Ocorreu um erro interno");
    } catch (err) {
      console.error(err);
      notyf?.error(getErrorMessage(err));
    }
  };

  const handleRefresh = async () => {
    setSpinning(true);
    await mutate_posts();
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
          <Image
            src={profile?.avatar ?? avatar}
            alt="avatar-icon"
            width={64}
            height={64}
            className={style.avatar}
            priority
          />
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
            placeholder="Conteúdo do Post"
          />
          <div className={style.post_config}>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              className={style.file_i}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
              }}
            />

            <KeywordsInput ref={keywordsRef} onChange={setKeywords} />
          </div>
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
