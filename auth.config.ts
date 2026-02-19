import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    providers: [],
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
                return false;
            }
            if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
