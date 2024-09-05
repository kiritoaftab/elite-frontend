import React, { Suspense } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MiniDrawer from './pages/AdminLayout';
import AdminVendor from './pages/AdminVendor';
import AdminCashier from './pages/AdminCashier';
import AdminPayments from './pages/AdminPayments';
import AdminProducts from './pages/AdminProducts';
import AdminReports from './pages/AdminReports';
import AdminOrders from './pages/AdminOrders';
import AddVendor from './pages/AddVendor';
import AddCashier from './pages/AddCashier';
import AddProduct from './pages/AddProduct';

// Lazy load the Login component
const Login = React.lazy(() => import('./pages/Login'));
const AdminHome = React.lazy(() => import('./pages/AdminHome'));

function App() {
  return (
    <Router>
      <Routes>
      
        <Route
          path="/"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Login />
            </Suspense>
          }
        />
        <Route path='admin' element={<MiniDrawer/>}>
          <Route path='home' element={<AdminHome/>} />
          <Route path='vendors' element={<AdminVendor/>} />
          <Route path='cashier' element={<AdminCashier/>} />
          <Route path='products' element={<AdminProducts/>} />
          <Route path='reports' element={<AdminReports/>} />
          <Route path='payments' element={<AdminPayments/>} />
          <Route path='orders' element={<AdminOrders/>} />
          <Route path='addVendor' element={<AddVendor/>}/>
          <Route path='addCashier' element={<AddCashier/>}/>
          <Route path='addProduct' element={<AddProduct/>} />
        </Route>
       
      </Routes>
    </Router>
  );
}

export default App;
