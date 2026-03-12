import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ScoreRepository } from "@/lib/db/score-repository";
import { ensureScoresTable } from "@/lib/db/table-setup";

// GET /api/v1/scores/:id - Get score details
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

    await ensureScoresTable();

    const score = await ScoreRepository.getById(id);

    if (!score) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    // Ensure user owns this score
    if (score.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ score }, { status: 200 });
  } catch (error) {
    console.error("Get score error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/scores/:id - Delete score
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

    await ensureScoresTable();

    const score = await ScoreRepository.getById(id);

    if (!score) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    if (score.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ScoreRepository.delete(id);

    return NextResponse.json(
      { message: "Score deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete score error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
