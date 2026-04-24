export type UserRole = "admin" | "moderator" | "user";
export type UserStatus = "active" | "inactive" | "banned";

export interface User {
     id: string;
     name: string;
     email: string;
     role: UserRole;
     status: UserStatus;
     avatar: string;
     createdAt: string;
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

export interface LinkedEntity {
     id: string;
     entity: string;
     email: string;
     usageQueries: number;
     lastActive: string;
}