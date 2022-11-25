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
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FiTrash2, FiUser } from "react-icons/fi";
import { dehydrate, DehydratedState, QueryClient, useQuery } from 'react-query';
import { MenuItem, Pagination, Select } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Table from '@components/common/Table';
import { SearchBar } from '@components/common/SearchBar';
import MuiTable from '@components/common/MuiTable';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { userTableLimit, TableColDef } from '@core/styles/mui';
import { TUser } from '@core/types/TUser';
import { Role } from '@prisma/client';

type MenuParams = {
    // props: {
    data: {
        csrfToken: string,
        // menus: Array<TMenu>
    },
    [key: string | number | symbol]: any,
    // }
}
const Menu: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (result) => {
    const router = useRouter();
    // const props = result as MenuParams
    const initializePage = () => parseInt(router.query.page as string) || 1
    const initializeEmail = () => router.query.email as string || ''
    const [page, setPage] = useState(initializePage());
    const [email, setEmail] = useState(initializeEmail());
    const { t } = useTranslation('menu');
    const { data } = useQuery("userList") as any
    const tableData = { ...data }

    function handlePaginationChange(event: ChangeEvent<unknown>, page: number) {
        routePush(page, email)
    }
    useEffect(() => {
        console.log('page hi', page, router.query.page, email, router.query.email)
        setPage(initializePage())
        setEmail(initializeEmail())
    }, [router.query])
    const routePush = (page: number, email: string) => {
        let link = 'menu/?'
        // let link = 'listTest/?'
        if (page)
            link = link.concat(`page=${page}&`)
        if (email)
            link = link.concat(`email=${email}&`)
        router.push(link, undefined, { shallow: false })
        return
    }
    const columns: TableColDef[] = [
        { field: 'id', headerName: 'ID', styles: { width: '10%' } },
        { field: 'name', headerName: 'Name', styles: { width: '20%' } },
        { field: 'email', headerName: 'MenuType', styles: { width: '10%' } },
        // { field: 'code', headerName: 'code', styles: { width: '10%' } },
        { field: 'password', headerName: 'password', styles: {} },
        // { field: 'order', headerName: 'order', styles: { width: '10%' }, },
        { field: 'image', headerName: 'image', styles: { width: '10%' } },
        { field: 'role', headerName: 'role', styles: { width: '10%' } },
        { field: 'createdAt', headerName: 'CreatedAt', styles: { width: '10%' } },
        { field: 'updatedAt', headerName: 'UpdatedAt', styles: { width: '10%' } },
    ];
    return (
        <>
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
                            <MuiTable
                                columns={columns}
                                rows={
                                    (tableData.users as Array<TUser>)
                                        .map(user => {
                                            return {
                                                ...user,
                                                role: (<>
                                                    <Select
                                                        // labelId="demo-simple-select-label"
                                                        value={user.role}
                                                        // label="Age"
                                                        onChange={()=>{}}
                                                    >
                                                        <MenuItem value={Role.ADMIN}>Admin</MenuItem>
                                                        <MenuItem value={Role.USER}>User</MenuItem>
                                                        <MenuItem value={Role.MEMBER}>Member</MenuItem>
                                                    </Select>
                                                </>)
                                            }
                                        })
                                }
                                limit={userTableLimit}
                            />
                        </Box>
                        <Pagination
                            count={tableData?.pages}
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
                        <Text align={"center"}>
                            <Link color={"blue.400"} href="/">
                                Home
                            </Link>
                        </Text>
                        <SearchBar
                            onChange={(e) => { setEmail(e.target.value) }}
                            onSubmit={() => {
                                routePush(1, email)
                            }}
                            placeHolder=''
                            searchImg='BiSearchAlt2' />
                    </Stack>
                </Stack>
            </Flex>
        </>
    )
}
const getUsers = async (page: any, email: any) =>
    await fetch(`${process.env.NEXTAPI_BASE_URL}/user/list`, {
        method: 'POST',
        body: JSON.stringify({
            page: page - 1,
            limit: userTableLimit,
            conditions: {
                // creator: {
                // email: 'admin@sotong.co.kr'
                // email
                //     ...(email && { email: email })
                // }
            }
        }),
        headers: { "Content-Type": "application/json" }
    }).then((result) => result.json())
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
    const email = context.query.email;
    const queryClient = new QueryClient();
    await Promise.all([queryClient.prefetchQuery(
        // ["menuList", page],
        "userList",
        () => getUsers(page, email)
    )])
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