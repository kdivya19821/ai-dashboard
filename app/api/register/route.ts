import bcrypt from "bcryptjs";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, password } = body;

        if (!email || !name || !password) {
            return new NextResponse("Missing info", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                status: "PENDING",
            },
        });

        return NextResponse.json(user);
    } catch (error: any) {
        if (error.code === "P2002") {
            return new NextResponse("Email already exists", { status: 400 });
        }
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
