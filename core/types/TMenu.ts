export type TMenu = {
    id: number,
    creatorId: string,
    modifierId: string,

    name: string,
    englishName: string,
    code: string,
    greetings: string
    redirectUrl: String
    contentsHeader: string
    contentsFooter: string
    order: number
    depth: number
    step: number
    groupId: number
    parentId: number

    deleted: boolean
    invisable: boolean

    createdAt: Date
    updatedAt: Date
}