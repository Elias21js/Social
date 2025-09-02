import { useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  callback: () => void,
  ignoreRefs?: Array<React.RefObject<HTMLElement | null> | undefined>
) {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!ref.current) return;
      if (ref.current.contains(event.target as Node)) return;
      if (ignoreRefs?.some((r) => r?.current?.contains(event.target as Node))) return;

      callback();
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, callback, ignoreRefs]);
}
