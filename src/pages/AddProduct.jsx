import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Container, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../constants';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const [productData, setProductData] = useState({
        name: '',
        category: '',
        subCategory: '',
        costPrice: '',
        sellingPrice: '',
        vendor: '',
    });

    const [vendors, setVendors] = useState([]);
    const navigate = useNavigate();

    // Fetch vendors in useEffect
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/vendor/getAll?page=1&pageSize=100&sortField=dateCreated&sortOrder=desc`);
                setVendors(response.data.vendors || []);
            } catch (error) {
                console.error('There was an error fetching vendors!', error);
            }
        };

        fetchVendors();
    }, []);

    const handleChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/product/create`, productData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(response.data);
            navigate('/admin/products');
            alert('Product added successfully');
            // Handle success (e.g., show a success message or clear the form)
        } catch (error) {
            console.error('There was an error adding the product!', error);
            alert('Error while adding product');
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Add Product
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            name="name"
                            label="Product Name"
                            variant="outlined"
                            fullWidth
                            value={productData.name}
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
                            value={productData.category}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="subCategory"
                            label="Sub Category"
                            variant="outlined"
                            fullWidth
                            value={productData.subCategory}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="costPrice"
                            label="Cost Price"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={productData.costPrice}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="sellingPrice"
                            label="Selling Price"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={productData.sellingPrice}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="outlined" fullWidth required>
                            <InputLabel id="vendor-label">Vendor</InputLabel>
                            <Select
                                labelId="vendor-label"
                                name="vendor"
                                value={productData.vendor}
                                onChange={handleChange}
                                label="Vendor"
                            >
                                {vendors.map((vendor) => (
                                    <MenuItem key={vendor._id} value={vendor._id}>
                                        {vendor.shopName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Add Product
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default AddProduct;
