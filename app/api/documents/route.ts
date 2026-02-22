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
                const pdf = require("pdf-parse/node");
                const data = await pdf(buffer);
                content = data.text;
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
