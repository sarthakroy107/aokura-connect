import NextAuth from "next-auth";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import Twitter from "@auth/core/providers/twitter";
import Twitch from "@auth/core/providers/twitch";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@db/db";
import { apiPublicRoutes, authRoutes, publicRoutes } from "./routes";
import { NextResponse } from "next/server";
import { encode } from "./lib/server-actions/auth/jwt-token";
import { TAPIProfile } from "@/app/api/profile/route";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  //@ts-ignore
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

  trustHost: true,

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/profile`,
        {
          method: "GET",
        }
      );

      if (res.status !== 200) {
        return session;
      }
      const profile = (await res.json()) as TAPIProfile;

      session.user.id = user.id;
      session.user.username = profile.usernaeme || null;
      session.user.email = profile.email || user.email;
      session.user.profile_id = profile.id || null;

      session.jwt = await encode({
        id: user.id,
        email: user.email,
        username: profile.usernaeme || null,
      });
      return session;
    },
  },
});
