export interface AiAssistantRequestV1 {
    userId?: string;
    query: string;
    currentLat: number;
    currentLng: number;
    useAI?: boolean;
    conversationId?: string;
}