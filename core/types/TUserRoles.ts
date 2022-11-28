import { Role } from "@prisma/client"

export type TUserRoles = {
    id: number
    userId: string
    role: Role
}