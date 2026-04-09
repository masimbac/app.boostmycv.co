import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BoostRepository } from "@/lib/db/boost-repository";
import { ensureBoostsTable } from "@/lib/db/table-setup";
import { changeAcceptanceSchema } from "@/lib/validation/boost-validation";

// PUT /api/v1/boosts/:id/changes/:changeId - Update change acceptance
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; changeId: string }> }
) {
  try {
    const { id, changeId } = await params;
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

    const body = await request.json();

    // Validate request body
    const validation = changeAcceptanceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { accepted } = validation.data;

    // Check if the change exists in the boost
    const changeExists = boost.changes.some((c) => c.change_id === changeId);
    if (!changeExists) {
      return NextResponse.json(
        { error: "Change not found in boost" },
        { status: 404 }
      );
    }

    // Update the change acceptance
    await BoostRepository.updateChangeAcceptance(id, changeId, accepted);

    return NextResponse.json(
      { message: "Change acceptance updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update change acceptance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
