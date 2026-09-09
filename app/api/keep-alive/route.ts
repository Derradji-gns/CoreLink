import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    console.log("KEEP-ALIVE: started");

    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.log("KEEP-ALIVE: unauthorized");

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("KEEP-ALIVE: authorization OK");

    const supabase = createAdminClient();

    console.log("KEEP-ALIVE: Supabase client created");

    const { data, error } = await supabase
      .from("keep_alive")
      .select("id")
      .limit(1);

    if (error) {
      console.error("KEEP-ALIVE: Supabase error", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    console.log("KEEP-ALIVE: Supabase query successful", data);

    return NextResponse.json({
      ok: true,
      pingedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("KEEP-ALIVE: unexpected error", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}