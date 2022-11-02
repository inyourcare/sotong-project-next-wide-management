import React from "react";
import type { NextApiRequest, NextApiResponse, NextPage, NextPageContext } from "next";
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProviders, signIn, getSession, LiteralUnion, ClientSafeProvider } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { options as authOptions } from "../api/auth/[...nextauth]"
// import { options as authOptions } from "./api/auth/[...nextauth]"
import { IncomingMessage, ServerResponse } from "http";
import { BuiltInProviderType } from "next-auth/providers";
import SignIn, { SignInData } from "../../components/auth/SignIn";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from 'next-i18next'
import { AppProps } from "next/app";
import Layout from "../../components/layout/default/Layout";

function AuthSignIn({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { t } = useTranslation('signin');
    return (
        // <div>커스텀 로그인{data.providers?.google.name}</div>
        (<>
                <SignIn providers={data.providers} t={t}></SignIn>
        </>)
    )
}
export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const { req, res, locale } = context;
    const session = await unstable_getServerSession(
        req as NextApiRequest | (IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }),
        res as NextApiResponse<any> | ServerResponse<IncomingMessage>,
        authOptions
    )
    if (session) {
        console.info('이미 로그인 되어 있습니다.')
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: {
            data: { providers: await getProviders(), },
            ...(await serverSideTranslations(locale as string))
        },
    };
}
export default AuthSignIn;