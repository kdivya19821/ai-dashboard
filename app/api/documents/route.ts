import { auth } from "@/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
    const pdf = require("pdf-parse/node");
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const workspaceId = formData.get("workspaceId") as string;

        if (!file || !workspaceId) return new NextResponse("Missing data", { status: 400 });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let content = "";
        if (file.type === "application/pdf") {
            const data = await pdf(buffer);
            content = data.text;
        } else {
            content = buffer.toString();
        }

        const document = await prisma.document.create({
            data: {
                name: file.name,
                content,
                workspaceId,
            },
        });

        return NextResponse.json(document);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
