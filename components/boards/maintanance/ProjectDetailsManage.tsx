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

    const columns: GridColDef[] = [
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
        //     field: 'projectStartDate',
        //     headerName: 'projectStartDate',
        //     type: 'date',
        //     // width: 110,
        //     editable: true,
        //     flex: 1,
        // },
        // {
        //     field: 'projectEndDate',
        //     headerName: 'projectEndDate',
        //     type: 'date',
        //     // width: 110,
        //     editable: true,
        //     flex: 1,
        // },
        // {
        //     field: 'projectMaintananceStartDate',
        //     headerName: 'projectMaintananceStartDate',
        //     type: 'date',
        //     // width: 110,
        //     editable: true,
        //     flex: 1,
        // },
        // {
        //     field: 'projectMaintananceEndDate',
        //     headerName: 'projectMaintananceEndDate',
        //     type: 'date',
        //     // width: 110,
        //     editable: true,
        //     flex: 1,
        // },
        // {
        //     field: 'createdAt',
        //     headerName: 'createdAt',
        //     type: 'date',
        //     // width: 110,
        //     // editable: true,
        //     flex: 1,
        // },
        // {
        //     field: 'updatedAt',
        //     headerName: 'updatedAt',
        //     type: 'date',
        //     // width: 110,
        //     // editable: true,
        //     flex: 1,
        // },
        {
            field: "action",
            headerName: "소통 담당자 추가",
            sortable: false,
            // width: 20,
            flex: 1,
            renderCell: (params) => {
                const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation(); // don't select this row after clicking

                    const api: GridApi = params.api;
                    const thisRow: Record<string, GridCellValue> = {};

                    api
                        .getAllColumns()
                        .filter((c) => c.field !== "__check__" && !!c)
                        .forEach(
                            (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
                        );

                    // const projectListArr = porjectTableData.projects as Array<TProject>
                    const projectListArr = projectList.data.projects as Array<TProject>
                    const project = projectListArr.filter(project => project.id === thisRow['id']).pop()
                    setSelectedProject(project)
                    // setProjectUsers(project?.users)
                    // return alert(JSON.stringify(thisRow, null, 4));
                    setDialogOpen(true)
                };

                return <Button onClick={onClick}>추가</Button>;
            }
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


    // dialog 
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedProject, setSelectedProject] = React.useState<TProject | undefined>(undefined);
    // const [projectUsers, setProjectUsers] = React.useState<[{ user: TUser }] | undefined>(undefined);
    const [selectedMembers, setSelectedMembers] = React.useState<Array<TUser> | null>(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };
    const handleAddDialog = useCallback(async () => {
        console.log(`handleAddDialog params`, selectedProject, selectedMembers);
        if (selectedProject && selectedMembers)
            createProjectUsers(selectedProject, selectedMembers)
                .then(result => {
                    // console.log('hihi1')
                    return (projectList.refetch() as Promise<any>)
                        .then(refetchResult => {
                            const newProjectList = refetchResult.data.projects as Array<TProject>
                            // const temp = (projectList.data.projects as Array<TProject>).filter(p => p.id === selectedProject?.id).pop()
                            const temp = newProjectList.filter(p => p.id === selectedProject?.id).pop()
                            // console.log('hihi2', temp)
                            setSelectedProject(temp)
                            return result.json()
                        })
                    // return result.json()
                })
                .catch((error) => {
                    console.error(`handleAddDialog :: ${error}`);
                })
    }, [selectedMembers, selectedProject]);
    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (dialogOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [dialogOpen]);

    const memberDataColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            // width: 10
            flex: 1,
        },
        {
            field: 'name',
            headerName: 'name',
            // width: 
            flex: 1,
        },
    ]

    useEffect(() => {
        console.log('selectedProject changed', selectedProject)
    }, [selectedProject])

    // project row click
    const projectRowOnClick: GridEventListener<'rowClick'> = (
        params, // GridRowParams
        event, // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
    ) => {
        logger.debug(`Movie "${params.row.projectName}" clicked`);
    };
    return (
        <>
            <div>
                <Dialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    scroll={'paper'}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                    fullWidth={true}
                    maxWidth={'lg'}
                >
                    <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
                    <DialogContent dividers={scroll === 'paper'}>
                        <Grid container>
                            <Grid item xs={6}>
                                <List>
                                    {selectedProject?.users.map(arr => (
                                        // {projectUsers?.map(arr => (
                                        <ListItem key={arr.user.id}>
                                            <ListItemText primary={arr.user.id} />
                                            <ListItemText primary={arr.user.name} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ height: 400 }}>
                                    <DataGrid
                                        // rows={rows}
                                        rows={memberList.data.users}
                                        columns={memberDataColumns}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        checkboxSelection
                                        disableSelectionOnClick
                                        experimentalFeatures={{ newEditingApi: true }}
                                        processRowUpdate={processRowUpdate}
                                        onSelectionModelChange={(ids) => {
                                            // console.log('selectedRowData1',ids);
                                            const selectedIDs = new Set(ids);
                                            const selectedRowData = (memberList.data.users as Array<TUser>).filter((row) =>
                                                // selectedIDs.has(row.id.toString())
                                                selectedIDs.has(row.id)
                                            );
                                            setSelectedMembers(selectedRowData)
                                            // console.log('selectedRowData2',selectedRowData);
                                        }}
                                    // isCellEditable={(params) => params.row.age % 2 === 0}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        {/* <DialogContentText
                            id="scroll-dialog-description"
                            ref={descriptionElementRef}
                            tabIndex={-1}
                        > */}
                        {/* {[...new Array(50)]
                                .map(
                                    () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
                                )
                                .join('\n')} */}
                        {/* {selectedProject?.users.map(user=>(<>
                                    {user.name}
                                </>))} */}
                        {/* </DialogContentText> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleAddDialog}>추가</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Box sx={{ height: 400, width: '50%' }}>
                {renderConfirmDialog()}
                <DataGrid
                    // rows={rows}
                    rows={projectList.data.projects}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
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

