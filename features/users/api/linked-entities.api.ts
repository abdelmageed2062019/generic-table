import type { LinkedEntity } from "../types/user.types";

const ENTITY_NAMES = [
     "Google Cloud Project: Alpha",
     "Slack Workspace: Marketing",
     "Internal Tool: CMS",
     "GitHub Organization: Dev",
     "Notion Workspace: Product",
     "Jira Project: Backend",
     "Figma Team: Design",
     "AWS Account: Production",
];

const LAST_ACTIVE = [
     "1 hr ago",
     "2 hrs ago",
     "3 hrs ago",
     "5 hrs ago",
     "1 day ago",
     "2 days ago",
     "Just now",
     "30 mins ago",
];

// Deterministic mock data based on userId
export function getLinkedEntities(userId: string): LinkedEntity[] {
     const seed = parseInt(userId, 10) || 1;
     const count = (seed % 4) + 1; 

     return Array.from({ length: count }, (_, i) => {
          const entityIndex = (seed + i) % ENTITY_NAMES.length;
          const emailPrefix = ENTITY_NAMES[entityIndex]
               .toLowerCase()
               .replace(/[^a-z0-9]/g, ".")
               .replace(/\.+/g, ".")
               .slice(0, 20);

          return {
               id: `${userId}-entity-${i + 1}`,
               entity: `Entity ${i + 1}  ${ENTITY_NAMES[entityIndex]}`,
               email: `${emailPrefix}@example.co`,
               usageQueries: Math.floor(((seed * (i + 1) * 137) % 5000) + 100),
               lastActive: LAST_ACTIVE[(seed + i) % LAST_ACTIVE.length],
          };
     });
}