import { TProjectSchedule } from "./TProjectSchedule"
import { TUser } from "./TUser"
import { TWebServer } from "./TWebServer"

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
    schedules: TProjectSchedule[]
    webServers: TWebServer[]
}