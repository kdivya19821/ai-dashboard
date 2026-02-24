import { auth } from "@/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { name } = await req.json();
        const userEmail = session.user.email;
        let userId = (session.user as any).id;

        console.log("WORKSPACE_CREATE: Session User", { id: userId, email: userEmail });

        if (!userId && userEmail) {
            console.log("WORKSPACE_CREATE: Looking up user by email", userEmail);
            const user = await prisma.user.findUnique({
                where: { email: userEmail }
            });
            userId = user?.id;
        }

        if (!userId) {
            console.error("WORKSPACE_CREATE_ERROR: No user ID found in session or DB", { sessionUser: session.user });
            return NextResponse.json({ error: "User identity missing. Please try logging out and in again." }, { status: 400 });
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
        const userEmail = session.user.email;
        let userId = (session.user as any).id;

        if (!userId && userEmail) {
            const user = await prisma.user.findUnique({
                where: { email: userEmail }
            });
            userId = user?.id;
        }

        if (!userId) {
            console.error("WORKSPACE_GET_ERROR: No user ID found in session or DB");
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
