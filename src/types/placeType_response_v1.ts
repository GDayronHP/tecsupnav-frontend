import { PlaceType } from '../features/home/services/placeTypesService';

export interface PlaceTypesResponseV1 {
  success: boolean;
  data: PlaceType[];
  total: number;
}