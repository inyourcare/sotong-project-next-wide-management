import { logger } from '@core/logger';
import { Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, Paper, Stack, TextareaAutosize, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Props } from 'framer-motion/types/types';
import { useTranslation } from 'next-i18next';
import { styled } from '@mui/material/styles';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
// date-fns
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// or for Day.js
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// or for Luxon
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
// or for Moment.js
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { getYYYYMMDDString } from '@core/time';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'firstName',
        headerName: 'First name',
        width: 150,
        editable: true,
    },
    {
        field: 'lastName',
        headerName: 'Last name',
        width: 150,
        editable: true,
    },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 110,
        editable: true,
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params: GridValueGetterParams) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
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

const WorkJournal: React.FC<Props> = ({ props }) => {
    // const { t } = useTranslation('maintanance');
    const [value, setValue] = React.useState<Dayjs | null>(
        dayjs('2014-08-18T21:11:54'),
    );

    const handleChange = (newValue: Dayjs | null) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
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
                    onSubmit={() => { }}
                >
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
                        />}
                        label="업무일자"
                        labelPlacement='top' />
                    <FormControlLabel
                        control={<TextField
                            // id="date"
                            // label="Birthday"
                            type="text"
                            // defaultValue="2017-05-24"
                            // defaultValue={}
                            sx={{ margin: 0, padding: 0 }}
                        />}
                        label="프로젝트"
                        labelPlacement='top'
                    />
                    <FormControlLabel control={<Checkbox defaultChecked />} label="오전" />
                    <FormControlLabel control={<Checkbox defaultChecked />} label="오후" />
                    <FormControlLabel control={<Checkbox defaultChecked />} label="야간" />
                    <FormControlLabel control={<TextareaAutosize
                        name="journalContent"
                        autoComplete="journalContent"
                        maxRows={4}
                        aria-label="maximum height"
                        placeholder="Maximum 4 rows"
                        defaultValue=""
                        style={{ width: 200, marginLeft: 10 }}
                    />}
                        label="업무내용"
                        labelPlacement='start'
                    />

                    <Button
                        // disabled={!this.isValid()}
                        disableRipple
                        fullWidth
                        variant="outlined"
                        // className={classes.button}
                        type="submit"
                    // onClick={this.submitRegistration}
                    >
                        Join
                    </Button>
                </form>
            </Box>
        </>
    )
}
export default WorkJournal;