import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn(params) {
      
      if (!params.user.email) {
        return false
      }
      
        const email = params.user.email
        
        const name = params.profile?.name

        try {
          const existingUser = await prisma.user.findUnique({where: {email}});
          
          if (!existingUser) {
            await prisma.user.create({
              data: {
                name: name || 'User',
                email: email || '',
                provider: 'Google',
              }
            })
          }
        } catch (error) {

        }

      return true
    },
    async redirect({ url, baseUrl }) {
      // After successful sign-in or sign-up, redirect to the dashboard
      if (url === baseUrl || url.startsWith(baseUrl)) {
        return "/dashboard";
      }
      return url;
    },
    async session({ session, token }) {
      // Add custom fields to the session
      session.user.id = token.sub!;
      session.user.image = token.picture || ""; 
      session.user.name = token.name || "User"; 
      return session;
    },
    async jwt({ token, account, profile }) {
      // Add custom fields to the token
      if (account && profile) {
        token.picture = (profile as any).picture || ""; 
        token.name = profile.name || "User";
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signIn",
    signOut: "/auth/signUp",
  }
});

export { handler as GET, handler as POST };