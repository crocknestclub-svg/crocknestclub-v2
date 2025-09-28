import NextAuth, { Session, User as AuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>>): Promise<User | null> {
        const email = typeof credentials.email === "string" ? credentials.email : undefined;
        const password = typeof credentials.password === "string" ? credentials.password : undefined;
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && password === "demo") {
          // Replace with hashed password check in production
          return user;
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
  async session({ session, token, user }: { session: Session; token: Record<string, unknown>; user: AuthUser }) {
      if (session.user) {
        session.user.role = typeof user?.role === 'string' ? user.role : (typeof token?.role === 'string' ? token.role : "CUSTOMER");
      }
      return session;
    },
  async jwt({ token, user }: { token: Record<string, unknown>; user: AuthUser }) {
      if (user) token.role = user.role;
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=true",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
