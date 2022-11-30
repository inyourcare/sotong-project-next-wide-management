import { ProjectScheduleType } from "@prisma/client"
import { TProject } from "./TProject"

export type TProjectSchedule = {
    id: number
    project: TProject
    type: ProjectScheduleType
    startDate: Date
    endDate: Date
    memo: string
}