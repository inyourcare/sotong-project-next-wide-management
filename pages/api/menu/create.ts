import type { NextApiRequest, NextApiResponse } from "next";
import sha256 from "crypto-js/sha256";
import { logger } from "@core/logger";
import { prisma } from '@core/prisma';
import { Role } from "@prisma/client"
import { getSession } from "next-auth/react";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === "POST") {
        await handlePOST(req, res);
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
}

const hashPassword = (password: string) => {
    return sha256(password).toString();
};

// POST /api/user
async function handlePOST(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const session = await getSession()
    const creatorId = session?.user.id
    const modifierId = session?.user.id
    const parentId = Number(req.body.parentId)
    logger.debug("creating menu", {
        ...req.body,
    });
    // 먼저 생성
    const menu = await prisma.menu.create({
        data: { ...req.body, creatorId, modifierId, parentId },
    }).then(async me => {
        // 부모가 없는 경우
        if (me.parentId === 0)
            return await prisma.menu.update({
                where: { id: me.id },
                data: {
                    ...me,
                    groupId: me.id,
                    parentId: me.id
                }
            })
        // 부모가 있는 경우
        else {
            // 먼저 부모를 찾고
            const parent = await prisma.menu.findFirstOrThrow({
                where: { id: me.parentId },
            })
            // 같은 부모를 가진 기존 글중 최대 step + 1
            const maxStepRecord = await prisma.menu.findFirstOrThrow({
                where: { parentId: me.parentId },
                orderBy: [{
                    step: 'desc'
                }]
            })
            const newStep = maxStepRecord.step + 1;
            // 해당 그룹에 step 이 더 크거나 하면 increment
            await prisma.menu.updateMany({
                where: { groupId: parent.groupId, step: { gte: newStep } },
                data: {
                    step: {
                        increment: 1
                    }
                }
            })
            // 자기자신 업데이트
            return await prisma.menu.update({
                where: { id: me.id },
                data: {
                    ...me,
                    depth: parent.depth + 1,
                    step: newStep,
                    groupId: parent.groupId,
                }
            })



            // if (parent.id !== parent.groupId) {
            //     return await prisma.menu.update({
            //         where: { id: me.id },
            //         data: {
            //             ...me,
            //             groupId: parent.groupId,
            //             step: parent.step + 1,
            //             depth: parent.depth + 1
            //         }
            //     }).then(updated => {
            //         logger.debug('menu create previously updateMany' , parent, updated)
            //         prisma.menu.updateMany({
            //             where: { groupId: parent.groupId, step: { gte: updated.step } },
            //             data: {
            //                 step: {
            //                     increment: 1
            //                 }
            //             }
            //         }).then(r=>{
            //             logger.debug('result -->>' , r)
            //         })
            //         return updated;
            //     })
            // } else {

            //     return await prisma.menu.findFirstOrThrow({
            //         where: { groupId: me.parentId },
            //         orderBy: [{
            //             step: 'desc'
            //         }]
            //     }).then(async one=>{
            //         return await prisma.menu.update({
            //             where: { id: me.id },
            //             data: {
            //                 ...me,
            //                 groupId: parent.groupId,
            //                 step: one.step + 1,
            //                 depth: parent.depth + 1
            //             }
            //         })
            //     })
            // }

            // return
        }
    });
    res.json(menu);
}
