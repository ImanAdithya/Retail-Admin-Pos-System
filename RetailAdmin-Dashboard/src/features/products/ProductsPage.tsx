import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    InputAdornment,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { ProductCard, LoadingSpinner } from '../../components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useGetPhotosQuery } from '../../services/api';
import { setProducts } from './productSlice';
import { addToCart } from '../pos/cartSlice';
import type { Product } from '../../types';

const ITEMS_PER_PAGE = 12;

const ProductsPage = () => {
    const dispatch = useAppDispatch();
    const { products } = useAppSelector((state) => state.products);
    const { data: photosData, isLoading } = useGetPhotosQuery(50);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (photosData && products.length === 0) {
            dispatch(setProducts(photosData));
        }
    }, [photosData, dispatch, products.length]);

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart(product));
    };

    const filteredProducts = products
        .filter((product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return a.price - b.price;
                case 'stock':
                    return b.stock - a.stock;
                default:
                    return a.title.localeCompare(b.title);
            }
        });

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading && products.length === 0) {
        return <LoadingSpinner message="Loading products..." />;
    }

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Products
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Browse and manage your product catalog
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 4,
                    flexDirection: { xs: 'column', sm: 'row' },
                }}
            >
                <TextField
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1);
                    }}
                    sx={{ flex: 1 }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }
                    }}
                />
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortBy}
                        label="Sort By"
                        onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'stock')}
                    >
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="price">Price (Low to High)</MenuItem>
                        <MenuItem value="stock">Stock (High to Low)</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Showing {paginatedProducts.length} of {filteredProducts.length} products
            </Typography>

            <Grid container spacing={3}>
                {paginatedProducts.map((product) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                        <ProductCard product={product} onAddToCart={handleAddToCart} />
                    </Grid>
                ))}
            </Grid>

            {paginatedProducts.length === 0 && (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        px: 2,
                    }}
                >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No products found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Try adjusting your search criteria
                    </Typography>
                </Box>
            )}

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Box>
    );
};

export default ProductsPage;
