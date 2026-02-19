import { auth } from "@/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    const session = await auth();
    const { userId } = await params;
    if ((session?.user as any)?.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { status } = await req.json();
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status },
        });
        return NextResponse.json(user);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
