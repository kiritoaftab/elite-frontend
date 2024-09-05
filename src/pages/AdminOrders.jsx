import { Box, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL, formatDate } from '../constants';
import CommonTable from '../components/CommonTable';

const AdminOrders = () => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data,setData] = useState([])
  const [totalCount,setTotalCount] = useState(10);

  const columns = [
    { id: 'product', label: 'Product', minWidth: 170 },
    { id: 'unit', label: 'Unit', minWidth: 100 },
    { id: 'vendor', label: 'Vendor', minWidth: 170},
    { id: 'price', label: 'Price', minWidth: 170, },
    { id: 'cashier', label: 'Cashier', minWidth: 170,  },
    { id: 'amountPaid', label: 'Amount Paid', minWidth: 170},
    { id: 'dateTime', label:'Date - Time', minWidth:170}
];

  const handleChangePage = (event, newPage) => {
    console.log(newPage);
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to the first page
  };

  const fetchOrders = async () => {
    try {
      console.log(page, rowsPerPage, "b4 api call");
      const res = await axios.get(`${BASE_URL}/order/getAll`, {
        params: {
          page: page + 1, // Backend might expect a 1-indexed page number
          pageSize: rowsPerPage,
          sortField: 'dateCreated',
          sortOrder: 'desc',
        },
      });
      console.log(res.data);
      setTotalCount(res.data.pagination.totalDocuments);
      setData(res.data.orders.map((order)=> ({
        product: `${order.product.name}`,
        unit : `${order.unit}`,
        vendor : `${order.vendor.shopName}`,
        price : `${order.product.sellingPrice}`,
        cashier: `${order.cashier.firstName}`,
        amountPaid : `${order.amountPaid}`,
        dateTime : `${formatDate(order.dateCreated)}`,
      })))

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=> {
    fetchOrders();
  },[page,rowsPerPage])

  return (
    <Box>
      <Typography variant="h3">All Orders</Typography>
      <CommonTable
        columns={columns}
        rows={data}
        label="Orders Table"
        rowsPerPageOptions={[10, 25, 100]}
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}

export default AdminOrders