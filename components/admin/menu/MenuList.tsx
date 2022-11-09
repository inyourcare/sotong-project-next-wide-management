import { Box, Flex, Heading, List, ListItem, Stack, Text, UnorderedList } from "@chakra-ui/react";
import Table from "@components/common/Table";
import { logger } from "@core/logger";
import { TMenu } from "@core/types/TMenu";
import { Pagination } from "@mui/material";
import { Props } from "framer-motion/types/types";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
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
    const [page, setPage] = useState(1);
    const { data } = useQuery(
        ["menuList", page],
        async () =>
            // await fetch(`https://rickandmortyapi.com/api/character/`).then((result) =>
            //     result.json()
            // )
            // await fetch(`${process.env.NEXTAPI_BASE_URL}/menu/list`, {
            await fetch(`/api/menu/list`, {
                method: 'POST',
                body: JSON.stringify({ page: page - 1, limit: 5 }),
                headers: { "Content-Type": "application/json" }
            }).then(async (result) => {
                const jsonResult = await result.json()
                logger.debug('useQuery result', jsonResult)
                return jsonResult
            })
    );
    function handlePaginationChange(event: ChangeEvent<unknown>, page: number) {
        setPage(page);
        router.push(`menu/?page=${page}`, undefined, { shallow: true });
    }

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
                </Stack>
            </Stack>
        </Flex>
    );
};

export default MenuList;