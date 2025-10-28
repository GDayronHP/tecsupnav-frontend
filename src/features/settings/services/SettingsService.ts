import { UserV3 } from '@types/auth';
import { ProfileResponseV1 } from '@types/response/profile_response_v1';
import { httpGet } from '@utils/httpClient';

class SettingsService {
  async getUserInfo(): Promise<UserV3> {
    const response = await httpGet<ProfileResponseV1>('auth/profile');
    return response.data;
  }
}

export const settingsService = new SettingsService();

export const useSettingsService = () => {
  return settingsService;
};

export default SettingsService;