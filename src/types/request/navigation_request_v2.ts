import { User } from "@types/auth";

export interface NavigationRequestV2 {
  currentLat: number;
  currentLng: number;
  destinationId: string;
  user: User;
}
