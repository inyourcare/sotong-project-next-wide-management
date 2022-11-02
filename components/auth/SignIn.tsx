import { Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { MuiVariables, useStyles } from '../../pages/_app';
import { useTranslation } from 'react-i18next'
import { signInAsyncAction } from '../../core/redux/reducers/app-reducer';
import { authorizedApi, refreshTokens } from '../../core/logics/auth';
import { signIn, signOut, useSession } from "next-auth/react";
import { LiteralUnion, ClientSafeProvider } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { GetStaticProps } from 'next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { AppProps } from 'next/app';
import { TFunction } from 'i18next';
import Link from 'next/link';
import NewWindow from 'react-new-window'

export type SignInData = {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null,
    t: TFunction<"signin", undefined>
}
function SignInContent({ providers, t }: SignInData) {
    // const { t } = useTranslation(['page'])
    // const onChangeLang = () => {
    //     i18n.changeLanguage('ko')
    // }
    const [remeberMeCheck, setRememberMeCheck] = useState(false);
    const [userId, setUserId] = useState("");
    const [userPass, setUserPass] = useState("");
    const [signInPopup, setSignInPopup] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState('')

    function checkboxOnChange(
        event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) {
        setRememberMeCheck(checked);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, valueSetter: Function, validationFunc?: Function) => {
        const value = e.target.value;
        if (validationFunc && validationFunc(value)) {
            valueSetter(value);
        } else {
            valueSetter(value);
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>, functionCall: Function) => {
        e.preventDefault();
        e.currentTarget.setAttribute('disabled', '')
        functionCall();
        e.currentTarget.removeAttribute('disabled')
    };

    // sign in popup window
    const width = 500;
    const height = 500;
    // const windowFeatures = "left=100,top=100,width=1000,height=800,popup=1,toolbar=no,resizable=yes,noopener,location=no"
    // const windowFeatures = "width=" + width + ",height=" + height + ",popup=1,toolbar=no,resizable=yes,noopener"
    const windowFeatures = "width=" + width + ",height=" + height + ",popup=1,toolbar=no,resizable=yes"
    const signInPopUpEffect = useEffect(() => {
        // console.log('signInPopUpEffect')
        // console.log(signInPopup)
        if (signInPopup) {
            // console.log(window.screen.width, window.screen.height, window.screen.availWidth, window.screen.availHeight, window.screenX, window.screenY)
            // const left = (window.screen.availWidth / 2) - (width / 2) + window.screenX;
            // const top = (window.screen.availHeight / 2) - (height / 2) + window.screenY;
            const left = window.screenX + (window.screen.availWidth / 2) - (width / 2)
            const top = window.screenY + (window.screen.availHeight / 2) - (height / 2)
            // window.open("https://www.mozilla.org/", "mozillaWindow", "popup");
            // window.open('/auth/signinpopup?prividerId' + selectedProvider, "mozillaWindow", "popup");
            const win = window.open('/auth/signinpopup?prividerId=' + selectedProvider, "targetWindow", windowFeatures + ",left=" + left + ",top=" + top);
            // win?.moveTo(left, top)
            win?.addEventListener("unload", (event) => {
                // console.log("I am the 3rd one.");
                // alert('unload')
                // setSignInPopup(false)
            });
            win?.addEventListener("beforeunload", (event) => {
                // console.log("I am the 1st one.");
                // alert('beforeunload')
                // setSignInPopup(false)
            });
            // alert(win?.location.href);
            // console.log(win,win?.location.href)
            var timer = setInterval(function () {
                if (!win || win.closed) {
                    clearInterval(timer);
                    // alert('closed');
                    setSignInPopup(false)
                }
            }, 1000);
        }
    }, [signInPopup, selectedProvider])

    // const theme = useTheme();
    const classes = useStyles();
    const dispatch = useDispatch();
    // const [session, loading] = useSession();
    const session = useSession();
    const mainText = t('signIn_mainText');
    const subText = t('signIn_subText');
    const loginBtnText = t('signIn_login_btnText');
    const idInputLabel = t('signIn_idInputLabel');
    const idInputPlaceholder = t('signIn_idInputPlaceholder');
    const idInputHelperText = t('signIn_idInputHelperText');
    const passwordInputLabel = t('signIn_passwordInputLabel');
    const passwordInputPlaceholder = t('signIn_passwordInputPlaceholder');
    const passwordInputHelperText = t('signIn_passwordInputHelperText');
    const rememberMeText = t('signIn_rememberMeText');
    const isUserSessionEmpty = (session.status === 'unauthenticated' || session.status === 'loading')
    return (<>
        <Grid container component="main" className={`${classes.height100vh}`}>
            <Grid item xs={false} sm={4} md={7} className={`${classes.signIn_sideImage}`} />
            <Grid item xs={12} sm={8} md={5} className={`${classes.alignCenterBasic}`}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={`${classes.alignCenterBasic}`}>
                        <Typography
                            component="h1"
                            variant="h6"
                            className={`${classes.alignCenterBasic}`}
                        >
                            {mainText}
                        </Typography>


                        <Typography
                            component="h3"
                            variant="caption"
                            className={`${classes.alignCenterBasic}`}
                        >
                            {subText}
                        </Typography>
                        <div className={`${classes.marginTop3} ${classes.width100P} ${classes.alignCenterBasic}`}>
                            {/* <form onSubmit={(e) => onSubmit(e, () => { dispatch({ type: SIGN_IN_ACTION, payload: { userId, password:userPass } }); setUserId(''); setUserPass(''); })}> */}
                            <form onSubmit={(e) => onSubmit(e, () => { dispatch(signInAsyncAction.request({ userId, password: userPass })); setUserId(''); setUserPass(''); })}>
                                <TextField
                                    autoFocus
                                    required

                                    label={idInputLabel}
                                    helperText={idInputHelperText}
                                    variant={MuiVariables.TextField.variant.outlined}
                                    placeholder={idInputPlaceholder}
                                    onChange={(e) => onChange(e, setUserId)}
                                    className={`${classes.width100P}`}
                                    // error={!(chatlinkValid && !getChatlinkState.error)}
                                    value={userId}
                                />
                                <TextField
                                    autoFocus
                                    required
                                    label={passwordInputLabel}
                                    helperText={passwordInputHelperText}
                                    variant={MuiVariables.TextField.variant.outlined}
                                    placeholder={passwordInputPlaceholder}
                                    onChange={(e) => onChange(e, setUserPass)}
                                    className={`${classes.width100P}`}
                                    // error={!(chatlinkValid && !getChatlinkState.error)}
                                    value={userPass}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={remeberMeCheck}
                                            id="remember-me-checkbox"
                                            value="remember"
                                            color="primary"
                                            onChange={(e, checked) => checkboxOnChange(e, checked)}
                                        />
                                    }
                                    label={rememberMeText}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    // onClick={() => { alert(t('page:test')) }}
                                    className={`${classes.signIn_Btn} ${classes.width100P}`}
                                >
                                    {loginBtnText}
                                </Button>

                                {/* <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { authorizedApi("rest/test/post") }}
                                    className={`${classes.signIn_Btn} ${classes.width100P}`}
                                >
                                    {"테스트 Post"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { refreshTokens() }}
                                    className={`${classes.signIn_Btn} ${classes.width100P}`}
                                >
                                    {"테스트 refreshToken"}
                                </Button> */}
                                {/* {(session.status === 'unauthenticated' || session.status === 'loading') && <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { signIn() }}
                                    disabled={session.status === 'loading'}
                                    className={`${classes.signIn_Btn} ${classes.width100P}`}
                                >
                                    {"next auth 로그인"}
                                </Button>} */}
                                {/* {(session.status === 'unauthenticated' || session.status === 'loading') && providers */}
                                {providers
                                    && (
                                        Object.keys(providers).map(k => {
                                            const provider = providers[k];
                                            return (<div key={provider.name}>
                                                <Button
                                                    type="button"
                                                    variant="contained"
                                                    color="primary"
                                                    // onClick={() => signIn(provider.id)}
                                                    onClick={() => { setSignInPopup(true); setSelectedProvider(provider.id) }}
                                                    className={`${classes.signIn_Btn} ${classes.width100P}`}
                                                    disabled={signInPopup}
                                                >
                                                    {provider.name}로 로그인 하기
                                                </Button>
                                            </div>)
                                        })
                                    )}
                                {session.status === 'authenticated' && <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { signOut() }}
                                    className={`${classes.signIn_Btn} ${classes.width100P}`}
                                >
                                    {"next auth 로그아웃"}
                                </Button>}
                                {/* {signInPopup && isUserSessionEmpty && ( */}
                                {/* {signInPopup && (
                                    // <NewWindow url={'/auth/signinpopup?prividerId' + selectedProvider} onUnload={() => setSignInPopup(false)} />
                                    // <NewWindow onUnload={() => setSignInPopup(false)}>
                                    // <NewWindow onUnload={()=>{alert('test')}} onBlock={()=>alert('block')} onOpen={()=>alert('open')}>
                                    //     <h1>Hi 👋</h1>
                                    // </NewWindow>
                                    // <SignInPopup providerId={selectedProvider} unloadCallback={() => setSignInPopup(false)} />
                                )} */}
                            </form>
                        </div>
                    </div>
                </Container>

            </Grid>
        </Grid>
    </>)
}
export default function SignIn(props: SignInData) {
    return <SignInContent providers={props.providers} t={props.t} />;
}