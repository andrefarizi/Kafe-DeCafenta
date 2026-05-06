import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Tidak menggunakan PrismaAdapter karena @auth/prisma-adapter
  // belum mendukung Prisma v7. Session disimpan via JWT (cookie).

  providers: [
    // ===== CREDENTIALS (email + password) =====
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),

    // ===== GOOGLE =====
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ===== FACEBOOK =====
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],

  // JWT strategy: session disimpan di encrypted cookie
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Tambahkan data user ke JWT token saat login
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { id?: string; role?: string }).role;
      }

      // Untuk OAuth (Google/Facebook): simpan user ke DB jika belum ada
      if (account && account.provider !== "credentials" && token.email) {
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: token.email },
          });

          if (!dbUser) {
            // Buat user baru untuk OAuth login
            dbUser = await prisma.user.create({
              data: {
                email: token.email,
                name: token.name ?? null,
                image: token.picture ?? null,
                role: "CUSTOMER",
              },
            });
          }

          token.id = dbUser.id;
          token.role = dbUser.role;
        } catch (err) {
          console.error("OAuth user upsert error:", err);
        }
      }

      // Fallback: ambil role dari DB jika belum ada
      if (token.id && !token.role) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          });
          token.role = dbUser?.role;
        } catch (err) {
          console.error("JWT fallback role fetch error:", err);
        }
      }

      return token;
    },

    // Expose id dan role ke session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },

    // Redirect berdasarkan role setelah login
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/customer/beranda`;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.AUTH_SECRET,
});
