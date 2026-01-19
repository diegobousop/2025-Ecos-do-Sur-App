import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type AuthUser = {
  id: string;
  userName?: string;
  name?: string;
  role?: string;
};

type AuthSession = {
  token: string;
  user?: AuthUser | null;
};

type AuthContextType = {
  isLoaded: boolean;
  isSignedIn: boolean;
  token: string | null;
  user: AuthUser | null;
  setSession: (session: AuthSession) => Promise<void>;
  signOut: () => Promise<void>;
};

const STORAGE_TOKEN_KEY = 'auth.token';
const STORAGE_USER_KEY = 'auth.user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeJsonParse = <T,>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const storageGetItem = async (key: string): Promise<string | null> => {
  return await SecureStore.getItemAsync(key);
};

const storageSetItem = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    return;
  }
};

const storageRemoveItem = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
   } catch {
    return;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const storedToken = await storageGetItem(STORAGE_TOKEN_KEY);
      const storedUser = safeJsonParse<AuthUser>(await storageGetItem(STORAGE_USER_KEY));

      if (cancelled) return;

      setToken(storedToken);
      setUser(storedUser);
      setIsLoaded(true);
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const setSession = useCallback(async (session: AuthSession) => {
    setToken(session.token);
    setUser(session.user ?? null);

    await storageSetItem(STORAGE_TOKEN_KEY, session.token);
    await storageSetItem(STORAGE_USER_KEY, JSON.stringify(session.user ?? null));
  }, []);

  const signOut = useCallback(async () => {
    setToken(null);
    setUser(null);

    await storageRemoveItem(STORAGE_TOKEN_KEY);
    await storageRemoveItem(STORAGE_USER_KEY);
  }, []);


  const value = useMemo<AuthContextType>(() => {
    const isSignedIn = Boolean(token);
    return { isLoaded, isSignedIn, token, user, setSession, signOut };
  }, [isLoaded, token, user, setSession, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
