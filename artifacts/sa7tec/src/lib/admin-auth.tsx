import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { ADMIN_CONFIG } from "./admin-config";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.SESSION) === "true";
  });

  useEffect(() => {
    // Initialize default password if missing
    if (!localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.PASSWORD)) {
      localStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.PASSWORD, ADMIN_CONFIG.DEFAULT_PASSWORD);
    }
  }, []);

  const login = (password: string) => {
    const correctPwd = localStorage.getItem(ADMIN_CONFIG.STORAGE_KEYS.PASSWORD) || ADMIN_CONFIG.DEFAULT_PASSWORD;
    if (password === correctPwd) {
      sessionStorage.setItem(ADMIN_CONFIG.STORAGE_KEYS.SESSION, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_CONFIG.STORAGE_KEYS.SESSION);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
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
