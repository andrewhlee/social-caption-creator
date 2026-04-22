import { NextRequest } from "next/server";
import { getAllEntries, addEntry, deleteEntry } from "@/lib/knowledge-base";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const entries = getAllEntries();
    return Response.json({ entries });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caption, context } = body;

    if (!caption?.trim()) {
      return Response.json({ error: "Caption is required" }, { status: 400 });
    }

    const entry = addEntry(caption.trim(), (context || "").trim());
    return Response.json({ entry }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Entry ID is required" }, { status: 400 });
    }

    const success = deleteEntry(id);
    if (!success) {
      return Response.json({ error: "Entry not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
