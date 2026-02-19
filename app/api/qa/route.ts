import { auth } from "@/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
    const groq = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    });
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { query, workspaceId } = await req.json();

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: { documents: true },
        });

        if (!workspace) return new NextResponse("Workspace not found", { status: 404 });

        // 1. Combine doc content as context 
        const contexts = workspace.documents
            .filter(doc => doc.content)
            .map(doc => `File: ${doc.name}\nContent: ${doc.content?.substring(0, 3000)}`)
            .join("\n\n---\n\n");

        if (!contexts) {
            return NextResponse.json({
                text: "No document content found in this workspace. Please upload some files first.",
                sources: []
            });
        }

        // 2. Query Groq
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are an AI assistant helping users analyze their documents. Use the provided context to answer the query. If the answer is not in the context, state that you don't know based on the documents. Keep the answer structured and helpful."
                },
                {
                    role: "user",
                    content: `Context:\n${contexts}\n\nQuestion: ${query}`
                }
            ],
        });

        const answer = completion.choices[0].message.content;
        const sources = workspace.documents.map(d => d.name);

        return NextResponse.json({ text: answer, sources });
    } catch (error: any) {
        console.error("QA Error:", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
