import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CustomerState, User } from '../../types';

const initialState: CustomerState = {
    customers: [],
    selectedCustomer: null,
    isLoading: false,
    error: null,
};

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        setCustomers: (state, action: PayloadAction<User[]>) => {
            state.customers = action.payload;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setSelectedCustomer: (state, action: PayloadAction<User | null>) => {
            state.selectedCustomer = action.payload;
        },
        addCustomer: (state, action: PayloadAction<User>) => {
            const newId = state.customers.length > 0
                ? Math.max(...state.customers.map(c => c.id)) + 1
                : 1;
            state.customers.unshift({ ...action.payload, id: newId });
        },
        updateCustomer: (state, action: PayloadAction<User>) => {
            const index = state.customers.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.customers[index] = action.payload;
            }
        },
        deleteCustomer: (state, action: PayloadAction<number>) => {
            state.customers = state.customers.filter(c => c.id !== action.payload);
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setCustomers,
    setLoading,
    setSelectedCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    setError,
} = customerSlice.actions;

export default customerSlice.reducer;
