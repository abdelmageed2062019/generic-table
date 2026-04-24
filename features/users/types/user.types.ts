export const userRoles = ["admin", "moderator", "user"] as const;
export const userStatuses = ["active", "inactive", "banned"] as const;

export type UserRole = (typeof userRoles)[number];
export type UserStatus = (typeof userStatuses)[number];

export interface LinkedEntity {
     id: string;
     entity: string;
     email: string;
     usageQueries: number;
     lastActive: string;
}

export interface User {
     id: string;
     name: string;
     email: string;
     role: UserRole;
     status: UserStatus;
     avatar: string;
     createdAt: string;
     linkedEntities: LinkedEntity[];
}

export interface UsersResponse {
     data: User[];
     total: number;
     page: number;
     perPage: number;
     totalPages: number;
}

export interface UsersParams {
     page: number;
     perPage: number;
     search?: string;
     role?: UserRole | "";
     status?: UserStatus | "";
}

export interface CreateUserInput {
     name: string;
     email: string;
     role: UserRole;
     status: UserStatus;
     avatar?: string;
     createdAt?: string;
     linkedEntities?: LinkedEntity[];
}

export interface DbSchema {
     users: User[];
}
