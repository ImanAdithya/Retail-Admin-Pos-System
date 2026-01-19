import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProductState, Product } from '../../types';

const initialState: ProductState = {
    products: [],
    isLoading: false,
    error: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        updateStock: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
            const product = state.products.find(p => p.id === action.payload.productId);
            if (product) {
                product.stock = Math.max(0, product.stock - action.payload.quantity);
            }
        },
        restoreStock: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
            const product = state.products.find(p => p.id === action.payload.productId);
            if (product) {
                product.stock += action.payload.quantity;
            }
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setProducts,
    setLoading,
    updateStock,
    restoreStock,
    setError,
} = productSlice.actions;

export default productSlice.reducer;
