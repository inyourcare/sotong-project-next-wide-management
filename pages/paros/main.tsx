import { checkAuthorized } from '@core/logics';
import { Props } from 'framer-motion/types/types';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { getCsrfToken } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '@styles/Paros.module.css'
import { ThemeProvider } from '@mui/styles';
import { Container, CssBaseline } from '@mui/material';
import Header from './Header';
import { createTheme } from '@mui/system';
import Footer from './Footer';
const theme = createTheme();
const sections = [
    { title: 'Technology', url: '#' },
    { title: 'Design', url: '#' },
    { title: 'Culture', url: '#' },
    { title: 'Business', url: '#' },
    { title: 'Politics', url: '#' },
    { title: 'Opinion', url: '#' },
    { title: 'Science', url: '#' },
    { title: 'Health', url: '#' },
    { title: 'Style', url: '#' },
    { title: 'Travel', url: '#' },
];

export interface PalosMainStyle {
    padding: {
        paddingLeft: string,
        paddingRight: string
    }
}
const Paros: React.FC<Props> = (props) => {
    const palosMainStyles : PalosMainStyle = {
        padding: {
            paddingLeft: '15%',
            paddingRight: '15%'
        }
    }
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {/* <Container maxWidth="xl"> */}
                <Container maxWidth={false} style={{padding:'0'}}>
                    <Header title="Blog" sections={sections} palosMainStyles={palosMainStyles}/>
                    <main>
                    </main>

                    <Footer
                        title="Footer"
                        description="Something here to give the footer a purpose!"
                    />
                </Container>
            </ThemeProvider>
        </>
    )
}
export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const { req, res, locale, resolvedUrl } = context;
    const session = await unstable_getServerSession(
        req as NextApiRequest | (IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }),
        res as NextApiResponse<any> | ServerResponse<IncomingMessage>,
        authOptions
    )
    // redirect check
    if (session && checkAuthorized(session, resolvedUrl) === false) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: {
            data: { csrfToken: await getCsrfToken(context), },
            ...(await serverSideTranslations(locale as string))
        },
    };
}
export default Paros;