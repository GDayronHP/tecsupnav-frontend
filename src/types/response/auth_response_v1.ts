import { User } from '../auth';

export interface AuthResponseV1 {
    success: boolean;
    message: string;
    data: User;
}