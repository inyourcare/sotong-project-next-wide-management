import Link from "next/link";
import { useTranslation } from 'next-i18next'
// import "../core/i18n";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { signOut, useSession } from "next-auth/react";
import { Button } from "@mui/material";
import Layout from "../components/layout/default/Layout";


export default function Home({ }) {
  // const { t } = useTranslation('common');
  const session = useSession();
  // const classes = useStyles();
  return (<>
    <Layout
      // type your page title and page description.
      title="Template - Next.js and Material-UI with Header and Footer"
      description="This is a Template using Next.js and Material-UI with Header and Footer."
    >
      메인페이지
      <br />
      <Link href="/auth/signin" passHref>
        로그인페이지
      </Link>
      <br />
      {session.status === 'authenticated' && <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={() => { signOut() }}
      // className={`${classes.signIn_Btn} ${classes.width100P}`}
      >
        {"next auth 로그아웃"}
      </Button>}
      {/* <>{"||||"}</>
    <a href="/auth/signin">
      로그인페이지 A
    </a>
    <br /> */}
      {/* <p>{t('en_test2')}</p>
    <p>{t('en_test')}</p>
    <p>{t('test2')}</p>
    <p>{t('test.intest')}</p> */}
    </Layout>
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