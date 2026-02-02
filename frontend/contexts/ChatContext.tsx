import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';

type ChatContextType = {
  resetChat: () => void;
  registerResetHandler: (handler: () => void) => void;
  activeChatIdRef: number | null;
  activeChatIsIncognitoRef: boolean | null;
  setActiveChatId: (id: number | null) => void;
  getActiveChatId: () => number | null;
  toggleIncognito: () => void;
  setIsIncognito: (value: boolean) => void;
  getIsIncognito: () => boolean;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const activeChatIdRef = useRef<string | null>(null);
  const activeChatIsIncognitoRef = useRef<boolean>(false);
  const resetHandlerRef = useRef<(() => void) | null>(null);

  const registerResetHandler = useCallback((handler: () => void) => {
    resetHandlerRef.current = handler;
  }, []);

  const setActiveChatId = useCallback((id: string | null) => {
    activeChatIdRef.current = id;
  }, []);

  const getActiveChatId = useCallback(() => {
    return activeChatIdRef.current;
  }, []);

  const toggleIncognito = useCallback(() => {
    activeChatIsIncognitoRef.current = !activeChatIsIncognitoRef.current;
  }, []);

  const setIsIncognito = useCallback((value: boolean) => {
    activeChatIsIncognitoRef.current = value;
    console.log('Incognito mode set to:', value);
  }, []);

  const getIsIncognito = useCallback(() => {
    return activeChatIsIncognitoRef.current;
  }, []);

  const resetChat = useCallback(() => {
    if (resetHandlerRef.current) {
      resetHandlerRef.current();
    }
  }, []);

  const value = useMemo(() => ({ resetChat, registerResetHandler, setActiveChatId, getActiveChatId, toggleIncognito, setIsIncognito, getIsIncognito }), [resetChat, registerResetHandler, setActiveChatId, getActiveChatId, toggleIncognito, setIsIncognito, getIsIncognito]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
