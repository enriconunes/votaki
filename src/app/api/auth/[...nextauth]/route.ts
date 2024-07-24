import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { Session } from "next-auth";

const adminEmails = ["enriconunesubi@gmail.com", "lcezarsm@gmail.com", "jhonmerces01@gmail.com", "enriconunes02@gmail.com"];

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    // add types/next-auth.d.ts to fix error
    callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      if (session.user?.email) {
        session.user.role = adminEmails.includes(session.user.email) ? 'admin' : 'user';
      }
      return session;
    },
  },
})

export { handler as GET, handler as POST }