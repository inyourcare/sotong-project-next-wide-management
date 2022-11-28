import { Role } from "@prisma/client"

export type TUser = {
    id: string,

    name: string,
    email: string,
    emailVerified: string,
    password: string,
    image: string,
    role: String,

    createdAt: Date
    updatedAt: Date
    roles: [{
        id: number,
        userId: string,
        role: Role
    }]
}