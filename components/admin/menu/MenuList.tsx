import { Box, Flex, Heading, List, ListItem, Stack, Text, UnorderedList } from "@chakra-ui/react";
import { logger } from "@core/logger";
import { TMenu } from "@core/types/TMenu";
import { Props } from "framer-motion/types/types";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

type MenuProps = Props & {
    data: {
        csrfToken: string,
        menus: Array<TMenu>
    }
}
const MenuList: React.FC<MenuProps> = ({ props, data }) => {
    const { t } = useTranslation('menu');

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
                        <List size="lg" w={"100%"}>
                            {data?.menus.map((menu) => (
                                <ListItem key={String(menu.id)}>
                                    <Text fontSize="sm">({menu.menuType})({menu.id}){menu.name}({menu.code})(순서:{menu.order})(Created By {menu.creator?.email})(Modified By {menu.modifier?.email})</Text>
                                    <ReactMarkdown children={menu.greetings} />
                                </ListItem>
                            ))}

                        </List>
                    </Box>

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