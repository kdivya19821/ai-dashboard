import { auth } from "@/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { name } = await req.json();
        const userId = (session.user as any).id;

        if (!userId) {
            console.error("No user ID found in session during workspace creation");
            return NextResponse.json({ error: "User identity missing" }, { status: 400 });
        }

        const workspace = await prisma.workspace.create({
            data: {
                name,
                ownerId: userId,
            },
        });
        return NextResponse.json(workspace);
    } catch (error) {
        console.error("WORKSPACE_CREATE_ERROR", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function GET() {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const userId = (session.user as any).id;
        if (!userId) {
            return NextResponse.json({ error: "User identity missing" }, { status: 400 });
        }

        const workspaces = await prisma.workspace.findMany({
            where: { ownerId: userId },
            include: { documents: true },
        });
        return NextResponse.json(workspaces);
    } catch (error) {
        console.error("WORKSPACE_GET_ERROR", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
