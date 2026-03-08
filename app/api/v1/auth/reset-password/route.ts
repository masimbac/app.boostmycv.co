import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/ses";
import { passwordChangedEmail } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send confirmation email
    if (data.user?.email) {
      const userName = data.user.user_metadata?.full_name || "User";
      await sendEmail({
        to: data.user.email,
        subject: "Your BoostMyCV Password Has Been Changed",
        html: passwordChangedEmail(userName),
      });
    }

    return NextResponse.json(
      {
        message: "Password updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
