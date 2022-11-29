import { projectTableLimit, userTableLimit } from "@core/styles/mui";

export const getProjects = async (page: any) =>
    await fetch(`${process.env.NEXTAPI_BASE_URL || '/api'}/project/list`, {
        method: 'POST',
        body: JSON.stringify({
            page: page - 1,
            limit: projectTableLimit,
            conditions: {
                // creator: {
                // email: 'admin@sotong.co.kr'
                // email
                // ...(email && { email: email })
                // }
            }
        }),
        headers: { "Content-Type": "application/json" }
    }).then((result) => result.json())

export const getUsers = async (page: any, email?: any, conditions?:any) =>
    await fetch(`${process.env.NEXTAPI_BASE_URL || '/api'}/user/list`, {
        method: 'POST',
        body: JSON.stringify({
            page: page - 1,
            limit: userTableLimit,
            // conditions: {
                // creator: {
                // email: 'admin@sotong.co.kr'
                // email
                //     ...(email && { email: email })
                // }
            // }
            conditions
        }),
        headers: { "Content-Type": "application/json" }
    }).then((result) => result.json())