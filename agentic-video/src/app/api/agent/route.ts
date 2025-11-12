import { NextResponse } from "next/server";
import { z } from "zod";
import { runAgent, AgentExecutionError } from "@/lib/agent";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  script: z.string().min(100, "Script must be at least 100 characters"),
  voiceId: z.string().optional(),
  musicPrompt: z.string().optional(),
  privacyStatus: z.enum(["public", "private", "unlisted"]).optional(),
});

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().formErrors.join(", ") },
      { status: 400 }
    );
  }

  try {
    const result = await runAgent(parsed.data);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof AgentExecutionError) {
      return NextResponse.json(
        { ok: false, error: error.message, logs: error.logs },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}
