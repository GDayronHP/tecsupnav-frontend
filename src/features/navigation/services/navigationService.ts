import { NavigationResponseV1 } from "@types/response/navigation_response_v1";
import { httpPost } from "@utils/httpClient";
import { NavigationRequestV1 } from "@types/request/navigation_request_v1";
import { NavigationRequestV2 } from "@types/request/navigation_request_v2";
import { NavigationResponseV2 } from "@types/response/navigation_response_v2";

class NavigationService {
  async createRoute(body: NavigationRequestV1): Promise<NavigationResponseV1> {
    const data = await httpPost<NavigationResponseV1>("/navigation/create-route", body);
    return data;
  }

  async updateRoute(body: NavigationRequestV2): Promise<NavigationResponseV2> {
    const data = await httpPost<NavigationResponseV2>("/navigation/update", body);
    return data;
  }
}

export const navigationService = new NavigationService();

export const useNavigationService = () => {
  return navigationService;
}
