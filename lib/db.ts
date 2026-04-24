import { mkdir } from "node:fs/promises";
import path from "node:path";

import { JSONFilePreset } from "lowdb/node";

import type { DbSchema } from "@/features/users/types/user.types";

const dbFile = path.join(process.cwd(), "data", "db.json");
const defaultData: DbSchema = {
     users: [],
};

let dbPromise: Promise<Awaited<ReturnType<typeof JSONFilePreset<DbSchema>>>> | null =
     null;

export async function getDb() {
     if (!dbPromise) {
          await mkdir(path.dirname(dbFile), { recursive: true });
          dbPromise = JSONFilePreset<DbSchema>(dbFile, defaultData);
     }

     return dbPromise;
}
