import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "@/lib/nav";
import { ADMIN_CONFIG } from "./admin-config";
import { hashPassword, RateLimiter, verifyPassword } from "./security";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function hasValidSession() {
  const authenticated = sessionStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.SESSION) === "true";
  const expiresAt = Number(sessionStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.SESSION_EXPIRES) || 0);
  return authenticated && expiresAt > Date.now();
}

async function ensureInitialPassword() {
  const stored = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.PASSWORD);
  if (stored || !ADMIN_CONFIG.INITIAL_PASSWORD) return;
  localStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.PASSWORD, await hashPassword(ADMIN_CONFIG.INITIAL_PASSWORD));
}

function startSession() {
  sessionStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.SESSION, "true");
  sessionStorage.setItem(
    ADMIN_CONFIG.STORAGE_KEYS.SESSION_EXPIRES,
    String(Date.now() + ADMIN_CONFIG.SESSION_TTL_MS),
  );
}

export async function changeAdminPassword(currentPassword: string, nextPassword: string): Promise<boolean> {
  await ensureInitialPassword();
  const stored = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.PASSWORD);
  const validCurrent = await verifyPassword(currentPassword, stored);
  if (!validCurrent) return false;
  localStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.PASSWORD, await hashPassword(nextPassword));
  return true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => hasValidSession());

  useEffect(() => {
    ensureInitialPassword();
  }, []);

  const login = async (password: string) => {
    const limiter = new RateLimiter(ADMIN_CONFIG.STORAGE_KEYS.LOGIN_ATTEMPTS, 5, 15 * 60 * 1000);
    if (!limiter.isAllowed()) return false;

    await ensureInitialPassword();
    const stored = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.PASSWORD);
    const valid = await verifyPassword(password, stored);
    if (!valid) return false;

    if (stored && !stored.startsWith("sha256:")) {
      localStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.PASSWORD, await hashPassword(password));
    }

    limiter.reset();
    startSession();
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_CONFIG.STORAGE_KEYS.SESSION);
    sessionStorage.removeItem(ADMIN_CONFIG.STORAGE_KEYS.SESSION_EXPIRES);
    setIsAuthenticated(false);
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
