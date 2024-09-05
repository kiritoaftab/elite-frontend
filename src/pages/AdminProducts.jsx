import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../constants'
import CommonTable from '../components/CommonTable'

const AdminProducts = () => {

  const [metrics,setMetrics] = useState({
    totalProduct:"N/A",
    totalProfit:"N/A",
    totalOrders:"N/A"
  })

  const columns = [
    { id: 'name', label: 'Name', minWidth: 120 },
    { id: 'shopName', label: 'Shop Name', minWidth: 120},
    { id: 'category', label: 'Phone', minWidth: 120, },
    { id: 'sellingPrice', label: 'Selling Price', minWidth: 120, align: 'right', format: (value) => value.toFixed(2) },
    { id: 'costPrice', label: 'Cost Price', minWidth: 120, align: 'right', format: (value) => value.toFixed(2) },
    { id: 'totalOrders', label: 'Total Orders', minWidth: 120, align: 'right', format: (value) => value.toFixed(2) },
    {id:'profit',label:'Profit', minWidth: 120, align: 'right', format: (value) => value.toFixed(2)},
    {id:'status',label:'Status', minWidth: 120}
];


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [data,setData] = useState([])

  const handleChangePage = (event, newPage) => {
    console.log(newPage);
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0); // Reset to the first page
  };


  const fetchProducts = async () => {
    try {
      console.log(page, rowsPerPage, "b4 api call");
      const res = await axios.get(`${BASE_URL}/product/getAll`, {
        params: {
          page: page + 1, // Backend might expect a 1-indexed page number
          pageSize: rowsPerPage,
          sortField: 'dateCreated',
          sortOrder: 'desc',
        },
      });
      console.log(res.data);

      setData(res.data.products.map((product) => ({
        name: `${product.name}`,
        shopName : `${product.vendor.shopName}`,
        category : `${product.category}`,
        sellingPrice : `${product.sellingPrice}`,
        costPrice : `${product.costPrice}`,
        totalOrders : `${product.totalOrders}`,
        profit: `${(product.sellingPrice - product.costPrice) * product.totalOrders}`,
        status: `${product.status}`
      })))

    } catch (error) {
      console.log(error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/product/getTotalCount`);
      console.log(res.data);

      const res2 = await axios.get(`${BASE_URL}/product/getTotalProfit`);
      console.log(res2.data);

      const res3 = await axios.get(`${BASE_URL}/product/getTotalOrders`);
      console.log(res3.data);

      setMetrics({
        totalProduct:res.data.totalProducts,
        totalProfit:res2.data.totalProfit,
        totalOrders:res3.data.totalOrders
      })
    } catch (error) {
      console.log(error);
    }
  } 

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage]);

  useEffect(()=> {
    fetchMetrics();
  },[])

  return (
    <Box>
      <Typography variant="h3">All Products</Typography>
      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{
            paddingX:5,
            paddingY:2
          }}>
            <Typography variant="h4"color="textSecondary" >Total Products</Typography>
            <Typography variant="h5">{metrics.totalProduct}</Typography>
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
            <Typography variant="h4"color="textSecondary" >Total Profit</Typography>
            <Typography variant="h5">{metrics.totalProfit}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box marginY={4} display="flex" justifyContent="flex-start">
        <Button variant="contained" href="/admin/addProduct">Add Product</Button>
      </Box>

      <CommonTable
            columns={columns}
            rows={data}
            label="Product Table"
            rowsPerPageOptions={[10, 25, 100,2]}
            count={metrics.totalProduct}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Box>
  )
}

export default AdminProducts