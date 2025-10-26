import { Place } from "@types/place";
import { Intent, Option } from "@types/aiAssistant";

export interface AiAssistantServiceResponseV2 {
  success: boolean;
  data: {
    message: string;
    intent: Intent;
    action: "show_info" | "navigate" | "search" | "none";
    requiresConfirmation?: boolean;
    suggestions?: string[];
    data?: {
      places?: Place[];
    };
  };
  userId: string;
}
