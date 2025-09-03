export async function getCroppedImg(
  file: File,
  croppedAreaPixels: { width: number; height: number; x: number; y: number }
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (!img.src) return;
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("Canvas context não encontrado");

      // Desenha a parte recortada da imagem no canvas
      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Converte para Blob e depois para File
      canvas.toBlob((blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], file.name, { type: file.type });
        resolve(croppedFile);
      }, file.type);
    };
    img.onerror = (err) => reject(err);
  });
}
