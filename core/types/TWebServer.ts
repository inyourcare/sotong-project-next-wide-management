import { ProjectScheduleType } from "@prisma/client"
import { TProject } from "./TProject"

export type TWebServer = {
    id: number
    project: TProject
    serverName: string
    serverIp: string
    serverPort: string
    referenceAddress: string
    memo: string
}