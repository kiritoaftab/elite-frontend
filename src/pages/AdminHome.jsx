import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useEffect, useState } from "react";
import { Button, Grid, Paper } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import jsPDF from 'jspdf';


const drawerWidth = 350;

export default function AdminHome() {
  const [vendors, setVendors] = useState([]);

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedVendorName, setSelectedVendorName] = useState(null);

  const [products, setProducts] = useState([]);
  const [productMatrix, setProductMatrix] = useState([]);

  const [cashierDoc, setCashierDoc] = useState(null);
  const [paymentsList,setPaymentsList] = useState([]);
  const [uniqueVendor,setUniqueVendor] = useState(0);

  const fetchVendors = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/vendor/getAll?page=1&pageSize=30&sortField=dateCreated&sortOrder=desc`
      );
      console.log(res.data);
      setVendors(res.data.vendors);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCashier = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      const res = await axios.get(`${BASE_URL}/cashier/getByUserId/${userId}`);
      console.log(res.data);
      setCashierDoc(res.data.cashierDoc);
    } catch (error) {
      console.log(error);
      alert("Error fetching cashier, please login as cashier");
    }
  };

  const generatePDF = (payment) => {
    const doc = new jsPDF();
  
    payment.ordersList.forEach((order, index) => {
      doc.setFontSize(18);
      doc.text(`Receipt for Vendor: ${order.vendor.shopName}`, 10, 10 + index * 60);
      
      doc.setFontSize(12);
      doc.text(`Vendor Name: ${order.vendor.firstName} ${order.vendor.lastName}`, 10, 30 + index * 60);
      doc.text(`Product: ${order.product.name}`, 10, 40 + index * 60);
      doc.text(`Quantity: ${order.unit}`, 10, 50 + index * 60);
      
      // Add more details if necessary
      doc.text('-------------------------------', 10, 60 + index * 60);
    });
  
    const pdfFile = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfFile);
    const pdfWindow = window.open(pdfUrl);
  
    // Initiate print on the new window
    pdfWindow.onload = () => {
      pdfWindow.print();
    };


  };

  useEffect(() => {
    fetchVendors();
    fetchCashier();
  }, []);

  const fetchProductsByVendor = async (vendor) => {
    try {
      const res = await axios.get(`${BASE_URL}/product/getByVendor/${vendor}`);
      console.log(res.data);
      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = (productId, prodDoc) => {
    setProductMatrix((prevMatrix) => {
      const productIndex = prevMatrix.findIndex(
        (item) => item.product === productId
      );

      if (productIndex !== -1) {
        // If the product is already in the matrix, increment its unit
        const updatedMatrix = [...prevMatrix];
        updatedMatrix[productIndex].unit += 1;
        return updatedMatrix;
      } else {
        // If the product is not in the matrix, add it with unit 1
        return [
          ...prevMatrix,
          { product: productId, unit: 1, prodDoc: prodDoc },
        ];
      }
    });
  };

  useEffect(() => {
    if (selectedVendor) {
      fetchProductsByVendor(selectedVendor);
    }
  }, [selectedVendor]);

  const grandTotal = productMatrix?.reduce((total, prodMat) => {
    return total + prodMat?.prodDoc?.sellingPrice * prodMat?.unit;
  }, 0);

  const handleIncrement = (productId) => {
    const updatedMatrix = productMatrix.map((prodMat) => {
      if (prodMat.product === productId) {
        return {
          ...prodMat,
          unit: prodMat.unit + 1,
        };
      }
      return prodMat;
    });
    setProductMatrix(updatedMatrix);
  };

  // Function to handle decrementing the quantity
  const handleDecrement = (productId) => {
    const updatedMatrix = productMatrix.map((prodMat) => {
      if (prodMat.product === productId && prodMat.unit > 1) {
        return {
          ...prodMat,
          unit: prodMat.unit - 1,
        };
      }
      return prodMat;
    });
    setProductMatrix(updatedMatrix);
  };

  const placeOrder = async() => {
    try {
      console.log(productMatrix);
      console.log(cashierDoc?._id);

      const res = await axios.post(`${BASE_URL}/order/create/v2`,{
        productMatrix:productMatrix,
        cashier:cashierDoc?._id
      });

      console.log(res.data);
      alert('Cart Checked out!!!')
      setPaymentsList(res.data.paymentsList);
      setUniqueVendor(res.data.uniqueVendors);

      const paymentIds = res.data.paymentsList.map((pay) => pay._id)

      const res2 = await axios.post(`${BASE_URL}/payment/list`,{paymentIds:paymentIds});
      console.log(res2.data);
      
      res2.data.payments.map((payment) => {
        generatePDF(payment);
      })
      alert('Printing pdfs');
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Error while placing order")
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, mr: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            POS
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />

        <Grid container spacing={2}>
          {vendors?.map((vendor) => {
            return (
              <Grid item xs={12} md={6} lg={4} key={vendor?._id}>
                <Paper
                  sx={{
                    paddingY: 3,
                    paddingX: 6,
                    transition: "transform 0.3s ease-in-out", // Smooth transition effect
                    "&:hover": {
                      transform: "scale(1.05)", // Increase the scale on hover
                    },
                  }}
                  elevation={2}
                  onClick={() => {
                    setSelectedVendor(vendor?._id);
                    setSelectedVendorName(vendor?.shopName);
                  }}
                >
                  <Typography textAlign="center" variant="h4" color="black">
                    {vendor?.shopName}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {products?.length > 0 ? (
          <Box>
            {selectedVendorName ? (
              <Typography marginY={3} variant="h5" color="black">
                Menu Items under {selectedVendorName}
              </Typography>
            ) : (
              ``
            )}
            <Grid container spacing={2}>
              {products?.map((product) => {
                return (
                  <Grid item xs={12} md={6} lg={4}>
                    <Paper
                      sx={{
                        padding: 3,
                      }}
                    >
                      <Typography variant="h4" color="black" fontWeight={600}>
                        {product?.name}
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        sx={{
                          flexDirection: {
                            xs: "column", // Default for xs and sm
                            md: "column", // Applies to md and below
                            lg: "row", // Applies to lg and above
                          },
                        }}
                      >
                        <Typography variant="h3" color="black" fontWeight={300}>
                          ₹{product?.sellingPrice}
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{
                            height: "2em",
                            alignSelf: "end",
                          }}
                          onClick={() => handleAddToCart(product._id, product)}
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ) : (
          ``
        )}
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <Toolbar />
        <Divider />
        <Typography variant="h4" color="black" padding={2}>
          Items in the cart
        </Typography>
        <Box padding={2}>
          {productMatrix?.map((prodMat) => {
            return (
              <Paper
                elevation={2}
                sx={{
                  bgcolor: "white",
                  padding: 1,
                  marginY: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h5" color="black" fontWeight={400}>
                    {prodMat?.prodDoc?.name}
                  </Typography>
                  <Typography>
                    Price: {prodMat?.prodDoc?.sellingPrice}
                  </Typography>
                  <Box display="flex" alignItems="center" marginTop={1}>
                    <Button
                      variant="contained"
                      onClick={() => handleDecrement(prodMat.product)}
                      sx={{ minWidth: "30px", padding: 0, marginRight: 1, color:"black", bgcolor:"wheat" }}
                    >
                      <RemoveCircleOutlineIcon/>
                    </Button>
                    <Typography>Qty: {prodMat?.unit}</Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleIncrement(prodMat.product)}
                      sx={{ minWidth: "30px", padding: 0, marginLeft: 1 ,color:"black", bgcolor:"wheat"}}
                    >
                      <AddCircleOutlineIcon/>
                    </Button>
                  </Box>
                  
                </Box>
                <Box>
                  <Typography variant="h5">
                    {prodMat?.prodDoc?.sellingPrice * prodMat?.unit}
                  </Typography>
                </Box>
              </Paper>
            );
          })}
          {productMatrix?.length > 0 ? (
            <>
            <Typography marginBottom={2}>
              Grand Total :{" "}
              <Typography fontWeight={700} color="black" variant="h3">
                {grandTotal}
              </Typography>{" "}
            </Typography>
            <Button variant="contained" onClick={() => placeOrder()}>Proceed to Payment</Button>
            </>
            
          ) : (
            ``
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
