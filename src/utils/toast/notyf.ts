import { useEffect, useState } from "react";
import { Notyf } from "notyf";

export function useNotyf() {
  const [notyf, setNotyf] = useState<Notyf | null>(null);

  useEffect(() => {
    setNotyf(
      new Notyf({
        position: { x: "center", y: "top" },
      })
    );
  }, []);

  return notyf;
}
