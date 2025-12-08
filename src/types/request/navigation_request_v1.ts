import { User } from "@types/auth";

export interface NavigationRequestV1 {
  currentLat: number;
  currentLng: number;
  destinationId: string | number;
  mode: string;
  accessible: boolean;
  fastest: boolean;
  user?: User;
}
