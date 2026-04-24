import type { LinkedEntity } from "../types/user.types";

export async function getLinkedEntities(userId: string): Promise<LinkedEntity[]> {
     const res = await fetch(`/api/users/${userId}/linked-entities`);
     if (!res.ok) throw new Error("Failed to fetch linked entities");

     return res.json();
}
