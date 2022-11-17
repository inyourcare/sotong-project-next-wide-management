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
import { Box, BoxProps, Container, CssBaseline, Grid, Typography } from '@mui/material';
import Header from './Header';
import { createTheme } from '@mui/system';
import Footer from './Footer';
import ParosLogoGnb from 'public/paros/logo-gnb.svg';
import ParosBtnGnbLogin from 'public/paros/btn-gnb-login.svg';
import ParosBtnGnbJoin from 'public/paros/btn-gnb-join.svg';
import ParosBtnGnbTrip from 'public/paros/btn-gnb-trip.svg';
import ParosBtnGnbCenter from 'public/paros/btn-gnb-center.svg';
import ParosBtnGnbMenu from 'public/paros/btn-gnb-menu.svg';
import ParosBtnGnbDrop from 'public/paros/btn-gnb-drop.svg';
import { SearchBar } from '@components/common/SearchBar';
import React, { Fragment, useState } from 'react';
import { BiListCheck, BiSearchAlt2 } from "react-icons/bi";
import Image from 'next/image'
import Carousel from '@components/common/Carousel';
import TestCarousel from '@components/common/carousel/TestCarousel';
import TestRRCarousel from '@components/common/carousel/TestRRCarousel';
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
function Item(props: BoxProps) {
    const { sx, ...other } = props;
    return (
        <Box
            sx={{
                p: 0,
                m: 0,
                // bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
                // color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
                // border: '1px solid',
                // borderColor: (theme) =>
                //     theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                // borderRadius: 2,
                // fontSize: '0.875rem',
                // fontWeight: '700',
                display: 'flex',
                justifyContent: 'center',
                alignItems: "center",
                // margin: '0',
                // padding: '0',
                ...sx,
            }}
            {...other}
        />
    );
}
export const useStyles = makeStyles((theme) => ({
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
        minHeight: '80px'
    },
    gridItem: {
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
    },
    gridSearchBar: {
        // display: { xs: 'block', md:'none' },
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
    },
    borderBottom: {
        borderBottom: '1px solid #e4e4e4'
    },
    justifyCenter: {
        justifyContent: "center",
    },
    innerListBox: {
        position: 'absolute',
        width: '100%',
        // padding: '0 -15%',
        transform: 'translateX(-15%)',
        height: '40px',
        backgroundColor: '#232323'
    }
}))


