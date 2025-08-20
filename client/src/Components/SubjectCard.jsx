import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaUsers, FaClock, FaTag, FaPlay, FaGraduationCap } from "react-icons/fa";
import { generateImageUrl } from "../utils/fileUtils";
import { placeholderImages } from "../utils/placeholderImages";

const SubjectCard = ({ subject, showActions = false, onEdit, onDelete, onToggleFeatured, onUpdateStatus }) => {
  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'featured': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-gray-200 dark:border-gray-600" dir="rtl">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={generateImageUrl(subject.image?.secure_url)}
          alt={subject.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = placeholderImages.course;
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Featured Badge */}
        {subject.featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg">
              ⭐ مميز
            </span>
          </div>
        )}
        
        {/* Status Badge */}
        {showActions && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-2 rounded-full text-sm font-semibold shadow-lg ${getStatusColor(subject.status)}`}>
              {subject.status === 'active' ? 'نشط' : subject.status === 'inactive' ? 'غير نشط' : 'مميز'}
            </span>
          </div>
        )}
        
        {/* Stage Badge */}
        <div className="absolute bottom-4 right-4">
          <span className="px-3 py-2 bg-white/95 backdrop-blur-sm text-gray-800 rounded-full text-sm font-semibold shadow-lg border border-gray-100">
            <FaGraduationCap className="inline ml-2" />
            {subject.stage?.name || 'مرحلة غير محددة'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {subject.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6 line-clamp-3">
          {subject.description}
        </p>

      </div>
    </div>
  );
};

export default SubjectCard; 