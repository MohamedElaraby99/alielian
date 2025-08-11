import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaPlay, FaStar, FaUsers, FaGraduationCap, FaAward, FaRocket, FaGlobe } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ALIELAIN from '../assets/ALIELAIN.png';

const AnimatedHero = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleExploreCourses = () => {
    // Navigate to courses page
    window.location.href = '/courses';
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir="rtl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Large Blue Shape - Main Background Element */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        {/* Secondary Blue Shapes */}
        <div className="absolute top-20 right-20 w-48 h-48 md:w-96 md:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 left-40 w-40 h-40 md:w-80 md:h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        
        {/* Floating Geometric Elements */}
        <div className="absolute top-1/4 right-1/4 animate-float">
          <div className="w-4 h-4 md:w-6 md:h-6 bg-blue-500 rounded-full opacity-40"></div>
        </div>
        <div className="absolute top-1/3 left-1/4 animate-float animation-delay-2000">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-indigo-500 rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-float animation-delay-4000">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-400 rounded-full opacity-40"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Right Side - Content (RTL) */}
          <div className={`order-2 lg:order-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="space-y-4 md:space-y-6 text-right">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs md:text-sm font-medium">
                <FaRocket className="w-3 h-3 md:w-4 md:h-4" />
                <span>منصة التعليم الرائدة</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                <span className="text-blue-600">المنصة الدولية</span>
                <br />
                <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-700 dark:text-gray-300">
                  اكتشف عالم المعرفة
                </span>
              </h1>

              {/* Teacher Credentials Section */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 dark:border-blue-700 shadow-lg">
                <div className="space-y-4">
                  <h1 className="text-center text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                   مستر علي عليان 
                  </h1>
                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-bold text-blue-600 dark:text.-blue-400 text-center">
                    مدرس المناهج الدولية
                  </h2>
                  
                  {/* Curricula */}
                  <div className="text-center">
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
                      ( الدبلومة الأمريكية - IGCSE - مناهج النيل - البكالوريا المصرية )
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-center">
                      الخبرات
                    </h3>
                    <ul className="space-y-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>مشرف ورئيس قسم اللغة العربية بالعديد من المدارس National , InterNational</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>معلم اللغة العربية لغير الناطقين بها</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>عضو الاتحاد الدولي للغة العربية</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>حاصل على دبلومة تربوية من Cambridge بتقدير امتياز</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>حاصل على زمالة المعلم البريطاني من Cambridge</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>حاصل على زمالة المدرب البريطاني من Cambridge</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>حاصل على المعلم المبدع من Microsoft</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
                انضم إلى آلاف المتعلمين حول العالم وقم بتحويل حياتك المهنية من خلال دوراتنا الشاملة عبر الإنترنت المصممة من قبل خبراء الصناعة.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 justify-end">
                <button 
                  onClick={onGetStarted}
                  className="group relative px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center gap-2 justify-center">
                    سجل الآن
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
                
              </div>
            </div>
          </div>

          {/* Left Side - Image with Blue Shape Effect (RTL) */}
          <div className={`order-1 lg:order-2 relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {/* Blue Shape Container */}
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
              {/* Large Blue Circle Background */}
              <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-full shadow-2xl animate-pulse"></div>
              
              {/* Secondary Blue Ring */}
              <div className="absolute w-[270px] h-[270px] md:w-[360px] md:h-[360px] lg:w-[450px] lg:h-[450px] bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-30 animate-spin-slow"></div>
              
              {/* Image Container - Appears to come out from the blue shape */}
              <div className="relative z-10 w-[250px] h-[300px] md:w-[320px] md:h-[400px] lg:w-[400px] lg:h-[500px] flex items-center justify-center">
                <img 
                  src={ALIELAIN} 
                  alt="المنصة الدولية" 
                  className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Elements Around Image */}
                <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 w-4 h-4 md:w-6 md:h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-3 h-3 md:w-4 md:h-4 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 -left-4 md:-left-8 w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-float"></div>
                <div className="absolute top-1/2 -right-4 md:-right-8 w-2 h-2 md:w-3 md:h-3 bg-purple-400 rounded-full animate-float animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Floating Elements */}
      <div className="absolute bottom-10 right-10 animate-float">
        <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full opacity-30"></div>
      </div>
      <div className="absolute top-10 left-10 animate-float animation-delay-4000">
        <div className="w-4 h-4 md:w-6 md:h-6 bg-indigo-500 rounded-full opacity-30"></div>
      </div>
    </section>
  );
};

export default AnimatedHero; 