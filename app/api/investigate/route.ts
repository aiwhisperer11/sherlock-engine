import { NextRequest, NextResponse } from "next/server";

import { prepareInvestigationRequest, runSherlockInvestigation } from "@/lib/server/sherlock-engine";

export { OPENAI_MODEL } from "@/lib/server/sherlock-engine";

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "request body must be valid JSON" }, { status: 400 });
  }

  const prepared = prepareInvestigationRequest(body);
  if (!prepared.ok) {
    return NextResponse.json(
      { error: prepared.message },
      { status: 400 },
    );
  }

  let result;
  try {
    result = await runSherlockInvestigation(prepared.request);
  } catch {
    return NextResponse.json({ error: "OpenAI client is unavailable" }, { status: 502 });
  }

  if (result.ok) {
    return NextResponse.json(result.investigation);
  }

  if (result.kind === "openai") {
    return NextResponse.json({ error: "OpenAI request failed" }, { status: 502 });
  }

  return NextResponse.json(
    {
      error: "Model response did not conform to the investigation schema",
      validation_errors: result.validationErrors,
    },
    { status: 502 },
  );
}
