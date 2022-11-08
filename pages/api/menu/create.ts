import type { NextApiRequest, NextApiResponse } from "next";
import sha256 from "crypto-js/sha256";
import { logger } from "@core/logger";
import { prisma } from '@core/prisma';
import { PrismaClient, Role } from "@prisma/client"
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
    const session = await getSession({ req })
    const creatorId = session?.user.id
    if (!session || !creatorId) {
        const errMsg = 'menu create error, session info essecial'
        logger.error(errMsg, session)
        res.json({ msg: errMsg })
        return;
    }
    // logger.debug('api/menu/create' , session)
    const parentId = Number(req.body.parentId)
    logger.debug("creating menu", {
        ...req.body,
    });

    // const [posts, totalPosts] = await prisma.$transaction([
    //     prisma.post.findMany({ where: { title: { contains: 'prisma' } } }),
    //     prisma.post.count(),
    // ])
    // const client = new PrismaClient()
    await prisma.$transaction(async (tx) => {
        const me = await tx.menu.create({
            data: { ...req.body, creatorId, modifierId: creatorId, parentId },
        })
        // 부모가 없는 경우
        if (me.parentId === 0)
            await tx.menu.update({
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
            const parent = await tx.menu.findFirstOrThrow({
                where: { id: me.parentId },
            })
            // 같은 부모를 가진 기존 글중 최대 step + 1
            const maxStepRecord = await tx.menu.findFirstOrThrow({
                where: { parentId: me.parentId },
                orderBy: [{
                    step: 'desc'
                }]
            })
            const newStep = Math.max(maxStepRecord.step, parent.step) + 1;
            // 해당 그룹에 step 이 더 크거나 하면 increment
            await tx.menu.updateMany({
                where: { groupId: parent.groupId, step: { gte: newStep } },
                data: {
                    step: {
                        increment: 1
                    }
                }
            })
            // 자기자신 업데이트
            await tx.menu.update({
                where: { id: me.id },
                data: {
                    ...me,
                    depth: parent.depth + 1,
                    step: newStep,
                    groupId: parent.groupId,
                }
            })
        }
        res.json(me);
    })
}
