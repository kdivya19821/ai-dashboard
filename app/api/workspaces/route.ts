import { auth } from "@/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { name } = await req.json();
        const workspace = await prisma.workspace.create({
            data: {
                name,
                ownerId: (session.user as any).id,
            },
        });
        return NextResponse.json(workspace);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const workspaces = await prisma.workspace.findMany({
            where: { ownerId: (session.user as any).id },
            include: { documents: true },
        });
        return NextResponse.json(workspaces);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
