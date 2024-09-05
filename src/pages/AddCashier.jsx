import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCashier = () => {
    const [cashierData, setCashierData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
    });

    const handleChange = (e) => {
        setCashierData({
            ...cashierData,
            [e.target.name]: e.target.value,
        });
    };

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/cashier/create', cashierData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(response.data);
            // Handle success (e.g., show a success message or redirect)
            alert('Created cashier successfully');
            navigate('/admin/cashier');

        } catch (error) {
            console.error('There was an error adding the cashier!', error);
            // Handle error (e.g., show an error message)
            alert('Error while adding cashier:'+error?.response?.data?.msg)
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Add Cashier
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            name="firstName"
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            value={cashierData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="lastName"
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            value={cashierData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="phone"
                            label="Phone"
                            variant="outlined"
                            fullWidth
                            value={cashierData.phone}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="password"
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            value={cashierData.password}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Add Cashier
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default AddCashier;
