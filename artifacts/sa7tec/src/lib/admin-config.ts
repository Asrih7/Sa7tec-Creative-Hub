export const ADMIN_CONFIG = {
  INITIAL_PASSWORD: import.meta.env.VITE_ADMIN_INITIAL_PASSWORD || "",
  SESSION_TTL_MS: 4 * 60 * 60 * 1000,
  STORAGE_KEYS: {
    PASSWORD: "sa7tec_admin_pwd",
    SESSION: "sa7tec_admin_session",
    SESSION_EXPIRES: "sa7tec_admin_session_expires",
    LOGIN_ATTEMPTS: "sa7tec_admin_login_attempts",
  }
};
