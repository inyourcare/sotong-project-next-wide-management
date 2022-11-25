// add pages which you want to the array.
// and make the file in the page folder.
import { Role } from '@prisma/client'
export type Route = {
    name: string,
    link: string,
    authorized?: Role[]
}
export const routes: Route[] = [
    { name: "Home", link: "/" },
    { name: "SignIn", link: "/auth/signin" },
    { name: "SignUp", link: "/auth/signup" },
    { name: "유지보수관리", link: "/boards/maintanance", authorized: [Role.ADMIN, Role.USER] },
    { name: "메뉴관리", link: "/admin/menu", authorized: [Role.ADMIN] },
    { name: "유저관리", link: "/admin/user", authorized: [Role.ADMIN] },
    { name: "파로스", link: "/paros/main" },
    // { name: "path name", link: "link url" }, like this
];
