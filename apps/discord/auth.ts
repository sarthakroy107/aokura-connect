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
import { getProfileFromAuthUserAction } from "./lib/server-actions/auth/get-profile-from-auth-user";

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
      const resProfile = await getProfileFromAuthUserAction({
        authUserEmail: user.email,
      });

      if (!resProfile) {
        console.log("Error fetching profile");
        return session;
      }

      session.user.id = user.id;
      session.user.username = resProfile.usernaeme || null;
      session.user.email = resProfile.email || user.email;
      session.user.profile_id = resProfile.id || null;

      const jwt = await encode({
        id: user.id,
        email: user.email,
        username: resProfile.usernaeme || null,
      });

      session.jwt = jwt;
      return session;
    },
  },
});
