"use client";
import style from "./cursor.module.css";
import { useEffect, useState } from "react";

export function CursorLoader() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.pageX, y: e.pageY });
    };
    document.addEventListener("mousemove", move);
    return () => document.removeEventListener("mousemove", move);
  }, []);

  return <div className={style.cursor_loader} style={{ left: pos.x, top: pos.y }} />;
}
