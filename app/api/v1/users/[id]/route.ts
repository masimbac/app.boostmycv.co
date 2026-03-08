import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser || currentUser.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mock user profile (replace with DynamoDB query in production)
    const userProfile = {
      id: currentUser.id,
      email: currentUser.email,
      full_name: currentUser.user_metadata?.full_name || "",
      profile_picture_url: currentUser.user_metadata?.avatar_url || null,
      subscription_tier: "free" as const,
      created_at: currentUser.created_at,
      updated_at: currentUser.updated_at || currentUser.created_at,
    };

    return NextResponse.json({ user: userProfile }, { status: 200 });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createClient();

    // Get current user
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser || currentUser.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: body.full_name,
        avatar_url: body.profile_picture_url,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name,
          profile_picture_url: data.user.user_metadata?.avatar_url,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
