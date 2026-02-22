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
        const { videoUrl, transcript: providedTranscript } = await request.json();

        if (!videoUrl && !providedTranscript) {
            return new NextResponse("Missing Video URL or Transcript", { status: 400 });
        }

        // 1. Get transcript (either provided or fetched)
        let transcript = providedTranscript || "";

        if (!transcript && videoUrl) {
            try {
                const transcriptItems = await YoutubeTranscript.fetchTranscript(videoUrl);
                transcript = transcriptItems.map(item => item.text).join(" ");
            } catch (err: any) {
                console.error("Transcript fetch error:", err);
                return NextResponse.json({
                    error: "TRANSCRIPT_DISABLED",
                    message: "Transcripts are disabled or unavailable for this video. You can try manual pasting below."
                });
            }
        }

        if (!transcript) {
            return NextResponse.json({
                error: "TRANSCRIPT_EMPTY",
                message: "No transcript content found for this video."
            });
        }

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
            notes: result.notes || [],
            transcript: transcript
        });
    } catch (error: any) {
        console.error("YouTube Tool Error:", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
