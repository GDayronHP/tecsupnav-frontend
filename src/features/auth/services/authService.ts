import { AuthRequest_V1 } from '@types/request/auth_request_v1';
import { AuthResponseV1 } from '@types/response/auth_response_v1';
import { ValidateTokenResponseV1 } from '@types/response/validateToken_response_v1';
import { httpPost, httpGet } from '@utils/httpClient';
import { clearTokenCache } from '@utils/httpClient';
import * as SecureStore from "expo-secure-store";

class AuthService {

  async login({ googleToken, email, firstName, lastName, avatar }: AuthRequest_V1): Promise<AuthResponseV1> {
    const response = await httpPost<AuthResponseV1>('/auth/google/mobile', { googleToken, email, firstName, lastName, avatar});
    return response;
  }

  async validateToken(): Promise<{ isValid: boolean; user?: any }> {
    try {
      const response = await httpGet<ValidateTokenResponseV1>('/auth/verify');
      
      if (response.success && response.valid) {
        return {
          isValid: true,
          user: response.user
        };
      }
      
      return { isValid: false };
    } catch (error) {
      console.error('Token validation failed:', error);
      return { isValid: false };
    }
  }


  async logout(): Promise<void> {
    try {

      await httpPost('/auth/logout');
    } catch (error) {

      console.warn('Error notificando logout al backend:', error);
    } finally {

      await this.clearAllTokens();
    }
  }
  async clearAllTokens(): Promise<void> {
    try {
      clearTokenCache();
      
      await Promise.all([
        SecureStore.deleteItemAsync('access_token'),
        SecureStore.deleteItemAsync('user_info'),
        SecureStore.deleteItemAsync('google_token')
      ]);

      console.log('✅ Todos los tokens han sido limpiados');
    } catch (error) {
      console.error('❌ Error limpiando tokens:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;