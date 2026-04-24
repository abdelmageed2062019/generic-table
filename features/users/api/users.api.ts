import type { UsersParams, UsersResponse, User } from "../types/user.types";
import type { UserRole, UserStatus } from "../types/user.types";

// We fetch real users from JSONPlaceholder and enrich them locally
const BASE_URL = "https://jsonplaceholder.typicode.com";

const ROLES: UserRole[] = ["admin", "moderator", "user"];
const STATUSES: UserStatus[] = ["active", "inactive", "banned"];
const AVATARS = (id: number) =>
     `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;

// Deterministic enrichment so data is stable across calls
function enrichUser(raw: { id: number; name: string; email: string }): User {
     return {
          id: String(raw.id),
          name: raw.name,
          email: raw.email,
          role: ROLES[raw.id % ROLES.length],
          status: STATUSES[raw.id % STATUSES.length],
          avatar: AVATARS(raw.id),
          createdAt: new Date(
               Date.now() - raw.id * 1000 * 60 * 60 * 24 * 10
          ).toISOString(),
     };
}

// Cache the full list so we don't re-fetch on every param change
let cachedUsers: User[] | null = null;

async function getAllUsers(): Promise<User[]> {
     if (cachedUsers) return cachedUsers;

     const res = await fetch(`${BASE_URL}/users`);
     if (!res.ok) throw new Error("Failed to fetch users");

     const raw: { id: number; name: string; email: string }[] = await res.json();
     cachedUsers = raw.map(enrichUser);
     return cachedUsers;
}

export async function fetchUsers(params: UsersParams): Promise<UsersResponse> {
     const { page, perPage, search, role, status } = params;

     const all = await getAllUsers();

     // Apply filters
     const filtered = all.filter((u) => {
          const matchSearch = search
               ? u.name.toLowerCase().includes(search.toLowerCase()) ||
               u.email.toLowerCase().includes(search.toLowerCase())
               : true;
          const matchRole = role ? u.role === role : true;
          const matchStatus = status ? u.status === status : true;
          return matchSearch && matchRole && matchStatus;
     });

     // Apply pagination
     const start = (page - 1) * perPage;
     const end = start + perPage;
     const paginated = filtered.slice(start, end);

     return {
          data: paginated,
          total: filtered.length,
          page,
          perPage,
          totalPages: Math.ceil(filtered.length / perPage),
     };
}

export async function deleteUser(id: string): Promise<void> {
     // JSONPlaceholder accepts DELETE but doesn't actually remove
     const res = await fetch(`${BASE_URL}/users/${id}`, {
          method: "DELETE",
     });
     if (!res.ok) throw new Error("Failed to delete user");

     // Remove from cache to simulate deletion
     if (cachedUsers) {
          cachedUsers = cachedUsers.filter((u) => u.id !== id);
     }
}