const Paros: React.FC<Props> = (props) => {
    // const palosMainStyles : PalosMainStyle = {
    //     padding: {
    //         paddingLeft: '15%',
    //         paddingRight: '15%'
    //     }
    // }
    // const { containerUniqueId } = props
    const theme = useTheme()
    const classes = useStyles();
    const initialSearchVal = ''
    const [search, setSearch] = React.useState(initialSearchVal)
    const [innerListVisible, setInnerListVisible] = useState(false)
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
                    <Box className={`${classes.paddingCommon} ${classes.borderBottom}`}>
                        <Grid container className={`${classes.gridContainer}`}>
                            {/* logo */}
                            <Grid className={`${classes.gridItem}`} item xl={3} lg={4.5} md={4.5} sm={4.5}>
                                <ParosLogoGnb width="200px" height="40px" />
                            </Grid>
                            {/* search */}
                            <Grid className={`${classes.gridItem}`}
                                item xl={5} lg={7} md={7} sm={7}
                            >
                                <Box
                                    className={`${classes.gridSearchBar}`}
                                    display={{ xs: "none", lg: "block" }}>
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
                                </Box>
                            </Grid>
                            <Grid item height='50px' xs={0.5} display={{ xs: "none", sm: 'block', xl: "none" }}>
                                <ParosBtnGnbMenu with="50px" height='50px' object-fit='contain' />
                            </Grid>
                            {/* buttons */}
                            <Grid className={`${classes.gridItem} ${classes.justifyCenter}`} item xl={4} xs={12}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        p: 1,
                                        m: 1,
                                        // bgcolor: 'background.paper',
                                        // borderRadius: 1,
                                        minWidth: '380px'
                                    }}
                                >
                                    <Item style={{ minWidth: '120px' }}>
                                        <ParosBtnGnbLogin with="15px" />
                                        <span style={{ minWidth: '80px', textAlign: 'center', }}>로그인</span>
                                    </Item>
                                    <Item>
                                        <span>|</span>
                                    </Item>
                                    <Item style={{ minWidth: '120px' }}>
                                        <ParosBtnGnbJoin with="15px" />
                                        <span style={{ minWidth: '80px', textAlign: 'center', }}>회원가입</span>
                                    </Item>
                                    <Item>
                                        <span>|</span>
                                    </Item>
                                    <Item style={{ minWidth: '120px' }}>
                                        <ParosBtnGnbTrip with="15px" />
                                        <span style={{ minWidth: '80px', textAlign: 'center', }}>맞춤여행</span>
                                    </Item>
                                    <Item>
                                        <span>|</span>
                                    </Item>
                                    <Item style={{ minWidth: '120px' }}>
                                        <ParosBtnGnbCenter with="15px" />
                                        <span style={{ minWidth: '80px', textAlign: 'center', }}>고객센터</span>
                                    </Item>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    {/* sub nav */}
                    <Box className={`${classes.paddingCommon}`} display={{ xs: "none", xl: "block" }}>
                        <Grid container>
                            {/* <Grid item height='50px' xs={0.5} display={{ xs: "none", xl: "block" }}> */}
                            <Grid item height='50px' xs={0.5}>
                                <ParosBtnGnbMenu with="50px" height='50px' object-fit='contain' />
                            </Grid>
                            <Grid item xs={9.5} height='50px'
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: "center",
                                }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: "center",
                                        // p: 0.5,
                                        // m: 0.5,
                                        // bgcolor: 'background.paper',
                                        // borderRadius: 1,
                                        minWidth: '380px',
                                        // margin: '0',
                                        // padding: '0',
                                    }}
                                >
                                    <Item style={{ minWidth: '120px' }}>
                                        <span style={{ minWidth: '80px', textAlign: 'center', }} onClick={() => setInnerListVisible(!innerListVisible)}>
                                            지역별여행
                                            <ParosBtnGnbDrop width='10px' height='10px' />
                                        </span>
                                    </Item>
                                    <Item style={{ minWidth: '120px' }}>
                                        <span style={{ minWidth: '80px', textAlign: 'center', }}>
                                            테마여행
                                            <ParosBtnGnbDrop width='10px' height='10px' />
                                        </span>
                                    </Item>
                                    <Item style={{ minWidth: '120px' }}>
                                        <span style={{ minWidth: '80px', textAlign: 'center', }}>
                                            기차여행
                                            <ParosBtnGnbDrop width='10px' height='10px' />
                                        </span>
                                    </Item>
                                    <Item style={{ minWidth: '120px' }}>
                                        <span style={{ minWidth: '80px', textAlign: 'center', }}>맞춤여행컨설팅</span>
                                    </Item>
                                    <Item style={{ minWidth: '120px' }}>
                                        <span style={{ minWidth: '80px', textAlign: 'center', }}>현지투어·패스</span>
                                    </Item>
                                    <Item style={{ minWidth: '120px' }}>
                                        <span style={{ minWidth: '80px', textAlign: 'center', }}>추천호텔</span>
                                    </Item>
                                    <Item style={{ minWidth: '120px' }}>
                                        <span style={{ minWidth: '80px', textAlign: 'center', }}>기획전·프로모션</span>
                                    </Item>
                                    <Item style={{ minWidth: '120px' }}>
                                        <span style={{ minWidth: '80px', textAlign: 'center', }}>
                                            여헹정보
                                            <ParosBtnGnbDrop width='10px' height='10px' />
                                        </span>
                                    </Item>
                                </Box>
                            </Grid>
                            {/* <Grid item height='50px' xs={2} display={{ xs: "none", xl: "block" }}> */}
                            <Grid item height='50px' xs={2}>
                                <img src="/paros/img-gnb-banner.png"
                                    srcSet="/paros/img-gnb-banner@2x.png 2x,/paros/img-gnb-banner@3x.png 3x"
                                    width={'220px'}
                                    height='50px'
                                    object-fit='contain'
                                />
                            </Grid>
                        </Grid>
                        {/* inner list */}
                        <Box
                            className={`${classes.paddingCommon} ${classes.innerListBox}`}
                            // className={`${classes.innerListBox}`}
                            display={innerListVisible === true ? 'block' : 'none'}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'left',
                                    alignItems: "center",
                                    minWidth: '380px',
                                    height: '40px',

                                    fontFamily: ' NotoSansCJKKR',
                                    fontSize: '12px',
                                    fontWeight: 'normal',
                                    fontStretch: 'normal',
                                    fontStyle: 'normal',
                                    lineHeight: 'normal',
                                    letterSpacing: ' -0.48px',
                                    // textAlign: 'center',
                                    color: '#888',
                                }}
                            >
                                <Item style={{ minWidth: '120px' }}>
                                    <span style={{ minWidth: '80px', textAlign: 'center', }}>캐나다서부</span>
                                </Item>
                                <Item style={{ minWidth: '120px' }}>
                                    <span style={{ minWidth: '80px', textAlign: 'center', }}>토론토·나이아가라</span>
                                </Item>
                                <Item style={{ minWidth: '120px' }}>
                                    <span style={{ minWidth: '80px', textAlign: 'center', }}>캐나다극지방</span>
                                </Item>
                                <Item style={{ minWidth: '120px' }}>
                                    <span style={{ minWidth: '80px', textAlign: 'center', }}>대서양지역</span>
                                </Item>
                            </Box>
                        </Box>
                    </Box>
                    {/* banners */}
                    <Box>
                        {/* <Box>main banner</Box> */}
                        <Carousel>
                            {/* <Carousel containerUniqueId={containerUniqueId}> */}
                            <img src="/paros/test1.png"
                                width={'1060px'}
                                height='500px'
                                object-fit='contain'
                            />
                            <img src="/paros/test2.jpg"
                                width={'1060px'}
                                height='500px'
                                object-fit='contain'
                            />
                            <img src="/paros/test3.jpg"
                                width={'1060px'}
                                height='500px'
                                object-fit='contain'
                            />
                            <img src="/paros/test4.jpg"
                                width={'1060px'}
                                height='500px'
                                object-fit='contain'
                            />
                            <img src="/paros/test5.jpeg"
                                width={'1060px'}
                                height='500px'
                                object-fit='contain'
                            />
                            {/* <img src="/paros/test5.jpeg"
                                width={'1060px'}
                                height='500px'
                                object-fit='contain'
                            /> */}
                        </Carousel>
                    </Box>
                    <Box>
                        <TestRRCarousel/>
                    </Box>
                    {/* recommendations */}
                    <Box>recommendations</Box>
                    {/* canada train trip */}
                    <Box>canada train trip</Box>
                    {/* theme traveling */}
                    <Box>them traveling</Box>
                    {/* bottom banner */}
                    <Box>bottom banner</Box>
                    {/* bottom banners */}
                    <Box>bottom banners</Box>
                    {/* footer */}
                    <Box>
                        <Footer
                            title="Sotong Five"
                            description="Something here to give the footer a purpose!"
                        />
                    </Box>
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
            data: {
                csrfToken: await getCsrfToken(context),
                // containerUniqueId: `carousel_container_${(Math.random() + 1).toString(36).substring(7)}` 
            },
            ...(await serverSideTranslations(locale as string))
        },
    };
}
export default Paros;