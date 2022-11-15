import { checkAuthorized } from '@core/logics';
import { Props } from 'framer-motion/types/types';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { getCsrfToken } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '@styles/Paros.module.css'
import { makeStyles, ThemeProvider, useTheme } from '@mui/styles';
import { Box, Container, CssBaseline, Grid, Typography } from '@mui/material';
import Header from './Header';
import { createTheme } from '@mui/system';
import Footer from './Footer';
import ParosLogoGnb from 'public/paros/logo-gnb.svg';
import ParosBtnGnbLogin from 'public/paros/btn-gnb-login.svg';
import ParosBtnGnbJoin from 'public/paros/btn-gnb-join.svg';
import ParosBtnGnbTrip from 'public/paros/btn-gnb-trip.svg';
import ParosBtnGnbCenter from 'public/paros/btn-gnb-center.svg';
import { SearchBar } from '@components/common/SearchBar';
import React from 'react';
import { BiListCheck, BiSearchAlt2 } from "react-icons/bi";
// const sections = [
//     { title: 'Technology', url: '#' },
//     { title: 'Design', url: '#' },
//     { title: 'Culture', url: '#' },
//     { title: 'Business', url: '#' },
//     { title: 'Politics', url: '#' },
//     { title: 'Opinion', url: '#' },
//     { title: 'Science', url: '#' },
//     { title: 'Health', url: '#' },
//     { title: 'Style', url: '#' },
//     { title: 'Travel', url: '#' },
// ];

// export interface PalosMainStyle {
//     padding: {
//         paddingLeft: string,
//         paddingRight: string
//     }
// }
const sidePadding = '15%'
export const useStyles = makeStyles(() => ({
    // common
    paddingCommon: {
        padding: '0 15%'
    },
    // respective
    container: {
        padding: '0',
        margin: '0',
        width: '100%',

        // '&, &:before': {
        //     width: '100%',
        //     height: '25px',
        //     backgroundImage: 'linear-gradient(to right, #be1d25, #3c3b6e)',
        //     backgroundSize: '100vw',
        // }
    },
    topDescription: {
        display: "flex",
        // justifyContent: "center",
        alignItems: "center",
        // flexDirection: "column",
        // width: '100vw',

        width: '100%',
        height: '25px',
        backgroundImage: 'linear-gradient(to right, #be1d25, #3c3b6e)',
        backgroundSize: '100vw',

        // overflow: 'visible',
        // paddingLeft: '100px'

        fontFamily: ' NotoSansCJKKR',
        fontSize: '12px',
        fontWeight: '300',
        fontStretch: 'normal',
        fontStyle: 'normal',
        lineHeight: 'normal',
        letterSpacing: ' -0.48px',
        textAlign: 'left',
        color: '#fff',
    },
    fontNormal: {
        weight: 'normal'
    },
    gridContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // flexDirection: "column",
        height: '80px'
    },
    gridItem: {
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
    },
    gridSearchBar: {
        '& div': {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: '50px',
            borderRadius: '3px',
            border: 'solid 1px #e4e4e4',
            backgroundColor: '#fff',
        },
        '& form': {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        '& input': {
            width: '355px',
            height: '20px',
            margin: '0 22px 0 22px',
            fontFamily: 'NotoSansCJKKR',
            fontSize: '14px',
            fontWeight: '300',
            fontStretch: 'normal',
            fontStyle: 'normal',
            lineHeight: 'normal',
            letterSpacing: ' -0.56px',
            textAlign: 'left',
            color: '#888',
            border: 'none'
        },
        '& button': {
            background: 'transparent',
            border: 'none'
        },
        '& svg': {
            with: "24px", height: '24px',
            // margin: '0 0 0 22px',
            objectFit: 'contain'
        }
    }
}))


const Paros: React.FC<Props> = (props) => {
    // const palosMainStyles : PalosMainStyle = {
    //     padding: {
    //         paddingLeft: '15%',
    //         paddingRight: '15%'
    //     }
    // }
    const theme = useTheme()
    const classes = useStyles();
    const initialSearchVal = ''
    const [search, setSearch] = React.useState(initialSearchVal)
    return (
        <>
            <ThemeProvider theme={theme}>
                <Container className={`${classes.container}`} maxWidth={false}>
                    {/* top description */}
                    <Box className={`${classes.topDescription}`}>
                        <Box component="span" className={`${classes.paddingCommon}`}>
                            <Box component="span" className={`${classes.fontNormal}`}>헬로캐나다</Box>
                            ㅣ 미국&캐나다 전문 여행브랜드
                        </Box>
                    </Box>
                    {/* top nav */}
                    <Box className={`${classes.paddingCommon}`}>
                        <Grid container className={`${classes.gridContainer}`}>
                            {/* logo */}
                            <Grid className={`${classes.gridItem}`} item xl={3} lg={3} md={5} sm={5}>
                                <ParosLogoGnb width="200px" height="40px" />
                            </Grid>
                            {/* search */}
                            <Grid className={`${classes.gridItem} ${classes.gridSearchBar}`} item xl={5} lg={5} md={7} sm={7}>
                                <SearchBar
                                    onChange={(e) => { setSearch(e.target.value) }}
                                    // onClick={() => {
                                    //     // routePush(1, email)
                                    //     alert(search)
                                    //     setSearch(initialSearchVal)
                                    // }}
                                    onSubmit={(e) => {
                                        // routePush(1, email)
                                        e.preventDefault()
                                        alert(search)
                                        setSearch(initialSearchVal)
                                    }}
                                    placeHolder=''
                                    searchImg='ParosBtnGnbSearch'
                                />
                            </Grid>
                            {/* buttons */}
                            <Grid className={`${classes.gridItem}`} item xl={4} lg={4}>
                                <ParosBtnGnbLogin with="15px" />
                                <span style={{ minWidth: '80px' }}>로그인</span>
                                <span>|</span>
                                <ParosBtnGnbJoin with="15px" />
                                <span style={{ minWidth: '80px' }}>회원가입</span>
                                <span>|</span>
                                <ParosBtnGnbTrip with="15px" />
                                <span style={{ minWidth: '80px' }}>맞춤여행</span>
                                <span>|</span>
                                <ParosBtnGnbCenter with="15px" />
                                <span style={{ minWidth: '80px' }}>고객센터</span>
                            </Grid>
                        </Grid>
                    </Box>
                    {/* sub nav */}
                    <Box>
                        <Grid></Grid>
                        <Grid></Grid>
                        <Grid></Grid>
                    </Box>
                    {/* banners */}
                    <Box></Box>
                    {/* recommendations */}
                    <Box></Box>
                    {/* canada train trip */}
                    <Box></Box>
                    {/* theme traveling */}
                    <Box></Box>
                    {/* bottom banner */}
                    <Box></Box>
                    {/* bottom banners */}
                    <Box></Box>
                    {/* footer */}
                    <Box></Box>
                </Container>
                {/* <CssBaseline /> */}
                {/* <Container maxWidth="xl"> */}
                {/* <Container maxWidth={false} style={{padding:'0'}}>
                    <Header title="Blog" sections={sections} palosMainStyles={palosMainStyles}/>
                    <main>
                    </main>

                    <Footer
                        title="Footer"
                        description="Something here to give the footer a purpose!"
                    />
                </Container> */}
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