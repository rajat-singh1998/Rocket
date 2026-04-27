const ADMIN_TOKEN_KEY = "rocket_admin_auth";
const ADMIN_PROFILE_KEY = "rocket_admin_profile";

export function getAdminToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}

export function getAdminAuthHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getAdminProfile() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(ADMIN_PROFILE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

export function persistAdminSession(token, profile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);

  if (profile) {
    window.localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
  }
}

export function updateStoredAdminProfile(profile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
}

export function logoutAdmin() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_PROFILE_KEY);
}
