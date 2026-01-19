import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Button,
    Chip,
} from '@mui/material';
import { ShoppingCart as CartIcon } from '@mui/icons-material';
import type { Product } from '../../types';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    showAddToCart?: boolean;
}

const ProductCard = ({ product, onAddToCart, showAddToCart = true }: ProductCardProps) => {
    const isLowStock = product.stock < 10;
    const isOutOfStock = product.stock === 0;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                },
            }}
        >
            {isLowStock && (
                <Chip
                    label={isOutOfStock ? 'Out of Stock' : `Only ${product.stock} left`}
                    color={isOutOfStock ? 'error' : 'warning'}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 1,
                        fontWeight: 600,
                    }}
                />
            )}

            <CardMedia
                component="img"
                height="160"
                image={product.thumbnailUrl}
                alt={product.title}
                sx={{
                    objectFit: 'cover',
                    backgroundColor: '#f5f5f5',
                }}
            />

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                    SKU: {product.id}
                </Typography>

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '2.5em',
                    }}
                >
                    {product.title}
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" color="primary.main" fontWeight={700}>
                            ${product.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Stock: {product.stock}
                        </Typography>
                    </Box>

                    {showAddToCart && (
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<CartIcon />}
                            onClick={() => onAddToCart?.(product)}
                            disabled={isOutOfStock}
                            sx={{
                                py: 1,
                                background: isOutOfStock
                                    ? undefined
                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                },
                            }}
                        >
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
