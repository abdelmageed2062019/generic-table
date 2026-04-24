import { useQuery } from "@tanstack/react-query";
import { getLinkedEntities } from "../api/linked-entities.api";

export const linkedEntitiesKeys = {
     byUser: (userId: string, locale?: string) =>
          ["linkedEntities", userId, locale] as const,
};

export function useLinkedEntities(userId: string, locale?: string) {
     return useQuery({
          queryKey: linkedEntitiesKeys.byUser(userId, locale),
          queryFn: () => getLinkedEntities(userId, locale),
          enabled: !!userId,
          staleTime: 1000 * 60 * 5,
     });
}
