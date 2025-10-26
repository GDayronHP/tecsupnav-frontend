import React, { useCallback, useState } from 'react'

import { createContext, useContext } from 'react'
const ChatbotContext = createContext(null);

export function ChatbotContextProvider({ children }) {
    const [showChatBot, setShowChatBot] = useState<boolean>(false);
    const [pendingChatQuery, setPendingChatQuery] = useState<string>("");

    const openChatBot = useCallback(() => {
        setShowChatBot(true);
        setPendingChatQuery("");
    }, []);

    const closeChatBot = useCallback(() => {
        setShowChatBot(false);
        setPendingChatQuery("");
    }, []);

    return (
        <ChatbotContext.Provider value={{
            showChatBot,
            setShowChatBot,
            openChatBot,
            closeChatBot,
            pendingChatQuery,
            setPendingChatQuery
        }}>
            {children}
        </ChatbotContext.Provider>
    )
}

export function useChatbot() {
    return useContext(ChatbotContext);
}