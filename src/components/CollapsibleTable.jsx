import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const CollapsibleTable = ({ payments }) => {
  const [open, setOpen] = useState({});

  const handleClick = (paymentId) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [paymentId]: !prevOpen[paymentId],
    }));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }} />
            <TableCell sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }}>Payment ID</TableCell>
            <TableCell sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }}>Total Amount</TableCell>
            <TableCell sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }}>Status</TableCell>
            <TableCell sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }}>Mode</TableCell>
            <TableCell sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }}>Date Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <React.Fragment key={payment._id}>
              <TableRow>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleClick(payment._id)}
                  >
                    {open[payment._id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </TableCell>
                <TableCell sx={{  color:'black', fontWeight:700 }}>{payment._id}</TableCell>
                <TableCell sx={{  color:'black', fontWeight:700 }}>{payment.totalAmount}</TableCell>
                <TableCell sx={{  color:'black', fontWeight:700 }}>{payment.status}</TableCell>
                <TableCell sx={{  color:'black', fontWeight:700 }}>{payment.mode}</TableCell>
                <TableCell sx={{  color:'black', fontWeight:700 }}>{new Date(payment.dateCreated).toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={open[payment._id]} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      <Typography variant="h5" gutterBottom component="div">
                        Orders
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }}>Order ID</TableCell>
                            <TableCell sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }}>Vendor</TableCell>
                            <TableCell sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }}>Product</TableCell>
                            <TableCell sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }}>Price</TableCell>
                            <TableCell sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }}>Cashier</TableCell>
                            <TableCell sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }}>Units</TableCell>
                            <TableCell sx={{ backgroundColor: 'darkorange', color:'black', fontWeight:800 }}>Amount Paid</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {payment.ordersList.map((order) => (
                            <TableRow key={order._id} >
                              <TableCell sx={{  color:'black', fontWeight:600 }}>{order._id}</TableCell>
                              <TableCell sx={{  color:'black', fontWeight:600 }}>{order.vendor.shopName}</TableCell>
                              <TableCell sx={{  color:'black', fontWeight:600 }}>{order.product.name}</TableCell>
                              <TableCell sx={{  color:'black', fontWeight:600 }}>{order.product.sellingPrice}</TableCell>
                              <TableCell sx={{  color:'black', fontWeight:600 }}>{`${order.cashier.firstName} ${order.cashier.lastName}`}</TableCell>
                              <TableCell sx={{  color:'black', fontWeight:600 }}>{order.unit}</TableCell>
                              <TableCell sx={{  color:'black', fontWeight:600 }}>{order.amountPaid}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CollapsibleTable;
