import { Place } from '@types/place';
import { PlacesResponse } from '@types/place_response_v1';
import { httpGet } from '@utils/httpClient';

class PlaceService {
  
  async getAll(): Promise<Place[]> {
    const data = await httpGet<PlacesResponse>('/places');
    return data.data;
  }

}

export const placesService = new PlaceService();

export const usePlacesService = () => {
  return placesService;
};

export default PlaceService;  