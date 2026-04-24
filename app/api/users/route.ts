import { NextRequest, NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import {
     userRoles,
     userStatuses,
     type CreateUserInput,
     type User,
     type UserRole,
     type UserStatus,
} from "@/features/users/types/user.types";

function buildAvatar(id: string) {
     return `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;
}

function generateUserId(users: User[]) {
     const maxId = users.reduce((max, user) => {
          const parsed = Number(user.id.replace(/\D/g, ""));
          return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
     }, 1000);

     return `USR-${String(maxId + 1).padStart(4, "0")}`;
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

     const filteredUsers = db.data.users.filter((user) => {
          const matchesSearch =
               !search ||
               user.name.toLowerCase().includes(search) ||
               user.email.toLowerCase().includes(search);
          const matchesRole = !role || user.role === role;
          const matchesStatus = !status || user.status === status;

          return matchesSearch && matchesRole && matchesStatus;
     });

     const start = (page - 1) * perPage;
     const data = filteredUsers.slice(start, start + perPage);

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
