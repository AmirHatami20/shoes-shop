import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {cartService} from "@/services/cartService";
import {Cart, CartItem, CartItemPayload, ErrorResponse} from "@/types";

interface CartState {
    cart: Cart | null;
    guestCart: CartItem[];
    loading: {
        fetch: boolean;
        create: boolean;
        deleteId: number | null;
        updateId: number | null;
    };
    error: string | null;
}

const initialState: CartState = {
    cart: null,
    guestCart: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("guestCart") || "[]") : [],
    loading: {
        fetch: true,
        create: false,
        updateId: null,
        deleteId: null,
    },
    error: null,
};

// Get Cart
export const fetchCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
    "cart/fetch",
    async (_, {rejectWithValue}) => {
        try {
            return await cartService.getCart();
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در دریافت سبد خرید");
        }
    }
);

// Add Item to Cart
export const addToCart = createAsyncThunk<CartItem, CartItemPayload, { rejectValue: string }>(
    "cart/addItem",
    async (payload, {rejectWithValue}) => {
        try {
            return await cartService.addItem(payload);
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در افزودن محصول به سبد خرید");
        }
    }
);

// Remove Item from Cart
export const removeCartItem = createAsyncThunk<number, number, { rejectValue: string }>(
    "cart/removeItem",
    async (itemId, {rejectWithValue}) => {
        try {
            await cartService.removeItem(itemId);
            return itemId;
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در حذف محصول از سبد خرید");
        }
    }
);

// Update Cart Item
export const updateCartItem = createAsyncThunk<{ id: number; qty: number }, { id: number; qty: number }, {
    rejectValue: string
}>(
    "cart/updateItem",
    async ({id, qty}, {rejectWithValue}) => {
        try {
            await cartService.updateItem(id, qty);
            return {id, qty};
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(
                error.response?.data?.error || "خطا در بروزرسانی محصول"
            );
        }
    });

// Merge guestCart to user cart
export const mergeGuestCart = createAsyncThunk<void, void, { state: { cart: CartState } }>(
    "cart/mergeGuestCart",
    async (_, {getState, dispatch}) => {
        const {guestCart} = getState().cart;
        if (!guestCart.length) return;

        for (const item of guestCart) {
            await dispatch(addToCart({
                productId: item.productId,
                color: item.color,
                size: item.size,
                quantity: item.quantity
            })).unwrap();
        }

        dispatch({type: "cart/clearGuestCart"});
        localStorage.removeItem("guestCart");
    }
);


// Slice
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addGuestCartItem(state, action: PayloadAction<CartItem>) {
            const existing = state.guestCart.find(
                item =>
                    item.productId === action.payload.productId &&
                    item.color === action.payload.color &&
                    item.size === action.payload.size
            );
            if (existing) {
                existing.quantity += action.payload.quantity;
            } else {
                state.guestCart.push(action.payload);
            }
            localStorage.setItem("guestCart", JSON.stringify(state.guestCart));
        },
        removeGuestCartItem(state, action: PayloadAction<number>) {
            state.guestCart = state.guestCart.filter(item => item.id !== action.payload);
            localStorage.setItem("guestCart", JSON.stringify(state.guestCart));
        },
        updateGuestCartItem(state, action: PayloadAction<{ id: number; qty: number }>) {
            const {id, qty} = action.payload;
            const item = state.guestCart.find(i => i.id === id);

            if (item) {
                item.quantity = qty;
                localStorage.setItem("guestCart", JSON.stringify(state.guestCart));
            }
        },
        clearGuestCart(state) {
            state.guestCart = [];
            localStorage.removeItem("guestCart");
        }
    },
    extraReducers: (builder) => {
        // Get Cart
        builder.addCase(fetchCart.pending, (state) => {
            state.loading.fetch = true;
            state.error = null;
        });
        builder.addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
            state.loading.fetch = false;
            state.cart = action.payload;
        });
        builder.addCase(fetchCart.rejected, (state, action) => {
            state.loading.fetch = false;
            state.error = action.payload || "خطا";
        });

        // Add Item
        builder.addCase(addToCart.pending, (state) => {
            state.loading.create = true;
            state.error = null;
        });
        builder.addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
            state.loading.create = false;
            if (state.cart) {
                const existing = state.cart.items?.find(
                    item =>
                        item.productId === action.payload.productId &&
                        item.color === action.payload.color &&
                        item.size === action.payload.size
                );
                if (existing) {
                    existing.quantity += action.payload.quantity;
                } else {
                    state.cart.items?.push(action.payload);
                }
            }
        });
        builder.addCase(addToCart.rejected, (state, action) => {
            state.loading.create = false;
            state.error = action.payload || "خطا";
        });

        // Remove Item
        builder.addCase(removeCartItem.pending, (state, action) => {
            state.loading.deleteId = action.meta.arg;
            state.error = null;
        });
        builder.addCase(removeCartItem.fulfilled, (state, action: PayloadAction<number>) => {
            state.loading.deleteId = null;
            if (state.cart) {
                state.cart.items = state.cart.items?.filter(item => item.id !== action.payload);
            }
        });
        builder.addCase(removeCartItem.rejected, (state, action) => {
            state.loading.deleteId = null;
            state.error = action.payload || "خطا";
        });

        // Update Item
        builder.addCase(updateCartItem.pending, (state, action) => {
            state.loading.updateId = action.meta.arg.id;
            state.error = null;
        });
        builder.addCase(updateCartItem.fulfilled, (state, action: PayloadAction<{ id: number; qty: number }>) => {
                state.loading.updateId = null;
                const {id, qty} = action.payload;
                if (state.cart) {
                    const item = state.cart.items?.find((i) => i.id === id);
                    if (item) {
                        item.quantity = qty;
                    }
                }
            }
        );
        builder.addCase(updateCartItem.rejected, (state, action) => {
            state.loading.updateId = null;
            state.error = action.payload || "خطا در بروزرسانی آیتم";
        });

    },
});

export const {addGuestCartItem, removeGuestCartItem, updateGuestCartItem, clearGuestCart} = cartSlice.actions;
export default cartSlice.reducer;