import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string,
    } & DefaultSession["user"];
    jwt: JWT
  }

  interface User {
    id: string,
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string,
    signedToken: string
  }
}
