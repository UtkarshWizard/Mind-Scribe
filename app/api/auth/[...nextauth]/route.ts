import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '@prisma/client';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'

interface Credentials {
  name?: string ;
  email: string;
  password: string;
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
    CredentialsProvider({
      name: 'Credential',
      credentials: {
        name: { label: "Name", type: "text", placeholder: "jsmith" },
        email: {label: 'Email' , type:'email'},
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Credentials | undefined) {
        if(!credentials) {
          return null
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            email: credentials?.email
          }
        })

        if (existingUser && existingUser.passwordHash) {
          const passwordValidation = await bcrypt.compare(credentials.password , existingUser.passwordHash);

          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.email
            }
          }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
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
          console.error("Error in signIn callback:", error);
        }

      return true
    },
    async redirect({ url, baseUrl }) {
    // If the URL contains a callbackUrl parameter, use it
      const callbackUrl = new URL(url).searchParams.get("callbackUrl");
      if (callbackUrl) {
        return callbackUrl;
      }
    // Redirect to dashboard if no callbackUrl is found or URL matches baseUrl
    if (url === baseUrl || url === `${baseUrl}/auth/signin` || url === `${baseUrl}/auth/signup`) {
      return `${baseUrl}/dashboard`;
    }

    // Allow URLs that start with the base URL
    if (url.startsWith(baseUrl)) {
      return url;
    }

    // Fallback to dashboard for any external URL
    return `${baseUrl}/`;
    },
    async session({ session, token }) {
      // Add custom fields to the session
      session.user.id = token.id;
      session.user.image = token.picture || ""; 
      session.user.name = token.name || "User"; 
      session.user.email = token.email
      return session;
    },
    async jwt({ token, account, profile , user }) {
      // Add custom fields to the token
      if (account && profile && user) {
        token.picture = (profile as { picture?: string })?.picture || ""; 
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
      
      return token;
    },
  },
});

export { handler as GET, handler as POST };