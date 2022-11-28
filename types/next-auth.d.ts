import NextAuth from "next-auth";
import { Role } from "@prisma/client"
import { TUserRoles } from "@core/types/TUserRoles";


declare module "next-auth" {
  interface Session {
    user: User
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    // role?: Role;
    roles?: TUserRoles[];
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