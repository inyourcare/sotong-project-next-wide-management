import React, { useState } from 'react';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Button, useTheme } from '@material-ui/core';
import { useRouter } from 'next/router';
import { routes } from '@core/reference';
import {
    Grid,
    AppBar,
    Toolbar,
    Typography,
    List,
    ListItem,
    ListItemText,
    SwipeableDrawer,
    IconButton,
    // } from "@material-ui/core";
} from "@mui/material";
import Link from 'next/link';

import MenuIcon from "@material-ui/icons/Menu";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { signOut, useSession } from 'next-auth/react';
import { useStyles } from '@core/styles/mui';

function ElevationScroll(props: any) {
    const { children } = props;

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

export default function Header() {
    const [openDrawer, setOpenDrawer] = useState(false);
    const session = useSession();

    const theme = useTheme();
    /**
        xs, extra-small: 0px
        sm, small: 600px
        md, medium: 900px
        lg, large: 1200px
        xl, extra-large: 1536px
     */
    const matches = useMediaQuery(theme.breakpoints.down("sm"));
    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const router = useRouter();
    const path = routes;
    const classes = useStyles();

    const tabs = (
        <>
            <Grid container justifyContent="flex-end" spacing={4}>
                {path.map(({ name, link }) => (
                    <Grid item key={link}>
                        <Link href={link}>
                            <Typography
                            // className={classes.link}
                            // style={{
                            //   fontWeight: router.pathname === link && "bold",
                            //   borderBottom: router.pathname === link && "1px solid #757ce8",
                            // }}
                            >
                                {name}
                            </Typography>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </>
    );
    const drawer = (
        <>
            <SwipeableDrawer
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                onOpen={() => setOpenDrawer(true)}
                // classes={{ paper: classes.drawer }}
                anchor="right"
            >
                {/* <div className={classes.toolbarMargin} /> */}
                <div />
                <List disablePadding>
                    {path.map(({ name, link }) => (
                        <ListItem
                            key={link}
                            divider
                            button
                            onClick={() => {
                                setOpenDrawer(false);
                            }}
                        >
                            <ListItemText disableTypography>
                                <Link href={link}>
                                    <Typography
                                        style={{
                                            color:
                                                router.pathname === link
                                                    ? "primary"
                                                    : "rgb(107 107 107)",
                                            // fontWeight: router.pathname === link && "bold",
                                        }}
                                    >
                                        {name}
                                    </Typography>
                                </Link>
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </SwipeableDrawer>
            <IconButton
                onClick={() => setOpenDrawer(!openDrawer)}
                disableRipple
            // className={classes.drawerIconContainer}
            >
                {/* <MenuIcon className={classes.drawerIcon} /> */}
                <MenuIcon />
            </IconButton>
        </>
    );

    return (<>
        {/* <ElevationScroll> */}
        {/* <AppBar className={classes.appBar}> */}
        {/* <AppBar style={{}}> */}
        {/* <AppBar style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}> */}
        {/* <header className={`${classes.header}`}> */}
        <AppBar className={`${classes.header}`}>
            <Toolbar
                disableGutters
                style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    width: "100%",
                    padding: matches ? "0 16px" : "24px",
                }}
            >
                <Link href="/">
                    {/* <Typography className={classes.logo}>Material-UI</Typography> */}
                    <Typography>Material-UI</Typography>
                </Link>
                {session.status === 'authenticated'
                    &&
                    <Link
                        href="/"
                        type="button"
                        // variant="contained"
                        color="primary"
                        onClick={() => { signOut() }}
                    // className={`${classes.signIn_Btn} ${classes.width100P}`}
                    >
                        {"next auth 로그아웃"}
                    </Link>}
                {matches ? drawer : tabs}
            </Toolbar>
        </AppBar>
        {/* </header> */}
        {/* </ElevationScroll> */}

        {/* <div className={classes.toolbarMargin} /> */}

    </>)
}