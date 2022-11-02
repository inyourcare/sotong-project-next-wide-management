import React from 'react';
import { Container, Grid, Typography } from "@material-ui/core";
import { routes } from './data/routes';
import Link from 'next/link';
import { socialMedia } from './data/socialMedia';
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import GitHubIcon from "@material-ui/icons/GitHub";
import HomeIcon from "@material-ui/icons/Home";
import { useStyles } from '../../../pages/_app';

export default function Footer() {
    const path = routes;
    const { instagram, facebook, github, homepage } = socialMedia;
    const classes = useStyles();
    return (<>

        {/* <footer className={classes.footer}> */}
        <footer className={`${classes.footer}`}>
            <Container maxWidth="lg">
                <Grid container spacing={3} justifyContent="center">
                    {path.map(({ name, link }) => (
                        <Grid item key={link}>
                            <Link href={link}>
                                <Typography
                                // className={classes.link}
                                // style={{
                                //     fontWeight: router.pathname === link && "bold",
                                //     borderBottom:
                                //         router.pathname === link && "1px solid #757ce8",
                                // }}
                                >
                                    {name}
                                </Typography>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
                <Grid container direction="column" style={{ margin: "1.2em 0" }}>
                    <Grid item container spacing={2} justifyContent="center">
                        <Grid
                            item
                            component={"a"}
                            target="_blank"
                            rel="noreferrer noopener"
                            href={homepage}
                        >
                            <HomeIcon
                                // className={classes.snsIcon}
                                // color={color ? "primary" : "secondary"}
                            />
                        </Grid>
                        <Grid
                            item
                            component={"a"}
                            target="_blank"
                            rel="noreferrer noopener"
                            href={facebook}
                        >
                            <FacebookIcon
                                // className={classes.snsIcon}
                                // color={color ? "primary" : "secondary"}
                            />
                        </Grid>
                        <Grid
                            item
                            component={"a"}
                            target="_blank"
                            rel="noreferrer noopener"
                            href={instagram}
                        >
                            <InstagramIcon
                                // className={classes.snsIcon}
                                // color={color ? "primary" : "secondary"}
                            />
                        </Grid>
                        <Grid
                            item
                            component={"a"}
                            target="_blank"
                            rel="noreferrer noopener"
                            href={github}
                        >
                            <GitHubIcon
                                // className={classes.snsIcon}
                                // color={color ? "primary" : "secondary"}
                            />
                        </Grid>
                        {/* add social media*/}
                    </Grid>
                </Grid>
                <Grid
                    item
                    container
                    component={"a"}
                    target="_blank"
                    rel="noreferrer noopener"
                    href="https://satoruakiyama.com"
                    justifyContent="center"
                    style={{
                        textDecoration: "none",
                    }}
                >
                    {/* <Typography className={classes.copylight}> */}
                    <Typography>
                        &copy;Satoru Akiyama
                    </Typography>
                </Grid>
            </Container>
        </footer>
    </>)
}