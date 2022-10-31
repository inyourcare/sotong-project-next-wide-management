import { Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { MuiVariables, useStyles } from '../../pages/_app';
import { useTranslation } from 'react-i18next'
import { signInAsyncAction } from '../../core/redux/reducers/app-reducer';
import { authorizedApi, refreshTokens } from '../../core/logics/auth';
import { signIn, signOut, useSession } from "next-auth/react";

function SignInContent() {
    const { t } = useTranslation(['page'])
    // const onChangeLang = () => {
    //     i18n.changeLanguage('ko')
    // }
    const [remeberMeCheck, setRememberMeCheck] = useState(false);
    const [userId, setUserId] = useState("");
    const [userPass, setUserPass] = useState("");

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

    // const theme = useTheme();
    const classes = useStyles();
    const dispatch = useDispatch();
    // const [session, loading] = useSession();
    const session = useSession();
    // const { accessToken, refreshToken } = useSelector(
    //     (state: RootState) => state.app
    // );
    const mainText = t('page:signIn_mainText');
    const subText = t('page:signIn_subText');
    const loginBtnText = t('page:signIn_login_btnText');
    const idInputLabel = t('page:signIn_idInputLabel');
    const idInputPlaceholder = t('page:signIn_idInputPlaceholder');
    const idInputHelperText = t('page:signIn_idInputHelperText');
    const passwordInputLabel = t('page:signIn_passwordInputLabel');
    const passwordInputPlaceholder = t('page:signIn_passwordInputPlaceholder');
    const passwordInputHelperText = t('page:signIn_passwordInputHelperText');
    const rememberMeText = t('page:signIn_rememberMeText');
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

                                <Button
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
                                </Button>
                                {(session.status === 'unauthenticated' || session.status === 'loading') && <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { signIn() }}
                                    disabled={session.status === 'loading'}
                                    className={`${classes.signIn_Btn} ${classes.width100P}`}
                                >
                                    {"next auth 로그인"}
                                </Button>}
                                {session.status === 'authenticated' && <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { signOut() }}
                                    className={`${classes.signIn_Btn} ${classes.width100P}`}
                                >
                                    {"next auth 로그아웃"}
                                </Button>}
                            </form>
                        </div>
                    </div>
                </Container>

            </Grid>
        </Grid>
    </>)
}
export default function SignIn() {
    return <SignInContent />;
}