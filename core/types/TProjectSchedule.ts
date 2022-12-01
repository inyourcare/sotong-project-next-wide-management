import { ProjectScheduleType } from "@prisma/client"
import { TProject } from "./TProject"

export type TProjectSchedule = {
    id: number
    projectId: number
    type: ProjectScheduleType
    startDate: Date
    endDate: Date
    memo: string
}