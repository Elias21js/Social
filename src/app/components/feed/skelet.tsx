import style from "./skelet.module.css";

export default function PostSkeleton() {
  return (
    <div className={style.card}>
      {/* Header */}
      <div className={style.header}>
        <div className={style.avatar}></div>
        <div className={style.headerText}>
          <div className={style.lineShort}></div>
          <div className={style.lineTiny}></div>
        </div>
      </div>

      {/* Texto */}
      <div className={style.body}>
        <div className={style.line}></div>
        <div className={style.line}></div>
        <div className={style.lineHalf}></div>
      </div>

      {/* Imagem */}
      <div className={style.image}></div>

      {/* Ações */}
      <div className={style.footer}>
        <div className={style.icon}></div>
        <div className={style.icon}></div>
        <div className={style.icon}></div>
      </div>
    </div>
  );
}
