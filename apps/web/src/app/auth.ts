import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@repo/db";
import type { AuthOptions, Session} from "next-auth";
import { getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database"
  },
  callbacks: {
    async session({ session, user }) {
     if (session.user) {
      session.user = {
        ...session.user,
        id: user.id
      }
     }
      return session;
    }
  }
}

const getSession = (): Promise<Session | null> => {
    return getServerSession(authOptions);
}

export { authOptions, getSession }