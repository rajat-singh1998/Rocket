const BYTES_IN_MB = 1024 * 1024;
const MAX_SOURCE_IMAGE_BYTES = 30 * BYTES_IN_MB;
const MAX_UPLOAD_IMAGE_BYTES = 6 * BYTES_IN_MB;
const COMPRESSIBLE_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_IMAGE_TYPES = new Set([...COMPRESSIBLE_IMAGE_TYPES, "image/gif", "image/svg+xml"]);

function extensionlessName(fileName) {
  return fileName.replace(/\.[^/.]+$/, "") || "image";
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This image could not be read. Please choose another image."));
    };

    image.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("This image could not be optimized. Please choose another image."));
        return;
      }

      resolve(blob);
    }, type, quality);
  });
}

export async function prepareImageForUpload(file, options = {}) {
  if (!file) {
    return null;
  }

  const fileType = file.type || "";

  if (!fileType.startsWith("image/") || !ALLOWED_IMAGE_TYPES.has(fileType)) {
    throw new Error("Please choose a JPG, PNG, WEBP, GIF or SVG image.");
  }

  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    throw new Error("This image is too large. Please use an image under 30 MB.");
  }

  if (!COMPRESSIBLE_IMAGE_TYPES.has(fileType)) {
    if (file.size > MAX_UPLOAD_IMAGE_BYTES) {
      throw new Error("This image is too large. Please use a JPG, PNG or WEBP image under 6 MB.");
    }

    return file;
  }

  if (file.size <= MAX_UPLOAD_IMAGE_BYTES && !options.forceOptimize) {
    return file;
  }

  const maxWidth = options.maxWidth || 2400;
  const maxHeight = options.maxHeight || 1800;
  const image = await loadImage(file);
  const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, "image/jpeg", options.quality || 0.78);

  if (blob.size > MAX_UPLOAD_IMAGE_BYTES) {
    throw new Error("This image is still too large after optimization. Please use a smaller image.");
  }

  if (blob.size >= file.size && file.size <= MAX_UPLOAD_IMAGE_BYTES) {
    return file;
  }

  return new File([blob], `${extensionlessName(file.name)}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now()
  });
}

export async function readJsonResponse(response, fallbackMessage) {
  try {
    return await response.json();
  } catch {
    return {
      ok: false,
      message: fallbackMessage || "The server returned an unexpected response. Please try again."
    };
  }
}

export function friendlyRequestError(error, fallbackMessage) {
  const message = error?.message || "";

  if (message.toLowerCase().includes("failed to fetch")) {
    return "Could not reach the server. Please refresh and try again. If you selected an image, choose a smaller JPG or PNG.";
  }

  return message || fallbackMessage || "Something went wrong. Please try again.";
}
