import { User } from '@types/auth';
import { AuthResponseV1 } from '@types/response/auth_response_v1';
import { httpGet } from '@utils/httpClient';

class SettingsService {

  async getMobileDashboard(): Promise<User> {
    const data = await httpGet<AuthResponseV1>('auth/mobile/dashboard');
    return data.data;
  }

}

export const settingsService = new SettingsService();

export const useSettingsService = () => {
  return settingsService;
};

export default SettingsService;