import { Box, Button, CssBaseline, Grid } from "@mui/material"
import { NextApiResponse } from "next"
import { ErrorProps } from "next/error"
import Link from "next/link"

function Error({ statusCode }: { statusCode: string }) {
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Grid container>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center" alignItems={'center'}>
                            <p>
                                {statusCode
                                    ? `An error ${statusCode} occurred on server`
                                    : 'An error occurred on client'}
                            </p>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center" alignItems={'center'}>
                            <Link color={"blue.400"} href="/">
                                Home
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

Error.getInitialProps = ({ res, err }: { res: NextApiResponse, err: ErrorProps }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error
