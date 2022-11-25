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
    // logger.debug('project/create->', req.body)
    const session = await getSession({ req })
    const creatorId = session?.user.id
    if (!session || !creatorId) {
        const errMsg = 'menu create error, session info essecial'
        logger.error(errMsg, session)
        res.json({ msg: errMsg })
        return;
    }

    await prisma.$transaction(async (tx) => {
        await tx.project.create({
            data: {
                projectName: req.body.projectName,
                projectEnglishName: req.body.projectEnglishName,
                projectStartDate: new Date(req.body.projectStartDate),
                projectEndDate: new Date(req.body.projectEndDate),
                projectMaintananceStartDate: new Date(req.body.projectMaintananceStartDate),
                projectMaintananceEndDate: new Date(req.body.projectMaintananceEndDate)
                // users: { create: { userId: req.body.userId } },
            },
        })
    })
    .then((data) => {
        res.json(data);
        logger.debug("Insert a project: ", data);
    })
    .catch((err) => {
        res.json(err);
        logger.debug("Error while Insert a project: ", err);
    })
}
