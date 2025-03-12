import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@repo/db";
import type { AuthOptions, Session} from "next-auth";
import { getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken"

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      token.signedToken = jwt.sign(
        { id: token.id, email: token.email }, process.env.NEXTAUTH_SECRET!
      )
      
      return token;
    },
    async session({ session, token }) {
     if (session.user) {
      session.user.id = token.id; 
      session.jwt = token.signedToken;
     }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

const getSession = (): Promise<Session | null> => {
    return getServerSession(authOptions);
}

export { authOptions, getSession }