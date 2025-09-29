export interface NavigationRequestV1 {
  currentLat: number;
  currentLng: number;
  destinationId: string;
  mode: string;
  accessible: boolean;
  fastest: boolean;
}
