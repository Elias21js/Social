import clsx from "clsx";
import style from "./style.module.css";

export function PerfilSkelet() {
  return (
    <section className={style.perfil}>
      <div className={clsx(style.card, style.skeleton_box)}>
        <div className={clsx(style.banner, style.skeleton_box)}></div>
        <div className={clsx(style.user_sec)}>
          <div className={clsx(style.user_data)}>
            <div className={clsx(style.avatar, style.skeleton_circle)}></div>
            <div className={clsx(style.user_infos)}>
              <div>
                <span className={clsx(style.skeleton_box, style.skeleton_text, style.short)}></span>
                <span className={clsx(style.skeleton_box, style.skeleton_text, style.long)}></span>
              </div>
              <div>
                <span className={clsx(style.skeleton_box, style.skeleton_text, style.long)}></span>
                <span className={clsx(style.skeleton_box, style.skeleton_text, style.long)}></span>
              </div>
            </div>
          </div>
          <div className={clsx(style.card_menu)}>
            <div>
              <span className={clsx(style.skeleton_box, style.skeleton_text, style.tiny)}></span>
              <span className={clsx(style.skeleton_box, style.skeleton_text, style.short)}></span>
            </div>
            <div>
              <span className={clsx(style.skeleton_box, style.skeleton_text, style.tiny)}></span>
              <span className={clsx(style.skeleton_box, style.skeleton_text, style.short)}></span>
            </div>
            <div>
              <span className={clsx(style.skeleton_box, style.skeleton_text, style.tiny)}></span>
              <span className={clsx(style.skeleton_box, style.skeleton_text, style.short)}></span>
            </div>
          </div>
        </div>
      </div>
      <div className={clsx(style.list_menu, style.skeleton_box)}>
        <div className={clsx(style.menu_item, style.skeleton_box)}></div>
        <div className={clsx(style.menu_item, style.skeleton_box)}></div>
        <div className={clsx(style.menu_item, style.skeleton_box)}></div>
      </div>
    </section>
  );
}
