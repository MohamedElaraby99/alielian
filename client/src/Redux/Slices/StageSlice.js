import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../Helpers/axiosInstance';
import { toast } from 'react-hot-toast';

// Async thunks
export const getAllStages = createAsyncThunk(
  'stage/getAllStages',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/stages', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stages');
    }
  }
);

export const getStageById = createAsyncThunk(
  'stage/getStageById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/stages/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stage');
    }
  }
);

export const createStage = createAsyncThunk(
  'stage/createStage',
  async (stageData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/stages', stageData);
      toast.success('تم إنشاء المرحلة بنجاح');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في إنشاء المرحلة');
      return rejectWithValue(error.response?.data?.message || 'Failed to create stage');
    }
  }
);

export const updateStage = createAsyncThunk(
  'stage/updateStage',
  async ({ id, stageData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/stages/${id}`, stageData);
      toast.success('تم تحديث المرحلة بنجاح');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في تحديث المرحلة');
      return rejectWithValue(error.response?.data?.message || 'Failed to update stage');
    }
  }
);

export const deleteStage = createAsyncThunk(
  'stage/deleteStage',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/stages/${id}`);
      toast.success('تم حذف المرحلة بنجاح');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في حذف المرحلة');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete stage');
    }
  }
);

export const getStageStats = createAsyncThunk(
  'stage/getStageStats',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/stages/${id}/stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stage stats');
    }
  }
);

export const getAllStagesWithStats = createAsyncThunk(
  'stage/getAllStagesWithStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/stages/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stages with stats');
    }
  }
);

export const getAllStagesAdmin = createAsyncThunk(
  'stage/getAllStagesAdmin',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/stages/admin', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all stages');
    }
  }
);

export const toggleStageStatus = createAsyncThunk(
  'stage/toggleStageStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/stages/${id}/toggle-status`);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في تغيير حالة المرحلة');
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle stage status');
    }
  }
);

// Stage Categories thunks
export const fetchStageCategories = createAsyncThunk(
  'stageCategories/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 50, search = '', status = '' } = params;
      const res = await axiosInstance.get(`/stage-categories?page=${page}&limit=${limit}&search=${search}&status=${status}`);
      console.log('fetchStageCategories API response:', res?.data);
      return res?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const createStageCategory = createAsyncThunk(
  'stageCategories/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/stage-categories`, payload);
      toast.success('تم إنشاء الفئة بنجاح');
      return res?.data?.data?.category;
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في إنشاء الفئة');
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const updateStageCategory = createAsyncThunk(
  'stageCategories/update',
  async ({ id, update }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/stage-categories/${id}`, update);
      toast.success('تم تحديث الفئة بنجاح');
      return res?.data?.data?.category;
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في تحديث الفئة');
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteStageCategory = createAsyncThunk(
  'stageCategories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/stage-categories/${id}`);
      toast.success('تم حذف الفئة بنجاح');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في حذف الفئة');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

const initialState = {
  stages: [],
  adminStages: [],
  currentStage: null,
  stagesWithStats: [],
  loading: false,
  adminLoading: false,
  categories: [],
  catLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  }
};

const stageSlice = createSlice({
  name: 'stage',
  initialState,
  reducers: {
    clearCurrentStage: (state) => {
      state.currentStage = null;
    },
    clearStages: (state) => {
      state.stages = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Get all stages
    builder.addCase(getAllStages.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllStages.fulfilled, (state, action) => {
      state.loading = false;
      state.stages = action.payload.data.stages;
      state.pagination = action.payload.data.pagination;
    });
    builder.addCase(getAllStages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get all stages admin (including inactive)
    builder.addCase(getAllStagesAdmin.pending, (state) => {
      state.adminLoading = true;
      state.error = null;
    });
    builder.addCase(getAllStagesAdmin.fulfilled, (state, action) => {
      state.adminLoading = false;
      state.adminStages = action.payload.data.stages;
    });
    builder.addCase(getAllStagesAdmin.rejected, (state, action) => {
      state.adminLoading = false;
      state.error = action.payload;
    });

    // Get stage by ID
    builder.addCase(getStageById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getStageById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentStage = action.payload.data.stage;
    });
    builder.addCase(getStageById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create stage
    builder.addCase(createStage.fulfilled, (state, action) => {
      state.stages.unshift(action.payload.data.stage);
    });

    // Update stage
    builder.addCase(updateStage.fulfilled, (state, action) => {
      const updatedStage = action.payload.data.stage;
      const index = state.stages.findIndex(stage => stage._id === updatedStage._id);
      if (index !== -1) {
        state.stages[index] = updatedStage;
      }
      if (state.currentStage && state.currentStage._id === updatedStage._id) {
        state.currentStage = updatedStage;
      }
    });

    // Delete stage
    builder.addCase(deleteStage.fulfilled, (state, action) => {
      const deletedId = action.payload.data?.stage?._id;
      state.stages = state.stages.filter(stage => stage._id !== deletedId);
      if (state.currentStage && state.currentStage._id === deletedId) {
        state.currentStage = null;
      }
    });

    // Get stage stats
    builder.addCase(getStageStats.fulfilled, (state, action) => {
      const updatedStage = action.payload.data.stage;
      const index = state.stages.findIndex(stage => stage._id === updatedStage._id);
      if (index !== -1) {
        state.stages[index] = updatedStage;
      }
      if (state.currentStage && state.currentStage._id === updatedStage._id) {
        state.currentStage = updatedStage;
      }
    });

    // Get all stages with stats
    builder.addCase(getAllStagesWithStats.fulfilled, (state, action) => {
      state.stagesWithStats = action.payload.data.stages;
    });

    // Toggle stage status
    builder.addCase(toggleStageStatus.fulfilled, (state, action) => {
      const updatedStage = action.payload.data.stage;
      const index = state.stages.findIndex(stage => stage._id === updatedStage._id);
      if (index !== -1) {
        state.stages[index] = updatedStage;
      }
      if (state.currentStage && state.currentStage._id === updatedStage._id) {
        state.currentStage = updatedStage;
      }
    });

    // Categories reducers
    builder.addCase(fetchStageCategories.pending, (state) => {
      state.catLoading = true;
    });
    builder.addCase(fetchStageCategories.fulfilled, (state, action) => {
      state.catLoading = false;
      console.log('fetchStageCategories.fulfilled - action.payload:', action.payload);
      console.log('fetchStageCategories.fulfilled - action.payload.data:', action.payload?.data);
      console.log('fetchStageCategories.fulfilled - action.payload.data.categories:', action.payload?.data?.categories);
      state.categories = action.payload?.data?.categories || [];
      console.log('fetchStageCategories.fulfilled - state.categories after update:', state.categories);
    });
    builder.addCase(fetchStageCategories.rejected, (state) => {
      state.catLoading = false;
    });
    builder.addCase(createStageCategory.fulfilled, (state, action) => {
      state.categories.unshift(action.payload);
    });
    builder.addCase(updateStageCategory.fulfilled, (state, action) => {
      const idx = state.categories.findIndex(c => c._id === action.payload._id);
      if (idx !== -1) state.categories[idx] = action.payload;
    });
    builder.addCase(deleteStageCategory.fulfilled, (state, action) => {
      state.categories = state.categories.filter(c => c._id !== action.payload);
    });
  }
});

export const { clearCurrentStage, clearStages, clearError } = stageSlice.actions;
export default stageSlice.reducer; 