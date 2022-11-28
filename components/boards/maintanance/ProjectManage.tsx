import { logger } from '@core/logger';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Input, InputLabel, Paper, Stack, TextareaAutosize, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Props } from 'framer-motion/types/types';
import { useTranslation } from 'next-i18next';
import { styled } from '@mui/material/styles';
import React, { useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { getYYYYMMDDString } from '@core/time';
import { FieldValues, useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { IncomingMessage, ServerResponse } from 'http';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { checkAuthorized } from '@core/logics';
import { getCsrfToken } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { projectTableLimit } from '@core/styles/mui';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getProjects } from 'pages/boards/maintanance';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'projectName',
        headerName: 'projectName',
        width: 150,
        editable: true,
    },
    {
        field: 'projectEnglishName',
        headerName: 'projectEnglishName',
        width: 150,
        editable: true,
    },
    {
        field: 'projectStartDate',
        headerName: 'projectStartDate',
        type: 'date',
        // width: 110,
        editable: true,
    },
    {
        field: 'projectEndDate',
        headerName: 'projectEndDate',
        type: 'date',
        // width: 110,
        editable: true,
    },
    {
        field: 'projectMaintananceStartDate',
        headerName: 'projectMaintananceStartDate',
        type: 'date',
        // width: 110,
        editable: true,
    },
    {
        field: 'projectMaintananceEndDate',
        headerName: 'projectMaintananceEndDate',
        type: 'date',
        // width: 110,
        editable: true,
    },
    {
        field: 'createdAt',
        headerName: 'createdAt',
        type: 'date',
        // width: 110,
        editable: true,
    },
    {
        field: 'updatedAt',
        headerName: 'updatedAt',
        type: 'date',
        // width: 110,
        editable: true,
    },
    // {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (params: GridValueGetterParams) =>
    //         `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    // },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const ProjectManage: React.FC<Props> = ({ props }) => {
    // const { t } = useTranslation('maintanance');
    // const { data } = useQuery("projectList",()=>getProjects(1)) as any
    const projectList = useQuery("projectList",()=>getProjects(1)) as any
    const tableData = { ...projectList.data }
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();
    const router = useRouter();
    async function onSubmit(values: FieldValues) {
        try {
            const body = { ...values };
            console.log(`POSTing ${JSON.stringify(body, null, 2)}`);
            const res = await fetch(`/api/project/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            logger.debug(`res`, res);
            // todo:: 만약 네이버 등으로 먼저 로그읺해서 메일이 등록된 유저는 create 가 되지 않는다. 해결 필요
            reset();
            router.push(
                `maintanance${router.query.callbackUrl
                    ? `?callbackUrl=${router.query.callbackUrl}`
                    : ""
                }`,
            );
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>{
        logger.debug('project list -> ' , tableData)
    },[tableData])

    return (
        <>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    // rows={rows}
                    rows={tableData.projects}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <FormGroup row={true}>
                        <FormControlLabel
                            control={<TextField
                                // id="date"
                                // label="Birthday"
                                type="text"
                                // defaultValue="2017-05-24"
                                // defaultValue={}
                                {...register('projectName')}
                                sx={{ margin: 0, padding: 0 }}
                            />}
                            label="프로젝트명"
                            labelPlacement='top'
                        />
                        <FormControlLabel
                            control={<TextField
                                // id="date"
                                // label="Birthday"
                                type="text"
                                // defaultValue="2017-05-24"
                                // defaultValue={}
                                {...register('projectEnglishName')}
                                sx={{ margin: 0, padding: 0 }}
                            />}
                            label="영문프로젝트명"
                            labelPlacement='top'
                        />
                        <FormControlLabel
                            sx={{ marginLeft: '0' }}
                            control={<TextField
                                // id="date"
                                // label="Birthday"
                                type="date"
                                // defaultValue="2017-05-24"
                                defaultValue={getYYYYMMDDString(new Date())}
                                sx={{ width: 220 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register('projectStartDate')}
                            />}
                            label="개발시작일"
                            labelPlacement='top' />
                        <FormControlLabel
                            sx={{ marginLeft: '0' }}
                            control={<TextField
                                // id="date"
                                // label="Birthday"
                                type="date"
                                // defaultValue="2017-05-24"
                                defaultValue={getYYYYMMDDString(new Date())}
                                sx={{ width: 220 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register('projectEndDate')}
                            />}
                            label="개발종료일"
                            labelPlacement='top' />
                        <FormControlLabel
                            sx={{ marginLeft: '0' }}
                            control={<TextField
                                // id="date"
                                // label="Birthday"
                                type="date"
                                // defaultValue="2017-05-24"
                                defaultValue={getYYYYMMDDString(new Date())}
                                sx={{ width: 220 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register('projectMaintananceStartDate')}
                            />}
                            label="유지보수 시작일"
                            labelPlacement='top' />
                        <FormControlLabel
                            sx={{ marginLeft: '0' }}
                            control={<TextField
                                // id="date"
                                // label="Birthday"
                                type="date"
                                // defaultValue="2017-05-24"
                                defaultValue={getYYYYMMDDString(new Date())}
                                sx={{ width: 220 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                {...register('projectMaintananceEndDate')}
                            />}
                            label="유지보수 종료일"
                            labelPlacement='top' />

                        <Button
                            // disabled={!this.isValid()}
                            disableRipple
                            fullWidth
                            variant="outlined"
                            // className={classes.button}
                            type="submit"
                        // onClick={this.submitRegistration}
                        >
                            입력
                        </Button>

                    </FormGroup>
                </form>
            </Box>
        </>
    )
}
// const getProjects = async (page: any, email: any) =>
//     await fetch(`${process.env.NEXTAPI_BASE_URL}/project/list`, {
//         method: 'POST',
//         body: JSON.stringify({
//             page: page - 1,
//             limit: projectTableLimit,
//             conditions: {
//                 creator: {
//                     // email: 'admin@sotong.co.kr'
//                     // email
//                     ...(email && { email: email })
//                 }
//             }
//         }),
//         headers: { "Content-Type": "application/json" }
//     }).then((result) => result.json())
// export const getServerSideProps: GetServerSideProps<any> = async (context) => {
//     const { req, res, locale, resolvedUrl } = context;
//     const session = await unstable_getServerSession(
//         req as NextApiRequest | (IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }),
//         res as NextApiResponse<any> | ServerResponse<IncomingMessage>,
//         authOptions
//     )
//     let page = 1;
//     if (context.query.page && typeof context.query.page === 'string') {
//         page = parseInt(context.query.page);
//     }
//     const email = context.query.email;
//     const queryClient = new QueryClient();
//     await queryClient.prefetchQuery(
//         "projectList",
//         () => getProjects(page, email)
//     );
//     // redirect check
//     if (checkAuthorized(session, resolvedUrl) === false) {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false,
//             },
//         }
//     }
//     return {
//         props: {
//             data: { csrfToken: await getCsrfToken(context), },
//             // ...(await serverSideTranslations(locale as string)),
//             dehydratedState: dehydrate(queryClient),
//         },
//     };
// }

export default ProjectManage;

