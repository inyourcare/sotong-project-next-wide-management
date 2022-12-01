import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@core/prisma';
import { logger } from "@core/logger";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const scheduleId = Number(req.query.id as string);
    logger.debug('schedule schedule dynamic async', req.query)

    if (req.method === "GET") {
        handleGET(scheduleId, res);
    } else if (req.method === "POST") {
        handlePOST(scheduleId, req, res);
    } else if (req.method === "DELETE") {
        handleDELETE(scheduleId, res);
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
}

// GET /api/schedule/:id
async function handleGET(id: number, res: NextApiResponse) {
    const schedule = await prisma.projectSchedule.findUnique({
        // where: { id: Number(userId) },
        where: { id: id },
        // include: { id: true, name: true, email: true, image: true },
    });
    res.json(schedule);
}

// POST /api/schedule/:id
async function handlePOST(id: number, req: NextApiRequest, res: NextApiResponse) {
    let data = req.body
    delete data.id
    // const users = data.users
    // delete data.users
    logger.debug('schedule handlePOST', data)
    const schedule = await prisma.projectSchedule.upsert({
        // where: { id: Number(userId) },
        where: { id: id },
        // data: { ...req.body },
        update: { 
            ...data 
        },
        create: {
            ...data,
            // project : {
            //     connect: {
            //         id: data.projectId
            //     }
            // }
        }
        // include: {
        //     users: false
        // }
    });
    return res.json(schedule);
}

// DELETE /api/schedule/:id
async function handleDELETE(id: number, res: NextApiResponse) {
    const schedule = await prisma.projectSchedule.delete({
        where: { id: id },
    });
    res.json(schedule);
}
