import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User"; // Import the updated User schema

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials Provider (Email/Username + Password)
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter your email or username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Email/Username and password are required.");
        }

        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email or username.");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValidPassword) {
            throw new Error("Invalid password.");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            favorites: user.favorites,
            searchHistory: user.searchHistory,
          };
        } catch (error: unknown) {
          throw new Error(
            error instanceof Error ? error.message : "Failed to log in."
          );
        }
      },
    }),

    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID || "",
      clientSecret: GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },

  pages: {
    signIn: "/signIn",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email as string;
        token.username = user.username;
        token.favorites = user.favorites;
        token.searchHistory = user.searchHistory;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          username: token.username,
          favorites: token.favorites,
          searchHistory: token.searchHistory,
        };
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // Secret for signing tokens
};
