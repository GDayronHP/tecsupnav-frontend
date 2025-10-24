import { UserV2 } from "@types/auth";

export interface ValidateTokenResponseV1 {
  success: boolean;
  valid: boolean;
  user?: UserV2;
}
