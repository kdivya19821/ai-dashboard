import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    providers: [], // Providers are added in auth.ts
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "668af82bd4166297395722fb",
    trustHost: true,
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");

            if (isOnDashboard || isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }
            if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
