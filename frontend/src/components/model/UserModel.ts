
export type UserModel = {
    id: string;
    microsoftId: string;
    username: string;
    email: string;
    role: string;
    avatarUrl?: string;
    createdAt: string;
    lastLoginAt?: string;
}

export const DefaultUser: UserModel = {
    id: "0",
    microsoftId: "0",
    username: "Loading...",
    email: "Loading...",
    role: "guest",
    avatarUrl: undefined,
    createdAt: "Loading...",
    lastLoginAt: undefined
};