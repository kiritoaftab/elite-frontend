import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../constants';
import { Box, TablePagination, Typography } from '@mui/material';
import CollapsibleTable from '../components/CollapsibleTable';

const AdminPayments = () => {

  const [paymentsData,setPaymentsData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchPayments = async () => {
    try {
      console.log(page, rowsPerPage, "b4 api call");
      const res = await axios.get(`${BASE_URL}/payment/getAll`, {
        params: {
          page: page + 1, // Backend might expect a 1-indexed page number
          pageSize: rowsPerPage,
          sortField: 'dateModified',
          sortOrder: 'desc',
        },
      });
      console.log(res.data);
      setPaymentsData(res.data.payments);
      setTotalRows(res.data.pagination.totalDocuments);

    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when page size changes
  };

  useEffect(() => {
    fetchPayments();
  },[page,rowsPerPage])

  return (
    <Box>
      <Typography variant="h3">All Payments</Typography>

      <CollapsibleTable payments={paymentsData}/>
      <TablePagination
        component="div"
        count={totalRows}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}

export default AdminPayments