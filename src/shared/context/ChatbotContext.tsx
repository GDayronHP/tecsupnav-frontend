import React, { useCallback, useState, useMemo } from 'react'

import { createContext, useContext } from 'react'

interface ChatbotContextType {
    showChatBot: boolean;
    setShowChatBot: (show: boolean) => void;
    openChatBot: () => void;
    closeChatBot: () => void;
    pendingChatQuery: string;
    setPendingChatQuery: (query: string) => void;
    pendingChatResponse: any;
    setPendingChatResponse: (response: any) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotContextProvider({ children }: { children: React.ReactNode }) {
    const [showChatBot, setShowChatBot] = useState<boolean>(false);
    const [pendingChatQuery, setPendingChatQuery] = useState<string>("");
    const [pendingChatResponse, setPendingChatResponse] = useState<any>(null);

    const openChatBot = useCallback(() => {
        setShowChatBot(true);
        setPendingChatQuery("");
        setPendingChatResponse(null);
    }, []);

    const closeChatBot = useCallback(() => {
        setShowChatBot(false);
        setPendingChatQuery("");
        setPendingChatResponse(null);
    }, []);

    // Memoizar el valor del contexto
    const contextValue = useMemo(() => ({
        showChatBot,
        setShowChatBot,
        openChatBot,
        closeChatBot,
        pendingChatQuery,
        setPendingChatQuery,
        pendingChatResponse,
        setPendingChatResponse
    }), [showChatBot, openChatBot, closeChatBot, pendingChatQuery, pendingChatResponse]);

    return (
        <ChatbotContext.Provider value={contextValue}>
            {children}
        </ChatbotContext.Provider>
    )
}

export function useChatbot(): ChatbotContextType {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error('useChatbot must be used within a ChatbotContextProvider');
    }
    return context;
}