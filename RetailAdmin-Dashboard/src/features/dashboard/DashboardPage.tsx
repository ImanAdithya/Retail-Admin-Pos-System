import { useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
    People as PeopleIcon,
    Inventory as InventoryIcon,
    ShoppingCart as OrdersIcon,
    TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { StatsCard, LoadingSpinner } from '../../components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useGetUsersQuery, useGetPhotosQuery } from '../../services/api';
import { setCustomers } from '../customers/customerSlice';
import { setProducts } from '../products/productSlice';

const DashboardPage = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { orders } = useAppSelector((state) => state.cart);
    const { customers } = useAppSelector((state) => state.customers);
    const { products } = useAppSelector((state) => state.products);

    const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
    const { data: photosData, isLoading: photosLoading } = useGetPhotosQuery(50);

    useEffect(() => {
        if (usersData && customers.length === 0) {
            dispatch(setCustomers(usersData));
        }
    }, [usersData, dispatch, customers.length]);

    useEffect(() => {
        if (photosData && products.length === 0) {
            dispatch(setProducts(photosData));
        }
    }, [photosData, dispatch, products.length]);

    const isLoading = usersLoading || photosLoading;

    if (isLoading) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    const totalCustomers = customers.length || usersData?.length || 0;
    const totalProducts = products.length || photosData?.length || 0;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Welcome back, {user?.name.split(' ')[0]} 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Here's what's happening with your store today.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatsCard
                        title="Total Customers"
                        value={totalCustomers}
                        icon={<PeopleIcon sx={{ fontSize: 28 }} />}
                        color="primary"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatsCard
                        title="Total Products"
                        value={totalProducts}
                        icon={<InventoryIcon sx={{ fontSize: 28 }} />}
                        color="secondary"                    
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatsCard
                        title="Total Orders"
                        value={totalOrders}
                        icon={<OrdersIcon sx={{ fontSize: 28 }} />}
                        color="warning"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                    <StatsCard
                        title="Total Revenue"
                        value={`$${totalRevenue.toFixed(2)}`}
                        icon={<TrendingIcon sx={{ fontSize: 28 }} />}
                        color="success"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Quick Overview
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: 'white',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            }}
                        >
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Recent Activity
                            </Typography>
                            {orders.length > 0 ? (
                                orders.slice(0, 5).map((order) => (
                                    <Box
                                        key={order.id}
                                        sx={{
                                            py: 1.5,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            '&:last-child': { borderBottom: 'none' },
                                        }}
                                    >
                                        <Typography variant="body2" fontWeight={500}>
                                            Order #{order.id} - {order.customerName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {order.items.length} items • ${order.total.toFixed(2)}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No orders yet. Start by creating an order in the POS section.
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: 'white',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            }}
                        >
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Top Products
                            </Typography>
                            {products.slice(0, 5).map((product) => (
                                <Box
                                    key={product.id}
                                    sx={{
                                        py: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        '&:last-child': { borderBottom: 'none' },
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={product.thumbnailUrl}
                                        alt={product.title}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 1,
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                        <Typography variant="body2" fontWeight={500} noWrap>
                                            {product.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ${product.price.toFixed(2)} • Stock: {product.stock}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default DashboardPage;
