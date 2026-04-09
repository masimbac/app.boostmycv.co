import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BoostRepository } from "@/lib/db/boost-repository";
import { ensureBoostsTable } from "@/lib/db/table-setup";

// GET /api/v1/boosts/:id - Get boost details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureBoostsTable();

    const boost = await BoostRepository.getById(id);

    if (!boost) {
      return NextResponse.json({ error: "Boost not found" }, { status: 404 });
    }

    // Ensure user owns this boost
    if (boost.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ boost }, { status: 200 });
  } catch (error) {
    console.error("Get boost error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/boosts/:id - Delete boost
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureBoostsTable();

    const boost = await BoostRepository.getById(id);

    if (!boost) {
      return NextResponse.json({ error: "Boost not found" }, { status: 404 });
    }

    if (boost.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await BoostRepository.delete(id);

    return NextResponse.json(
      { message: "Boost deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete boost error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
