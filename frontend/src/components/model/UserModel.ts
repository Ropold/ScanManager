
export type UserModel = {
    id: string;
    microsoftId: string;
    username: string;
    email: string;
    role: string;
    preferredLanguage: string;
    createdAt: string;
    lastLoginAt?: string;
    avatarUrl?: string;
}

export const DefaultUser: UserModel = {
    id: "0",
    microsoftId: "0",
    username: "Loading...",
    email: "Loading...",
    role: "USER",
    preferredLanguage: "de",
    avatarUrl: undefined,
    lastLoginAt: undefined,
    createdAt: "Loading..."
};