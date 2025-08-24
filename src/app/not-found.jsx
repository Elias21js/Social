import style from "./404.module.css";

export default function NotFound() {
  return (
    <div className={style.container}>
      <div className={style.stars}></div>
      <div className={style.stars2}></div>
      <div className={style.stars3}></div>

      <h1 className={style.title}>404</h1>
      <p className={style.subtitle}>Você se perdeu no espaço sideral 🚀</p>
      <a href="/" className={style.button}>
        Voltar para o início
      </a>
    </div>
  );
}
