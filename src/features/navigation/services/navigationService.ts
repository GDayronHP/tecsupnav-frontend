import { NavigationResponse } from "@types/response/navigation_response_v1";
import { Navigation } from "@types/navigation";
import { httpPost } from "@utils/httpClient";
import { NavigationRequestV1 } from "@types/request/navigation_request_v1";

class NavigationService {
  async getAll(body: NavigationRequestV1): Promise<Navigation> {
    const data = await httpPost<NavigationResponse>("/navigation/create-route", body);
    return data.data;
  }
}

export const navigationService = new NavigationService();

export const useNavigationService = () => {
  return navigationService;
}
