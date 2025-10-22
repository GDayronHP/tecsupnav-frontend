import { Place } from "@types/place";
import { Intent, Option } from "@types/aiAssistant";

export interface AiAssistantServiceResponseV1 {
  success: boolean;
  data: {
    message: string;
    intent: Intent;
    action: "show_info" | "navigate" | "search" | "none";
    requiresConfirmation?: boolean;
    suggestions?: string[];
    options?: Option[];
    data?: {
      places?: Place[];
    };
  };
  userId: string;
}
