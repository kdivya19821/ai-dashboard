import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Increase body size limit for file uploads (default is 1MB in Next.js)
export const maxDuration = 30;


export async function POST(req: Request) {
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

        // Check file size (limit to 4MB to stay within Vercel limits)
        const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 4MB." },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let content = "";
        if (file.type === "application/pdf" || filename.endsWith(".pdf")) {
            try {
                const officeparser = require("officeparser");

                // Verify it's a valid PDF first
                const header = buffer.toString("utf-8", 0, 5);
                if (!header.startsWith("%PDF-")) {
                    return NextResponse.json(
                        { error: "Invalid PDF format. The file header is missing." },
                        { status: 422 }
                    );
                }

                // officeparser is environment-agnostic and more stable in Vercel
                const ast = await officeparser.parseOffice(buffer);
                content = ast.toText();

                if (!content || content.trim().length === 0) {
                    return NextResponse.json(
                        { error: "No text found in PDF. This might be an image-based PDF or scanned document." },
                        { status: 422 }
                    );
                }
            } catch (pdfError: any) {
                console.error("CRITICAL PDF ERROR:", pdfError);
                return NextResponse.json(
                    { error: `PDF Extraction Error: ${pdfError.message || "Unknown error"}. Try converting to TXT or another PDF.` },
                    { status: 422 }
                );
            }
        } else {
            content = buffer.toString("utf-8");
        }

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: "No text content found in the document. It may be an image-based PDF." },
                { status: 422 }
            );
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
        return NextResponse.json(
            { error: error.message || "Internal Error" },
            { status: 500 }
        );
    }
}
