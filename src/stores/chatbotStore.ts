import { create } from 'zustand';

interface ChatbotStore {
  showChatBot: boolean;
  pendingChatQuery: string;
  pendingChatResponse: any | null;
  
  // Actions
  openChatBot: () => void;
  closeChatBot: () => void;
  setShowChatBot: (show: boolean) => void;
  setPendingChatQuery: (query: string) => void;
  setPendingChatResponse: (response: any) => void;
  resetChatbot: () => void;
}

export const useChatbotStore = create<ChatbotStore>((set) => ({
  showChatBot: false,
  pendingChatQuery: "",
  pendingChatResponse: null,
  
  openChatBot: () => set({ showChatBot: true }),
  closeChatBot: () => set({ 
    showChatBot: false, 
    pendingChatQuery: "", 
    pendingChatResponse: null 
  }),
  setShowChatBot: (show) => set({ showChatBot: show }),
  setPendingChatQuery: (query) => set({ pendingChatQuery: query }),
  setPendingChatResponse: (response) => set({ pendingChatResponse: response }),
  resetChatbot: () => set({
    showChatBot: false,
    pendingChatQuery: "",
    pendingChatResponse: null
  })
}));
