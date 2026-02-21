import { auth } from "@/auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    const groq = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    });

    try {
        const { question, context } = await req.json();

        if (!question || !context) {
            return new NextResponse("Missing question or document context", { status: 400 });
        }

        // Truncate context to prevent payload-too-large errors
        const MAX_CONTEXT_CHARS = 30000;
        const trimmedContext =
            context.length > MAX_CONTEXT_CHARS
                ? context.substring(0, MAX_CONTEXT_CHARS) + "... (truncated)"
                : context;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful AI assistant. Use the provided document context to answer the user's question accurately. If the answer is not found in the context, say so clearly. Keep answers structured and concise.",
                },
                {
                    role: "user",
                    content: `Context:\n${trimmedContext}\n\nQuestion: ${question}`,
                },
            ],
            temperature: 0.5,
        });

        const answer = completion.choices[0].message.content;
        return NextResponse.json({ answer });
    } catch (error: any) {
        console.error("Document QA error:", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
