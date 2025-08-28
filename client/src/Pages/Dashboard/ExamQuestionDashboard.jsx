import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Layout from '../../Layout/Layout';
import {
    getAllExamQuestions,
    deleteExamQuestion,
    toggleQuestionStatus,
    getQuestionStatistics,
    clearExamQuestionError,
    setFilters,
    clearFilters
} from '../../Redux/Slices/ExamQuestionSlice';
import { getAdminCourses } from '../../Redux/Slices/CourseSlice';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaSearch,
    FaFilter,
    FaSort,
    FaToggleOn,
    FaToggleOff,
    FaClipboardList,
    FaQuestionCircle,
    FaChartBar,
    FaDownload,
    FaUpload,
    FaTimes,
    FaCheck,
    FaExclamationTriangle,
    FaLightbulb,
    FaClock,
    FaTag,
    FaBook,
    FaGraduationCap,
    FaCog,
    FaArrowUp,
    FaArrowDown,
    FaList,
    FaTh,
    FaTable
} from 'react-icons/fa';
import { generateImageUrl } from '../../utils/fileUtils';
import CreateExamQuestionModal from '../../Components/ExamQuestion/CreateExamQuestionModal';

const ExamQuestionDashboard = () => {
    const dispatch = useDispatch();
    const { data: user, role } = useSelector((state) => state.auth);
    const { courses } = useSelector((state) => state.course);
    const {
        questions,
        statistics,
        pagination,
        filters,
        loading,
        error,
        actionLoading,
        actionError
    } = useSelector((state) => state.examQuestion);

    // Local state
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    const [showFilters, setShowFilters] = useState(false);
    const [showStatistics, setShowStatistics] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [questionToEdit, setQuestionToEdit] = useState(null);

    // Load data on component mount
    useEffect(() => {
        dispatch(getAdminCourses());
        dispatch(getQuestionStatistics());
        loadQuestions();
    }, [dispatch]);

    // Load questions when filters or pagination change
    useEffect(() => {
        loadQuestions();
    }, [filters, currentPage, sortBy, sortOrder]);

    // Clear errors when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearExamQuestionError());
        };
    }, [dispatch]);

    const loadQuestions = () => {
        const params = {
            ...filters,
            page: currentPage,
            sortBy,
            sortOrder
        };
        dispatch(getAllExamQuestions(params));
    };

    const handleFilterChange = (key, value) => {
        dispatch(setFilters({ [key]: value }));
        setCurrentPage(1);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const handleDeleteQuestion = (question) => {
        setQuestionToDelete(question);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (questionToDelete) {
            try {
                await dispatch(deleteExamQuestion(questionToDelete._id)).unwrap();
                toast.success('Question deleted successfully');
                setShowDeleteModal(false);
                setQuestionToDelete(null);
            } catch (error) {
                toast.error(error || 'Failed to delete question');
            }
        }
    };

    const handleToggleStatus = async (question) => {
        try {
            await dispatch(toggleQuestionStatus(question._id)).unwrap();
            toast.success(`Question ${question.isActive ? 'deactivated' : 'activated'} successfully`);
        } catch (error) {
            toast.error(error || 'Failed to toggle question status');
        }
    };

    const handleBulkAction = (action) => {
        if (selectedQuestions.length === 0) {
            toast.error('Please select questions first');
            return;
        }

        switch (action) {
            case 'delete':
                // Implement bulk delete
                toast.info('Bulk delete feature coming soon');
                break;
            case 'activate':
                // Implement bulk activate
                toast.info('Bulk activate feature coming soon');
                break;
            case 'deactivate':
                // Implement bulk deactivate
                toast.info('Bulk deactivate feature coming soon');
                break;
            default:
                break;
        }
    };

    const handleSelectQuestion = (questionId) => {
        setSelectedQuestions(prev => 
            prev.includes(questionId) 
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    const handleSelectAll = () => {
        if (selectedQuestions.length === questions.length) {
            setSelectedQuestions([]);
        } else {
            setSelectedQuestions(questions.map(q => q._id));
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'text-green-600 bg-green-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'hard': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };



    if (error) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 p-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                    <div className="flex items-center">
                            <FaExclamationTriangle className="text-red-500 ml-2" />
                            <span className="text-red-700">Error: {error}</span>
                        </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    إدارة أسئلة الامتحانات
                                </h1>
                                <p className="text-gray-600">
                                    إنشاء وإدارة أسئلة الامتحانات التدريبية والنهائية
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaPlus className="ml-2" />
                                    إضافة سؤال جديد
                                </button>
                                <button
                                    onClick={() => {/* Navigate to bulk create */}}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <FaUpload className="ml-2" />
                                    رفع أسئلة متعددة
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    {statistics && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <FaQuestionCircle className="text-blue-600 text-xl" />
                                    </div>
                                    <div className="mr-4">
                                        <p className="text-sm font-medium text-gray-600">إجمالي الأسئلة</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {statistics.totalQuestions || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <FaCheck className="text-green-600 text-xl" />
                                    </div>
                                    <div className="mr-4">
                                        <p className="text-sm font-medium text-gray-600">الأسئلة النشطة</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {statistics.activeQuestions || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filters and Controls */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <FaFilter className="ml-2" />
                                    الفلاتر
                                </button>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                                    >
                                        <FaTable />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                                    >
                                        <FaTh />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleSort(sortBy)}
                                        className="p-1 text-gray-600 hover:text-gray-900"
                                    >
                                        {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filters Panel */}
                        {showFilters && (
                            <div className="border-t pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            البحث
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={filters.search}
                                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                                placeholder="ابحث في الأسئلة..."
                                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <FaSearch className="absolute right-3 top-3 text-gray-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            الدورة
                                        </label>
                                        <select
                                            value={filters.courseId}
                                            onChange={(e) => handleFilterChange('courseId', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">جميع الدورات</option>
                                            {courses.map(course => (
                                                <option key={course._id} value={course._id}>
                                                    {course.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => dispatch(clearFilters())}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        مسح الفلاتر
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bulk Actions */}
                    {selectedQuestions.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-blue-700">
                                    تم تحديد {selectedQuestions.length} سؤال
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleBulkAction('activate')}
                                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                    >
                                        تفعيل
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('deactivate')}
                                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                                    >
                                        إلغاء تفعيل
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('delete')}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Questions List */}
                    <div className="bg-white rounded-lg shadow-sm">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="mt-2 text-gray-600">جاري التحميل...</p>
                            </div>
                        ) : questions.length === 0 ? (
                            <div className="p-8 text-center">
                                <FaQuestionCircle className="mx-auto text-4xl text-gray-400 mb-4" />
                                <p className="text-gray-600">لا توجد أسئلة متاحة</p>
                            </div>
                        ) : (
                            <>
                                {/* Table Header */}
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedQuestions.length === questions.length && questions.length > 0}
                                            onChange={handleSelectAll}
                                            className="ml-3"
                                        />
                                        <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                                            <div className="col-span-5">السؤال</div>
                                            <div className="col-span-2">الدورة</div>
                                            <div className="col-span-1">الصعوبة</div>
                                            <div className="col-span-1">الحالة</div>
                                            <div className="col-span-3">الإجراءات</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Questions */}
                                {questions.map((question) => (
                                    <div key={question._id} className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedQuestions.includes(question._id)}
                                                onChange={() => handleSelectQuestion(question._id)}
                                                className="ml-3"
                                            />
                                            <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                                                <div className="col-span-5">
                                                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                                        {question.question}
                                                    </p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-sm text-gray-600">{question.course?.title || 'غير محدد'}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {question.stage?.name || question.stage || 'غير محدد'} - {question.subject?.title || question.subject || 'غير محدد'}
                                                    </p>
                                                </div>
                                                <div className="col-span-1">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getDifficultyColor(question.difficulty)}`}>
                                                        {question.difficulty === 'easy' ? 'سهل' : question.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                                                    </span>
                                                </div>
                                                <div className="col-span-1">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${question.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {question.isActive ? 'نشط' : 'غير نشط'}
                                                    </span>
                                                </div>
                                                <div className="col-span-3">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => {/* Navigate to view question */}}
                                                            className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                                                            title="عرض"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setQuestionToEdit(question);
                                                                setShowEditModal(true);
                                                            }}
                                                            className="p-1 text-gray-600 hover:text-green-600 transition-colors"
                                                            title="تعديل"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleStatus(question)}
                                                            className="p-1 text-gray-600 hover:text-yellow-600 transition-colors"
                                                            title={question.isActive ? 'إلغاء تفعيل' : 'تفعيل'}
                                                        >
                                                            {question.isActive ? <FaToggleOff /> : <FaToggleOn />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteQuestion(question)}
                                                            className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                                                            title="حذف"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-700">
                                عرض {((currentPage - 1) * pagination.resultsPerPage) + 1} إلى {Math.min(currentPage * pagination.resultsPerPage, pagination.totalResults)} من {pagination.totalResults} نتيجة
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    السابق
                                </button>
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 border rounded text-sm ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                    disabled={currentPage === pagination.totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    التالي
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <div className="flex items-center mb-4">
                                <FaExclamationTriangle className="text-red-500 ml-3" />
                                <h3 className="text-lg font-medium text-gray-900">تأكيد الحذف</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                هل أنت متأكد من حذف هذا السؤال؟ لا يمكن التراجع عن هذا الإجراء.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                >
                                    حذف
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Question Modal */}
                <CreateExamQuestionModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    mode="create"
                    onSuccess={loadQuestions}
                />

                {/* Edit Question Modal */}
                <CreateExamQuestionModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setQuestionToEdit(null);
                    }}
                    mode="edit"
                    question={questionToEdit}
                    onSuccess={loadQuestions}
                />
            </div>
        </Layout>
    );
};

export default ExamQuestionDashboard;
