import { GridRowModel, GridValidRowModel } from "@mui/x-data-grid";
import { AlertProps, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from '@mui/material';
import { EntityType, getMutation } from "./CustomDataGrid";
import { logger } from "@core/logger";

interface ConfirmDialogProps {
    entityType: EntityType,
    promiseArguments: {
        resolve: (value: GridValidRowModel | PromiseLike<GridValidRowModel>) => void,
        reject: (reason?: any) => void,
        newRow: GridValidRowModel,
        oldRow: GridValidRowModel
    },
    setPromiseArguments: (value: any) => void,
    // noButtonRef: React.RefObject<HTMLButtonElement>,
    // handleNo: () => void,
    // handleYes: () => void,
    mutateRow: (param: GridValidRowModel) => Promise<any>,
    setSnackbar: React.Dispatch<React.SetStateAction<Pick<AlertProps, "children" | "severity"> | null>>
    refetch: any
}
export const renderConfirmDialog = (
    { entityType, promiseArguments, setPromiseArguments, mutateRow, setSnackbar, refetch }: ConfirmDialogProps
) => {
    if (!promiseArguments) {
        return null;
    }

    const { newRow, oldRow } = promiseArguments;
    // let mutation
    // if (entityType === EntityType.Project)
    //     mutation = computeProjectMutation(newRow, oldRow);
    const mutation = getMutation(entityType, newRow, oldRow)

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
            refetch()
        } catch (error) {
            setSnackbar({ children: "Name can't be empty", severity: 'error' });
            reject(oldRow);
            setPromiseArguments(null);
        }
    };

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
                {/* <Button ref={noButtonRef} onClick={handleNo}> */}
                <Button onClick={handleNo}>
                    No
                </Button>
                <Button onClick={handleYes}>Yes</Button>
            </DialogActions>
        </Dialog>
    );
};

const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
};