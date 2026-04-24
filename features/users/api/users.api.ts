import type {
     CreateUserInput,
     UsersParams,
     UsersResponse,
     User,
} from "../types/user.types";

function buildQuery(params: UsersParams) {
     const searchParams = new URLSearchParams({
          page: String(params.page),
          perPage: String(params.perPage),
     });

     if (params.search) searchParams.set("search", params.search);
     if (params.role) searchParams.set("role", params.role);
     if (params.status) searchParams.set("status", params.status);

     return searchParams.toString();
}

export async function fetchUsers(params: UsersParams): Promise<UsersResponse> {
     const res = await fetch(`/api/users?${buildQuery(params)}`);
     if (!res.ok) throw new Error("Failed to fetch users");

     return res.json();
}

export async function createUser(payload: CreateUserInput): Promise<User> {
     const res = await fetch("/api/users", {
          method: "POST",
          headers: {
               "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
     });
     if (!res.ok) throw new Error("Failed to create user");

     return res.json();
}

export async function updateUser(
     id: string,
     payload: Partial<CreateUserInput>
): Promise<User> {
     const res = await fetch(`/api/users/${id}`, {
          method: "PATCH",
          headers: {
               "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
     });
     if (!res.ok) throw new Error("Failed to update user");

     return res.json();
}

export async function deleteUser(id: string): Promise<void> {
     const res = await fetch(`/api/users/${id}`, {
          method: "DELETE",
     });
     if (!res.ok) throw new Error("Failed to delete user");
}
