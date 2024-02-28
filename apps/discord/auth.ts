import NextAuth from "next-auth";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import Twitter from "@auth/core/providers/twitter";
import Twitch from "@auth/core/providers/twitch";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@db/db";
import { apiPublicRoutes, authRoutes, publicRoutes } from "./routes";
import { NextResponse } from "next/server";
import { encode, generateJWT } from "./lib/server-actions/auth/jwt-token";
import { getProfile } from "@db/data-access/user/get-profile";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db),

  providers: [
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Twitter({
      allowDangerousEmailAccountLinking: true,
    }),
    Twitch({
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    authorized({ request, auth }) {
      const isLoggedIn = !!auth;

      const { pathname } = request.nextUrl;

      if (publicRoutes.includes(pathname)) return true;
      if (apiPublicRoutes.includes(pathname)) return true;

      if (authRoutes.includes(pathname)) {
        if (isLoggedIn) {
          return NextResponse.redirect(
            new URL("/channel", request.nextUrl).toString()
          );
        }
        return true;
      }

      if (!isLoggedIn) {
        return NextResponse.redirect(
          new URL("/login", request.nextUrl).toString()
        );
      }

      return NextResponse.next();
    },
    async session({ session, user }) {
      
      const res = await getProfile({
        email: user.email,
        is_email_verified: true,
        is_deleted: false,
      });

      session.user.id = user.id;
      session.user.username = res.data?.usernaeme || null;
      session.user.email = res.data?.email || user.email;
      session.user.profile_id = res.data?.id || null;
      
      session.jwt = await encode({ id: user.id, email: user.email, username: res.data?.usernaeme || null})
      return session;
    },
  },
});
