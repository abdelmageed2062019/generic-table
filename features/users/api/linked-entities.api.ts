import type { LinkedEntity } from "../types/user.types";

export async function getLinkedEntities(
     userId: string,
     locale?: string
): Promise<LinkedEntity[]> {
     const searchParams = new URLSearchParams();
     if (locale) searchParams.set("locale", locale);

     const queryString = searchParams.toString();
     const res = await fetch(
          `/api/users/${userId}/linked-entities${queryString ? `?${queryString}` : ""}`
     );
     if (!res.ok) throw new Error("Failed to fetch linked entities");

     return res.json();
}
