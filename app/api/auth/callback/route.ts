import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/libs/supabase/server";
// We need to use the supabase-js client to create an admin client
import { createClient as createAdminClient } from "@supabase/supabase-js";
import config from "@/config";

export const dynamic = "force-dynamic";

// This route is called after a successful login. It exchanges the code for a session and redirects to the callback URL (see config.js).
export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/signin?error=Could not authenticate user`
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const allowedEmails = (process.env.ALLOWED_EMAILS || "")
      .split("|")
      .map((email) => email.trim())
      .filter(Boolean);

    if (allowedEmails.length > 0) {
      if (!user?.email || !allowedEmails.includes(user.email)) {
        const userId = user.id;

        // sign out the user from the current session
        await supabase.auth.signOut();

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_SECRET;

        if (!supabaseUrl || !supabaseServiceRoleKey) {
          console.error(
            "Supabase URL or Service Role Key is not set in environment variables."
          );
          return NextResponse.redirect(
            `${requestUrl.origin}/signin?error=Server configuration error. Please contact the administrator.`
          );
        }

        // and then delete the user from Supabase auth
        // an admin client is required for this operation
        const supabaseAdmin = createAdminClient(
          supabaseUrl,
          supabaseServiceRoleKey
        );

        const { error: deleteError } =
          await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
          console.error("Error deleting user:", deleteError);
          return NextResponse.redirect(
            `${requestUrl.origin}/signin?error=Error deleting unauthorized user.`
          );
        }

        return NextResponse.redirect(
          `${requestUrl.origin}/signin?error=This email is not allowed. Please contact the administrator.`
        );
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + config.auth.callbackUrl);
}
