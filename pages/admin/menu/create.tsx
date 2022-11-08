import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, ListItem, Stack, Textarea, UnorderedList, useColorModeValue } from '@chakra-ui/react';
import { logger } from '@core/logger';
import { checkAuthorized } from '@core/logics';
import { Props } from 'framer-motion/types/types';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { getCsrfToken } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Router, { useRouter } from 'next/router';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
// const MenuCreate: React.FC<Props> = ({ props }) => {
const MenuCreate: React.FC<Props> = (props) => {
    const router = useRouter();
    const { t } = useTranslation('menu');
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();
    async function onSubmit(values: FieldValues) {
        try {
            const body = { ...values };
            console.log(`POSTing ${JSON.stringify(body, null, 2)}`);
            const res = await fetch(`/api/menu/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            logger.debug(`res`, res);
            reset();
            // logger.debug(`router.query`, router.query.callbackUrl);
            router.push(
                `/admin/menu${router.query.callbackUrl
                    ? `?callbackUrl=${router.query.callbackUrl}`
                    : ""
                }`,
            );
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <Flex
                minH={"100vh"}
                align={"center"}
                justify={"center"}
                bg={useColorModeValue("gray.50", "gray.800")}
            >
                <Stack w={"full"} spacing={8} mx={"auto"} py={12} px={6}>
                    <Stack align={"center"}>
                        <Heading mb={6}>{t('create-heading')}</Heading>
                        <Box
                            marginTop={{ base: "1", sm: "5" }}
                            display="flex"
                            flexDirection={{ base: "column", sm: "row" }}
                            justifyContent="space-between"
                        >
                            {/* {data?.csrfToken} */}
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Box>
                                    <FormControl id="name" isRequired>
                                        <FormLabel>name</FormLabel>
                                        <Input type="text" {...register("name")} />
                                    </FormControl>
                                </Box>
                                <FormControl id="englishName" isRequired>
                                    <FormLabel>englishName</FormLabel>
                                    <Input type="text" {...register("englishName")} />
                                </FormControl>
                                <FormControl id="code" isRequired>
                                    <FormLabel>code</FormLabel>
                                    <Input type="text" {...register("code")} />
                                </FormControl>
                                <FormControl id="greetings" isRequired>
                                    <FormLabel>greetings</FormLabel>
                                    <Textarea {...register("greetings")} />
                                </FormControl>
                                <FormControl id="parentId" isRequired>
                                    <FormLabel>parentId</FormLabel>
                                    <Input type="text" {...register("parentId")} />
                                </FormControl>
                                <Stack spacing={10} pt={2}>
                                    <Button
                                        loadingText="Submitting"
                                        size="lg"
                                        type="submit"
                                        isLoading={isSubmitting}
                                        bg={"blue.400"}
                                        color={"white"}
                                        _hover={{
                                            bg: "blue.500",
                                        }}
                                    >
                                        create
                                    </Button>
                                </Stack>
                            </form>
                        </Box>
                    </Stack>
                </Stack>
            </Flex>
        </>
    )
}
export default MenuCreate;


export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const { req, res, locale, resolvedUrl } = context;
    const session = await unstable_getServerSession(
        req as NextApiRequest | (IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }),
        res as NextApiResponse<any> | ServerResponse<IncomingMessage>,
        authOptions
    )
    const translation = await serverSideTranslations(locale as string)
    // logger.debug('menu create getServerSideProps', translation)
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
            ...(translation)
        })
    }
}