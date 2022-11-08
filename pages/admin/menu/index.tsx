import { checkAuthorized } from '@core/logics';
import { Props } from 'framer-motion/types/types';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSideProps, GetServerSidePropsResult, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { getCsrfToken } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MenuList from '@components/admin/menu/MenuList';
import { logger } from '@core/logger';
import { TMenu } from '@core/types/TMenu';
import {
    ChakraProvider, Flex, Spacer, Avatar,
    Text,
    Box,
    Icon,
    Button,
    Heading
} from '@chakra-ui/react';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import { useEffect, useState } from 'react';
import { Table } from "react-chakra-pagination";
import { FiTrash2, FiUser } from "react-icons/fi";
import { useQuery } from 'react-query';
import { Pagination } from '@mui/material';

type MenuParams = {
    // props: {
    data: {
        csrfToken: string,
        // menus: Array<TMenu>
    },
    [key: string | number | symbol]: any,
    // }
}
// const Menu: React.FC<Props> = (props) => {
// const Menu: React.FC<GetServerSidePropsResult<MenuParams>> = (result) => {
const Menu: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (result) => {
    const props = result as MenuParams
    // logger.debug('Menu rendering result', result)
    // logger.debug('Menu rendering props', props)
    // const menus = props.data.menus
    // const [page, setPage] = useState(1);
    // const { data } = useQuery(
    //     "menuList",
    //     async () =>
    //         // await fetch(`https://rickandmortyapi.com/api/character/`).then((result) =>
    //         //     result.json()
    //         // )
    //         // await fetch(`${process.env.NEXTAPI_BASE_URL}/menu/list`, {
    //         await fetch(`/api/menu/list`, {
    //             method: 'POST',
    //             body: JSON.stringify({ page, limit: 5 }),
    //             headers: { "Content-Type": "application/json" }
    //         }).then(async (result) => {
    //             const jsonResult = await result.json()
    //             logger.debug('useQuery result', jsonResult)
    //             return jsonResult
    //         })
    // );
    return (
        <>
            {/* {data && data.menus && (data.menus as Array<TMenu>).length > 0 && <MenuList props={props} data={data}></MenuList>} */}
            {<MenuList props={props}></MenuList>}
        </>
    )
}

export const getServerSideProps: GetServerSideProps<MenuParams> = async (context) => {
    const { req, res, locale, resolvedUrl } = context;
    const session = await unstable_getServerSession(
        req as NextApiRequest | (IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }),
        res as NextApiResponse<any> | ServerResponse<IncomingMessage>,
        authOptions
    )
    // const menus = await fetch(`${process.env.NEXTAPI_BASE_URL}/menu/list`, {
    //     method: 'POST',
    //     body: JSON.stringify({ page: 0, limit: 5 }),
    //     headers: { "Content-Type": "application/json" }
    // })
    // redirect check
    if (checkAuthorized(session, resolvedUrl) === false) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: ({
            data: {
                csrfToken: await getCsrfToken(context),
                // menus: (await menus.json()),
            },
            ...(await serverSideTranslations(locale as string))
        }) as MenuParams
    }
}
export default Menu;