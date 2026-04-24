import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";

type RouteContext = {
     params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
     const { id } = await params;
     const db = await getDb();
     await db.read();

     const user = db.data.users.find((entry) => entry.id === id);
     if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
     }

     return NextResponse.json(user.linkedEntities);
}
