import { NextApiHandler } from 'next';
import NextAuth, { User } from 'next-auth';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';
import Google from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from '../../../core/prisma'
import CredentialsProvider from "next-auth/providers/credentials";

const kakaoClientId = process.env.KAKAO_CLIENT_ID
const kakaoClientSecret = process.env.KAKAO_CLIENT_SECRET
const naverClientId = process.env.NAVER_CLIENT_ID
const naverClientSecret = process.env.NAVER_CLIENT_SECRET
const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
let authHandler: NextApiHandler | undefined = undefined;
const SECRET = "dsds"
type RedirectParam = {
    url: string,
    baseUrl: string
}
var optionsDefault: any;
if (kakaoClientId && kakaoClientSecret && naverClientId && naverClientSecret && googleClientId && googleClientSecret && prisma) {
    optionsDefault = {
        providers: [
            Kakao({
                clientId: kakaoClientId,
                clientSecret: kakaoClientSecret,

            }),
            Naver({
                clientId: naverClientId,
                clientSecret: naverClientSecret,
            }),
            Google({
                clientId: googleClientId,
                clientSecret: googleClientSecret,
            }),
            // EmailProvider({ // 이메일 인증이 필요한 경우
            //     server: process.env.EMAIL_SERVER,
            //     from: process.env.EMAIL_FROM,
            //     // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
            // }),
            CredentialsProvider({
                // The name to display on the sign in form (e.g. 'Sign in with...')
                name: 'Credentials',
                // The credentials is used to generate a suitable form on the sign in page.
                // You can specify whatever fields you are expecting to be submitted.
                // e.g. domain, username, password, 2FA token, etc.
                // You can pass any HTML attribute to the <input> tag through the object.
                credentials: {
                    username: { label: "Username", type: "text", placeholder: "jsmith" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials, req) {
                    // You need to provide your own logic here that takes the credentials
                    // submitted and returns either a object representing a user or value
                    // that is false/null if the credentials are invalid.
                    // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                    // You can also use the `req` object to obtain additional parameters
                    // (i.e., the request IP address)
                    // const res = await fetch("/your/endpoint", {
                    //     method: 'POST',
                    //     body: JSON.stringify(credentials),
                    //     headers: { "Content-Type": "application/json" }
                    // })
                    // const user = await res.json()

                    // // If no error and we have user data, return it
                    // if (res.ok && user) {
                    //     return user
                    // }
                    // // Return null if user data could not be retrieved
                    // return null
                    
                    console.log('credentials->',credentials)
                    /**
                        [Object: null prototype] {
                            csrfToken: '2b8084f3a92951b70411b3e9ef8243650c9a43cad4d3acdad0182955ec78d124',
                            username: 'admin',
                            password: 'pass12#$'
                        }
                     */
                    console.log('req->',req)
                    const user = { name: "J Smith", email: "jsmith@example.com" } as User
                    return user
                }
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
} else {
    const errMsg = 'next auth 인증정보 에러';
    console.error(errMsg)
    throw new Error(errMsg)
}

export const options = optionsDefault;
export default authHandler;