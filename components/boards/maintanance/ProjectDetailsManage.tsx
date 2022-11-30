import { logger } from '@core/logger';
import { Alert, AlertProps, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, Input, InputLabel, List, ListItem, ListItemText, Paper, Snackbar, Stack, TextareaAutosize, TextField } from '@mui/material';
import { DataGrid, GridApi, GridCellValue, GridColDef, GridEventListener, GridRowModel, GridValueGetterParams } from '@mui/x-data-grid';
import { Props } from 'framer-motion/types/types';
import { useTranslation } from 'next-i18next';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { getYYYYMMDDString } from '@core/time';
import { FieldValues, useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { TProject } from '@core/types/TProject';
import { useQueryGetProjects, useQueryGetUser } from 'pages/boards/maintanance';
import { TUser } from '@core/types/TUser';
import { createProjectUsers, updateProject } from '@core/logics/prisma';
import { computeProjectMutation, EntityType, renderConfirmDialog } from '@components/common/Dialog';
import dynamic from 'next/dynamic';


const ToastEditor = dynamic<any>(
    () => import('components/common/ToastEditor').then(mod => mod.ToastEditor),
    { ssr: false }
);

const ProjectDetailsManage: React.FC<Props> = ({ props }) => {
    // const { t } = useTranslation('maintanance');
    // const { data } = useQuery("projectList",()=>getProjects(1)) as any
    // const projectList = useQuery("projectList", () => getProjects(1)) as any
    const projectList = useQuery("projectList", () => useQueryGetProjects(1)) as any
    // const porjectTableData = { ...projectList.data }
    // const memberList = useQuery("memberList", () => getUsers(1)) as any
    const memberList = useQuery("memberList", () => useQueryGetUser(1)) as any
    // const memberTableData = { ...memberList.data }
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();
    const router = useRouter();
    useEffect(() => {
        logger.debug('project list -> ', { ...projectList.data })
    }, [projectList])



    //////////// mui datagrid example

    const projectColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 10
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
        // {
        //     field: "action",
        //     headerName: "소통 담당자 추가",
        //     sortable: false,
        //     // width: 20,
        //     flex: 1,
        //     renderCell: (params) => {
        //         const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        //             e.stopPropagation(); // don't select this row after clicking

        //             const api: GridApi = params.api;
        //             const thisRow: Record<string, GridCellValue> = {};

        //             api
        //                 .getAllColumns()
        //                 .filter((c) => c.field !== "__check__" && !!c)
        //                 .forEach(
        //                     (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
        //                 );

        //             // const projectListArr = porjectTableData.projects as Array<TProject>
        //             const projectListArr = projectList.data.projects as Array<TProject>
        //             const project = projectListArr.filter(project => project.id === thisRow['id']).pop()
        //             setSelectedProject(project)
        //         };

        //         return <Button onClick={onClick}>추가</Button>;
        //     }
        // },
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
    const scheduleColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 10
            // flex: 1,
        },
        {
            field: 'startDate',
            headerName: 'startDate',
            // width: 150,
            editable: true,
            // resizable: true
            flex: 1,
        },
        {
            field: 'endDate',
            headerName: 'endDate',
            // width: 150,
            editable: true,
            // resizable: true
            flex: 1,
        },
        {
            field: 'memo',
            headerName: 'memo',
            // width: 150,
            editable: true,
            // resizable: true
            flex: 1,
        },
    ]
    const [promiseArguments, setPromiseArguments] = React.useState<any>(null);
    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);
    const noButtonRef = React.useRef<HTMLButtonElement>(null);

    const mutateRow = React.useCallback(
        updateProject
        , []
    );

    const processRowUpdate = React.useCallback(
        (newRow: GridRowModel, oldRow: GridRowModel) =>
            new Promise<GridRowModel>((resolve, reject) => {
                const mutation = computeProjectMutation(newRow, oldRow);
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

    const [selectedProject, setSelectedProject] = React.useState<TProject | undefined>(undefined);
    const handleCloseSnackbar = () => setSnackbar(null);

    // project row click
    const projectRowOnClick: GridEventListener<'rowClick'> = (
        params, // GridRowParams
        event, // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
    ) => {
        logger.debug(`Project "${params.row.projectName}" clicked`);
        const project = (projectList.data.projects as Array<TProject>).filter(project => project.id === params.row.id).pop()
        setSelectedProject(project)
    };
    return (
        <>
            <Grid container>
                <Grid item xs={4} sx={{ height: 800 }}>
                    {renderConfirmDialog(EntityType.Project, promiseArguments, noButtonRef, handleNo, handleYes)}
                    <DataGrid
                        // rows={rows}
                        rows={projectList.data.projects}
                        columns={projectColumns}
                        pageSize={10}
                        // rowsPerPageOptions={[10]}
                        // checkboxSelection
                        // disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                        processRowUpdate={processRowUpdate}
                        // onSelectionModelChange={(ids) => {
                        //     // console.log('selectedRowData1',ids);
                        //     const selectedIDs = new Set(ids);
                        //     const selectedRowData = (projectList.data.projects as Array<TProject>).filter((row) =>
                        //         // selectedIDs.has(row.id.toString())
                        //         selectedIDs.has(row.id)
                        //     );
                        //     // console.log('selectedRowData2',selectedRowData);
                        // }}
                        onRowClick={projectRowOnClick}
                    // isCellEditable={(params) => params.row.age % 2 === 0}
                    />
                </Grid>
                <Grid item xs={8} sx={{ height: 800 }}>
                    <Grid sx={{ height: 400 }}>
                        <DataGrid
                            // rows={rows}
                            rows={selectedProject?.schedules || []}
                            getRowId={(row) => row.user.id}
                            columns={scheduleColumns}
                            pageSize={5}
                            // rowsPerPageOptions={[10]}
                            // checkboxSelection
                            // disableSelectionOnClick
                            experimentalFeatures={{ newEditingApi: true }}
                            processRowUpdate={processRowUpdate}
                            // onSelectionModelChange={(ids) => {
                            //     // console.log('selectedRowData1',ids);
                            //     const selectedIDs = new Set(ids);
                            //     const selectedRowData = (projectList.data.projects as Array<TProject>).filter((row) =>
                            //         // selectedIDs.has(row.id.toString())
                            //         selectedIDs.has(row.id)
                            //     );
                            //     // console.log('selectedRowData2',selectedRowData);
                            // }}
                            onRowClick={projectRowOnClick}
                        // isCellEditable={(params) => params.row.age % 2 === 0}
                        />
                    </Grid>
                    <Grid sx={{ height: 400 }}>
                        <ToastEditor height={'400px'}/>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ height: 200 }}>
                    <DataGrid
                        // rows={rows}
                        rows={projectList.data.projects}
                        columns={projectColumns}
                        pageSize={10}
                        // rowsPerPageOptions={[10]}
                        // checkboxSelection
                        // disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                        processRowUpdate={processRowUpdate}
                        onSelectionModelChange={(ids) => {
                            // console.log('selectedRowData1',ids);
                            const selectedIDs = new Set(ids);
                            const selectedRowData = (projectList.data.projects as Array<TProject>).filter((row) =>
                                // selectedIDs.has(row.id.toString())
                                selectedIDs.has(row.id)
                            );
                            // console.log('selectedRowData2',selectedRowData);
                        }}
                        onRowClick={projectRowOnClick}
                    // isCellEditable={(params) => params.row.age % 2 === 0}
                    />
                </Grid>
            </Grid>
            <Box>
                {!!snackbar && (
                    <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
                        <Alert {...snackbar} onClose={handleCloseSnackbar} />
                    </Snackbar>
                )}
            </Box>
        </>
    )
}

export default ProjectDetailsManage;

