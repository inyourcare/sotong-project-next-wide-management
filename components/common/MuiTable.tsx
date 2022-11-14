import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableColDef } from '@core/styles/mui';

export default function MuiTable({ columns, rows, limit }: {
  columns: TableColDef[],
  rows: Array<{
    id: string | number
    [key: string]: Date | String | string | number | boolean | undefined
  }>
  , limit: number
}) {
  const [directions] = React.useState(columns.map((col) => { return true }));
  function sortTable(feildOrder: number) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("mui-table") as HTMLTableElement;
    switching = true;
    /*Make a loop that will continue until
  no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        // x = rows[i].getElementsByTagName("td")[feildOrder];
        x = rows[i].cells[feildOrder];
        // y = rows[i + 1].getElementsByTagName("td")[feildOrder];
        y = rows[i + 1].cells[feildOrder];
        // console.log(rows,x,y,feildOrder)
        //check if the two rows should switch place:
        if (directions[feildOrder] === true) {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
        else {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode?.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
    directions[feildOrder] = !directions[feildOrder]
  }
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
      {/* <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table"> */}
      <Table id='mui-table'>
        <TableHead>
          {/* <TableRow style={{ width: '70px' }}> */}
          <TableRow >
            {columns.map((col, idx) => (
              // <TableCell key={`${col.field}`} width="20px" style={{ width: '70px' }}>{col.headerName}</TableCell>
              // <TableCell key={`${col.field}`} style={{backgroundColor:'red', color: 'white', width:`${col.width}%`}}>{col.headerName}</TableCell>
              <TableCell key={`${col.field}`} style={{ ...col.styles }} onClick={() => sortTable(idx)}>{col.headerName}</TableCell>
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
                  // <TableCell key={`${row.id}-${col.field}`} component="th" scope="row" style={{width:'10%'}}>
                  <TableCell key={`${row.id}-${col.field}`} component="th" scope="row">
                    {row[col.field]?.toString() || ""}
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
