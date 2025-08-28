import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllStageCategories, 
  createStageCategory, 
  updateStageCategory, 
  deleteStageCategory
} from '../../Redux/Slices/StageCategorySlice';
import { getAllStages as getAllStagesAction } from '../../Redux/Slices/StageSlice';
import Layout from '../../Layout/Layout';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaUsers, 
  FaBook,
  FaSearch,
  FaFilter,
  FaTimes,
  FaSave,
  FaToggleOn,
  FaToggleOff,
  FaChartBar,
  FaList,
  FaCheck,
  FaTimes as FaClose
} from 'react-icons/fa';

export default function StageCategoryDashboard() {
  const dispatch = useDispatch();
  const { categories, loading, pagination } = useSelector((state) => state.stageCategory);
  const { stages } = useSelector((state) => state.stage);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stages: [],
    status: "active"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getAllStageCategories({ page: 1, limit: 100 }));
    dispatch(getAllStagesAction({ page: 1, limit: 100 }));
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم فئة المرحلة مطلوب";
    }

    if (formData.name.length > 100) {
      newErrors.name = "اسم فئة المرحلة يجب أن يكون أقل من 100 حرف";
    }

    if (formData.description.length > 300) {
      newErrors.description = "الوصف يجب أن يكون أقل من 300 حرف";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await dispatch(createStageCategory(formData)).unwrap();
      setShowCreateModal(false);
      resetForm();
      dispatch(getAllStageCategories({ page: 1, limit: 100 }));
    } catch (error) {
      console.error('Error creating stage category:', error);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await dispatch(updateStageCategory({ 
        id: selectedCategory._id, 
        categoryData: formData 
      })).unwrap();
      setShowEditModal(false);
      setSelectedCategory(null);
      resetForm();
      dispatch(getAllStageCategories({ page: 1, limit: 100 }));
    } catch (error) {
      console.error('Error updating stage category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه فئة المرحلة؟')) {
      try {
        await dispatch(deleteStageCategory(categoryId)).unwrap();
        dispatch(getAllStageCategories({ page: 1, limit: 100 }));
      } catch (error) {
        console.error('Error deleting stage category:', error);
      }
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      stages: category.stages ? category.stages.map(stage => stage._id) : [],
      status: category.status
    });
    setErrors({});
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      stages: [],
      status: "active"
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleStageToggle = (stageId) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.includes(stageId)
        ? prev.stages.filter(id => id !== stageId)
        : [...prev.stages, stageId]
    }));
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(search.toLowerCase()) ||
                         (category.description && category.description.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = !status || category.status === status;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBgColor = (status) => {
    return status === 'active' ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <Layout>
      <section className="min-h-screen py-8 px-4 lg:px-20" dir="rtl">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                إدارة فئات المراحل الدراسية
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                إدارة فئات المراحل الدراسية والمراحل التعليمية
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              <FaPlus />
              إضافة فئة مرحلة جديدة
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي فئات المراحل</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <FaChartBar className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الفئات النشطة</p>
                  <p className="text-2xl font-bold text-green-600">{categories.filter(c => c.status === 'active').length}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <FaToggleOn className="text-green-600 dark:text-green-400" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي المراحل</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {categories.reduce((sum, category) => sum + (category.stages?.length || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <FaBook className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">متوسط المراحل لكل فئة</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {categories.length > 0 ? Math.round(categories.reduce((sum, category) => sum + (category.stages?.length || 0), 0) / categories.length) : 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <FaList className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في فئات المراحل..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-right"
                />
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-right"
              >
                <option value="">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      اسم فئة المرحلة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الوصف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      المراحل المرفقة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="mr-3 text-gray-500 dark:text-gray-400">جاري التحميل...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        لا توجد فئات مراحل
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category) => (
                      <tr key={category._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                            {category.description || 'لا يوجد وصف'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <div className="flex items-center text-sm text-gray-900 dark:text-white">
                              <FaBook className="ml-1 text-blue-500" />
                              {category.stages?.length || 0} مرحلة
                            </div>
                            {category.stages && category.stages.length > 0 && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {category.stages.slice(0, 2).map(stage => stage.name).join(', ')}
                                {category.stages.length > 2 && '...'}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBgColor(category.status)} ${getStatusColor(category.status)}`}>
                            {category.status === 'active' ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => openEditModal(category)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              title="تعديل"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="حذف"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    إضافة فئة مرحلة جديدة
                  </h3>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      اسم فئة المرحلة *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-right ${
                        errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="اسم فئة المرحلة"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الوصف
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-right ${
                        errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="وصف فئة المرحلة (اختياري)"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      المراحل المرفقة
                    </label>
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 max-h-40 overflow-y-auto">
                      {stages.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center">لا توجد مراحل متاحة</p>
                      ) : (
                        <div className="space-y-2">
                          {stages.map((stage) => (
                            <label key={stage._id} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.stages.includes(stage._id)}
                                onChange={() => handleStageToggle(stage._id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-900 dark:text-white">{stage.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الحالة
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-right"
                    >
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                    </select>
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <FaSave />
                      إنشاء فئة مرحلة
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && selectedCategory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    تعديل فئة المرحلة
                  </h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedCategory(null);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <form onSubmit={handleEditCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      اسم فئة المرحلة *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-right ${
                        errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="اسم فئة المرحلة"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الوصف
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-right ${
                        errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="وصف فئة المرحلة (اختياري)"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      المراحل المرفقة
                    </label>
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 max-h-40 overflow-y-auto">
                      {stages.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center">لا توجد مراحل متاحة</p>
                      ) : (
                        <div className="space-y-2">
                          {stages.map((stage) => (
                            <label key={stage._id} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.stages.includes(stage._id)}
                                onChange={() => handleStageToggle(stage._id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-900 dark:text-white">{stage.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الحالة
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-right"
                    >
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                    </select>
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedCategory(null);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <FaSave />
                      تحديث فئة المرحلة
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
