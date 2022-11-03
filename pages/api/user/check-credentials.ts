import type { NextApiRequest, NextApiResponse } from "next";
import sha256 from "crypto-js/sha256";
import { omit } from "lodash";
import { logger } from "@core/logger";
import { prisma } from '@core/prisma'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    // logger.debug('check-credentials', {req,res})
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
    const user = await prisma.user.findUnique({
        where: { email: req.body.username },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            password: true,
            role: true
        },
    });
    logger.debug("password", user,user?.password,hashPassword(req.body.password));
    if (user && user.password == hashPassword(req.body.password)) {
        logger.debug("password correct");
        res.json(omit(user, "password"));
    } else {
        logger.debug("incorrect credentials");
        res.status(400).end("Invalid credentials");
    }
}
