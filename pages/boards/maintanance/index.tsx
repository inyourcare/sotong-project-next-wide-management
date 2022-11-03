import { Props } from 'framer-motion/types/types';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { getCsrfToken } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from 'pages/api/auth/[...nextauth]';
const Maintanance: React.FC<Props> = (props) => {
    return (
        <>
        </>
    )
}
export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const { req, res, locale } = context;
    const session = await unstable_getServerSession(
        req as NextApiRequest | (IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }),
        res as NextApiResponse<any> | ServerResponse<IncomingMessage>,
        authOptions
    )
    // redirect check
    if (session) {
        console.info('이미 로그인 되어 있습니다.')
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: {
            data: { csrfToken: await getCsrfToken(context), },
            ...(await serverSideTranslations(locale as string))
        },
    };
}
export default Maintanance;