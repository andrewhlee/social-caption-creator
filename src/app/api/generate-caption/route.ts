import { NextRequest } from "next/server";
import anthropic from "@/lib/anthropic";
import { getRelevantEntries } from "@/lib/knowledge-base";
import { buildUserMessage, SYSTEM_PROMPT } from "@/lib/prompt-builder";
import { fileToBase64 } from "@/lib/image-utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File | null;
    const backgroundInfo = formData.get("backgroundInfo") as string | null;

    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }
    if (!backgroundInfo?.trim()) {
      return Response.json(
        { error: "Background information is required" },
        { status: 400 }
      );
    }

    const { base64, mediaType } = await fileToBase64(image);
    const relevantEntries = getRelevantEntries(backgroundInfo);
    const userMessage = buildUserMessage(backgroundInfo, relevantEntries);

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: "text",
              text: userMessage,
            },
          ],
        },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            const data = JSON.stringify({ text: chunk.delta.text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
