import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from '@mui/material';

const CommonTable = ({ columns, rows, label, rowsPerPageOptions, count, page, onPageChange, onRowsPerPageChange }) => {
    return (
        <Paper sx={{
            marginY:5
        }}>
            <TableContainer>
                <Table stickyHeader aria-label={label}>
                    <TableHead >
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align || 'left'} style={{ minWidth: column.minWidth }} sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    if(column.id == "logo"){
                                        return (
                                        <TableCell key={column.id} align={column.align || 'left'} sx={{color:"black"}}>
                                                <img src={value} height={50} width={50}/>
                                        </TableCell>
                                        )
                                    }else{
                                        return (
                                            <TableCell key={column.id} align={column.align || 'left'} sx={{color:"black"}}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    }
                                    
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                count={count}
                rowsPerPage={rowsPerPageOptions[0]}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </Paper>
    );
};

export default CommonTable;