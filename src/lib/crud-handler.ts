import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

type ModelName = keyof typeof db;
type WhereClause = { id: number };

export function createCrudHandler<T extends Record<string, unknown>>(
  model: ModelName,
  orderBy: string = "id",
  orderDir: "asc" | "desc" = "desc"
) {
  const modelDb = db[model] as unknown as {
    findMany: (args?: { orderBy?: Record<string, string> }) => Promise<T[]>;
    create: (args: { data: unknown }) => Promise<T>;
    update: (args: { where: WhereClause; data: unknown }) => Promise<T>;
    delete: (args: { where: WhereClause }) => Promise<T>;
  };

  return {
    async GET() {
      try {
        const records = await modelDb.findMany({
          orderBy: { [orderBy]: orderDir },
        });
        return NextResponse.json(records);
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to fetch records" },
          { status: 500 }
        );
      }
    },

    async POST(request: NextRequest) {
      try {
        const body = await request.json();
        const record = await modelDb.create({ data: body });
        return NextResponse.json(record, { status: 201 });
      } catch (error: unknown) {
        const msg =
          error instanceof Prisma.PrismaClientValidationError
            ? "Validation error: check field types"
            : "Failed to create record";
        return NextResponse.json({ error: msg }, { status: 400 });
      }
    },

    async PUT(request: NextRequest) {
      try {
        const { id, ...data } = await request.json();
        if (!id) {
          return NextResponse.json(
            { error: "id is required" },
            { status: 400 }
          );
        }
        const record = await modelDb.update({
          where: { id },
          data,
        });
        return NextResponse.json(record);
      } catch (error: unknown) {
        const msg =
          error instanceof Prisma.PrismaClientValidationError
            ? "Validation error: check field types"
            : "Failed to update record";
        return NextResponse.json({ error: msg }, { status: 400 });
      }
    },

    async DELETE(request: NextRequest) {
      try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get("id") || "0");
        if (!id) {
          return NextResponse.json(
            { error: "id is required" },
            { status: 400 }
          );
        }
        await modelDb.delete({ where: { id } });
        return NextResponse.json({ success: true });
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to delete record" },
          { status: 400 }
        );
      }
    },
  };
}