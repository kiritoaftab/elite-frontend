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
import { Button, Grid, Paper, TextField } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import jsPDF from 'jspdf';
import Receipt from "./Receipt";
import { createRoot } from "react-dom/client";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';


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

  const [selectedPayment, setSelectedPayment] = useState(''); // No button selected by default

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
  };

  const [query,setQuery] = useState('');

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
    const inchToPt = 72;  // Conversion factor from inches to points
    const pageWidth = 3.14 * inchToPt;  // Convert width to points (3.14 inches, ~226 pts)
    const lineHeight = 4;  // Line height between text elements
    const padding = 2;  // Padding for the receipt content

    // Calculate dynamic height based on number of items (we give about 60 pts for each order)
    const contentHeight = padding + (payment.ordersList.length * 10) + padding;
    const pageHeight = contentHeight;  // Set the height based on content (no excessive length)

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [pageWidth, pageHeight]  // Set the dynamic page size based on content
    });

    const shopName = payment.ordersList[0].vendor.shopName || 'shopname';
    doc.setFontSize(10);
    doc.text(`${shopName}`, 10, padding);

    payment.ordersList.forEach((order, index) => {
        const yPosition = padding + 40 + index * 60;  // Position for each order
        doc.setFontSize(6);
        doc.text(`Product: ${order.product.name}`, 10, yPosition);
        doc.text(`Quantity: ${order.unit}`, 10, yPosition + lineHeight);
        doc.text('-------------------------------', 10, yPosition + lineHeight * 2);
    });

    const pdfFile = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfFile);
    const pdfWindow = window.open(pdfUrl);

    // Initiate print on the new window
    pdfWindow.onload = () => {
        pdfWindow.print();
    };
};

const generatePDFHtml = (payment, onComplete) => {
  try {
    const printContainer = document.createElement('div');
    printContainer.id = 'printContainer';
    document.body.appendChild(printContainer);

    const root = createRoot(printContainer);

    const closePrint = () => {
      root.unmount();
      document.body.removeChild(printContainer);
      if (onComplete) onComplete();  // Notify that printing is done
    };

    root.render(<Receipt payment={payment} close={closePrint} />);

    setTimeout(() => {
      window.print();
      window.onafterprint = () => {
        closePrint();
      };
    }, 500); // Adjust timeout if needed
  } catch (error) {
    console.error('Error while generating the PDF:', error);
    alert('Error while generating PDF');
    if (onComplete) onComplete();  // Ensure the process completes even on error
  }
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

  const placeOrder = async () => {
    try {
      console.log(productMatrix);
      console.log(cashierDoc?._id);
  
      const res = await axios.post(`${BASE_URL}/order/create/v2`, {
        productMatrix: productMatrix,
        cashier: cashierDoc?._id
      });
  
      console.log(res.data);
      alert('Cart Checked out!!!');
      setPaymentsList(res.data.paymentsList);
      setUniqueVendor(res.data.uniqueVendors);
  
      const paymentIds = res.data.paymentsList.map((pay) => pay._id);
  
      const res2 = await axios.post(`${BASE_URL}/payment/list`, { paymentIds: paymentIds });
      console.log(res2.data);
  
      // Function to print each PDF
      const printPDFsSequentially = async (payments) => {
        for (const payment of payments) {
          await new Promise((resolve) => {
            generatePDFHtml(payment, resolve);
          });
        }
        alert('All PDFs have been printed!');
      };
  
      // Start the printing process
      await printPDFsSequentially(res2.data.payments);
      const res3 = await axios.post(`${BASE_URL}/payment/updateMany`,{
        paymentIds,
        status:"PAID",
        mode:selectedPayment
      })
      console.log(res3.data);
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert('Error while placing order');
    }
  };

  const handleSearchQuery = async(e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${BASE_URL}/product/query/${query}`);
      console.log(res.data);
      setProducts(res.data.products);
    } catch (error) {
      console.log('Error while fetching products');
    }finally{
      setQuery('');
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
        <form style={{marginBottom:15}} onSubmit={handleSearchQuery}>
          <TextField
              name="query"
              label="Search By Name..."
              variant="outlined"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              required
          />
          {/* <Button variant="contained">Search</Button> */}
        </form>


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
            <Grid container spacing={2} marginTop={4}>
              {products?.map((product) => {
                return (
                  <Grid item xs={12} md={6} lg={4}>
                    <Paper
                      sx={{
                        padding: 3,
                      }}
                    >
                      <Typography variant="h5" color="black" fontWeight={600}>
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
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={2}>
              <Button
                variant={selectedPayment === 'CASH' ? 'contained' : 'outlined'}
                onClick={() => handlePaymentSelect('CASH')}
                startIcon={<AttachMoneyIcon />}
              >
                CASH
              </Button>
              <Button
                variant={selectedPayment === 'UPI' ? 'contained' : 'outlined'}
                onClick={() => handlePaymentSelect('UPI')}
                startIcon={<CreditCardIcon />}
              >
                UPI
              </Button>
              <Button
                variant={selectedPayment === 'STAFF' ? 'contained' : 'outlined'}
                onClick={() => handlePaymentSelect('STAFF')}
                startIcon={<CreditCardIcon />}
              >
                STAFF
              </Button>
            </Box>
            {selectedPayment.length>0 ? (
              <Button variant="contained" onClick={() => placeOrder()} sx={{marginTop:2}}>Proceed to Payment</Button>
            ):``}
            </>
            
          ) : (
            ``
          )}


        </Box>
      </Drawer>
    </Box>
  );
}
