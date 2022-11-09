import { Box, Flex, Heading, List, ListItem, Stack, Text, UnorderedList } from "@chakra-ui/react";
import { SearchBar } from "@components/common/SearchBar";
import Table from "@components/common/Table";
import { logger } from "@core/logger";
import { TMenu } from "@core/types/TMenu";
import { Pagination } from "@mui/material";
import { Props } from "framer-motion/types/types";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useQuery } from "react-query";

type MenuProps = Props & {
    // data: {
    //     // csrfToken: string,
    //     menus: Array<TMenu>,
    //     pages: number
    // }
    // // menus: Array<TMenu>
}
const MenuList: React.FC<MenuProps> = ({ props }) => {
    const { t } = useTranslation('menu');
    const router = useRouter();
    const initialPage = () => Number(router.query.page) || 1
    const initialEmail = () => router.query.email as string || undefined
    const [page, setPage] = useState(initialPage());
    // searching
    const [email, setEmail] = useState<string | undefined>(initialEmail());
    const [queryTrigger, setQueryTrigger] = useState(0)
    const [changingEmail, setChangingEmail] = useState<string | undefined>(undefined);
    const { data } = useQuery(
        // ["menuList", page, email],
        ["menuList", queryTrigger],
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
                            email
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

    function routerPush(page?: number, email?: string) {
        let link = 'menu/?'
        if (page)
            link = link.concat(`page=${page}&`)
        if (email)
            link = link.concat(`email=${email}&`)
        router.push(link, undefined, { shallow: true })
        // router.push(`menu/?page=${page}&email=${email}`, undefined, { shallow: true });
        // router.push(`menu/?page=${page}`, undefined, { shallow: true });
    }
    function handlePaginationChange(event: ChangeEvent<unknown>, page: number) {
        setPage(page);
        setQueryTrigger(queryTrigger+1)
        // routerPush(page)
    }
    // useEffect(() => {
    //     logger.debug('page, email chaging detector', page, email, router.query.page)
    //     if (router.query.page && (page) !== Number(router.query.page))
    //         setPage(Number(router.query.page))
    //         // router.reload()
    // }, [router.query.page])
    // useEffect(() => {
    //     const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
    //         // console.log(
    //         //     `App is changing to ${url} ${shallow ? 'with' : 'without'
    //         //     } shallow routing`
    //         // )
    //         // const complePage = Number(router.query.page)
    //         // const compleEmail = router.query.email as string
    //         // if (complePage && (complePage !== page))
    //         //     setPage(complePage)
    //         // if (!complePage)
    //         //     setPage(initialPage)
    //         // // else 
    //         // //     setPage(1)
    //         // if (compleEmail && typeof compleEmail === 'string' && (compleEmail !== email))
    //         //     setEmail(compleEmail)
    //         // if (!compleEmail)
    //         //     setEmail(initialEmail)
    //         // else 
    //         //     setEmail(undefined)
    //         setPage(initialPage())
    //         setEmail(initialEmail())
    //         console.log('router change query', router.query.page, router.query.email)
    //         setQueryTrigger(queryTrigger + 1)
    //     }

    //     // router.events.on('routeChangeStart', handleRouteChange)
    //     router.events.on('routeChangeComplete', handleRouteChange)

    //     // If the component is unmounted, unsubscribe
    //     // from the event with the `off` method:
    //     return () => {
    //         // router.events.off('routeChangeStart', handleRouteChange)
    //         router.events.off('routeChangeComplete', handleRouteChange)
    //     }
    // }, [router.query])

    // const routerPush = useCallback(()=>router.push(`menu/?page=${page}&email=${email}`, undefined, { shallow: true }),[page,email]);

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
                            let resultEmail
                            if (changingEmail) resultEmail = changingEmail
                            else resultEmail = undefined
                            // setPage(page);
                            // alert('onclick email' , email)
                            console.log('onclick', changingEmail, email)
                            
                            setEmail(resultEmail)
                            setPage(1)
                            setQueryTrigger(queryTrigger+1)
                            // routerPush(undefined, resultEmail)
                        }}
                        // onClick={() => { router.push(`menu/?page=${page}`, undefined, { shallow: true }); }} 
                        placeHolder='' />
                    <button onClick={() => { router.back() }}>go back</button>
                </Stack>
            </Stack>
        </Flex>
    );
};

export default MenuList;