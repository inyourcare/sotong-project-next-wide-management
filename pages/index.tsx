import Link from "next/link";
import { useTranslation } from 'next-i18next'
// import "../core/i18n";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { signOut, useSession } from "next-auth/react";
import { Button, Flex, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { logger } from "@core/logger";
import { useEffect } from "react";
import { prisma } from "@core/prisma"
import KakaoShareBtn from "@components/common/KakaoShareBtn";
import { Box, Typography } from "@mui/material";
import { Route, routes } from "@core/reference";
import { AppProps } from "next/app";

type HomeProps = AppProps & {
  signInPath: Route | undefined
}
export default function Home(props: HomeProps) {
  // const { t } = useTranslation('common');
  const session = useSession();
  const path = routes;
  const signInPath = path.filter(({ name, link }) => name === 'SignIn').pop()
  const maintanancePath = path.filter(({ name, link }) => name === '유지보수관리').pop()
  const signUpPath = path.filter(({ name, link }) => name === 'SignUp').pop()
  // const classes = useStyles();
  // const signInPath = props.signInPath;
  useEffect(() => {
    logger.debug("session change", session, session.data?.user, session.data?.expires)
    logger.debug("props", props)
  }, [session, props])
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
          {session.status !== 'authenticated'
            // && <Link href={signInPath?.link as string}>
            && <Box>
              <Link href={signInPath?.link as string}>
                <Typography color="inherit">Login</Typography>
              </Link>
            </Box>}
          {session.status === 'authenticated'
            && (<Box>
              <Button
                onClick={() => { signOut() }}
              // className={`${classes.signIn_Btn} ${classes.width100P}`}
              >
                {"next auth 로그아웃"}
              </Button>

              <Link href={maintanancePath?.link as string}>
                <Typography color="inherit">유지보수관리</Typography>
              </Link>
              <Link href={signUpPath?.link as string}>
                <Typography color="inherit">회원가입</Typography>
              </Link>
            </Box>
            )}

          <Box>{session.data?.expires}하이루?(Role:{session.data?.user?.role}){session.data?.user?.name}</Box>
          <br />
          <KakaoShareBtn />
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
  const path = routes;
  const signInPath = path.filter(({ name, link }) => name === 'SignIn').pop()
  console.log('getStaticProps', signInPath)
  if (locale) {
    const result = await serverSideTranslations(locale, ["common"]);
    return {
      props: {
        // common 은 위 locales/ko 아래에 만든 json 파일 명이다. 다른 파일을 사용한다면 바꿔주자.
        ...(result),
        signInPath
      },
    }
  }
  console.error('locale undefind', locale)
  return {
    props: {
    }
  }
};