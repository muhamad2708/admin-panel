const STORAGE_KEYS = {
  auth: "isp-admin-auth",
  employees: "isp-employees",
  customers: "isp-customers",
  complaints: "isp-complaints",
  attendance: "isp-attendance",
};

export function safeRead(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

export function saveData(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStorageKeys() {
  return STORAGE_KEYS;
}

export function isLoggedIn() {
  return !!safeRead(STORAGE_KEYS.auth, null);
}

export function setAuthSession(value) {
  saveData(STORAGE_KEYS.auth, value);
}
