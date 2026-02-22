import { auth } from "@/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;


export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const workspaceId = formData.get("workspaceId") as string;
        const directContent = formData.get("content") as string | null;
        const directName = formData.get("name") as string | null;

        if (!workspaceId) return new NextResponse("Missing workspaceId", { status: 400 });

        let name = "";
        let content = "";

        if (file) {
            name = file.name;
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            if (file.type === "application/pdf" || name.toLowerCase().endsWith(".pdf")) {
                try {
                    const officeparser = require("officeparser");
                    // Check PDF header
                    const header = buffer.toString("utf-8", 0, 5);
                    if (!header.startsWith("%PDF-")) {
                        return new NextResponse("Invalid PDF format: Missing PDF header.", { status: 422 });
                    }

                    // officeparser is environment-agnostic and more stable in Vercel
                    const ast = await officeparser.parseOffice(buffer);
                    content = ast.toText();

                    if (!content || content.trim().length === 0) {
                        return new NextResponse("No text content found in PDF. It might be an image-only document.", { status: 422 });
                    }
                } catch (err: any) {
                    console.error("PDF Extraction Error:", err);
                    return new NextResponse(`PDF Extraction Error: ${err?.message || "Internal failure"}`, { status: 422 });
                }
            } else {
                content = buffer.toString();
            }
        } else if (directContent && directName) {
            name = directName;
            content = directContent;
        } else {
            return new NextResponse("Missing file or text content", { status: 400 });
        }

        const document = await prisma.document.create({
            data: {
                name,
                content,
                workspaceId,
            },
        });

        return NextResponse.json(document);
    } catch (error) {
        console.error("Document creation error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
