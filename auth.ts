import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
import google from "next-auth/providers/google";

const credentialsConfig = credentials({
  name: "Credentials",
  credentials: {
    username: {
      label: "User Name",
    },
    password: {
      label: "Password",
      type: "password",
    },
  },

  async authorize(credentials) {
    if (credentials.username === "mikha" && credentials.password === "123")
      return {
        name: "Mikha",
      };
    else return null;
  },
});

const config = {
  providers: [google, credentialsConfig],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middlewareProtected") return !!auth;
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
