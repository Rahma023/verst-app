import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  messages: ChatMessage[];
  lessonContext?: {
    moduleCode?: string;
    moduleTitle?: string;
    lessonCode?: string;
    lessonTitle?: string;
  };
};

export async function POST(request: Request) {
  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "AI tutor not configured. Add ANTHROPIC_API_KEY to .env.local (and Vercel env vars).",
      },
      { status: 503 },
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { messages, lessonContext } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "Provide at least one message." },
      { status: 400 },
    );
  }

  const moduleLine = lessonContext?.moduleTitle
    ? `\nThe learner is currently on Module ${lessonContext.moduleCode ?? ""}: ${lessonContext.moduleTitle}.`
    : "";
  const lessonLine = lessonContext?.lessonTitle
    ? ` Specifically the lesson "${lessonContext.lessonCode ?? ""} ${lessonContext.lessonTitle}".`
    : "";

  const system = `You are the Verst Tutor — an AI tutor for the Verst Carbon Academy, a climate-tech and carbon-markets e-learning platform for African project developers and corporate sustainability teams.${moduleLine}${lessonLine}

Your job is to help learners understand climate science, carbon markets, GHG accounting (ISO 14064-1 and 14064-2), Article 6 of the Paris Agreement, carbon finance, MRV (monitoring/reporting/verification), and AI applied to climate work.

Style:
- Clear, concise, practitioner-oriented.
- Cite methodologies, standards, or sources (Verra VM0044, Puro, Isometric, ISO 14064, the IPCC reports, Article 6.2/6.4, etc.) where relevant.
- Use markdown sparingly: short paragraphs, occasional bullet lists for lists, no headers in short responses.
- If you don't know, say so and suggest where to look.
- Stay scoped to climate-tech / carbon. If a learner asks something off-topic, politely redirect.
- Avoid hedging filler ("I think", "perhaps") — be specific.

Length: aim for ~2-5 short paragraphs unless a list or table is clearer. Long-form answers only when the topic genuinely calls for it.`;

  const client = new Anthropic();

  try {
    const stream = client.messages.stream({
      model: "claude-opus-4-7",
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          controller.enqueue(encoder.encode(`\n\n[error: ${message}]`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "Invalid ANTHROPIC_API_KEY." },
        { status: 503 },
      );
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limited. Try again shortly." },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
