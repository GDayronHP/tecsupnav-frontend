import { PlaceTypesResponseV1 } from '@types/placeType_response_v1';
import { httpGet } from '@utils/httpClient';
import { PlaceType } from '@types/place';

class PlaceTypesService {
  
  async getAll(): Promise<PlaceType[]> {
    const response = await httpGet<PlaceTypesResponseV1>('/place-types');
    return response.data || [];
  }

}

export const placeTypesService = new PlaceTypesService();

export const usePlaceTypesService = () => {
  return placeTypesService;
};

export default PlaceTypesService;