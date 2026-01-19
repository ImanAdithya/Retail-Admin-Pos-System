import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types';

const STORAGE_KEY = 'retailadmin_user';

const getStoredUser = (): User | null => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const initialState: AuthState = {
    user: getStoredUser(),
    isAuthenticated: !!getStoredUser(),
    isLoading: false,
    error: null,
};

export const loginUser = createAsyncThunk<User, string, { rejectValue: string }>(
    'auth/login',
    async (email, { rejectWithValue }) => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const users: User[] = await response.json();

            const user = users.find(
                (u) => u.email.toLowerCase() === email.toLowerCase()
            );

            if (!user) {
                return rejectWithValue('Invalid email. Please use an email from the users list.');
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            return user;
        } catch {
            return rejectWithValue('Network error. Please try again.');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem(STORAGE_KEY);
        },
        clearError: (state) => {
            state.error = null;
        },
        checkAuth: (state) => {
            const user = getStoredUser();
            state.user = user;
            state.isAuthenticated = !!user;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Login failed';
            });
    },
});

export const { logout, clearError, checkAuth } = authSlice.actions;
export default authSlice.reducer;
