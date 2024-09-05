import React from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../constants';
import { useNavigate } from 'react-router-dom';

const Login = () => {


    const navigate = useNavigate();
    const handleLoginApi = async (reqBody) => {
        try {
            const res = await axios.post(`${BASE_URL}/user/login`,reqBody);
            console.log(res.data);
            alert('Logged in successfully');
            sessionStorage.setItem("userId",res.data.userDoc._id);
            sessionStorage.setItem('role',res.data.userDoc.role);
            const role = res.data.userDoc.role;
            navigate('/admin/home');
            
        } catch (error) {
            console.log(error);
            alert('Error while logging in '+error?.response?.data?.msg);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const phone = formData.get('phone');
        const password = formData.get('password');
        console.log(phone,password);
        handleLoginApi({
            phone,
            password
        })
    }

  return (
    <Container maxWidth="md" sx={{
        display:"grid",
        placeItems:"center",
        alignItems:"center",
        height:"100vh"
    }}>
        <Paper elevation={6} sx={{
            padding:6
        }}>
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Elite Experience POS Login
        </Typography>
        <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="tel"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
        </Paper>
      
    </Container>
  );
};

export default Login;
