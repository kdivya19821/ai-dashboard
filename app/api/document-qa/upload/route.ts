import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const pdf = require("pdf-parse");
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) return new NextResponse("No file provided", { status: 400 });

        const filename = file.name.toLowerCase();
        const isAllowed = filename.endsWith(".pdf") || filename.endsWith(".txt");
        if (!isAllowed) {
            return new NextResponse("Only PDF and TXT files are supported", { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let content = "";
        if (file.type === "application/pdf" || filename.endsWith(".pdf")) {
            const data = await pdf(buffer);
            content = data.text;
        } else {
            content = buffer.toString("utf-8");
        }

        // Limit content to 50,000 chars for prompt context
        const trimmedContent = content.substring(0, 50000);

        return NextResponse.json({
            message: "File uploaded successfully",
            filename: file.name,
            content: trimmedContent,
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
