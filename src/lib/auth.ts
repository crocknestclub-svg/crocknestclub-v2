  import NextAuth, { Session, User as AuthUser, User } from "next-auth";
  import CredentialsProvider from "next-auth/providers/credentials";
  import GoogleProvider from "next-auth/providers/google";
  import { prisma } from "./prisma";
  import bcrypt from 'bcryptjs';

  import getServerSession from 'next-auth';

  export async function auth() {
    return await getServerSession(authOptions);
  }

  // ...existing code...

  const authOptions = {
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
          if (!user || !user.passwordHash) return null;
          const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok) return null;
          // Optional: require verified email
          // if (!user.emailVerified) return null;
          return user;
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
          session.user.role =
            typeof user?.role === "string"
              ? user.role
              : typeof token?.role === "string"
              ? token.role
              : "CUSTOMER";

          // Safely assign emailVerified, ensuring only Date or null (not undefined)
          const emailVerified =
            (token as { emailVerified?: Date | string | null }).emailVerified;

          (session.user as { emailVerified?: Date | null }).emailVerified =
            typeof emailVerified === "string" || emailVerified instanceof Date
              ? (emailVerified ? new Date(emailVerified) : null)
              : null;
        }
        return session;
      },
      async jwt({ token, user }: { token: Record<string, unknown>; user: AuthUser }) {
        if (user) {
          token.role = (user as unknown as { role: string }).role;
          token.emailVerified = (user as unknown as { emailVerified: Date | null }).emailVerified ?? null;
        } else if (token?.email) {
          const u = await prisma.user.findUnique({ where: { email: String(token.email) } });
          if (u) {
            token.role = u.role;
            token.emailVerified = u.emailVerified ?? null;
          }
        }
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
