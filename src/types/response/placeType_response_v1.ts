import { PlaceType } from '../place';

export interface PlaceTypesResponseV1 {
  success: boolean;
  data: PlaceType[];
  total: number;
}