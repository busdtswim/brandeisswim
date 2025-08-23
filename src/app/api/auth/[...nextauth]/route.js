// src/app/api/auth/[...nextauth]/route.js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { headers } from 'next/headers';
const UserStore = require('@/lib/stores/UserStore.js');

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await UserStore.findByEmail(credentials.email);

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password, 
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.fullname,
            role: user.role,
            must_change_password: user.must_change_password,
          };
        } catch (error) {
          // Log error internally without exposing details to client
          return null;
        }
      }
    }),
    CredentialsProvider({
      id: 'one-time-token',
      name: 'One Time Token',
      credentials: {
        token: { label: "Token", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.token) {
          return null;
        }

        try {
          const user = await UserStore.findByOneTimeToken(credentials.token);

          if (!user || !user.must_change_password) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.fullname,
            role: user.role,
            must_change_password: user.must_change_password,
            one_time_login: true,
          };
        } catch (error) {
          // Log error internally without exposing details to client
          return null;
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Initial sign in
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.must_change_password = user.must_change_password;
        token.one_time_login = user.one_time_login;
      }
      
      // Handle session updates
      if (trigger === 'update' && session?.user) {
        // Update token with new session data
        if (session.user.email) token.email = session.user.email;
        if (session.user.role) token.role = session.user.role;
        if (session.user.must_change_password !== undefined) token.must_change_password = session.user.must_change_password;
        if (session.user.one_time_login !== undefined) token.one_time_login = session.user.one_time_login;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.must_change_password = token.must_change_password;
        session.user.one_time_login = token.one_time_login;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

export const GET = auth;
export const POST = auth;

// Create GET and POST handlers
async function auth(request, context) {
  const headersList = await headers();
  context.headers = Object.fromEntries(headersList.entries());
  return NextAuth(authOptions)(request, context);
}