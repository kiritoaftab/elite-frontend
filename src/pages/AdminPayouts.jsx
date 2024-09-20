import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../constants';
import { Box, Grid, Paper, Typography } from '@mui/material';

const AdminPayouts = () => {

    const [payouts,setPayouts] = useState([]);
    const [cashPayout,setCashPayout] = useState("N/A");
    const [upiPayout,setUpiPayout] = useState("N/A");
    const [staffPayout,setStaffPayout] = useState("N/A");

    const fetchPayouts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/payment/report`);
            console.log(res.data);
            setPayouts(res.data.paymentTotals);
            setCashPayout(res.data.cashPaid);
            setUpiPayout(res.data.upiPaid);
            setStaffPayout(res.data.staffPaid);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=> {
        fetchPayouts();
    },[])

  return (
    <Box>
        <Typography variant="h3">All Payments</Typography>
        <Box display="flex" justifyContent="space-around">
        <Grid container spacing={2} marginTop={2}>
            
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{
            paddingX:5,
            paddingY:2
          }}>
            <Typography variant="h4"color="textSecondary" >CASH </Typography>
            <Typography variant="h5">{cashPayout}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{
            paddingX:5,
            paddingY:2
          }}>
            <Typography variant="h4"color="textSecondary" > UPI</Typography>
            <Typography variant="h5">{upiPayout}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{
            paddingX:5,
            paddingY:2
          }}>
            <Typography variant="h4"color="textSecondary" > STAFF</Typography>
            <Typography variant="h5">{staffPayout}</Typography>
          </Paper>
        </Grid>
      </Grid>

        </Box>
    </Box>
  )
}

export default AdminPayouts