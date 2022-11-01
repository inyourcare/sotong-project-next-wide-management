import Link from "next/link";
import { useTranslation } from 'next-i18next'
// import "../core/i18n";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps, InferGetStaticPropsType } from 'next';


export default function Home({ }) {
  // const { t } = useTranslation('common');
  return (<>
    메인페이지
    <br />
    <Link href="/auth/signin">
      로그인페이지
    </Link>
    <br />
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