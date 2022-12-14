import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@core/prisma';
import { logger } from "@core/logger";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const projectId = Number(req.query.id as string);
    logger.debug('project dynamic async', req.query)

    if (req.method === "GET") {
        handleGET(projectId, res);
    } else if (req.method === "POST") {
        handlePOST(projectId, req, res);
    } else if (req.method === "DELETE") {
        handleDELETE(projectId, res);
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
}

// GET /api/project/:id
async function handleGET(id: number, res: NextApiResponse) {
    const project = await prisma.project.findUnique({
        // where: { id: Number(userId) },
        where: { id: id },
        // include: { id: true, name: true, email: true, image: true },
    });
    res.json(project);
}

// POST /api/project/:id
async function handlePOST(id: number, req: NextApiRequest, res: NextApiResponse) {
    let data = req.body
    // const users = data.users
    // delete data.users
    logger.debug('project handlePOST', data)
    const project = await prisma.project.update({
        // where: { id: Number(userId) },
        where: { id: id },
        // data: { ...req.body },
        data: { ...data },
        // include: {
        //     users: false
        // }
    });
    return res.json(project);
}

// DELETE /api/project/:id
async function handleDELETE(id: number, res: NextApiResponse) {
    const project = await prisma.project.delete({
        where: { id: id },
    });
    res.json(project);
}
