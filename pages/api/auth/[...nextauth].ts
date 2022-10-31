import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import Kakao from 'next-auth/providers/kakao';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from '../../../core/prisma'

const kakaoClientId = process.env.KAKAO_CLIENT_ID
const kakaoClientSecret = process.env.KAKAO_CLIENT_SECRET
let authHandler: NextApiHandler|undefined = undefined;
const SECRET = ""

if (kakaoClientId && kakaoClientSecret && prisma) {
    const options = {
        providers: [
            Kakao({
                clientId: kakaoClientId,
                clientSecret: kakaoClientSecret,

            }),
        ],
        adapter: PrismaAdapter(prisma),
    };

    authHandler = (req, res) => NextAuth(req, res, options);
}

export default authHandler;