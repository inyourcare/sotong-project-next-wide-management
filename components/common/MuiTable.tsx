import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function MuiTable({ columns, rows, limit }: {
  columns: GridColDef[],
  rows: Array<{
    id: string | number
    [key: string]: Date | String | string | number | boolean | undefined
  }>
  , limit: number
}) {
  return (
    // <div style={{ height: 400, width: '100%' }}>
    //   <DataGrid
    //     rows={rows}
    //     columns={columns}
    //     pageSize={5}
    //     rowsPerPageOptions={[limit]}
    //     checkboxSelection
    //   />
    // </div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          {/* <TableRow style={{ width: '70px' }}> */}
          <TableRow >
            {columns.map((col) => (
              // <TableCell key={`${col.field}`} width="20px" style={{ width: '70px' }}>{col.headerName}</TableCell>
              <TableCell key={`${col.field}`}>{col.headerName}</TableCell>
            ))}
            {/* <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            return (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {columns.map((col) => (
                  // <TableCell key={`${row.id}-${col.field}`} component="th" scope="row" width="20px" style={{ width: '70px' }}>
                  <TableCell key={`${row.id}-${col.field}`} component="th" scope="row">
                    {row[col.field]?.toString() || "empty"}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
