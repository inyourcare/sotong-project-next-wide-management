import { checkAuthorized } from '@core/logics';
import { Props } from 'framer-motion/types/types';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSideProps, GetServerSidePropsResult, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { getCsrfToken } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { logger } from '@core/logger';
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
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FiTrash2, FiUser } from "react-icons/fi";
import { dehydrate, DehydratedState, QueryClient, useQuery } from 'react-query';
import { AlertProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Divider, MenuItem, Pagination, Select } from '@mui/material';
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

type UserParams = {
    // props: {
    data: {
        csrfToken: string,
    },
    [key: string | number | symbol]: any,
    // }
}
const User: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (result) => {
    const router = useRouter();
    const initializePage = () => parseInt(router.query.page as string) || 1
    const initializeEmail = () => router.query.email as string || ''
    const [page, setPage] = useState(initializePage());
    const [email, setEmail] = useState(initializeEmail());
    const { t } = useTranslation('user');
    const { data } = useQuery("userList", () => getUsers(page, email)) as any
    const tableData = { ...data }
    // const [roleMap,setRoleMap] = useState((tableData.users as Array<TUser>).reduce((map,obj)=>{
    //     map.set(obj.id,obj.role)
    //     return map;
    // }, new Map<string,any>))
    const [roleMap, setRoleMap] = useState(new Map<string, any>())

    function handlePaginationChange(event: ChangeEvent<unknown>, page: number) {
        routePush(page, email)
    }
    useEffect(() => {
        console.log('page hi', page, router.query.page, email, router.query.email)
        setPage(initializePage())
        setEmail(initializeEmail())
    }, [router.query])
    const routePush = (page: number, email: string) => {
        let link = 'user/?'
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
        { field: 'email', headerName: 'Email', styles: { width: '10%' } },
        // { field: 'code', headerName: 'code', styles: { width: '10%' } },
        { field: 'password', headerName: 'Password', styles: {} },
        // { field: 'order', headerName: 'order', styles: { width: '10%' }, },
        { field: 'image', headerName: 'image', styles: { width: '10%' } },
        { field: 'role', headerName: 'role', styles: { width: '10%' } },
        { field: 'createdAt', headerName: 'CreatedAt', styles: { width: '10%' } },
        { field: 'updatedAt', headerName: 'UpdatedAt', styles: { width: '10%' } },
    ];

    // const saveRoleChanges = async () => {
    //     console.log('saveRoleChanges', roleMap)
    //     roleMap.forEach(async (role, userId) => {
    //         console.log(`POSTing ${JSON.stringify({ role, userId }, null, 2)}`);
    //         const res = await fetch(`/api/user/${userId}`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ role }),
    //         })
    //             .catch((error) => {
    //                 console.error(`${userId} :: ${error}`);
    //             })
    //     })
    //     // try {
    //     //     // const body = { ...values };
    //     //     const body = Object.fromEntries(roleMap);
    //     //     console.log(`POSTing ${JSON.stringify(body, null, 2)}`);
    //     //     const res = await fetch(`/api/user/update`, {
    //     //         method: "POST",
    //     //         headers: { "Content-Type": "application/json" },
    //     //         body: JSON.stringify(body),
    //     //     });
    //     //     logger.debug(`res`, res);
    //     //     // todo:: 만약 네이버 등으로 먼저 로그읺해서 메일이 등록된 유저는 create 가 되지 않는다. 해결 필요
    //     //     // reset();
    //     //     router.push(
    //     //         `admin/user/${router.query.callbackUrl
    //     //             ? `?callbackUrl=${router.query.callbackUrl}`
    //     //             : ""
    //     //         }`,
    //     //     );
    //     // } catch (error) {
    //     //     console.error(error);
    //     // }
    //     roleMap.clear()
    //     routePush(page, email)
    // }

    // dialog 
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);
    const noButtonRef = React.useRef<HTMLButtonElement>(null);
    const initialDialogRoleToAdd = Role.USER
    const [dialogUser, setDialogUser] = React.useState<TUser | null>(null);
    const [dialogRoleToAdd, setDialogRoleToAdd] = React.useState<Role>(initialDialogRoleToAdd);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const handleCloseSnackbar = () => setSnackbar(null);
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };
    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (dialogOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [dialogOpen]);

    const openRolesDialog = (user: TUser) => {
        setDialogUser(user)
        setDialogOpen(true)
        setDialogRoleToAdd(initialDialogRoleToAdd)
    }
    const addNewRoleToUser = useCallback(async () => {
        console.log(`addNewRoleToUser POSTing ${JSON.stringify({ dialogRoleToAdd, ...dialogUser }, null, 2)}`);
        const res = await fetch(`/api/user/${dialogUser?.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({ role:dialogRoleToAdd }),
            body: JSON.stringify({ roles: { create: { role: dialogRoleToAdd } } }),
        })
            .catch((error) => {
                console.error(`addNewRoleToUser :: ${error}`);
            })
        routePush(page, email)
        setDialogOpen(false)
    }, [dialogRoleToAdd, dialogUser])

    return (
        <>
            <div>
                <Dialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    scroll={'paper'}
                    aria-labelledby="scroll-dialog-title"
                // aria-describedby="scroll-dialog-description"
                >
                    <DialogTitle id="scroll-dialog-title">역활추가</DialogTitle>
                    <DialogContent dividers={scroll === 'paper'}>
                        <Box>기존</Box>
                        {dialogUser?.roles.map(role => {
                            return <DialogContentText
                                id="scroll-dialog-description"
                                ref={descriptionElementRef}
                                tabIndex={-1}
                            >
                                {role.role}
                            </DialogContentText>
                        })}
                        <Divider />
                        <Box sx={{ marginTop: '20px' }}>신규</Box>
                        <Select
                            // labelId="demo-simple-select-label"
                            // value={user.role}
                            defaultValue={initialDialogRoleToAdd}
                            // value={roleMap.get(user.id)}
                            // label="Age"
                            // onChange={(e)=>{user.role = e.target.value}}
                            // onChange={(e) => { roleMap.set(user.id, e.target.value) }}
                            onChange={(e) => { setDialogRoleToAdd(e.target.value as Role) }}
                        >
                            <MenuItem value={Role.ADMIN}>Admin</MenuItem>
                            <MenuItem value={Role.USER}>User</MenuItem>
                            <MenuItem value={Role.MEMBER}>Member</MenuItem>
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={addNewRoleToUser}>추가</Button>
                    </DialogActions>
                </Dialog>
            </div>
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
                                                    {/* <Select
                                                        // labelId="demo-simple-select-label"
                                                        // value={user.role}
                                                        defaultValue={user.role}
                                                        // value={roleMap.get(user.id)}
                                                        // label="Age"
                                                        // onChange={(e)=>{user.role = e.target.value}}
                                                        onChange={(e) => { roleMap.set(user.id, e.target.value) }}
                                                    >
                                                        <MenuItem value={Role.ADMIN}>Admin</MenuItem>
                                                        <MenuItem value={Role.USER}>User</MenuItem>
                                                        <MenuItem value={Role.MEMBER}>Member</MenuItem>
                                                    </Select> */}
                                                    <Button onClick={() => openRolesDialog(user)}>추가</Button>
                                                </>),
                                                roles: null
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
                            <Link color={"blue.400"} href="/">
                                Home
                            </Link>
                        </Text>
                        {/* <Button onClick={saveRoleChanges}>Save</Button> */}
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
    await fetch(`${process.env.NEXTAPI_BASE_URL || '/api'}/user/list`, {
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
export const getServerSideProps: GetServerSideProps<UserParams> = async (context) => {
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
            },
            dehydratedState: dehydrate(queryClient),
            ...(await serverSideTranslations(locale as string))
        }) as UserParams
    }
}
export default User;