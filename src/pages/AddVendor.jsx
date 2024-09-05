import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Container } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../constants';
import { useNavigate } from 'react-router-dom';

const AddVendor = () => {
    const [vendorData, setVendorData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        shopName: '',
        shopLogo: '',
        category: '',
    });

    const handleChange = (e) => {
        setVendorData({
            ...vendorData,
            [e.target.name]: e.target.value,
        });
    };

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/vendor/create`, vendorData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(response.data);
            alert('Vendor added successfully');
            navigate('/admin/vendors')
            // Handle success (e.g., show a success message or redirect)
        } catch (error) {
            console.error('There was an error adding the vendor!', error);
            alert('There was an error adding vendor');
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Add Vendor
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            name="firstName"
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            value={vendorData.firstName}
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
                            value={vendorData.lastName}
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
                            value={vendorData.phone}
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
                            value={vendorData.password}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="shopName"
                            label="Shop Name"
                            variant="outlined"
                            fullWidth
                            value={vendorData.shopName}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="shopLogo"
                            label="Shop Logo URL"
                            variant="outlined"
                            fullWidth
                            value={vendorData.shopLogo}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="category"
                            label="Category"
                            variant="outlined"
                            fullWidth
                            value={vendorData.category}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Add Vendor
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default AddVendor;
