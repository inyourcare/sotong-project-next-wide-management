import { logger } from '@core/logger';
import { Alert, AlertProps, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, Input, InputLabel, List, ListItem, ListItemText, MenuItem, NativeSelect, Paper, Select, SelectChangeEvent, Snackbar, Stack, TextareaAutosize, TextField } from '@mui/material';
import { DataGrid, GridApi, GridCellValue, GridColDef, GridEventListener, GridRowModel, GridRowModes, GridRowModesModel, GridRowsProp, GridToolbarContainer, GridValueGetterParams, useGridApiRef } from '@mui/x-data-grid';
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
import { createProjectUsers, updateProject, upsertProjectSchedule } from '@core/logics/prisma';
import { renderConfirmDialog } from '@components/common/datagrid/Dialog';
import dynamic from 'next/dynamic';
import BasicAddRemoveDataGridFooter from '@components/common/datagrid/BasicAddRemoveDataGridFooter';
import { AddIcon } from '@chakra-ui/icons';
import { TProjectSchedule } from '@core/types/TProjectSchedule';
import { ProjectScheduleType } from '@prisma/client';
import CustomDataGrid, { EntityType } from '@components/common/datagrid/CustomDataGrid';


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
        logger.debug('project list -> ', scheduleRows)
        // setScheduleRows(scheduleRows?.filter(schedule => schedule.id !== 0))
        const projects = projectList.data.projects as Array<TProject>
        setScheduleRows(
            projects
                .filter(p => p.id === selectedProject?.id)
                .pop()?.schedules.filter(schedule => schedule.id !== 0)
        )
    }, [projectList.data.projects])


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
            field: 'type',
            headerName: 'type',
            // width: 10
            editable: true,
            flex: 1,
            renderCell: (params) => {
                // let val = params.value
                const { id, value, field } = params;
                // const api: GridApi = params.api;
                // const thisRow: Record<string, GridCellValue> = {};

                // api
                //     .getAllColumns()
                //     .filter((c) => c.field !== "__check__" && !!c)
                //     .forEach(
                //         (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
                //     );
                const selectChange = (e: SelectChangeEvent) => {
                    logger.debug('selectChange', id, field, scheduleRows, value, e.target.value)
                    setScheduleRows(scheduleRows?.map(schedule=> {
                        if (schedule.id === id){
                            schedule.type = e.target.value as ProjectScheduleType
                            return schedule
                        }
                        return schedule
                    }))
                }
                return <>
                    {/* <Select value={ProjectScheduleType.MAINTANANCE} sx={{width:'100%'}}> */}
                    <Select value={value} sx={{ width: '100%' }} onChange={selectChange}>
                        {Object.values(ProjectScheduleType).map((v) => {
                            return (<MenuItem value={v} key={v}>{v}</MenuItem>)
                        })}
                    </Select>
                    {/* <NativeSelect>
                        {Object.values(ProjectScheduleType).map((v) => {
                            return (<option value={v}>{v}</option>)
                        })}
                    </NativeSelect> */}
                </>
            }
        },
        {
            field: 'startDate',
            headerName: 'startDate',
            // width: 150,
            editable: true,
            // resizable: true
            type: 'date',
            flex: 1,
        },
        {
            field: 'endDate',
            headerName: 'endDate',
            // width: 150,
            editable: true,
            // resizable: true
            type: 'date',
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
    const [projectDataGridPromiseArguments, setProjectDataGridPromiseArguments] = React.useState<any>(null);
    const [projectScheduleDataGridPromiseArguments, setProjectScheduleDataGridPromiseArguments] = React.useState<any>(null);
    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);
    // const noButtonRef = React.useRef<HTMLButtonElement>(null);

    // const mutateRow = React.useCallback(
    //     updateProject
    //     , []
    // );

    // const processRowUpdate = React.useCallback(
    //     (newRow: GridRowModel, oldRow: GridRowModel) =>
    //         new Promise<GridRowModel>((resolve, reject) => {
    //             const mutation = computeProjectMutation(newRow, oldRow);
    //             if (mutation) {
    //                 // Save the arguments to resolve or reject the promise later
    //                 setPromiseArguments({ resolve, reject, newRow, oldRow });
    //             } else {
    //                 resolve(oldRow); // Nothing was changed
    //             }
    //         }),
    //     [],
    // );

    const [selectedProject, setSelectedProject] = React.useState<TProject | undefined>(undefined);
    const [scheduleRows, setScheduleRows] = React.useState<TProjectSchedule[] | undefined>(undefined);
    const handleCloseSnackbar = () => setSnackbar(null);

    useEffect(() => {
        logger.debug('selectedProject -> ', { ...selectedProject })
        // setScheduleRows(scheduleRows?.filter(schedule => schedule.id !== 0))
        setScheduleRows(selectedProject?.schedules)
    }, [selectedProject])

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

    const addProjectSheduleClick = useCallback(() => {
        logger.debug('addProjectSheduleClick');
        setScheduleRows(scheduleRows?.concat([{
            // id: scheduleRows.length,
            id: 0,
            projectId: (selectedProject as TProject).id,
            type: ProjectScheduleType.MAINTANANCE,
            // startDate: new Date('2022-12-01T08:00:06.421Z'),
            startDate: new Date(),
            endDate: new Date(),
            memo: ''
        }]))
    }, [selectedProject, scheduleRows])
    const removeProjectSheduleClick = () => {
        logger.debug('removeProjectSheduleClick')
    }

    return (
        <>
            <Grid container>
                <Grid item xs={4} sx={{ height: 800 }}>
                    {renderConfirmDialog(
                        // handleNo,
                        // handleYes
                        {
                            entityType: EntityType.Project,
                            promiseArguments: projectDataGridPromiseArguments,
                            setPromiseArguments: setProjectDataGridPromiseArguments,
                            // noButtonRef: noButtonRef,
                            mutateRow: updateProject,
                            setSnackbar,
                            refetch: projectList.refetch
                        }
                    )}
                    <CustomDataGrid
                        rows={projectList.data.projects}
                        columns={projectColumns}
                        // processRowUpdate={processRowUpdate}
                        pageSize={5}
                        rowsPerPageOptions={[10, 5]}
                        experimentalFeatures={{ newEditingApi: true }}
                        setPromiseArguments={setProjectDataGridPromiseArguments}
                        rowOnClick={projectRowOnClick}
                        entityType={EntityType.Project}
                    />
                </Grid>
                <Grid item xs={8} sx={{ height: 800 }}>
                    <Grid sx={{ height: 400 }}>
                        {renderConfirmDialog(
                            // handleNo,
                            // handleYes
                            {
                                entityType: EntityType.ProjectSchedule,
                                promiseArguments: projectScheduleDataGridPromiseArguments,
                                setPromiseArguments: setProjectScheduleDataGridPromiseArguments,
                                // noButtonRef: noButtonRef,
                                mutateRow: upsertProjectSchedule,
                                setSnackbar,
                                refetch: projectList.refetch
                            }
                        )}
                        <CustomDataGrid
                            rows={scheduleRows || []}
                            columns={scheduleColumns}
                            pageSize={5}
                            rowsPerPageOptions={[10, 5]}
                            experimentalFeatures={{ newEditingApi: true }}
                            components={{
                                Footer: () => BasicAddRemoveDataGridFooter({ onAddClick: addProjectSheduleClick, onRemoveClick: removeProjectSheduleClick }),
                            }}
                            // processRowUpdate={processRowUpdate}
                            setPromiseArguments={setProjectScheduleDataGridPromiseArguments}
                            rowOnClick={() => { }}
                            entityType={EntityType.ProjectSchedule}
                        />
                    </Grid>
                    <Grid sx={{ height: 400 }}>
                        <ToastEditor height={'400px'} />
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ height: 200 }}>
                    <CustomDataGrid
                        rows={projectList.data.projects}
                        columns={projectColumns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 5]}
                        experimentalFeatures={{ newEditingApi: true }}
                        // processRowUpdate={processRowUpdate}
                        setPromiseArguments={setProjectDataGridPromiseArguments}
                        rowOnClick={projectRowOnClick}
                        entityType={EntityType.Project}
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

