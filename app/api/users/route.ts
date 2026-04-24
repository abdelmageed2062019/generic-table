import { NextRequest, NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import {
     userRoles,
     userStatuses,
     type CreateUserInput,
     type DbUser,
     type User,
     type UserRole,
     type UserStatus,
} from "@/features/users/types/user.types";

function buildAvatar(id: string) {
     return `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;
}

function generateUserId(users: Array<Pick<User, "id">>) {
     const maxId = users.reduce((max, user) => {
          const parsed = Number(user.id.replace(/\D/g, ""));
          return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
     }, 1000);

     return `USR-${String(maxId + 1).padStart(4, "0")}`;
}

function toApiUser(user: DbUser, locale: "en" | "ar"): User {
     return {
          id: user.id,
          name: locale === "ar" && user.nameAr?.trim() ? user.nameAr : user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
          createdAt: user.createdAt,
          linkedEntities: user.linkedEntities.map((entity) => ({
               id: entity.id,
               entity:
                    locale === "ar" && entity.entityAr?.trim()
                         ? entity.entityAr
                         : entity.entity,
               email: entity.email,
               usageQueries: entity.usageQueries,
               lastActive: entity.lastActive,
          })),
     };
}

export async function GET(request: NextRequest) {
     const db = await getDb();
     await db.read();

     const { searchParams } = new URL(request.url);
     const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
     const perPage = Math.max(1, Number(searchParams.get("perPage") ?? "10"));
     const search = searchParams.get("search")?.trim().toLowerCase() ?? "";
     const role = searchParams.get("role");
     const status = searchParams.get("status");
     const joinedDate = searchParams.get("joinedDate")?.trim() ?? "";
     const locale = searchParams.get("locale") === "ar" ? "ar" : "en";

     const filteredUsers = db.data.users.filter((user) => {
          const matchesSearch = !search
               ? true
               : [user.id, user.name, user.nameAr, user.email].some((value) =>
                    value?.toLowerCase().includes(search)
               );
          const matchesRole = !role || user.role === role;
          const matchesStatus = !status || user.status === status;
          const matchesJoinedDate =
               !joinedDate || user.createdAt.slice(0, 10) === joinedDate;

          return matchesSearch && matchesRole && matchesStatus && matchesJoinedDate;
     });

     const start = (page - 1) * perPage;
     const data = filteredUsers
          .slice(start, start + perPage)
          .map((user) => toApiUser(user, locale));

     return NextResponse.json({
          data,
          total: filteredUsers.length,
          page,
          perPage,
          totalPages: Math.max(1, Math.ceil(filteredUsers.length / perPage)),
     });
}

export async function POST(request: NextRequest) {
     const db = await getDb();
     await db.read();

     const body = (await request.json()) as CreateUserInput;
     const role = body.role as UserRole;
     const status = body.status as UserStatus;

     if (!body.name?.trim() || !body.email?.trim()) {
          return NextResponse.json(
               { message: "Name and email are required" },
               { status: 400 }
          );
     }

     if (!userRoles.includes(role) || !userStatuses.includes(status)) {
          return NextResponse.json(
               { message: "Invalid role or status" },
               { status: 400 }
          );
     }

     const id = generateUserId(db.data.users);
     const newUser: User = {
          id,
          name: body.name.trim(),
          email: body.email.trim(),
          role,
          status,
          avatar: body.avatar?.trim() || buildAvatar(id),
          createdAt: body.createdAt || new Date().toISOString(),
          linkedEntities: body.linkedEntities ?? [],
     };

     db.data.users.push(newUser);
     await db.write();

     return NextResponse.json(newUser, { status: 201 });
}
