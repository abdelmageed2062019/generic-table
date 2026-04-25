import { access, copyFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { JSONFilePreset } from "lowdb/node";

import type { DbSchema } from "@/features/users/types/user.types";

const repoDbFile = path.join(process.cwd(), "data", "db.json");
const dbFile = process.env.VERCEL
     ? path.join(os.tmpdir(), "generic-table", "db.json")
     : repoDbFile;
const defaultData: DbSchema = {
     users: [],
};

let dbPromise: Promise<Awaited<ReturnType<typeof JSONFilePreset<DbSchema>>>> | null =
     null;

export async function getDb() {
     if (!dbPromise) {
          await mkdir(path.dirname(dbFile), { recursive: true });
          if (process.env.VERCEL) {
               try {
                    await access(dbFile);
               } catch {
                    try {
                         await copyFile(repoDbFile, dbFile);
                    } catch {
                    }
               }
          }
          dbPromise = JSONFilePreset<DbSchema>(dbFile, defaultData);
     }

     return dbPromise;
}
