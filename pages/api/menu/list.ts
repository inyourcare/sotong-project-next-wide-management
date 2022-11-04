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
    const { page, limit } = req.body;
    logger.debug('menu list api', req.body, page, limit)
    const menus = await prisma.menu.findMany({
        skip: page * limit,
        take: limit,
        where: {
            deleted: false,
            invisable: false,
        },
        orderBy: [{
            groupId: 'desc',
        }, {
            step: 'asc'
        }]
    });
    logger.debug('menu list api result', menus)
    res.status(200).json(menus)
    // if (menus.length>0)
    //     res.status(200).json({menus})
    // res.status(500).send({})

    // const session = await getSession({ req });
    // if (!session) {
    //     res.statusCode = 403;
    //     return { props: { drafts: [] } };
    // }

    // const drafts = await prisma.post.findMany({
    //     where: {
    //         author: { email: session.user.email },
    //         published: false,
    //     },
    //     include: {
    //         author: {
    //             select: { name: true, email: true },
    //         },
    //     },
    // });
    // return {
    //     props: { drafts },
    // };
}
