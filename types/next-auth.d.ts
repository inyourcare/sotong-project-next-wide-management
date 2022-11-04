import NextAuth from "next-auth";
import { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: User
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: Role;
    [key: string]: string;
  }
  interface JWT {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
    role?: Role;
  }
}