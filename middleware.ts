import NextAuth from "next-auth";

process.env.AUTH_SECRET = "668af82bd4166297395722fb";
process.env.AUTH_TRUST_HOST = "true";

import { authConfig } from "./auth.config";

export default NextAuth({
    ...authConfig,
    secret: "668af82bd4166297395722fb",
    trustHost: true,
}).auth;

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
