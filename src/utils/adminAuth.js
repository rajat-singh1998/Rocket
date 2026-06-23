const ADMIN_TOKEN_KEY = "rocket_admin_auth";
const ADMIN_PROFILE_KEY = "rocket_admin_profile";
const ADMIN_PROFILE_UPDATED_EVENT = "rocket_admin_profile_updated";

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

export function isAdminOwner() {
  return getAdminProfile()?.isOwner === true;
}

export function hasAdminPermission(permission) {
  const profile = getAdminProfile();

  if (!profile) {
    return false;
  }

  if (profile.isOwner || profile.role === "owner") {
    return true;
  }

  if (!Array.isArray(profile.permissions)) {
    return false;
  }

  if (permission === "city-pages") {
    return profile.permissions.includes("city-pages") || profile.permissions.some((item) => String(item).startsWith("city:"));
  }

  return profile.permissions.includes(permission);
}

export function persistAdminSession(token, profile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);

  if (profile) {
    window.localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent(ADMIN_PROFILE_UPDATED_EVENT, { detail: profile }));
  }
}

export function updateStoredAdminProfile(profile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent(ADMIN_PROFILE_UPDATED_EVENT, { detail: profile }));
}

export function logoutAdmin() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_PROFILE_KEY);
}

export { ADMIN_PROFILE_UPDATED_EVENT };
