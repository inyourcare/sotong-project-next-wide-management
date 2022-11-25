import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from '@core/prisma'
import { Role } from "@prisma/client";
import { logger } from "@core/logger";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    // const query = req.query;
    const { page, limit, lastId, conditions } = req.body;
    logger.debug('user list api', req.body, page, limit)
    // const conditionTemp = {
    //     creator: {
    //         email: 'admin@sotong.co.kr'
    //     }
    // }
    const whereConditions = {
        // deleted: false,
        // invisable: false,
        ...conditions,
        // ...conditionTemp
    }
    const users = await prisma.user.findMany({
        // skip: page * limit,
        // skip: lastId ? 1 : page * limit,

        ...(page && limit && { skip: page * limit }),
        ...(limit && { take: limit }),
        ...(lastId && { skip: 1, cursor: { id: lastId } }),
        where: whereConditions,
        // where: {
        //     creator: {
        //         email: 'admin@sotong.co.kr'
        //     }
        // },
        // orderBy: [{
        //     groupId: 'desc',
        // }, {
        //     step: 'asc'
        // }],
        // include: {
        //     creator: {
        //         select: {
        //             name: true, email: true, image: true, role: true
        //         }
        //     },
        //     modifier: {
        //         select: {
        //             name: true, email: true, image: true, role: true
        //         }
        //     }
        // }
    });
    logger.debug('users list api result', users.length)
    const total = await prisma.user.count({
        where: whereConditions,
        // where: {
        //     creator: {
        //         email: 'admin@sotong.co.kr'
        //     }
        // }
    });
    const pages = total === 0 ? 1 : Math.floor(total / limit) + (total % limit === 0 ? 0 : 1)
    res.status(200).json({ users, pages })
}
