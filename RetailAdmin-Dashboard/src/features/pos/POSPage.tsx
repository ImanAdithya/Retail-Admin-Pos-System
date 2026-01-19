import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    IconButton,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Snackbar,
    InputAdornment,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
    ShoppingCart as CartIcon,
    Person as PersonIcon,
    Search as SearchIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { LoadingSpinner } from '../../components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useGetUsersQuery, useGetPhotosQuery, useCreateOrderMutation } from '../../services/api';
import { setCustomers } from '../customers/customerSlice';
import { setProducts, updateStock } from '../products/productSlice';
import {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCustomer,
    addOrder,
    selectCartTotal,
} from './cartSlice';
import type { Product, Order } from '../../types';

const POSPage = () => {
    const dispatch = useAppDispatch();
    const { items, selectedCustomer, orders } = useAppSelector((state) => state.cart);
    const { customers } = useAppSelector((state) => state.customers);
    const { products } = useAppSelector((state) => state.products);
    const cartTotal = useAppSelector(selectCartTotal);

    const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
    const { data: photosData, isLoading: photosLoading } = useGetPhotosQuery(50);
    const [createOrderMutation] = useCreateOrderMutation();

    const [searchQuery, setSearchQuery] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

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

    const handleAddToCart = (product: Product) => {
        const cartItem = items.find((item) => item.product.id === product.id);
        const currentQty = cartItem?.quantity || 0;

        if (currentQty >= product.stock) {
            setSnackbarMessage(`Not enough stock for ${product.title}`);
            setSnackbarOpen(true);
            return;
        }

        dispatch(addToCart(product));
        setSnackbarMessage(`${product.title} added to cart`);
        setSnackbarOpen(true);
    };

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            dispatch(removeFromCart(productId));
        } else {
            const product = products.find((p) => p.id === productId);
            if (product && newQuantity > product.stock) {
                setSnackbarMessage('Not enough stock available');
                setSnackbarOpen(true);
                return;
            }
            dispatch(updateQuantity({ productId, quantity: newQuantity }));
        }
    };

    const handleCheckout = async () => {
        if (!selectedCustomer) {
            setSnackbarMessage('Please select a customer first');
            setSnackbarOpen(true);
            return;
        }

        if (items.length === 0) {
            setSnackbarMessage('Cart is empty');
            setSnackbarOpen(true);
            return;
        }

        const order: Order = {
            id: orders.length + 1,
            customerId: selectedCustomer.id,
            customerName: selectedCustomer.name,
            items: [...items],
            total: cartTotal,
            createdAt: new Date().toISOString(),
        };

        await createOrderMutation({
            title: `Order #${order.id}`,
            body: JSON.stringify(order),
            userId: selectedCustomer.id,
        });

        items.forEach((item) => {
            dispatch(updateStock({ productId: item.product.id, quantity: item.quantity }));
        });

        dispatch(addOrder(order));
        dispatch(clearCart());

        setSnackbarMessage(`Order #${order.id} placed successfully! Total: $${cartTotal.toFixed(2)}`);
        setSnackbarOpen(true);
    };

    // Filter products by search
    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading && products.length === 0) {
        return <LoadingSpinner message="Loading POS..." />;
    }

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Point of Sale
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Create orders by selecting products and a customer
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Card sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                            <FormControl sx={{ minWidth: 250 }}>
                                <InputLabel>Select Customer</InputLabel>
                                <Select
                                    value={selectedCustomer?.id || ''}
                                    label="Select Customer"
                                    onChange={(e) => {
                                        const customer = customers.find((c) => c.id === e.target.value);
                                        dispatch(setCustomer(customer || null));
                                    }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <PersonIcon color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    {customers.map((customer) => (
                                        <MenuItem key={customer.id} value={customer.id}>
                                            {customer.name} - {customer.email}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {selectedCustomer && (
                                <Chip
                                    label={`Customer: ${selectedCustomer.name}`}
                                    color="primary"
                                    onDelete={() => dispatch(setCustomer(null))}
                                />
                            )}
                        </Box>

                        <TextField
                            fullWidth
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ mb: 3 }}
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

                        <Grid container spacing={2}>
                            {filteredProducts.slice(0, 20).map((product) => (
                                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product.id}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                boxShadow: 4,
                                                transform: 'translateY(-2px)',
                                            },
                                        }}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        <Box
                                            component="img"
                                            src={product.thumbnailUrl}
                                            alt={product.title}
                                            sx={{
                                                width: '100%',
                                                height: 100,
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <CardContent sx={{ p: 1.5 }}>
                                            <Typography variant="caption" noWrap display="block">
                                                {product.title}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                                <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                                                    ${product.price.toFixed(2)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    x{product.stock}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Card
                        sx={{
                            position: { lg: 'sticky' },
                            top: { lg: 80 },
                            maxHeight: { lg: 'calc(100vh - 100px)' },
                            overflow: 'auto',
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <CartIcon color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    Cart ({items.length} items)
                                </Typography>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            {items.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <CartIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                                    <Typography color="text.secondary">
                                        Cart is empty
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Click on products to add them
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    {items.map((item) => (
                                        <Box
                                            key={item.product.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                py: 1.5,
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={item.product.thumbnailUrl}
                                                alt={item.product.title}
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 1,
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                                <Typography variant="body2" fontWeight={500} noWrap>
                                                    {item.product.title}
                                                </Typography>
                                                <Typography variant="caption" color="primary.main" fontWeight={600}>
                                                    ${item.product.price.toFixed(2)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleQuantityChange(item.product.id, item.quantity - 1)
                                                    }
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <Typography variant="body2" fontWeight={600} sx={{ minWidth: 24, textAlign: 'center' }}>
                                                    {item.quantity}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleQuantityChange(item.product.id, item.quantity + 1)
                                                    }
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => dispatch(removeFromCart(item.product.id))}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}

                                    {/* Cart Totals */}
                                    <Box sx={{ mt: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Subtotal
                                            </Typography>
                                            <Typography variant="body2">
                                                ${cartTotal.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Tax (0%)
                                            </Typography>
                                            <Typography variant="body2">$0.00</Typography>
                                        </Box>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                            <Typography variant="h6" fontWeight={700}>
                                                Total
                                            </Typography>
                                            <Typography variant="h6" fontWeight={700} color="primary.main">
                                                ${cartTotal.toFixed(2)}
                                            </Typography>
                                        </Box>

                                        {/* Checkout Button */}
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            startIcon={<CheckIcon />}
                                            onClick={handleCheckout}
                                            disabled={!selectedCustomer || items.length === 0}
                                            sx={{
                                                py: 1.5,
                                                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                                fontSize: '1rem',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #0d7d73 0%, #2ecc71 100%)',
                                                },
                                            }}
                                        >
                                            Checkout
                                        </Button>

                                        {!selectedCustomer && (
                                            <Alert severity="warning" sx={{ mt: 2 }}>
                                                Please select a customer before checkout
                                            </Alert>
                                        )}
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default POSPage;
