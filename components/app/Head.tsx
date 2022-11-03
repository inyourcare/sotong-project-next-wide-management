import { useStyles } from '@core/styles/mui';
import { Button } from '@material-ui/core';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head'

function AppHead() {
    const session = useSession();
    const classes = useStyles();
    return (
        <div>
            {session.status === 'authenticated' && <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={() => { signOut() }}
                className={`${classes.signIn_Btn} ${classes.width100P}`}
            >
                {"next auth 로그아웃"}
            </Button>}
        </div>
    )
}

export default AppHead