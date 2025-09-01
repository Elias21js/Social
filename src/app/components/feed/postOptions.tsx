"use client";

import { Pencil, Trash, Flag } from "lucide-react";
import style from "./postOptions.module.css";
import clsx from "clsx";
import { RefObject, useRef } from "react";
import { useClickOutside } from "@/app/hooks/clickOuside";
import { useNotyf } from "@/utils/toast/notyf";
import { getErrorMessage } from "@/utils/error/errorCatch";
import { handleDeletePost } from "@/app/controllers/postController";
import { mutate } from "swr";
//
export function PostPopup({
  postOwner,
  setStateMenu,
  ignoreRef,
  postId,
  postOwnerId,
}: {
  postOwner: boolean;
  setStateMenu: () => void;
  ignoreRef: RefObject<HTMLButtonElement | null>;
  postId: string;
  postOwnerId: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useClickOutside(ref, () => setStateMenu(), ignoreRef);
  const notyf = useNotyf();

  const onDelete = async () => {
    setStateMenu();
    try {
      const success = await handleDeletePost({ postId, postOwnerId });

      if (success) notyf?.success("Post deletado.");
      mutate("/posts");
    } catch (err) {
      notyf?.error(getErrorMessage(err));
      console.error(err);
    }
  };

  return (
    <div ref={ref} className={style.menuWrapper}>
      <div className={style.menuContent}>
        {postOwner && (
          <>
            <div className={style.menuItem}>
              <Pencil size={16} />
              Editar
            </div>

            <div onClick={onDelete} className={clsx(style.menuItem, style.delete)}>
              <Trash size={16} />
              Excluir
            </div>
          </>
        )}

        {!postOwner && (
          <>
            <div className={clsx(style.menuItem)}>
              <Flag size={16} />
              Denunciar
            </div>
          </>
        )}
      </div>
    </div>
  );
}
