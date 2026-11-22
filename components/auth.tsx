"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { apiLogin, apiRegister } from "@/lib/api";

const SESSION_KEY = "motion-auth-session";
const TOKEN_KEY = "motion-auth-token";

export type AuthUser = {
  id: string;
  email: string;
  phone: string;
  nameOrCompany: string;
  role: "user" | "admin";
  planId: string;
  workIds: string[];
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  ready: boolean;
  login: (input: { email: string; password: string }) => Promise<AuthUser>;
  register: (input: {
    email: string;
    phone: string;
    nameOrCompany: string;
    password: string;
  }) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

let cachedSessionRaw: string | null | undefined;
let cachedSession: AuthUser | null = null;
let cachedToken: string | null = null;

function readSession(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (raw === cachedSessionRaw) return cachedSession;
    cachedSessionRaw = raw;
    cachedToken = window.localStorage.getItem(TOKEN_KEY);
    if (!raw) {
      cachedSession = null;
      return cachedSession;
    }
    const parsed = JSON.parse(raw) as AuthUser;
    cachedSession = parsed?.email ? parsed : null;
    return cachedSession;
  } catch {
    cachedSessionRaw = null;
    cachedSession = null;
    cachedToken = null;
    return null;
  }
}

function writeSession(user: AuthUser | null, token: string | null = null) {
  if (user && token) {
    const raw = JSON.stringify(user);
    window.localStorage.setItem(SESSION_KEY, raw);
    window.localStorage.setItem(TOKEN_KEY, token);
    cachedSessionRaw = raw;
    cachedSession = user;
    cachedToken = token;
  } else {
    window.localStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    cachedSessionRaw = null;
    cachedSession = null;
    cachedToken = null;
  }
  emit();
}

function getServerSnapshot(): AuthUser | null {
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, readSession, getServerSnapshot);

  const login = useCallback(
    async (input: { email: string; password: string }) => {
      const result = await apiLogin(input.email, input.password);
      writeSession(result.user, result.accessToken);
      return result.user;
    },
    [],
  );

  const register = useCallback(
    async (input: {
      email: string;
      phone: string;
      nameOrCompany: string;
      password: string;
    }) => {
      const result = await apiRegister(input);
      writeSession(result.user, result.accessToken);
      return result.user;
    },
    [],
  );

  const logout = useCallback(() => {
    writeSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token: user ? cachedToken : null,
      ready: true,
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
