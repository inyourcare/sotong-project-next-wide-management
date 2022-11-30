import { GridRowModel, GridValidRowModel } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from '@mui/material';

export enum EntityType {
    Project
}
export const renderConfirmDialog = (
    entityType: EntityType,
    promiseArguments: { newRow: GridValidRowModel, oldRow: GridValidRowModel },
    noButtonRef: React.RefObject<HTMLButtonElement>,
    handleNo: () => void,
    handleYes: () => void
) => {
    if (!promiseArguments) {
        return null;
    }

    const { newRow, oldRow } = promiseArguments;
    let mutation
    if (entityType === EntityType.Project)
        mutation = computeProjectMutation(newRow, oldRow);

    return (
        <Dialog
            maxWidth="xs"
            // TransitionProps={{ onEntered: handleEntered }}
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

const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
};