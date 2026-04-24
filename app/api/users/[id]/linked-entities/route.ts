import { NextRequest, NextResponse } from "next/server";

import { getDb } from "@/lib/db";

type RouteContext = {
     params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
     const { id } = await params;
     const db = await getDb();
     await db.read();

     const { searchParams } = new URL(request.url);
     const locale = searchParams.get("locale") === "ar" ? "ar" : "en";

     const user = db.data.users.find((entry) => entry.id === id);
     if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
     }

     const entities = user.linkedEntities.map((entity) => ({
          id: entity.id,
          entity:
               locale === "ar" && entity.entityAr?.trim() ? entity.entityAr : entity.entity,
          email: entity.email,
          usageQueries: entity.usageQueries,
          lastActive: entity.lastActive,
     }));

     return NextResponse.json(entities);
}
