"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: number; // opcional, padrão 16/9
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function ResponsiveImage({
  src,
  alt,
  aspectRatio = 16 / 9,
  className,
  sizes,
  priority,
}: ResponsiveImageProps) {
  const [fit, setFit] = useState<"cover" | "contain">("cover");

  useEffect(() => {
    // Cria uma imagem temporária para descobrir proporção
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (img.naturalHeight > img.naturalWidth) {
        setFit("contain"); // vertical, mostra inteira
      } else {
        setFit("cover"); // horizontal ou quadrada, cobre o container
      }
    };
  }, [src]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: aspectRatio,
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
      }}
    >
      <NextImage
        src={src}
        alt={alt}
        fill
        style={{ objectFit: fit, objectPosition: "center" }}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
