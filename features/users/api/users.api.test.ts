import { describe, expect, it, vi } from "vitest";
import { createUser, deleteUser, fetchUsers } from "./users.api";

describe("users.api", () => {
     it("fetchUsers calls /api/users with query params", async () => {
          const fetchMock = vi.fn(async () => {
               return {
                    ok: true,
                    json: async () => ({
                         data: [],
                         total: 0,
                         page: 1,
                         perPage: 10,
                         totalPages: 1,
                    }),
               } as Response;
          });

          vi.stubGlobal("fetch", fetchMock);

          await fetchUsers({
               page: 1,
               perPage: 10,
               search: "alice",
               role: "admin",
               status: "active",
               joinedDate: "2024-01-15",
               locale: "en",
          });

          expect(fetchMock).toHaveBeenCalledWith(
               "/api/users?page=1&perPage=10&search=alice&role=admin&status=active&joinedDate=2024-01-15&locale=en"
          );

          vi.unstubAllGlobals();
     });

     it("createUser sends POST JSON body", async () => {
          const fetchMock = vi.fn(async () => {
               return { ok: true, json: async () => ({ id: "USR-9999" }) } as Response;
          });

          vi.stubGlobal("fetch", fetchMock);

          await createUser({
               name: "New User",
               email: "new.user@example.com",
               role: "user",
               status: "active",
          });

          expect(fetchMock).toHaveBeenCalledWith("/api/users", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                    name: "New User",
                    email: "new.user@example.com",
                    role: "user",
                    status: "active",
               }),
          });

          vi.unstubAllGlobals();
     });

     it("deleteUser sends DELETE", async () => {
          const fetchMock = vi.fn(async () => {
               return { ok: true } as Response;
          });

          vi.stubGlobal("fetch", fetchMock);

          await deleteUser("USR-1001");

          expect(fetchMock).toHaveBeenCalledWith("/api/users/USR-1001", {
               method: "DELETE",
          });

          vi.unstubAllGlobals();
     });
});
