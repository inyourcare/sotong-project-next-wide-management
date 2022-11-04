import { checkAuthorized } from '@core/logics';
import { Props } from 'framer-motion/types/types';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { getCsrfToken } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MenuList from '@components/admin/menu/MenuList';
import { logger } from '@core/logger';
const Menu: React.FC<Props> = (props) => {
    return (
        <>
            <MenuList props={props}></MenuList>
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
    const menus = await fetch(`${process.env.NEXTAPI_BASE_URL}/menu/list`, {
        method: 'POST',
        body: JSON.stringify({page:0,limit:5}),
        headers: { "Content-Type": "application/json" }
    })
    // logger.debug(':::::::::::',menus.json())
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
            data: {
                csrfToken: await getCsrfToken(context), 
                munus: await menus.json(),
            },
            ...(await serverSideTranslations(locale as string))
        },
    };
}
export default Menu;