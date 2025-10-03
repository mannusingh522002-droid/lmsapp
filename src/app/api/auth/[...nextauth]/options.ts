import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

// Extend the Session and User types to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
      isApproved?: boolean;
      isVerified?: boolean;
      role:Role
      username?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<import('@prisma/client').User | null> {
        if (!credentials) {
          throw new Error('No credentials provided');
        }
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }, 
          });
          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.emailVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        console.log("JWT User:", user);
        token.id = user.id?.toString(); 
        token.username = user.name ? user.name : user.email?.split('@')[0];
    
        token.email = user.email; 
        token.isVerified = user.emailVerified;
        token.isApproved = user.isApproved;
        token.role = user.role as Role; 
      }
      console.log("JWT Token:", token);
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.email = token.email;
          session.user.isApproved = token.isApproved as boolean;
          session.user.role = token.role as Role;
          session.user.name = token.name;
        }
      }
      console.log("Session:", session);
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    signOut: '/sign-out',
  },
};