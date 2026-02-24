import imageCompression from "browser-image-compression";

const loadImageElement = (file: File) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

const canvasCompressToJpeg = async (file: File, maxWidthOrHeight: number, quality: number): Promise<File> => {
  const img = await loadImageElement(file);
  const longestSide = Math.max(img.width, img.height);
  const ratio = longestSide > maxWidthOrHeight ? maxWidthOrHeight / longestSide : 1;
  const width = Math.max(1, Math.round(img.width * ratio));
  const height = Math.max(1, Math.round(img.height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context unavailable");
  }

  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Failed to generate compressed image"));
      },
      "image/jpeg",
      quality
    );
  });

  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
};

const DEFAULT_ATTEMPTS = [
  { maxWidthOrHeight: 2048, quality: 0.9 },
  { maxWidthOrHeight: 1600, quality: 0.82 },
  { maxWidthOrHeight: 1280, quality: 0.74 },
  { maxWidthOrHeight: 1024, quality: 0.66 },
  { maxWidthOrHeight: 768, quality: 0.58 },
  { maxWidthOrHeight: 640, quality: 0.5 },
  { maxWidthOrHeight: 512, quality: 0.42 },
  { maxWidthOrHeight: 384, quality: 0.34 },
  { maxWidthOrHeight: 256, quality: 0.26 },
  { maxWidthOrHeight: 180, quality: 0.2 },
  { maxWidthOrHeight: 128, quality: 0.16 },
  { maxWidthOrHeight: 96, quality: 0.12 },
];

export async function compressImageToMaxBytes(file: File, maxBytes: number): Promise<File> {
  if (file.size <= maxBytes) {
    return file;
  }

  let current = file;
  const maxSizeMB = Number((maxBytes / (1024 * 1024)).toFixed(4));

  for (const attempt of DEFAULT_ATTEMPTS) {
    try {
      current = await imageCompression(current, {
        maxSizeMB,
        maxWidthOrHeight: attempt.maxWidthOrHeight,
        useWebWorker: true,
        initialQuality: attempt.quality,
        maxIteration: 20,
        fileType: "image/jpeg",
      });
    } catch {
      current = await canvasCompressToJpeg(current, attempt.maxWidthOrHeight, attempt.quality);
    }

    if (current.size <= maxBytes) {
      return current;
    }
  }

  const finalAttempt = await canvasCompressToJpeg(current, 72, 0.08);
  if (finalAttempt.size <= maxBytes) {
    return finalAttempt;
  }

  throw new Error(`Unable to compress image to ${Math.round(maxBytes / 1024)}KB`);
}
