import { TUser } from "./TUser"

export type TProject = {
    id: number,
    projectName: string,
    projectEnglishName: string,
    projectStartDate: Date,
    projectEndDate: Date,
    projectMaintananceStartDate: Date,
    projectMaintananceEndDate: Date,

    createdAt: Date
    updatedAt: Date,

    users: [{user:TUser}]
}