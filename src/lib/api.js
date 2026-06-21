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

export function appendAssetVersion(assetUrl, version) {
  const nextUrl = String(assetUrl || "").trim();
  const nextVersion = String(version || "").trim();

  if (!nextUrl || !nextVersion || nextUrl.startsWith("data:") || nextUrl.startsWith("blob:")) {
    return nextUrl;
  }

  const separator = nextUrl.includes("?") ? "&" : "?";
  return `${nextUrl}${separator}v=${encodeURIComponent(nextVersion)}`;
}

export { API_BASE_URL };
