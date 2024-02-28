import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    jwt: string | null
    user: {
      id: string
      username: string | null
      email: string | null
      profile_id: string | null
    }
    & DefaultSession["user"]
  }
}