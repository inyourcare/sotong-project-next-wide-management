import { logger } from "@core/logger";
import { DataGrid, DataGridProps, GridColDef, GridEventListener, GridRowModel, GridValidRowModel } from "@mui/x-data-grid";

interface CustomDataGridProps extends DataGridProps<any> {
    // interface CustomDataGridProps {
    rows: any,
    columns: GridColDef[],
    processRowUpdate?: (newRow: GridRowModel, oldRow: GridRowModel) => Promise<GridValidRowModel>,
    rowOnClick: GridEventListener<"rowClick">,
    setPromiseArguments: (value: any) => void,
    entityType?: EntityType,
}
export default function CustomDataGrid(props: CustomDataGridProps) {
    const { rows, columns, rowOnClick, setPromiseArguments, entityType } = props
    const processRowUpdate =
        (newRow: GridRowModel, oldRow: GridRowModel) =>
            new Promise<GridRowModel>((resolve, reject) => {
                let mutation
                // if (Object.values(EntityType).includes(entityType as EntityType))
                mutation = getMutation(entityType as EntityType, newRow, oldRow)
                // if (entityType === EntityType.Project)
                //     mutation = computeProjectMutation(newRow, oldRow);
                // const mutation = entityType ? getMutation(entityType, newRow, oldRow) : null
                if (mutation) {
                    // Save the arguments to resolve or reject the promise later
                    setPromiseArguments({ resolve, reject, newRow, oldRow });
                } else {
                    resolve(oldRow); // Nothing was changed
                }
            })
    return (<>
        <DataGrid
            {...props}
            rows={rows}
            columns={columns}
            // pageSize={10}
            // rowsPerPageOptions={[10, 5]}
            // checkboxSelection
            // disableSelectionOnClick
            // experimentalFeatures={{ newEditingApi: true }}
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
            onRowClick={rowOnClick}
        // isCellEditable={(params) => params.row.age % 2 === 0}
        />
    </>)
}

export enum EntityType {
    Project,
    ProjectSchedule
}

export function getMutation(entityType: EntityType, newRow: GridRowModel, oldRow: GridRowModel) {
    logger.debug('getMutation', entityType, newRow, oldRow)
    let mutation
    if (entityType === EntityType.Project)
        mutation = computeProjectMutation(newRow, oldRow);
    if (entityType === EntityType.ProjectSchedule)
        mutation = computeProjectScheduleMutation(newRow, oldRow);

    return mutation
}

function computeProjectMutation(newRow: GridRowModel, oldRow: GridRowModel) {
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

function computeProjectScheduleMutation(newRow: GridRowModel, oldRow: GridRowModel) {
    if (newRow.type !== oldRow.type) {
        return `projectName from '${oldRow.type}' to '${newRow.type}'`;
    }
    if (newRow.startDate !== oldRow.startDate) {
        return `projectName from '${oldRow.startDate}' to '${newRow.startDate}'`;
    }
    if (newRow.endDate !== oldRow.endDate) {
        return `projectName from '${oldRow.endDate}' to '${newRow.endDate}'`;
    }
    if (newRow.memo !== oldRow.memo) {
        return `projectName from '${oldRow.memo}' to '${newRow.memo}'`;
    }
    return null;
}