process.env.AUTH_SECRET = "668af82bd4166297395722fb668af82b";
process.env.AUTH_TRUST_HOST = "true";

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prismadb";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    secret: "668af82bd4166297395722fb668af82b",
    trustHost: true,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user?.password) return null;

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isCorrectPassword) return null;

                if (user.status !== "APPROVED") return null;

                return user;
            },
        }),
    ],
    callbacks: {
        ...authConfig?.callbacks,
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.status = (user as any).status;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).status = token.status;
            }
            return session;
        },
    },
});
