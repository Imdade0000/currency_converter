import { User } from './api';

export interface UserProfile extends User {
    stats?: {
        totalConversions: number;
        totalAlerts: number;
        totalApiKeys: number;
    };
}
