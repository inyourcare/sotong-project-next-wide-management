import { IncomingMessage, ServerResponse } from "http";
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

function BoardMaintanance({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // const { t } = useTranslation('signin');
    // return (
    //     // <div>커스텀 로그인{data.providers?.google.name}</div>
    //     (<>
    //             <SignIn providers={data.providers} t={t} csrfToken={data.csrfToken}></SignIn>
    //     </>)
    // )
}

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const { req, res, locale } = context;
    return {props:{data:{}}}
    // const session = await unstable_getServerSession(
    //     req as NextApiRequest | (IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }),
    //     res as NextApiResponse<any> | ServerResponse<IncomingMessage>,
    //     authOptions
    // )
    // if (session) {
    //     console.info('이미 로그인 되어 있습니다.')
    //     return {
    //         redirect: {
    //             destination: '/',
    //             permanent: false,
    //         },
    //     }
    // }
    // return {
    //     props: {
    //         data: { providers: await getProviders(), csrfToken: await getCsrfToken(context),},
    //         ...(await serverSideTranslations(locale as string))
    //     },
    // };
}
export default BoardMaintanance;