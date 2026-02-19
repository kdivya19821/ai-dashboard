import { auth } from "@/auth";
import { NextResponse } from "next/server";
import FirecrawlApp from "@mendable/firecrawl-js";
import OpenAI from "openai";

const firecrawl = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY,
});

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { query } = await req.json();

        if (!query) return new NextResponse("Missing query", { status: 400 });

        // 1. Search with Firecrawl
        const searchResponse = await firecrawl.search(query, {
            limit: 5,
            scrapeOptions: { formats: ["markdown"] }
        });

        if (!searchResponse.success) {
            throw new Error(searchResponse.error || "Firecrawl search failed");
        }

        const contexts = searchResponse.data.map(item =>
            `Source: ${item.title}\nURL: ${item.url}\nContent: ${item.markdown?.substring(0, 2000)}`
        ).join("\n\n---\n\n");

        // 2. Synthesize with Groq
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a research assistant. Synthesize a comprehensive answer based ONLY on the provided web search context. Use markdown for structure. Keep it professional and concise."
                },
                {
                    role: "user",
                    content: `Query: ${query}\n\nContext:\n${contexts}`
                }
            ],
        });

        const answer = completion.choices[0].message.content;
        const links = searchResponse.data.map(item => ({
            title: item.title || "External Source",
            url: item.url || "#"
        }));

        return NextResponse.json({ text: answer, links });
    } catch (error: any) {
        console.error("Deep Search Error:", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
