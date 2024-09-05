import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CommonTable from "../components/CommonTable";
import axios from 'axios';
import {BASE_URL} from '../constants/index.js'

const AdminVendor = () => {

  const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'logo', label: 'Shop Logo', minWidth: 100 },
    { id: 'shopName', label: 'Shop Name', minWidth: 170},
    { id: 'phone', label: 'Phone', minWidth: 170, },
    { id: 'totalOrders', label: 'Total Orders', minWidth: 170, align: 'right', format: (value) => value.toFixed(2) },
    { id: 'totalSale', label: 'Total Sales', minWidth: 170, align: 'right', format: (value) => value.toFixed(2) },
];

const rows = [
    { name: 'India', code: 'IN', population: 1393409038, size: 3287263, density: 423.1 },
    { name: 'China', code: 'CN', population: 1444216107, size: 9596961, density: 150.5 },
    // Add more rows as needed
];


const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(20);
const [data,setData] = useState([])
const [totalCount,setTotalCount] = useState(10);
const [totalVendors,setTotalVendors] = useState(0);
const [totalProducts,setTotalProducts] = useState(0);
const [totalSales,setTotalSales] = useState(0);

const handleChangePage = (event, newPage) => {
  console.log(newPage);
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(+event.target.value);
  setPage(0); // Reset to the first page
};

const fetchTotalVendorCount = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/vendor/getTotalCount`);
    console.log(res.data);
    setTotalVendors(res.data.totalVendors);

    const res2 = await axios.get(`${BASE_URL}/product/getTotalCount`);
    console.log(res2.data);
    setTotalProducts(res2.data.totalProducts);

    const res3 = await axios.get(`${BASE_URL}/vendor/getTotalSales`);
    console.log(res3.data);
    setTotalSales(res3.data.totalSalesSum);
  } catch (error) {
    console.log(error);
  }
}

const fetchVendors = async () => {
  try {
    console.log(page, rowsPerPage, "b4 api call");
    const res = await axios.get(`${BASE_URL}/vendor/getAll`, {
      params: {
        page: page + 1, // Backend might expect a 1-indexed page number
        pageSize: rowsPerPage,
        sortField: 'dateCreated',
        sortOrder: 'desc',
      },
    });
    console.log(res.data);
    setTotalCount(res.data.pagination.totalDocuments);
    setData(res.data.vendors.map((vendor) => ({
      name: `${vendor.firstName} ${vendor.lastName}`,
      logo: `${vendor.shopLogo}`,
      shopName: `${vendor.shopName}`,
      totalOrders: `${vendor.totalOrders}`,
      totalSale: `${vendor.totalSale}`,
      phone: `${vendor.user.phone}`,
    })));
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchVendors();
}, [page, rowsPerPage]);

useEffect(()=> {
  fetchTotalVendorCount();
},[])



  return (
    <Box>
        <Typography variant="h3">All Vendors</Typography>
      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{
            paddingX:5,
            paddingY:2
          }}>
            <Typography variant="h4"color="textSecondary" >Total Vendors</Typography>
            <Typography variant="h5">{totalVendors}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{
            paddingX:5,
            paddingY:2
          }}>
            <Typography variant="h4"color="textSecondary" >Total Products</Typography>
            <Typography variant="h5">{totalProducts}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{
            paddingX:5,
            paddingY:2
          }}>
            <Typography variant="h4"color="textSecondary" >Total Sale</Typography>
            <Typography variant="h5">{totalSales}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box marginY={4} display="flex" justifyContent="flex-start">
        <Button variant="contained" href="/admin/addVendor">Add Vendor</Button>
      </Box>
      <CommonTable
            columns={columns}
            rows={data}
            label="Vendor Table"
            rowsPerPageOptions={[10, 25, 100]}
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Box>
  );
};

export default AdminVendor;
