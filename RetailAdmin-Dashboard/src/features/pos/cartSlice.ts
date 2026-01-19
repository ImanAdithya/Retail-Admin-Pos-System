import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartState, Product, User, Order } from '../../types';

const initialState: CartState = {
    items: [],
    selectedCustomer: null,
    orders: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCustomer: (state, action: PayloadAction<User | null>) => {
            state.selectedCustomer = action.payload;
        },
        addToCart: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find(item => item.product.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ product: action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.product.id !== action.payload);
        },
        updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
            const item = state.items.find(item => item.product.id === action.payload.productId);
            if (item) {
                if (action.payload.quantity <= 0) {
                    state.items = state.items.filter(i => i.product.id !== action.payload.productId);
                } else {
                    item.quantity = action.payload.quantity;
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.selectedCustomer = null;
        },
        addOrder: (state, action: PayloadAction<Order>) => {
            state.orders.push(action.payload);
        },
    },
});

export const selectCartTotal = (state: { cart: CartState }) =>
    state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

export const selectCartItemCount = (state: { cart: CartState }) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0);

export const {
    setCustomer,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addOrder,
} = cartSlice.actions;

export default cartSlice.reducer;
