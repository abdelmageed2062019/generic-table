import { NextRequest, NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import {
     userRoles,
     userStatuses,
     type UserRole,
     type UserStatus,
} from "@/features/users/types/user.types";

type RouteContext = {
     params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
     const { id } = await params;
     const db = await getDb();
     await db.read();

     const user = db.data.users.find((entry) => entry.id === id);
     if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
     }

     const body = (await request.json()) as Partial<{
          name: string;
          email: string;
          role: UserRole;
          status: UserStatus;
          avatar: string;
          createdAt: string;
     }>;

     if (body.role && !userRoles.includes(body.role)) {
          return NextResponse.json({ message: "Invalid role" }, { status: 400 });
     }

     if (body.status && !userStatuses.includes(body.status)) {
          return NextResponse.json({ message: "Invalid status" }, { status: 400 });
     }

     if (body.name !== undefined) user.name = body.name.trim();
     if (body.email !== undefined) user.email = body.email.trim();
     if (body.role !== undefined) user.role = body.role;
     if (body.status !== undefined) user.status = body.status;
     if (body.avatar !== undefined) user.avatar = body.avatar.trim();
     if (body.createdAt !== undefined) user.createdAt = body.createdAt;

     await db.write();

     return NextResponse.json(user);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
     const { id } = await params;
     const db = await getDb();
     await db.read();

     const index = db.data.users.findIndex((entry) => entry.id === id);
     if (index === -1) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
     }

     db.data.users.splice(index, 1);
     await db.write();

     return new NextResponse(null, { status: 204 });
}
