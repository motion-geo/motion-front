"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const SESSION_KEY = "motion-auth-session";
const USERS_KEY = "motion-auth-users";

export type AuthUser = {
  email: string;
  phone: string;
  nameOrCompany: string;
  planId: string;
  workIds: string[];
};

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  login: (input: { email: string; password: string }) => AuthUser;
  register: (input: {
    email: string;
    phone: string;
    nameOrCompany: string;
    password: string;
  }) => AuthUser;
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

function readUsers(): Record<string, AuthUser> {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, AuthUser>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, AuthUser>) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

let cachedSessionRaw: string | null | undefined;
let cachedSession: AuthUser | null = null;

function readSession(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (raw === cachedSessionRaw) return cachedSession;
    cachedSessionRaw = raw;
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
    return null;
  }
}

function writeSession(user: AuthUser | null) {
  if (user) {
    const raw = JSON.stringify(user);
    window.localStorage.setItem(SESSION_KEY, raw);
    cachedSessionRaw = raw;
    cachedSession = user;
  } else {
    window.localStorage.removeItem(SESSION_KEY);
    cachedSessionRaw = null;
    cachedSession = null;
  }
  emit();
}

function getServerSnapshot(): AuthUser | null {
  return null;
}

function demoUserFromEmail(email: string): AuthUser {
  const local = email.split("@")[0] || "client";
  const name = local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    email,
    phone: "555123456",
    nameOrCompany: name || "Motion Client",
    planId: "growth",
    workIds: ["identity", "rhythm", "film"],
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, readSession, getServerSnapshot);

  const login = useCallback((input: { email: string; password: string }) => {
    void input.password;
    const email = input.email.trim().toLowerCase();
    const users = readUsers();
    const existing = users[email] ?? demoUserFromEmail(email);
    users[email] = existing;
    writeUsers(users);
    writeSession(existing);
    return existing;
  }, []);

  const register = useCallback(
    (input: {
      email: string;
      phone: string;
      nameOrCompany: string;
      password: string;
    }) => {
      void input.password;
      const email = input.email.trim().toLowerCase();
      const next: AuthUser = {
        email,
        phone: input.phone.trim(),
        nameOrCompany: input.nameOrCompany.trim(),
        planId: "growth",
        workIds: ["identity", "rhythm", "search"],
      };
      const users = readUsers();
      users[email] = next;
      writeUsers(users);
      writeSession(next);
      return next;
    },
    [],
  );

  const logout = useCallback(() => {
    writeSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
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
