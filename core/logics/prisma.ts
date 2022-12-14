import { logger } from "@core/logger";
import { projectTableLimit, userTableLimit } from "@core/styles/mui";
import { TProject } from "@core/types/TProject";
import { TProjectSchedule } from "@core/types/TProjectSchedule";
import { TUser } from "@core/types/TUser";
import { FieldValues } from "react-hook-form";

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

export const getUsers = async (page: any, email?: any, conditions?: any) =>
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

export const updateProject = async (project: Partial<TProject>) => {
    // const projectUsers = {update:project.users}
    // const projectUsers = project.users?.map(user => { return { ...user.user } }).values()
    delete project.users
    delete project.schedules
    delete project.webServers
    const res = await fetch(`/api/project/${project.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ ...project, users:{...projectUsers} }),
        body: JSON.stringify({ ...project }),
    })
        .then(result => result.json())
        .catch((error) => {
            console.error(`${project.id} ?????? ??? ?????? :: ${error}`);
        })
    return res
}

export const createProject = async (values: FieldValues) => {
    try {
        // logger.debug('hihi')
        const body = { ...values };
        console.log(`POSTing ${JSON.stringify(body, null, 2)}`);
        const res = await fetch(`/api/project/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        // logger.debug(`res`, res);
        return res
    } catch (error) {
        console.error(error);
    }
}

export const createProjectUsers = async (project:TProject, members:TUser[]) => {
    console.log(`handleAddDialog params`, project, members);
    const res = await fetch(`/api/project/${project.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ role:dialogRoleToAdd }),
        // body: JSON.stringify({ users: { create: { userId: dialogRoleToAdd } } }),
        body: JSON.stringify({ users: { create: members.map(member => { return { userId: member.id } }) } }),
    })
    return res
}

export const upsertProjectSchedule = async (schedule: Partial<TProjectSchedule>) => {
    // const projectUsers = {update:project.users}
    // const projectUsers = project.users?.map(user => { return { ...user.user } }).values()
    const res = await fetch(`/api/project/schedule/${schedule.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ ...project, users:{...projectUsers} }),
        body: JSON.stringify({ ...schedule }),
    })
        .then(result => result.json())
        .catch((error) => {
            console.error(`${schedule.id} ?????? ??? ?????? :: ${error}`);
        })
    return res
}