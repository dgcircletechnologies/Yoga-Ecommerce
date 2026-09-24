"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { getCurrentUser, login as loginRequest, type AuthUser } from "@/api/auth.api";
import { getToken, removeToken, setToken } from "@/utils/auth";

type AuthContextValue = {
  currentUser: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  refreshSession: () => Promise<AuthUser | null>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setStoredToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const existingToken = getToken();
    if (!existingToken) {
      setStoredToken(null);
      setCurrentUser(null);
      return null;
    }

    setStoredToken(existingToken);
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      return user;
    } catch {
      removeToken();
      setStoredToken(null);
      setCurrentUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    // Session restoration is the external-storage synchronization this effect owns.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshSession().finally(() => setIsLoading(false));
  }, [refreshSession]);

  useEffect(() => {
    const handleExpired = () => { setStoredToken(null); setCurrentUser(null); };
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    setToken(result.accessToken);
    setStoredToken(result.accessToken);
    setCurrentUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setStoredToken(null);
    setCurrentUser(null);
  }, []);

  const value = useMemo(() => ({
    currentUser,
    token,
    isAuthenticated: Boolean(token && currentUser),
    isLoading,
    login,
    logout,
    refreshSession,
  }), [currentUser, isLoading, login, logout, refreshSession, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
