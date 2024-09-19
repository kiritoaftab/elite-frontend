import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";

const AdminReports = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  const [selectedVendor,setSelectedVendor] = useState(null);

  const [products,setProducts] = useState([]);
  const [saleStat,setSaleStat] = useState({
    totalCost: "N/A",
    totalProfit:"N/A",
    totalSales: "N/A"
  })

  const fetchVendors = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/vendor/getAll?page=1&pageSize=100&sortField=dateCreated&sortOrder=desc`
      );
      setVendors(response.data.vendors || []);
    } catch (error) {
      console.error("There was an error fetching vendors!", error);
    }
  };

  // Fetch vendors in useEffect
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchProductsByVendor = async(vendor) => {
    try {
      const res = await axios.get(`${BASE_URL}/product/getByVendor/${vendor}`);
      console.log(res.data);
      setProducts(res.data.products);

      const res2 = await axios.get(`${BASE_URL}/product/saleStat/${vendor}`);
      console.log(res2.data);
      setSaleStat({
        totalCost:res2.data.data.totalCost,
        totalProfit:res2.data.data.totalProfit,
        totalSales:res2.data.data.totalSales
      })
    } catch (error) {
      console.log(error);
      alert('Error while fetching products')
    }
  }

  const resetDatabase = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/product/resetDb`);
      console.log(res.data);
      alert('Database is reset !!!!');
    } catch (error) {
      console.log(error);
      alert('Error while reseting database');
    }
  }

  useEffect(()=> {
    if(selectedVendor){
      fetchProductsByVendor(selectedVendor);
    }
  },[selectedVendor])

  return (
    <Box>

      <Box display="flex" justifyContent="space-between">
          <Typography variant="h3">Reports</Typography>
          <Button onClick={() => resetDatabase()} variant="contained">Reset Database</Button>
      </Box>
      

      <FormControl variant="outlined" fullWidth required>
        <InputLabel id="vendor-label">Vendor</InputLabel>
        <Select labelId="vendor-label" name="vendor" label="Vendor" onChange={(e)=> setSelectedVendor(e.target.value)}>
          {vendors.map((vendor) => (
            <MenuItem key={vendor._id} value={vendor._id}>
              {vendor.shopName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

    {selectedVendor ? (
      <>
            <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{
            paddingX:5,
            paddingY:2
          }}>
            <Typography variant="h4"color="textSecondary" >Total Sales</Typography>
            <Typography variant="h5">{saleStat?.totalSales}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{
            paddingX:5,
            paddingY:2
          }}>
            <Typography variant="h4"color="textSecondary" >Payable Amount</Typography>
            <Typography variant="h5">{saleStat?.totalCost}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{
            paddingX:5,
            paddingY:2
          }}>
            <Typography variant="h4"color="textSecondary" >Net Profit</Typography>
            <Typography variant="h5">{saleStat?.totalProfit}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{
        marginY:5
      }}>
        <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align={ 'left'}  sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:600 }}>Name</TableCell>
                  <TableCell align={ 'left'}  sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:600 }}>Cost Price</TableCell>
                  <TableCell align={ 'left'}  sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:600 }}>Selling Price</TableCell>
                  <TableCell align={ 'left'}  sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:600 }}>Item Sold Count</TableCell>
                  <TableCell align={ 'left'}  sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:600 }}>Profit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products?.map((product,index) => {
                  return(
                  <TableRow hover key={product?._id}>
                    <TableCell align={'left'} sx={{color:"black"}}>
                      {product?.name}
                    </TableCell>
                    <TableCell align={'left'} sx={{color:"black"}}>
                      {product?.costPrice}
                    </TableCell>
                    <TableCell align={'left'} sx={{color:"black"}}>
                      {product?.sellingPrice}
                    </TableCell>
                    <TableCell align={'left'} sx={{color:"black"}}>
                      {product?.totalOrders}
                    </TableCell>
                    <TableCell align={'left'} sx={{color:"black"}}>
                      {(product?.sellingPrice - product?.costPrice)*product?.totalOrders}
                    </TableCell>
                </TableRow>
                  )
                })}
              </TableBody>
            </Table>
        </TableContainer>
      </Paper>
      </>
    ):``}

    </Box>
  );
};

export default AdminReports;
