import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from '../../../core/prisma'

const kakaoClientId = process.env.KAKAO_CLIENT_ID
const kakaoClientSecret = process.env.KAKAO_CLIENT_SECRET
let authHandler: NextApiHandler | undefined = undefined;
const SECRET = "dsds"
type RedirectParam = {
    url: string,
    baseUrl: string
}

if (kakaoClientId && kakaoClientSecret && prisma) {
    const options = {
        providers: [
            Kakao({
                clientId: kakaoClientId,
                clientSecret: kakaoClientSecret,
                
            }),
            Naver({
                clientId: kakaoClientId,
                clientSecret: kakaoClientSecret,
            }),
        ],
        adapter: PrismaAdapter(prisma),
        callbacks: {
            async redirect({ url, baseUrl }: RedirectParam) {
                // Allows relative callback URLs
                if (url.startsWith("/")) return `${baseUrl}${url}`
                // Allows callback URLs on the same origin
                else if (new URL(url).origin === baseUrl) return url
                return baseUrl
            }
        },
        secret: SECRET,

    };

    authHandler = (req, res) => NextAuth(req, res, options);
}

export default authHandler;