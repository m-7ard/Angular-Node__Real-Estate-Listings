export const JWT_ROLES = {
    ADMIN: "Admin",
    CLIENT: "Client",
} as const;

export interface IJwtPayload {
    email: string;
    role: typeof JWT_ROLES[keyof typeof JWT_ROLES];
}
