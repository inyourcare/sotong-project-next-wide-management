import Link from "next/link";
import { useTranslation } from 'next-i18next'
// import "../core/i18n";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { signOut, useSession } from "next-auth/react";
import { Button, Flex, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { logger } from "@core/logger";
import { useEffect } from "react";


export default function Home({ }) {
  // const { t } = useTranslation('common');
  const session = useSession();
  // const classes = useStyles();
  useEffect(()=>{
    logger.debug("session change",session,session.data?.user,session.data?.expires)
  },[session])
  return (<>
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={8}
        mx={"auto"}
        w={{ md: "md" }}
        maxW={"lg"}
        py={12}
        px={6}
      >
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            메인페이지
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            {session.status === 'authenticated'
              && <Button
                onClick={() => { signOut() }}
              // className={`${classes.signIn_Btn} ${classes.width100P}`}
              >
                {"next auth 로그아웃"}
              </Button>}
              `{session.data?.expires}하이루?(Role:{session.data?.user?.role}){session.data?.user?.name}`<br/>
              {/* `하이루` */}
              {/* {Date.now()} */}
          </Text>
        </Stack>
      </Stack>
    </Flex>

    {/* <>{"||||"}</>
    <a href="/auth/signin">
      로그인페이지 A
    </a>
    <br /> */}
    {/* <p>{t('en_test2')}</p>
    <p>{t('en_test')}</p>
    <p>{t('test2')}</p>
    <p>{t('test.intest')}</p> */}
  </>)
}

export const getStaticProps: GetStaticProps<any> = async (context) => {
  const { locale } = context;
  if (locale) {
    const result = await serverSideTranslations(locale, ["common"]);
    return {
      props: {
        // common 은 위 locales/ko 아래에 만든 json 파일 명이다. 다른 파일을 사용한다면 바꿔주자.
        ...(result),
      },
    }
  }
  console.error('locale undefind', locale)
  return {
    props: {

    }
  }
};