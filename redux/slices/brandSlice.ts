import {Brand, BrandPayload, ErrorResponse} from "@/types";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {brandService} from "@/services/brandService";

interface BrandState {
    brands: Brand[];
    loading: {
        fetch: boolean;
        create: boolean;
        deleteId: number | null;
    };
    error: {
        fetch: string | null;
        create: string | null;
        delete: string | null;
    };
}

const initialState: BrandState = {
    brands: [],
    loading: {
        fetch: false,
        create: false,
        deleteId: null,
    },
    error: {
        fetch: null,
        create: null,
        delete: null,
    },
}

// Get All
export const fetchBrands = createAsyncThunk<Brand[], void, { rejectValue: string }>(
    "brand/fetchAll",
    async (_, {rejectWithValue}) => {
        try {
            return await brandService.getAll();
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در دریافت برندها");
        }
    }
)

// Create
export const createBrand = createAsyncThunk<Brand, BrandPayload, { rejectValue: string }>(
    "brand/create",
    async (data, {rejectWithValue}) => {
        try {
            return await brandService.create(data);
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در دریافت برندها");
        }
    }
)

// Delete
export const deleteBrand = createAsyncThunk<number, number, { rejectValue: string }>(
    "brand/delete",
    async (id, {rejectWithValue}) => {
        try {
            await brandService.delete(id);
            return id
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در حذف برند");
        }
    }
)

// Slice
const brandSlice = createSlice({
    name: "brand",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Get All
        builder.addCase(fetchBrands.pending, (state) => {
            state.loading.fetch = true;
            state.error.fetch = null;
        })
        builder.addCase(fetchBrands.fulfilled, (state, action: PayloadAction<Brand[]>) => {
            state.loading.fetch = false;
            state.brands = action.payload;
        })
        builder.addCase(fetchBrands.rejected, (state, action) => {
            state.loading.fetch = false;
            state.error.fetch = action.payload || "خطا";
        })
        // Create
        builder.addCase(createBrand.pending, (state) => {
            state.loading.create = true;
            state.error.create = null;
        });
        builder.addCase(createBrand.fulfilled, (state, action: PayloadAction<Brand>) => {
            state.loading.create = false;
            state.brands.push(action.payload);
        });
        builder.addCase(createBrand.rejected, (state, action) => {
            state.loading.create = false;
            state.error.create = action.payload || "خطا";
        });

        // Delete
        builder.addCase(deleteBrand.pending, (state, action) => {
            state.loading.deleteId = action.meta.arg;
            state.error.delete = null;
        });
        builder.addCase(deleteBrand.fulfilled, (state, action: PayloadAction<number>) => {
            state.loading.deleteId = null;
            state.brands = state.brands.filter((brand) => brand.id !== action.payload);
        });
        builder.addCase(deleteBrand.rejected, (state, action) => {
            state.loading.deleteId = null;
            state.error.delete = action.payload || "خطا";
        });
    }
})

export default brandSlice.reducer;
