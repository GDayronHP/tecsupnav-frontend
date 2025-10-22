import { NavigationV1 } from '../navigation';

export interface NavigationResponseV1 {
    success: boolean;
    message: string;
    data: NavigationV1;
    statusCode?: number;
}