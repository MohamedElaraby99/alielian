import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../Helpers/axiosInstance';

// Async thunks for exam questions
export const createExamQuestion = createAsyncThunk(
    'examQuestion/create',
    async (questionData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/exam-questions', questionData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create exam question');
        }
    }
);

export const getAllExamQuestions = createAsyncThunk(
    'examQuestion/getAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/exam-questions', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch exam questions');
        }
    }
);

export const getExamQuestionById = createAsyncThunk(
    'examQuestion/getById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/exam-questions/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch exam question');
        }
    }
);

export const updateExamQuestion = createAsyncThunk(
    'examQuestion/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/exam-questions/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update exam question');
        }
    }
);

export const deleteExamQuestion = createAsyncThunk(
    'examQuestion/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/exam-questions/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete exam question');
        }
    }
);

export const toggleQuestionStatus = createAsyncThunk(
    'examQuestion/toggleStatus',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/exam-questions/${id}/toggle-status`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle question status');
        }
    }
);

export const getQuestionsByCourse = createAsyncThunk(
    'examQuestion/getByCourse',
    async ({ courseId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/exam-questions/course/${courseId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch exam questions');
        }
    }
);

export const bulkCreateQuestions = createAsyncThunk(
    'examQuestion/bulkCreate',
    async (questions, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/exam-questions/bulk', { questions });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to bulk create questions');
        }
    }
);

export const getQuestionStatistics = createAsyncThunk(
    'examQuestion/getStatistics',
    async (courseId = null, { rejectWithValue }) => {
        try {
            const url = courseId ? `/exam-questions/statistics/${courseId}` : '/exam-questions/statistics';
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch question statistics');
        }
    }
);

const initialState = {
    questions: [],
    selectedQuestion: null,
    statistics: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        resultsPerPage: 20
    },
    filters: {
        stageId: '',
        subjectId: '',
        courseId: '',
        difficulty: '',
        isActive: '',
        search: ''
    },
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null
};

const examQuestionSlice = createSlice({
    name: 'examQuestion',
    initialState,
    reducers: {
        clearExamQuestionError: (state) => {
            state.error = null;
            state.actionError = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                stageId: '',
                subjectId: '',
                courseId: '',
                difficulty: '',
                isActive: '',
                search: ''
            };
        },
        setSelectedQuestion: (state, action) => {
            state.selectedQuestion = action.payload;
        },
        clearSelectedQuestion: (state) => {
            state.selectedQuestion = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create exam question
            .addCase(createExamQuestion.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(createExamQuestion.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.questions.unshift(action.payload.data);
                state.pagination.totalResults += 1;
            })
            .addCase(createExamQuestion.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            })
            // Get all exam questions
            .addCase(getAllExamQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllExamQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload.data;
                state.pagination = action.payload.pagination;
                state.statistics = action.payload.statistics;
            })
            .addCase(getAllExamQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get exam question by ID
            .addCase(getExamQuestionById.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(getExamQuestionById.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.selectedQuestion = action.payload.data;
            })
            .addCase(getExamQuestionById.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            })
            // Update exam question
            .addCase(updateExamQuestion.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(updateExamQuestion.fulfilled, (state, action) => {
                state.actionLoading = false;
                const index = state.questions.findIndex(q => q._id === action.payload.data._id);
                if (index !== -1) {
                    state.questions[index] = action.payload.data;
                }
                if (state.selectedQuestion && state.selectedQuestion._id === action.payload.data._id) {
                    state.selectedQuestion = action.payload.data;
                }
            })
            .addCase(updateExamQuestion.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            })
            // Delete exam question
            .addCase(deleteExamQuestion.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(deleteExamQuestion.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.questions = state.questions.filter(q => q._id !== action.payload);
                state.pagination.totalResults -= 1;
                if (state.selectedQuestion && state.selectedQuestion._id === action.payload) {
                    state.selectedQuestion = null;
                }
            })
            .addCase(deleteExamQuestion.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            })
            // Toggle question status
            .addCase(toggleQuestionStatus.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(toggleQuestionStatus.fulfilled, (state, action) => {
                state.actionLoading = false;
                const index = state.questions.findIndex(q => q._id === action.payload.data._id);
                if (index !== -1) {
                    state.questions[index] = action.payload.data;
                }
                if (state.selectedQuestion && state.selectedQuestion._id === action.payload.data._id) {
                    state.selectedQuestion = action.payload.data;
                }
            })
            .addCase(toggleQuestionStatus.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            })
            // Get questions by course
            .addCase(getQuestionsByCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuestionsByCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload.data;
            })
            .addCase(getQuestionsByCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Bulk create questions
            .addCase(bulkCreateQuestions.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
            })
            .addCase(bulkCreateQuestions.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.questions.unshift(...action.payload.data);
                state.pagination.totalResults += action.payload.data.length;
            })
            .addCase(bulkCreateQuestions.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload;
            })
            // Get question statistics
            .addCase(getQuestionStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuestionStatistics.fulfilled, (state, action) => {
                state.loading = false;
                state.statistics = action.payload.data;
            })
            .addCase(getQuestionStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const {
    clearExamQuestionError,
    setFilters,
    clearFilters,
    setSelectedQuestion,
    clearSelectedQuestion
} = examQuestionSlice.actions;

export default examQuestionSlice.reducer;
