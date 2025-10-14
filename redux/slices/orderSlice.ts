import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {orderService} from "@/services/orderService";
import {Order, CreateOrderPayload, ErrorResponse} from "@/types";

interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null,
};

// Fetch all orders (admin sees all, user sees own)
export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
    "order/fetchAll",
    async (_, {rejectWithValue}) => {
        try {
            return await orderService.getOrder();
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در دریافت سفارشات");
        }
    }
);

// Create order
export const createOrder = createAsyncThunk<Order, CreateOrderPayload, { rejectValue: string }>(
    "order/create",
    async (payload, {rejectWithValue}) => {
        try {
            return await orderService.create(payload);
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در ایجاد سفارش");
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch all
        builder.addCase(fetchOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
            state.loading = false;
            state.orders = action.payload;
        });
        builder.addCase(fetchOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "خطا";
        });

        // Create
        builder.addCase(createOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
            state.loading = false;
            state.orders.push(action.payload);
        });
        builder.addCase(createOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "خطا";
        });
    },
});

export default orderSlice.reducer;
