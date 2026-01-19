import React, { createContext, useContext, useRef, useCallback, useMemo } from 'react';

type ChatContextType = {
  resetChat: () => void;
  registerResetHandler: (handler: () => void) => void;
  activeChatIdRef: number | null;
  setActiveChatId: (id: number | null) => void;
  getActiveChatId: () => number | null;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const activeChatIdRef = useRef<string | null>(null);
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

  const resetChat = useCallback(() => {
    if (resetHandlerRef.current) {
      resetHandlerRef.current();
    }
  }, []);

  const value = useMemo(() => ({ resetChat, registerResetHandler, setActiveChatId, getActiveChatId }), [resetChat, registerResetHandler, setActiveChatId, getActiveChatId]);

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
