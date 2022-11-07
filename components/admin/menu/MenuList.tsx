import { Box, Flex, Heading, ListItem, Stack, UnorderedList } from "@chakra-ui/react";
import { logger } from "@core/logger";
import { TMenu } from "@core/types/TMenu";
import { Props } from "framer-motion/types/types";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import MenuDetail from "./MenuDetail";

type MenuProps = Props & {
    data: {
        csrfToken: string,
        menus: Array<TMenu>
    }
}
const MenuList: React.FC<MenuProps> = ({props,data}) => {
    const { t } = useTranslation('menu');

    return (
        <Flex minH={"100vh"} w={"full"} align={"center"} justify={"center"}>
            <Stack w={"full"} spacing={8} mx={"auto"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading mb={6}>{t('heading')}</Heading>
                    <Box
                        marginTop={{ base: "1", sm: "5" }}
                        display="flex"
                        flexDirection={{ base: "column", sm: "row" }}
                        justifyContent="space-between"
                    >{props?.data?.csrfToken}
                        <UnorderedList size="lg">
                            {data?.menus.map((menu) => (
                                <ListItem key={String(menu.id)}>
                                    <MenuDetail menu={menu} />
                                </ListItem>
                            ))}
                            
                        </UnorderedList>
                    </Box>
                </Stack>
            </Stack>
        </Flex>
    );
};

export default MenuList;