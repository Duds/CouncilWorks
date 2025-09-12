import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Role } from "@prisma/client";
import { logAuditEvent } from "@/lib/audit";
import { AuditAction } from "@prisma/client";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials);

          const user = await prisma.user.findUnique({
            where: { email },
            include: { organisation: true },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          // Check if user is active
          if (!user.isActive) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(password, user.passwordHash);

          if (!isValidPassword) {
            return null;
          }

          // Update last login time
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            organisationId: user.organisationId,
            organisation: user.organisation,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organisationId = user.organisationId;
        token.organisation = user.organisation;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.organisationId = token.organisationId as string;
        session.user.organisation = token.organisation as { id: string; name: string };
      }
      return session;
    },
    async signIn({ user, account, profile: _profile }) {
      if (user?.id) {
        // Log successful login
        await logAuditEvent(
          AuditAction.USER_LOGIN,
          user.id,
          user.organisationId || undefined,
          {
            provider: account?.provider || "credentials",
            timestamp: new Date().toISOString(),
          }
        );
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.sub) {
        // Log logout
        await logAuditEvent(
          AuditAction.USER_LOGOUT,
          token.sub,
          token.organisationId as string || undefined,
          {
            timestamp: new Date().toISOString(),
          }
        );
      }
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
