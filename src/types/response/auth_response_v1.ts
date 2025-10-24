import { AuthResponseV1Data } from '../auth';

export interface AuthResponseV1 {
    success: boolean;
    message: string;
    data: AuthResponseV1Data;
}
