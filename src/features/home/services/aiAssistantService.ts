import { AiAssistantRequestV1 } from '@types/request/aiAssistant_request_v1';
import { AiAssistantServiceResponseV2 } from '@types/response/aiAssistant_response_v2';
import { httpPost } from '@utils/httpClient';

class AiAssistantService {

  async process({ userId, query, currentLat, currentLng, useAI, conversationId }: AiAssistantRequestV1): Promise<AiAssistantServiceResponseV2> {
    const response = await httpPost<AiAssistantServiceResponseV2>('/ai-assistant/process', { userId, query, currentLat, currentLng, useAI: useAI ?? true, conversationId });
    return response || { success: false, data: null, userId: '' };
  }

}

export const aiAssistantService = new AiAssistantService();

export const useAiAssistantService = () => {
  return aiAssistantService;
};

export default aiAssistantService;  