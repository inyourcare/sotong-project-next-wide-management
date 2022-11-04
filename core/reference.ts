// add pages which you want to the array.
// and make the file in the page folder.
import { Role } from '@prisma/client'

export const routes = [
    { name: "Home", link: "/" },
    { name: "SignIn", link: "/auth/signin" },
    { name: "SignUp", link: "/auth/signup" },
    { name: "유지보수관리", link: "/boards/maintanance", authorized: [Role.ADMIN,Role.USER]},
    // { name: "path name", link: "link url" }, like this
];
