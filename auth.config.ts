import type { NextAuthConfig } from "next-auth";

const AUTH_SECRET = "668af82bd4166297395722fb668af82b"; // 32 chars

// Ensure variables are in environment for Edge Runtime
process.env.AUTH_SECRET = AUTH_SECRET;
process.env.AUTH_TRUST_HOST = "true";

export const authConfig = {
    providers: [], // Providers are added in auth.ts
    secret: AUTH_SECRET,
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
