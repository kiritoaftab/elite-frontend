import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../constants'
import CommonTable from '../components/CommonTable'

const AdminCashier = () => {

  const [metrics,setMetrics] = useState({
    totalCashier: "N/A",
    totalOrders:"N/A",
    totalSales:"N/A"
  })

  const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'phone', label: 'Phone', minWidth: 100 },
    { id: 'totalOrders', label: 'Total Items Sold', minWidth: 170, align: 'right', format: (value) => value.toFixed(2) },
    { id: 'totalSale', label: 'Total Sales', minWidth: 170, align: 'right', format: (value) => value.toFixed(2) },
];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [data,setData] = useState([])


  const fetchMetrics = async() => {
    try {
      const res = await axios.get(`${BASE_URL}/cashier/getTotal`);
      console.log(res.data);
      setMetrics({
        totalCashier:res.data.totalCashiers,
        totalOrders:res.data.totalOrders,
        totalSales:res.data.totalSales
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangePage = (event, newPage) => {
    console.log(newPage);
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to the first page
  };

  const fetchCashiers = async() => {

      try {
        console.log(page, rowsPerPage, "b4 api call");
        const res = await axios.get(`${BASE_URL}/cashier/getAll`, {
          params: {
            page: page + 1, // Backend might expect a 1-indexed page number
            pageSize: rowsPerPage,
            sortField: 'dateCreated',
            sortOrder: 'desc',
          },
        });
        console.log(res.data);
        setData(res.data.cashier.map((cashier) => ({
          name: `${cashier.firstName} ${cashier.lastName}`,
          phone : `${cashier.user.phone}`,
          totalOrders: `${cashier.totalOrders}`,
          totalSale: `${cashier.totalSale}`,
        })))

      } catch (error) {
        console.log(error);
      }

  }

  useEffect(() => {
    fetchCashiers();
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchMetrics();
  },[])

  return (
    <Box>
        <Typography variant="h3">All Cashiers</Typography>
        <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{
            paddingX:5,
            paddingY:2
          }}>
            <Typography variant="h4"color="textSecondary" >Total Cashiers</Typography>
            <Typography variant="h5">{metrics.totalCashier}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{
            paddingX:5,
            paddingY:2
          }}>
            <Typography variant="h4"color="textSecondary" >Total Orders</Typography>
            <Typography variant="h5">{metrics.totalOrders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{
            paddingX:5,
            paddingY:2
          }}>
            <Typography variant="h4"color="textSecondary" >Total Sale</Typography>
            <Typography variant="h5">{metrics.totalSales}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box marginY={4} display="flex" justifyContent="flex-start">
        <Button variant="contained" href="/admin/addCashier">Add Cashier</Button>
      </Box>

      <CommonTable
            columns={columns}
            rows={data}
            label="Cashier Table"
            rowsPerPageOptions={[10, 25, 100]}
            count={metrics.totalCashier}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Box>
  )
}

export default AdminCashier