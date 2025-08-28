import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
    createExamQuestion,
    updateExamQuestion,
    clearExamQuestionError
} from '../../Redux/Slices/ExamQuestionSlice';
import { getAdminCourses } from '../../Redux/Slices/CourseSlice';
import { getAllStages } from '../../Redux/Slices/StageSlice';
import { getAllSubjects } from '../../Redux/Slices/SubjectSlice';
import { axiosInstance } from '../../Helpers/axiosInstance';
import {
    FaTimes,
    FaPlus,
    FaTrash,
    FaSave,
    FaUpload,
    FaImage,
    FaQuestionCircle,
    FaList,
    FaClock,
    FaTag,
    FaBook,
    FaGraduationCap,
    FaExclamationTriangle
} from 'react-icons/fa';

const CreateExamQuestionModal = ({ isOpen, onClose, question = null, mode = 'create', onSuccess }) => {
    const dispatch = useDispatch();
    const { courses } = useSelector((state) => state.course);
    const { stages, loading } = useSelector((state) => state.stage);
    const { subjects } = useSelector((state) => state.subject);
    
    
    const { actionLoading, actionError } = useSelector((state) => state.examQuestion);

    // Form state
    const [formData, setFormData] = useState({
        stageId: '',
        subjectId: '',
        courseId: '',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        image: '',
        numberOfOptions: 4,
        difficulty: 'medium'
    });

    const [selectedStage, setSelectedStage] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Load data on component mount
    useEffect(() => {
        dispatch(getAdminCourses());
        dispatch(getAllStages());
        dispatch(getAllSubjects());
    }, [dispatch]);

    // Initialize form data when editing
    useEffect(() => {
        if (question && mode === 'edit') {
            setFormData({
                stageId: question.stage._id,
                subjectId: question.subject._id,
                courseId: question.course._id,
                question: question.question,
                options: [...question.options],
                correctAnswer: question.correctAnswer,
                explanation: question.explanation || '',
                image: question.image || '',
                numberOfOptions: question.numberOfOptions || 4,
                difficulty: question.difficulty || 'medium'
            });

            // Set selected stage, subject, course
            const stage = stages.find(s => s._id === question.stage._id);
            if (stage) {
                setSelectedStage(stage);
            }

            const subject = subjects.find(s => s._id === question.subject._id);
            if (subject) {
                setSelectedSubject(subject);
            }

            const course = courses.find(c => c._id === question.course._id);
            if (course) {
                setSelectedCourse(course);
            }

            if (question.image) {
                setImagePreview(question.image);
            }
        }
    }, [question, mode, stages, subjects, courses]);

    // Clear errors when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearExamQuestionError());
        };
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({
            ...prev,
            options: newOptions
        }));
    };

    const handleNumberOfOptionsChange = (value) => {
        const numOptions = parseInt(value);
        const newOptions = [...formData.options];
        
        if (numOptions > newOptions.length) {
            // Add empty options
            for (let i = newOptions.length; i < numOptions; i++) {
                newOptions.push('');
            }
        } else if (numOptions < newOptions.length) {
            // Remove excess options
            newOptions.splice(numOptions);
        }

        // Adjust correct answer if necessary
        let correctAnswer = formData.correctAnswer;
        if (correctAnswer >= numOptions) {
            correctAnswer = numOptions - 1;
        }

        setFormData(prev => ({
            ...prev,
            numberOfOptions: numOptions,
            options: newOptions,
            correctAnswer
        }));
    };

    const handleAddOption = () => {
        if (formData.options.length < 6) {
            setFormData(prev => ({
                ...prev,
                options: [...prev.options, ''],
                numberOfOptions: prev.options.length + 1
            }));
        }
    };

    const handleRemoveOption = (index) => {
        if (formData.options.length > 2) {
            const newOptions = formData.options.filter((_, i) => i !== index);
            let correctAnswer = formData.correctAnswer;
            
            if (correctAnswer >= index) {
                correctAnswer = Math.max(0, correctAnswer - 1);
            }

            setFormData(prev => ({
                ...prev,
                options: newOptions,
                numberOfOptions: newOptions.length,
                correctAnswer
            }));
        }
    };



    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
                return;
            }
            
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.stageId || !formData.subjectId || !formData.courseId) {
            toast.error('يرجى اختيار المرحلة والمادة والدورة');
            return;
        }

        if (!formData.question.trim()) {
            toast.error('يرجى إدخال نص السؤال');
            return;
        }

        if (formData.options.some(option => !option.trim())) {
            toast.error('جميع الخيارات مطلوبة');
            return;
        }

        if (formData.correctAnswer < 0 || formData.correctAnswer >= formData.options.length) {
            toast.error('يرجى اختيار الإجابة الصحيحة');
            return;
        }

        try {
            const submitData = { ...formData };
            
            // Handle image upload if new image is selected
            if (imageFile) {
                const formDataImage = new FormData();
                formDataImage.append('image', imageFile);
                
                try {
                    // Upload image first using axios instance
                    const uploadResponse = await axiosInstance.post('/upload/image', formDataImage, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    
                    if (uploadResponse.data.success) {
                        // Handle both response formats
                        submitData.image = uploadResponse.data.data?.url || uploadResponse.data.url;
                    }
                } catch (uploadError) {
                    
                    toast.error('فشل في رفع الصورة');
                    return;
                }
            }

            if (mode === 'create') {
                await dispatch(createExamQuestion(submitData)).unwrap();
                toast.success('تم إنشاء السؤال بنجاح');
            } else {
                await dispatch(updateExamQuestion({ id: question._id, data: submitData })).unwrap();
                toast.success('تم تحديث السؤال بنجاح');
            }

            // Refresh the questions list in the dashboard
            if (onSuccess) {
                onSuccess();
            }

            onClose();
        } catch (error) {
            toast.error(error || 'حدث خطأ أثناء حفظ السؤال');
        }
    };

    const handleStageChange = (stageId) => {
        const stage = stages.find(s => s._id === stageId);
        setSelectedStage(stage);
        
        setFormData(prev => ({
            ...prev,
            stageId
        }));
    };

    const handleSubjectChange = (subjectId) => {
        const subject = subjects.find(s => s._id === subjectId);
        setSelectedSubject(subject);
        
        setFormData(prev => ({
            ...prev,
            subjectId
        }));
    };

    const handleCourseChange = (courseId) => {
        const course = courses.find(c => c._id === courseId);
        setSelectedCourse(course);
        
        setFormData(prev => ({
            ...prev,
            courseId
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {mode === 'create' ? 'إضافة سؤال جديد' : 'تعديل السؤال'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6" dir="rtl">
                    {/* Stage, Subject, Course Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                                المرحلة <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.stageId}
                                onChange={(e) => handleStageChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                                required
                                disabled={loading}
                            >
                                <option value="">
                                    {loading ? 'جاري التحميل...' : 'اختر المرحلة'}
                                </option>
                                {stages.map(stage => (
                                    <option key={stage._id} value={stage._id}>
                                        {stage.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                                المادة <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.subjectId}
                                onChange={(e) => handleSubjectChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                                required
                            >
                                <option value="">اختر المادة</option>
                                {subjects.map(subject => (
                                    <option key={subject._id} value={subject._id}>
                                        {subject.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                                الدورة <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.courseId}
                                onChange={(e) => handleCourseChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                                required
                            >
                                <option value="">اختر الدورة</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Question Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                            نص السؤال <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="question"
                            value={formData.question}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                            placeholder="أدخل نص السؤال هنا..."
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                            صورة السؤال (اختياري)
                        </label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <FaUpload className="ml-2" />
                                رفع صورة
                            </label>
                            {imagePreview && (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview('');
                                            setImageFile(null);
                                        }}
                                        className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Options */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-gray-700 text-right">
                                خيارات الإجابة <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">عدد الخيارات:</span>
                                <select
                                    value={formData.numberOfOptions}
                                    onChange={(e) => handleNumberOfOptionsChange(e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm text-right"
                                >
                                    {[2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {formData.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            value={index}
                                            checked={formData.correctAnswer === index}
                                            onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: parseInt(e.target.value) }))}
                                            className="ml-2"
                                        />
                                        <span className="text-sm font-medium text-gray-700 w-8">
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                                        placeholder={`الخيار ${String.fromCharCode(65 + index)}`}
                                        required
                                    />
                                    {formData.options.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveOption(index)}
                                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {formData.options.length < 6 && (
                            <button
                                type="button"
                                onClick={handleAddOption}
                                className="mt-3 flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <FaPlus className="ml-2" />
                                إضافة خيار
                            </button>
                        )}
                    </div>

                    {/* Explanation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                            شرح الإجابة (اختياري)
                        </label>
                        <textarea
                            name="explanation"
                            value={formData.explanation}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                            placeholder="أدخل شرح الإجابة الصحيحة..."
                        />
                    </div>



                    {/* Error Display */}
                    {actionError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <FaExclamationTriangle className="text-red-500 ml-2" />
                                <span className="text-red-700">{actionError}</span>
                            </div>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={actionLoading}
                            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {actionLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                                    جاري الحفظ...
                                </>
                            ) : (
                                <>
                                    <FaSave className="ml-2" />
                                    {mode === 'create' ? 'إنشاء السؤال' : 'حفظ التغييرات'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateExamQuestionModal;
