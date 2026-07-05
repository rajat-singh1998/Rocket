function getDefaultApiBaseUrl() {
  if (typeof window === "undefined") {
    return "http://localhost:5000";
  }

  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }

  return window.location.origin;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || getDefaultApiBaseUrl();

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
