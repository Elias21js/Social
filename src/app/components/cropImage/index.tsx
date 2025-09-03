"use client";

import React, { useState, useCallback, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/utils/croppCoordinates/croppCoordinates";

interface CroppedProps {
  src: File;
  onCancel: () => void;
  onComplete: (FileCropped?: File) => void;
  state: "avatar" | "banner";
}

export function CroppedImage({ src, onCancel, onComplete, state }: CroppedProps) {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedFile, setCroppedFile] = useState<File>();
  const [urlImage, setUrlImage] = useState<string>();

  useEffect(() => {
    setUrlImage(URL.createObjectURL(src));
  }, []);

  const onCropChange = useCallback((newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  }, []);

  const onCropComplete = useCallback(
    async (croppedArea: Area, croppedAreaPixels: Area) => {
      try {
        const croppedFile = await getCroppedImg(src, croppedAreaPixels);
        // Aqui você tem o arquivo recortado pronto pra enviar ou mostrar
        setCroppedFile(croppedFile);
      } catch (err) {
        console.error(err);
      }
    },
    [src]
  );

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);
  //user-sec-padding: 5rem 2rem 2rem; banner-img: height: 318px; max-height: 318px; card: height: max-content;
  // OUTRO STYLE PRO PERFIL (BANNER MAIOR)
  return (
    <div className="cropp_wrapper">
      <div className="crop-container">
        <Cropper
          image={urlImage}
          crop={crop}
          zoom={zoom}
          aspect={state === "avatar" ? 1 : 28 / 9}
          cropShape={state === "avatar" ? "round" : "rect"}
          showGrid={false}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
        />
      </div>
      <div className="controls">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(_, value) => onZoomChange(value as number)}
          sx={{ width: 300 }}
        />
        <div>
          <button
            onClick={() => onComplete(croppedFile)} // depois você troca file por blob recortado
            className="btn-complete"
          >
            Concluído
          </button>

          <button onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
