const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function buildApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export function resolveAssetUrl(assetPath) {
  const nextPath = String(assetPath || "").trim();

  if (!nextPath) {
    return "";
  }

  if (
    nextPath.startsWith("http://") ||
    nextPath.startsWith("https://") ||
    nextPath.startsWith("data:") ||
    nextPath.startsWith("blob:")
  ) {
    return nextPath;
  }

  if (nextPath.startsWith("/uploads/")) {
    return `${API_BASE_URL}${nextPath}`;
  }

  return nextPath;
}

export { API_BASE_URL };
