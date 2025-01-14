import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import jwt , { JwtPayload } from "jsonwebtoken";


interface DecodedToken extends JwtPayload {
  id: string;
  name: string;
  email: string;
}

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
        const avatar = params.user.image
        const name = params.profile?.name

        try {
          const existingUser = await prisma.user.findUnique({where: {email}});
          
          if (!existingUser) {
            await prisma.user.create({
              data: {
                name: name || 'User',
                email: email || '',
                provider: 'Google',
                avatar: avatar || ''
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
      console.log('before pop' , {session, token})
      // Add custom fields to the session
      session.user.id = token.id;
      session.user.image = token.picture || ""; 
      session.user.name = token.name || "User"; 
      session.user.email = token.email
      console.log('after pop' , session)
      return session;
    },
    async jwt({ token, account, profile , user }) {
      // Add custom fields to the token
      if (account && profile && user) {
        token.picture = (profile as any).picture || ""; 
        token.name = profile.name || "User";
        token.id = user.id
        token.name = user.name || 'User'
        token.email = user.email
      }

      if (user && user.token) { 
        token.id = user.id;
        token.name = user.name || 'User';
        token.email = user.email ;
      }
      
      console.log(token)
      return token;
    },
  },
  pages: {
    signIn: "/auth/signIn",
    signOut: "/auth/signUp",
  }
});

export { handler as GET, handler as POST };