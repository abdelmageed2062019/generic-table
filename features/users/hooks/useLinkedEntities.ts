import { useQuery } from "@tanstack/react-query";
import { getLinkedEntities } from "../api/linked-entities.api";

export const linkedEntitiesKeys = {
     byUser: (userId: string) => ["linkedEntities", userId] as const,
};

export function useLinkedEntities(userId: string) {
     return useQuery({
          queryKey: linkedEntitiesKeys.byUser(userId),
          queryFn: () => getLinkedEntities(userId),
          enabled: !!userId,
          staleTime: 1000 * 60 * 5,
     });
}