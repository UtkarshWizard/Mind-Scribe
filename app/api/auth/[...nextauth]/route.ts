import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add custom fields to the session
      session.user.id = token.sub!;
      session.user.image = token.picture || ""; // Add a fallback
      session.user.name = token.name || "User"; // Add a fallback
      return session;
    },
    async jwt({ token, account, profile }) {
      // Add custom fields to the token
      if (account && profile) {
        token.picture = (profile as any).picture || ""; // Explicit cast to avoid type issues
        token.name = profile.name || "User";
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };