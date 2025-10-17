import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {productService} from "@/services/productService";
import {ErrorResponse, Product, ProductQueryParams} from "@/types";

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface ProductState {
    products: Product[];
    pagination: Pagination;
    selectedProduct: Product | null;
    loading: {
        fetchAll: boolean;
        fetchOne: boolean;
        create: boolean;
        update: boolean;
        deleteId: number | null;
    };
    error: {
        fetchAll: string | null;
        fetchOne: string | null;
        create: string | null;
        update: string | null;
        delete: string | null;
    };
}

const initialState: ProductState = {
    products: [],
    pagination: {total: 0, page: 1, limit: 10, totalPages: 0},
    selectedProduct: null,
    loading: {
        fetchAll: true,
        fetchOne: false,
        create: false,
        update: false,
        deleteId: null,
    },
    error: {
        fetchAll: null,
        fetchOne: null,
        create: null,
        update: null,
        delete: null,
    },
};

// ================= Thunks =================

// Fetch All Products
export const fetchProducts = createAsyncThunk<
    { data: Product[]; pagination: Pagination },
    ProductQueryParams | undefined,
    { rejectValue: string }
>(
    "product/fetchAll",
    async (params, {rejectWithValue}) => {
        try {
            return await productService.getAll(params);
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در دریافت محصولات");
        }
    }
);

// Fetch One Product
export const fetchProduct = createAsyncThunk<Product, number, { rejectValue: string }>(
    "product/fetchOne",
    async (id, {rejectWithValue}) => {
        try {
            return await productService.getOne(id);
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در دریافت محصول");
        }
    }
);

// Create Product
export const createProduct = createAsyncThunk<Product, FormData, { rejectValue: string }>(
    "product/create",
    async (formData, {rejectWithValue}) => {
        try {
            return await productService.create(formData);
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در ایجاد محصول");
        }
    }
);

// Update Product
export const updateProduct = createAsyncThunk<Product, { id: number; formData: FormData }, { rejectValue: string }>(
    "product/update",
    async ({id, formData}, {rejectWithValue}) => {
        try {
            return await productService.update(id, formData);
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در بروزرسانی محصول");
        }
    }
);

// Delete Product
export const deleteProduct = createAsyncThunk<number, number, { rejectValue: string }>(
    "product/delete",
    async (id, {rejectWithValue}) => {
        try {
            await productService.delete(id);
            return id;
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در حذف محصول");
        }
    }
);

// ================= Slice =================
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch All
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading.fetchAll = true;
            state.error.fetchAll = null;
        });
        builder.addCase(fetchProducts.fulfilled, (
            state,
            action: PayloadAction<{ data: Product[]; pagination: Pagination }>
        ) => {
            state.loading.fetchAll = false;
            state.products = action.payload.data;
            state.pagination = action.payload.pagination;
        });
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading.fetchAll = false;
            state.error.fetchAll = action.payload || "خطا";
        });

        // Fetch One
        builder.addCase(fetchProduct.pending, (state) => {
            state.loading.fetchOne = true;
            state.error.fetchOne = null;
        });
        builder.addCase(fetchProduct.fulfilled, (state, action: PayloadAction<Product>) => {
            state.loading.fetchOne = false;
            state.selectedProduct = action.payload;
        });
        builder.addCase(fetchProduct.rejected, (state, action) => {
            state.loading.fetchOne = false;
            state.error.fetchOne = action.payload || "خطا";
        });

        // Create
        builder.addCase(createProduct.pending, (state) => {
            state.loading.create = true;
            state.error.create = null;
        });
        builder.addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
            state.loading.create = false;
            state.products.push(action.payload);
        });
        builder.addCase(createProduct.rejected, (state, action) => {
            state.loading.create = false;
            state.error.create = action.payload || "خطا";
        });

        // Update
        builder.addCase(updateProduct.pending, (state) => {
            state.loading.update = true;
            state.error.update = null;
        });
        builder.addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
            state.loading.update = false;
            const index = state.products.findIndex((p) => p.id === action.payload.id);
            if (index !== -1) state.products[index] = action.payload;
            if (state.selectedProduct?.id === action.payload.id) state.selectedProduct = action.payload;
        });
        builder.addCase(updateProduct.rejected, (state, action) => {
            state.loading.update = false;
            state.error.update = action.payload || "خطا";
        });

        // Delete
        builder.addCase(deleteProduct.pending, (state, action) => {
            state.loading.deleteId = action.meta.arg;
            state.error.delete = null;
        });
        builder.addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
            state.loading.deleteId = null;
            state.products = state.products.filter((p) => p.id !== action.payload);
            if (state.selectedProduct?.id === action.payload) state.selectedProduct = null;
        });
        builder.addCase(deleteProduct.rejected, (state, action) => {
            state.loading.deleteId = null;
            state.error.delete = action.payload || "خطا";
        });
    },
});

export default productSlice.reducer;
