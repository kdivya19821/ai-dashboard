import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    const groq = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    });
    try {
        const { videoUrl } = await request.json();

        if (!videoUrl) {
            return new NextResponse("Missing Video URL", { status: 400 });
        }

        // 1. Extract transcript
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoUrl);
        const transcript = transcriptItems.map(item => item.text).join(" ");

        // 2. Summarize with Groq
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are an educational assistant. Summarize the provided YouTube video transcript into a concise summary and a list of key study notes in JSON format with 'summary' (string) and 'notes' (array of strings) keys. Output ONLY valid JSON."
                },
                {
                    role: "user",
                    content: `Transcript: ${transcript.substring(0, 10000)}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        return NextResponse.json({
            summary: result.summary || "Could not generate summary.",
            notes: result.notes || []
        });
    } catch (error: any) {
        console.error("YouTube Tool Error:", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
