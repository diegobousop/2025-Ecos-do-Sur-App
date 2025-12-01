import React, { createContext, useContext, useRef, useCallback, useMemo } from 'react';

type ChatContextType = {
  resetChat: () => void;
  registerResetHandler: (handler: () => void) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const resetHandlerRef = useRef<(() => void) | null>(null);

  const registerResetHandler = useCallback((handler: () => void) => {
    resetHandlerRef.current = handler;
  }, []);

  const resetChat = useCallback(() => {
    if (resetHandlerRef.current) {
      resetHandlerRef.current();
    }
  }, []);

  const value = useMemo(() => ({ resetChat, registerResetHandler }), [resetChat, registerResetHandler]);

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
