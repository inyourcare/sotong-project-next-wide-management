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
    Heading,
    Stack
} from '@chakra-ui/react';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { FiTrash2, FiUser } from "react-icons/fi";
import { dehydrate, DehydratedState, QueryClient, useQuery } from 'react-query';
import { Pagination } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Table from '@components/common/Table';
import { SearchBar } from '@components/common/SearchBar';

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
    const router = useRouter();
    const props = result as MenuParams
    const initializePage = () => parseInt(router.query.page as string) || 1
    const [page, setPage] = useState(initializePage());
    const [changingEmail, setChangingEmail] = useState('')
    const [email, setEmail] = useState('');
    const [queryTrigger, setQueryTrigger] = useState(0);
    const [queryBody, setQieryBody] = useState('');
    const { t } = useTranslation('menu');
    // logger.debug('Menu rendering result', result)
    // logger.debug('Menu rendering props', props)
    // const menus = props.data.menus
    // const [page, setPage] = useState(1);
    const { data } = useQuery(
        ["menuList", queryTrigger],
        // ["menuList", queryTrigger],
        async () => {
            // await fetch(`https://rickandmortyapi.com/api/character/`).then((result) =>
            //     result.json()
            // )
            // await fetch(`${process.env.NEXTAPI_BASE_URL}/menu/list`, {
            return await fetch(`/api/menu/list`, {
                method: 'POST',
                body: JSON.stringify({
                    page: page - 1,
                    limit: 5,
                    conditions: {
                        creator: {
                            // email: 'admin@sotong.co.kr'
                            // email
                            ...(email && { email: email })
                        }
                    }
                }),
                headers: { "Content-Type": "application/json" }
            }).then(async (result) => {
                const jsonResult = await result.json()
                logger.debug('useQuery result', jsonResult)
                return jsonResult
            })
        },
        {
            refetchOnMount: "always",
            // staleTime: 60 * 1000, // 1분
        }
    );
    function handlePaginationChange(event: ChangeEvent<unknown>, page: number) {
        setPage(initializePage());
        router.push(`menu/?page=${page}`, undefined, { shallow: false });
        // routerPush(page)
    }
    useEffect(() => {
        // const state = props.dehydratedState as DehydratedState
        console.log('hi')
        setPage(parseInt(router.query.page as string) || 1)
        setQueryTrigger(queryTrigger + 1)
    }, [props])

    const columns = useMemo(
        () => [
            {
                Header: "Menu",
                columns: [{
                    accessor: "name",
                    Header: "Name",
                    // Header: () => (
                    //     <p style={{text-align: 'center}}>번호</p>
                    //   ),
                    show: true,
                    maxWidth: 300,
                    minWidth: 300,
                    width: 300,
                },
                {
                    accessor: "menuType",
                    Header: "menuType",
                },
                {
                    accessor: "id",
                    Header: "id",
                },
                {
                    accessor: "code",
                    Header: "code",
                },
                {
                    accessor: "order",
                    Header: "order",
                },
                {
                    accessor: "creator",
                    Header: "creator",
                },
                {
                    accessor: "modifier",
                    Header: "modifier",
                },]
            }
        ],
        []
    );
    return (
        <>
            {/* {data && data.menus && (data.menus as Array<TMenu>).length > 0 && <MenuList props={props} data={data}></MenuList>} */}
            {/* {<MenuList props={props}></MenuList>} <- CSR */}
            <Flex minH={"100vh"} w={"100%"} align={"center"} justify={"center"}>
                <Stack w={"100%"} spacing={20} mx={"auto"} py={12} px={20}>
                    <Stack w={"full"} align={"center"}>
                        <Heading mb={6}>{t('heading')}</Heading>
                        <Box
                            marginTop={{ base: "1", sm: "5" }}
                            display="flex"
                            flexDirection={{ base: "column", sm: "row" }}
                            justifyContent="space-between"
                            // w={"full"}
                            w={"100%"}
                        >
                            {/* {props?.data?.csrfToken} */}
                            {/* <List size="lg" w={"100%"}>
                            {(data?.menus as Array<TMenu>)?.map((menu) => (
                                // {menus.map((menu) => (
                                <ListItem key={String(menu.id)}>
                                    <Text fontSize="sm">({menu.menuType})({menu.id}){menu.name}({menu.code})(순서:{menu.order})(Created By {menu.creator?.email})(Modified By {menu.modifier?.email})</Text>
                                    <ReactMarkdown children={menu.greetings} />
                                </ListItem>
                            ))}

                        </List> */}
                            {(data?.menus as Array<TMenu>) && <Table columns={columns} data={(data.menus as Array<TMenu>).map(menu => { return { ...menu, creator: menu.creator?.email, modifier: menu.modifier?.email } })} />}
                        </Box>
                        <Pagination
                            count={data?.pages}
                            variant='outlined'
                            color='primary'
                            className='pagination'
                            page={page}
                            onChange={handlePaginationChange}
                        />
                        <Text align={"center"}>
                            <Link color={"blue.400"} href="menu/create">
                                Menu Create
                            </Link>
                        </Text>
                        <SearchBar
                            // onChange={() => { }}
                            onChange={(e) => { setChangingEmail(e.target.value) }}
                            // onChange={(e) => { setEmail(e.target.value) }}
                            // onClick={() => { }}
                            onClick={() => {
                                // let resultEmail
                                // if (changingEmail) resultEmail = changingEmail
                                // else resultEmail = undefined
                                // // setPage(page);
                                // // alert('onclick email' , email)
                                // console.log('onclick', changingEmail, email)

                                // setEmail(resultEmail)
                                setEmail(changingEmail)
                                setChangingEmail('')
                                setPage(1)
                                setQueryTrigger(queryTrigger + 1)
                                // routerPush(undefined, resultEmail)
                            }}
                            // onClick={() => { router.push(`menu/?page=${page}`, undefined, { shallow: true }); }} 
                            placeHolder='' />
                        {/* <button onClick={() => { setPage(1) }}>test</button> */}
                    </Stack>
                </Stack>
            </Flex>
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
    let page = 1;
    if (context.query.page && typeof context.query.page === 'string') {
        page = parseInt(context.query.page);
    }
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(
        ["menuList", page],
        async () =>
            await fetch(`${process.env.NEXTAPI_BASE_URL}/menu/list`, {
                method: 'POST',
                body: JSON.stringify({
                    page: page - 1,
                    limit: 5,
                    conditions: {
                        creator: {
                            // email: 'admin@sotong.co.kr'
                            // email
                        }
                    }
                }),
                headers: { "Content-Type": "application/json" }
            }).then((result) => result.json())
    );
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
            dehydratedState: dehydrate(queryClient),
            ...(await serverSideTranslations(locale as string))
        }) as MenuParams
    }
}
export default Menu;