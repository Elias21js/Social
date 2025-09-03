"use client";

import { Pencil, Trash, Flag } from "lucide-react";
import style from "./menu.module.css";
import clsx from "clsx";
import { RefObject, useRef, useState } from "react";
import { useClickOutside } from "@/app/hooks/clickOuside";
import { useNotyf } from "@/utils/toast/notyf";
import { getErrorMessage } from "@/utils/error/errorCatch";
import { mutate } from "swr";
import { removeAvatar, uploadAvatar } from "@/app/storage/avatar.storage";
import { removeBanner, uploadBanner } from "@/app/storage/banner.storage";
import {
  handleDeleteAvatar,
  handleDeleteBanner,
  handleUpdateAvatar,
  handleUpdateBanner,
} from "@/app/controllers/userController";
import { CroppedImage } from "../cropImage";
//
export function Menu({
  state,
  perfilOwner,
  setStateMenu,
  ignoreRef,
  position,
  ref,
  user,
}: {
  state: "avatar" | "banner";
  perfilOwner: boolean;
  setStateMenu: () => void;
  ignoreRef?: RefObject<HTMLDivElement | null>[];
  position: { x: number; y: number } | null;
  ref: RefObject<HTMLDivElement | null>;
  user: {
    user_id: string;
    name: string;
    username: string | null;
    email: string | undefined;
    avatar: string | null;
    avatar_path: string | null;
    banner: string | null;
    banner_path: string | null;
    created_at: string;
  };
}) {
  useClickOutside(ref, () => setStateMenu(), ignoreRef);
  const [cropp, setCropp] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const notyf = useNotyf();

  const onEdit = async (selectedFile?: File) => {
    const currentFile = selectedFile;
    if (!currentFile) return;
    setStateMenu();

    try {
      const uploaders = {
        avatar: uploadAvatar,
        banner: uploadBanner,
      };

      const updaters = {
        avatar: handleUpdateAvatar,
        banner: handleUpdateBanner,
      };

      const url = await uploaders[state](user.user_id, currentFile);
      await updaters[state](user.user_id, url);

      mutate(`/api/users/${user.user_id}`);
      notyf?.success(`${state === "avatar" ? "Avatar" : "Banner"} atualizado com sucesso!`);
    } catch (err) {
      if (getErrorMessage(err).includes("maximum allowed size"))
        return notyf?.error("Tamanho do arquivo muito grande.");
      notyf?.error(getErrorMessage(err));
      console.error(err);
    }
  };

  const onDelete = async () => {
    setStateMenu();
    if (!state) return;
    try {
      const removeHandlers = {
        avatar: removeAvatar,
        banner: removeBanner,
      };

      const databaseHandlers = {
        avatar: handleDeleteAvatar,
        banner: handleDeleteBanner,
      };

      console.log(user[`${state}_path`]);
      const { success } = await removeHandlers[state](user[`${state}_path`]!);
      if (!success) throw new Error("Não foi possível remover.");
      await databaseHandlers[state](user.user_id);

      mutate(`/api/users/${user.user_id}`);
      notyf?.success(`${state === "avatar" ? "Avatar" : "Banner"} removido com sucesso!`);
    } catch (err) {
      notyf?.error(getErrorMessage(err));
      console.error(err);
    }
  };

  return (
    <>
      <div style={{ top: position?.y, left: position?.x }} ref={ref} className={style.menuWrapper}>
        <div className={style.menuContent}>
          {perfilOwner && (
            <>
              {!cropp && (
                <>
                  <label htmlFor="file-upload" className={style.label_upload}>
                    <div className={style.menuItem}>
                      <Pencil size={16} />
                      Mudar {state}
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        ref={fileRef}
                        className={style.file_i}
                        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.files && e.target.files[0]) {
                            if (e.target.files[0].type === "image/gif") return await onEdit(e.target.files[0]);
                            setCropp(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </label>

                  <div onClick={onDelete} className={clsx(style.menuItem, style.delete)}>
                    <Trash size={16} />
                    Remover
                  </div>
                </>
              )}
            </>
          )}

          {!perfilOwner && (
            <>
              <div className={clsx(style.menuItem)}>
                <Flag size={16} />
                Denunciar
              </div>
            </>
          )}
        </div>
      </div>
      {cropp && (
        <>
          <CroppedImage
            src={cropp}
            onCancel={() => setCropp(null)}
            onComplete={async (fileCropped) => {
              if (!fileCropped) return;
              await onEdit(fileCropped);
            }}
            state={state}
          />
        </>
      )}
    </>
  );
}
