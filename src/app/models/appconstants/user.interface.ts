export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    enabled: boolean;
    accountVerified: boolean;
    emailVerified: boolean;
    joinDate: string;
    dateLastModified: string;
    phone:string;
}