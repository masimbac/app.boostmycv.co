import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/ses";
import { passwordResetEmail } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get user name for personalized email
    const { data: userData } = await supabase
      .from("users")
      .select("full_name")
      .eq("email", email)
      .single();

    const userName = userData?.full_name || "User";
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`;

    await sendEmail({
      to: email,
      subject: "Reset Your BoostMyCV Password",
      html: passwordResetEmail(userName, resetUrl),
    });

    return NextResponse.json(
      {
        message:
          "If an account exists with that email, you will receive password reset instructions.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
