import { logger } from "@core/logger";
import React, { useEffect } from "react";
import { Column, useTable, useSortBy } from "react-table";

function Table({ columns, data }: { columns: Column<{}>[], data: {}[] }) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data }, useSortBy);

    // useEffect(() => {
    //     logger.debug("table attributes::", headerGroups, rows, getTableProps(), getTableProps())
    //     headerGroups.map((headerGroup) => {
    //         logger.debug('headergroup', { ...headerGroup.getHeaderGroupProps() })
    //         headerGroup.headers.map((column) => (
    //             logger.debug('column', {
    //                 ...column.getHeaderProps({
    //                     style: { maxWidth: column.maxWidth, minWidth: column.minWidth, width: column.width },
    //                 })
    //             })
    //         ))
    //     })
    // }, [getTableProps, getTableBodyProps, headerGroups, rows, prepareRow])

    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            // <th {...column.getHeaderProps({ style: { minWidth: column.minWidth, width: column.width } })}>
                            // <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            <th {...column.getHeaderProps([{ style: { minWidth: column.minWidth, width: column.width } },column.getSortByToggleProps()])}>
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td {...cell.getCellProps({
                                    style: {
                                        maxWidth: cell.column.maxWidth,
                                        minWidth: cell.column.minWidth,
                                        width: cell.column.width,
                                    },
                                })}>{cell.render("Cell")}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default Table;