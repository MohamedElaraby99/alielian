import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../Helpers/axiosInstance';
import { toast } from 'react-hot-toast';

// Async thunks
export const getAllStageCategories = createAsyncThunk(
  'stageCategory/getAllStageCategories',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/stage-categories', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stage categories');
    }
  }
);

export const getStageCategoryById = createAsyncThunk(
  'stageCategory/getStageCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/stage-categories/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stage category');
    }
  }
);

export const createStageCategory = createAsyncThunk(
  'stageCategory/createStageCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/stage-categories', categoryData);
      toast.success('تم إنشاء فئة المرحلة بنجاح');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في إنشاء فئة المرحلة');
      return rejectWithValue(error.response?.data?.message || 'Failed to create stage category');
    }
  }
);

export const updateStageCategory = createAsyncThunk(
  'stageCategory/updateStageCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/stage-categories/${id}`, categoryData);
      toast.success('تم تحديث فئة المرحلة بنجاح');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في تحديث فئة المرحلة');
      return rejectWithValue(error.response?.data?.message || 'Failed to update stage category');
    }
  }
);

export const deleteStageCategory = createAsyncThunk(
  'stageCategory/deleteStageCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/stage-categories/${id}`);
      toast.success('تم حذف فئة المرحلة بنجاح');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في حذف فئة المرحلة');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete stage category');
    }
  }
);

const initialState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  }
};

const stageCategorySlice = createSlice({
  name: 'stageCategory',
  initialState,
  reducers: {
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearCategories: (state) => {
      state.categories = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Get all stage categories
    builder.addCase(getAllStageCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllStageCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload.data.categories;
      state.pagination = action.payload.data.pagination;
    });
    builder.addCase(getAllStageCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get stage category by ID
    builder.addCase(getStageCategoryById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getStageCategoryById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentCategory = action.payload.data.category;
    });
    builder.addCase(getStageCategoryById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create stage category
    builder.addCase(createStageCategory.fulfilled, (state, action) => {
      state.categories.unshift(action.payload.data.category);
    });

    // Update stage category
    builder.addCase(updateStageCategory.fulfilled, (state, action) => {
      const updatedCategory = action.payload.data.category;
      const index = state.categories.findIndex(category => category._id === updatedCategory._id);
      if (index !== -1) {
        state.categories[index] = updatedCategory;
      }
      if (state.currentCategory && state.currentCategory._id === updatedCategory._id) {
        state.currentCategory = updatedCategory;
      }
    });

    // Delete stage category
    builder.addCase(deleteStageCategory.fulfilled, (state, action) => {
      const deletedId = action.payload.data?.id;
      state.categories = state.categories.filter(category => category._id !== deletedId);
      if (state.currentCategory && state.currentCategory._id === deletedId) {
        state.currentCategory = null;
      }
    });
  }
});

export const { clearCurrentCategory, clearCategories, clearError } = stageCategorySlice.actions;
export default stageCategorySlice.reducer;
