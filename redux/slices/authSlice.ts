import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authService} from "@/services/authService";
import {ErrorResponse, LoginData, RegisterData, User} from "@/types";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

// LOGIN
export const login = createAsyncThunk<User, LoginData, { rejectValue: string }>(
    "auth/login",
    async (data, {rejectWithValue}) => {
        try {
            return await authService.login(data);
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در ورود");
        }
    });

// REGISTER
export const register = createAsyncThunk<User, RegisterData, { rejectValue: string }>(
    "auth/register",
    async (data, {rejectWithValue}) => {
        try {
            return await authService.register(data);
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در ثبت نام");
        }
    });

// GET ME
export const getMe = createAsyncThunk<User, void, { rejectValue: string }>(
    "auth/getMe",
    async (_, {rejectWithValue}) => {
        try {
            return await authService.getMe();
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در دریافت اطلاعات کاربر");
        }
    });

// Logout
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
    "auth/logout",
    async (_, {rejectWithValue}) => {
        try {
            await authService.logout();
        } catch (err: unknown) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در خروج");
        }
    }
);


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // LOGIN
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "خطا در ورود";
            })

            // REGISTER
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "خطا در ثبت نام";
            })

            // GET ME
            .addCase(getMe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMe.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "خطا در دریافت اطلاعات کاربر";
            })

            // LOGOUT
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.error = null;
                state.loading = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.payload || "خطا در خروج";
                state.loading = false;
            });
    },
});


export default authSlice.reducer;
