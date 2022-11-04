import { checkAuthorized } from '@core/logics';
import { Props } from 'framer-motion/types/types';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { getCsrfToken } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from 'pages/api/auth/[...nextauth]';
const Maintanance: React.FC<Props> = (props) => {
    const { t } = useTranslation('maintanance');
    return (
        <>
        </>
    )
}
export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const { req, res, locale, resolvedUrl } = context;
    const session = await unstable_getServerSession(
        req as NextApiRequest | (IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }),
        res as NextApiResponse<any> | ServerResponse<IncomingMessage>,
        authOptions
    )
    // redirect check
    if (session && checkAuthorized(session, resolvedUrl) === false) {
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