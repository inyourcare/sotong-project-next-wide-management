import { logger } from '@core/logger';
import { Alert, AlertProps, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Input, InputLabel, Paper, Snackbar, Stack, TextareaAutosize, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridValueGetterParams } from '@mui/x-data-grid';
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
import { TProject } from '@core/types/TProject';

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 90
        // flex: 1,
    },
    {
        field: 'projectName',
        headerName: 'projectName',
        // width: 150,
        editable: true,
        // resizable: true
        flex: 1,
    },
    {
        field: 'projectEnglishName',
        headerName: 'projectEnglishName',
        // width: 150,
        editable: true,
        flex: 1,
    },
    {
        field: 'projectStartDate',
        headerName: 'projectStartDate',
        type: 'date',
        // width: 110,
        editable: true,
        flex: 1,
    },
    {
        field: 'projectEndDate',
        headerName: 'projectEndDate',
        type: 'date',
        // width: 110,
        editable: true,
        flex: 1,
    },
    {
        field: 'projectMaintananceStartDate',
        headerName: 'projectMaintananceStartDate',
        type: 'date',
        // width: 110,
        editable: true,
        flex: 1,
    },
    {
        field: 'projectMaintananceEndDate',
        headerName: 'projectMaintananceEndDate',
        type: 'date',
        // width: 110,
        editable: true,
        flex: 1,
    },
    {
        field: 'createdAt',
        headerName: 'createdAt',
        type: 'date',
        // width: 110,
        // editable: true,
        flex: 1,
    },
    {
        field: 'updatedAt',
        headerName: 'updatedAt',
        type: 'date',
        // width: 110,
        // editable: true,
        flex: 1,
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
function computeMutation(newRow: GridRowModel, oldRow: GridRowModel) {
    if (newRow.projectName !== oldRow.projectName) {
        return `projectName from '${oldRow.projectName}' to '${newRow.projectName}'`;
    }
    if (newRow.projectEnglishName !== oldRow.projectEnglishName) {
        return `projectName from '${oldRow.projectEnglishName}' to '${newRow.projectEnglishName}'`;
    }
    if (newRow.projectStartDate !== oldRow.projectStartDate) {
        return `projectName from '${oldRow.projectStartDate}' to '${newRow.projectStartDate}'`;
    }
    if (newRow.projectEndDate !== oldRow.projectEndDate) {
        return `projectName from '${oldRow.projectEndDate}' to '${newRow.projectEndDate}'`;
    }
    if (newRow.projectMaintananceStartDate !== oldRow.projectMaintananceStartDate) {
        return `projectName from '${oldRow.projectMaintananceStartDate}' to '${newRow.projectMaintananceStartDate}'`;
    }
    if (newRow.projectMaintananceEndDate !== oldRow.projectMaintananceEndDate) {
        return `projectName from '${oldRow.projectMaintananceEndDate}' to '${newRow.projectMaintananceEndDate}'`;
    }
    return null;
}

const ProjectManage: React.FC<Props> = ({ props }) => {
    // const { t } = useTranslation('maintanance');
    // const { data } = useQuery("projectList",()=>getProjects(1)) as any
    const projectList = useQuery("projectList", () => getProjects(1)) as any
    const porjectTableData = { ...projectList.data }
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
    useEffect(() => {
        logger.debug('project list -> ', porjectTableData)
    }, [porjectTableData])



    //////////// mui example

    const [promiseArguments, setPromiseArguments] = React.useState<any>(null);
    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);
    const noButtonRef = React.useRef<HTMLButtonElement>(null);

    const mutateRow = React.useCallback(
        // (user: Partial<User>) =>
        //     new Promise<Partial<User>>((resolve, reject) =>
        //         setTimeout(() => {
        //             if (user.name?.trim() === '') {
        //                 reject();
        //             } else {
        //                 resolve(user);
        //             }
        //         }, 200),
        //     ),
        // [],
        async (project: Partial<TProject>) => {
            const res = await fetch(`/api/project/${project.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...project }),
            })
                .then(result => result.json())
                .catch((error) => {
                    console.error(`${project.id} 수정 중 에러 :: ${error}`);
                })
            return res
        }
        , []
    );

    const processRowUpdate = React.useCallback(
        (newRow: GridRowModel, oldRow: GridRowModel) =>
            new Promise<GridRowModel>((resolve, reject) => {
                const mutation = computeMutation(newRow, oldRow);
                if (mutation) {
                    // Save the arguments to resolve or reject the promise later
                    setPromiseArguments({ resolve, reject, newRow, oldRow });
                } else {
                    resolve(oldRow); // Nothing was changed
                }
            }),
        [],
    );

    const handleNo = () => {
        const { oldRow, resolve } = promiseArguments;
        resolve(oldRow); // Resolve with the old row to not update the internal state
        setPromiseArguments(null);
    };

    const handleYes = async () => {
        const { newRow, oldRow, reject, resolve } = promiseArguments;

        try {
            // Make the HTTP request to save in the backend
            const response = await mutateRow(newRow);
            setSnackbar({ children: 'User successfully saved', severity: 'success' });
            logger.debug('handleYes success::', response)
            resolve(response);
            setPromiseArguments(null);
        } catch (error) {
            setSnackbar({ children: "Name can't be empty", severity: 'error' });
            reject(oldRow);
            setPromiseArguments(null);
        }
    };

    const handleEntered = () => {
        // The `autoFocus` is not used because, if used, the same Enter that saves
        // the cell triggers "No". Instead, we manually focus the "No" button once
        // the dialog is fully open.
        // noButtonRef.current?.focus();
    };

    const renderConfirmDialog = () => {
        if (!promiseArguments) {
            return null;
        }

        const { newRow, oldRow } = promiseArguments;
        const mutation = computeMutation(newRow, oldRow);

        return (
            <Dialog
                maxWidth="xs"
                TransitionProps={{ onEntered: handleEntered }}
                open={!!promiseArguments}
            >
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent dividers>
                    {`Pressing 'Yes' will change ${mutation}.`}
                </DialogContent>
                <DialogActions>
                    <Button ref={noButtonRef} onClick={handleNo}>
                        No
                    </Button>
                    <Button onClick={handleYes}>Yes</Button>
                </DialogActions>
            </Dialog>
        );
    };

    const handleCloseSnackbar = () => setSnackbar(null);

    return (
        <>
            <Box sx={{ height: 400, width: '100%' }}>
                {renderConfirmDialog()}
                <DataGrid
                    // rows={rows}
                    rows={porjectTableData.projects}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                    processRowUpdate={processRowUpdate}
                // isCellEditable={(params) => params.row.age % 2 === 0}
                />
                {!!snackbar && (
                    <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
                        <Alert {...snackbar} onClose={handleCloseSnackbar} />
                    </Snackbar>
                )}
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

