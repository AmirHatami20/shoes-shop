import {Category, CategoryPayload, ErrorResponse} from "@/types";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {categoryService} from "@/services/categoryService";

interface CategoryState {
    categories: Category[];
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

const initialState: CategoryState = {
    categories: [],
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
export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
    "category/fetchAll",
    async (_, {rejectWithValue}) => {
        try {
            return await categoryService.getAll();
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در دریافت دسته‌بندی‌ها");
        }
    }
);

// Create
export const createCategory = createAsyncThunk<Category, CategoryPayload, { rejectValue: string }>(
    "category/create",
    async (data, {rejectWithValue}) => {
        try {
            return await categoryService.create(data);
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در ایجاد دسته‌بندی");
        }
    }
);

// Delete
export const deleteCategory = createAsyncThunk<number, number, { rejectValue: string }>(
    "category/delete",
    async (id, {rejectWithValue}) => {
        try {
            await categoryService.delete(id);
            return id;
        } catch (err) {
            const error = err as ErrorResponse;
            return rejectWithValue(error.response?.data?.error || "خطا در حذف دسته‌بندی");
        }
    }
);

// Slice
const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch
        builder.addCase(fetchCategories.pending, (state) => {
            state.loading.fetch = true;
            state.error.fetch = null;
        });
        builder.addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
            state.loading.fetch = false;
            state.categories = action.payload;
        });
        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.loading.fetch = false;
            state.error.fetch = action.payload || "خطا در دریافت دسته‌بندی‌ها";
        });

        // Create
        builder.addCase(createCategory.pending, (state) => {
            state.loading.create = true;
            state.error.create = null;
        });
        builder.addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
            state.loading.create = false;
            state.categories.push(action.payload);
        });
        builder.addCase(createCategory.rejected, (state, action) => {
            state.loading.create = false;
            state.error.create = action.payload || "خطا در ایجاد دسته‌بندی";
        });

        // Delete
        builder.addCase(deleteCategory.pending, (state, action) => {
            state.loading.deleteId = action.meta.arg;
            state.error.delete = null;
        });
        builder.addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
            state.categories = state.categories.filter(cat => cat.id !== action.payload);
            state.loading.deleteId = null;
        });
        builder.addCase(deleteCategory.rejected, (state, action) => {
            state.loading.deleteId = null;
            state.error.delete = action.payload || "خطا در حذف دسته‌بندی";
        });

    }
});

export default categorySlice.reducer;
