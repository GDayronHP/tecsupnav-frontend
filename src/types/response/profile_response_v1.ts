import { UserV3 } from '@types/auth';

export interface ProfileResponseV1 {
  success: boolean;
  message: string;
  data: UserV3;
}
