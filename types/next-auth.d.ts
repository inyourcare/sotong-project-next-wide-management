import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    [key: string]: string;
  }
  interface JWT {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
    role?: string | null;
  }
}