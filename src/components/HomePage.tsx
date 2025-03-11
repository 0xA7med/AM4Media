import React, { useState, useEffect, useMemo } from 'react';
import { Camera, Play, Edit, Monitor, Facebook, Instagram, Twitter, Youtube, Clock, Award, DollarSign, Users2, MessageCircle, Mail, Phone } from 'lucide-react';
import VideoGallery from './VideoGallery';
import VideoSlider from './VideoSlider';
import IntroVideo from './IntroVideo';
import { useVideos } from '../videoStore';
import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init("HLBCVhf1ZCFwFRH2T");

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [selectedFiles, setSelectedFiles] = React.useState<File[] | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { videos, introVideo } = useVideos();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const sortedVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    return [...videos].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [videos]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) errors.name = "الاسم مطلوب";
    if (!formData.email.trim()) errors.email = "البريد الإلكتروني مطلوب";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "البريد الإلكتروني غير صالح";
    if (!formData.service) errors.service = "يرجى اختيار نوع الخدمة";
    if (!formData.message.trim()) errors.message = "الرسالة مطلوبة";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      // قم بإرسال البيانات
      // await submitForm(formData);
      setFormSubmitted(true);
      setFormError(false);
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        email: '',
        service: '',
        message: ''
      });
      setSelectedFiles([]);
    } catch (error) {
      setFormSubmitted(true);
      setFormError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    { 
      icon: <Camera className="w-16 h-16 mb-6 text-blue-500 group-hover:text-blue-400 transition-all duration-300" />, 
      title: "إنتاج الفيديو", 
      description: "نقدم خدمات إنتاج فيديو احترافية بأحدث المعدات"
    },
    { 
      icon: <Play className="w-16 h-16 mb-6 text-blue-500 group-hover:text-blue-400 transition-all duration-300" />, 
      title: "موشن جرافيك", 
      description: "تصميم رسوم متحركة إبداعية تناسب رؤيتك"
    },
    { 
      icon: <Edit className="w-16 h-16 mb-6 text-blue-500 group-hover:text-blue-400 transition-all duration-300" />, 
      title: "مونتاج فيديو", 
      description: "مونتاج احترافي يرتقي بمحتواك البصري"
    },
    { 
      icon: <Monitor className="w-16 h-16 mb-6 text-blue-500 group-hover:text-blue-400 transition-all duration-300" />, 
      title: "تصميم جرافيك", 
      description: "تصاميم مبتكرة تعزز هويتك البصرية"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100" dir="rtl">
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <a href="#" className="flex items-center">
              <img src="https://i.ibb.co/rXykWgk/AM-4-Media-Logo.png" alt="AM4 Media Logo" className="h-16 w-auto" />
            </a>

            <nav className="hidden md:flex gap-12">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">الرئيسية</a>
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">خدماتنا</a>
              <a href="#portfolio" className="text-gray-300 hover:text-white transition-colors">أعمالنا</a>
              <a href="#why-us" className="text-gray-300 hover:text-white transition-colors">لماذا نحن؟</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">اتصل بنا</a>
            </nav>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          <div className={`absolute top-full left-0 right-0 transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
            <div className="bg-gray-900/95 backdrop-blur-md shadow-xl border-t border-gray-800">
              <div className="container mx-auto py-4 px-6">
                <nav className="space-y-4">
                  <a href="#home" className="block py-3 px-4 text-gray-200 hover:bg-gray-800/50 rounded-lg transition-all duration-300 text-lg">الرئيسية</a>
                  <a href="#services" className="block py-3 px-4 text-gray-200 hover:bg-gray-800/50 rounded-lg transition-all duration-300 text-lg">خدماتنا</a>
                  <a href="#portfolio" className="block py-3 px-4 text-gray-200 hover:bg-gray-800/50 rounded-lg transition-all duration-300 text-lg">أعمالنا</a>
                  <a href="#why-us" className="block py-3 px-4 text-gray-200 hover:bg-gray-800/50 rounded-lg transition-all duration-300 text-lg">لماذا نحن؟</a>
                  <a href="#contact" className="block py-3 px-4 text-gray-200 hover:bg-gray-800/50 rounded-lg transition-all duration-300 text-lg">اتصل بنا</a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Intro Video */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-black"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                AM 4 Media
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
              نستمع لأفكارك ونفهم أهدافك
              <br />
              ثم نحولها إلى إبداع مرئي متقن يلهم المشاهدين ويجذبهم.
              <br />
              فريقنا المحترف يمزج بين الإبداع والخبرة لتقديم محتوى يتجاوز توقعاتك
              {/* نمنح أفكارك حياة على الشاشة بإبداع يتخطى الحدود. نجمع بين الفن والتقنية لنقدم محتوى مرئياً يعبر عن هويتك ويصل إلى قلوب جمهورك */}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  طلب خدمة
                </a>
                <a
                  href="https://wa.me/201026043165"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  تواصل معنا عبر واتساب
                </a>
              </div>
            </div>
            {introVideo?.id && (
              <div className="flex-1 max-w-xl">
                <IntroVideo videoId={introVideo?.id || ""} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Videos Slider */}
      <section className="py-12 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            أحدث الأعمال
          </h2>
          <VideoSlider videos={videos} />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-black"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            خدماتنا
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 transform hover:-translate-y-1 transition-all duration-300 border border-gray-700/30"
              >
                <div className="flex flex-col items-center text-center h-full">
                  {service.icon}
                  <h3 className="text-xl font-bold mb-4 text-white">
                    {service.title}
                  </h3>
                  <p className="text-gray-300">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">أعمالنا</h2>
          <VideoGallery videos={sortedVideos} />
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            لماذا نحن؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl text-center">
              <Award className="w-12 h-12 mx-auto mb-6 text-blue-500" />
              <h3 className="text-xl font-bold mb-4">جودة إنتاج احترافية</h3>
              <p className="text-gray-400">نستخدم أحدث التقنيات والمعدات لضمان أعلى جودة</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl text-center">
              <Clock className="w-12 h-12 mx-auto mb-6 text-blue-500" />
              <h3 className="text-xl font-bold mb-4">تسليم سريع</h3>
              <p className="text-gray-400">نلتزم بالمواعيد النهائية ونضمن تسليم المشاريع في الوقت المحدد</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-6 text-blue-500" />
              <h3 className="text-xl font-bold mb-4">أسعار تنافسية</h3>
              <p className="text-gray-400">نقدم أفضل قيمة مقابل المال مع الحفاظ على الجودة</p>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl text-center">
              <Users2 className="w-12 h-12 mx-auto mb-6 text-blue-500" />
              <h3 className="text-xl font-bold mb-4">فريق إبداعي متخصص</h3>
              <p className="text-gray-400">فريقنا من المحترفين ذوي الخبرة في مجال الإنتاج المرئي</p>
            </div>
          </div>
        </div>
      </section>

    {/* Contact Section */}
    <section id="contact" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/10 pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">اتصل بنا</h2>
        <div className="max-w-3xl mx-auto">
          {/* Social Media Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <a
              href="https://wa.me/201026043165"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              تواصل معنا عبر واتساب
            </a>
            <a
              href="https://t.me/A7meed_Mo7ameed"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.2647 2.42778C21.98 2.19091 21.6364 2.0354 21.2704 1.9787C20.9045 1.92199 20.5309 1.96659 20.1906 2.10778C19.7038 2.30778 15.7498 3.95278 12.0444 5.48278C8.27353 7.03978 4.58139 8.58928 2.88139 9.31978C2.50779 9.46583 2.18779 9.71637 1.96109 10.0411C1.73438 10.3659 1.6117 10.7496 1.60931 11.1428C1.60367 11.5357 1.71842 11.9216 1.94231 12.2511C2.16621 12.5805 2.48423 12.8375 2.85739 12.9908C4.34339 13.6458 6.19139 14.4378 6.19139 14.4378L6.19439 14.4388C6.19439 14.4388 6.92539 14.7108 7.03139 15.0258C7.12317 15.2958 7.12317 15.5866 7.03139 15.8568C6.78339 16.7548 6.31139 18.4068 6.07739 19.2368C5.95891 19.6457 5.96344 20.0817 6.09042 20.4878C6.2174 20.8939 6.46078 21.2503 6.78939 21.5128C7.14122 21.7899 7.57659 21.9424 8.02539 21.9428C8.45339 21.9428 8.87739 21.8058 9.31739 21.5348C10.1416 21.0518 13.2824 18.9048 14.1824 18.2598C16.7414 19.6068 19.4214 21.0128 19.6634 21.1318C20.0079 21.2889 20.3903 21.3605 20.7737 21.3396C21.1572 21.3187 21.5289 21.2059 21.8521 21.0125C22.1754 20.8192 22.4391 20.5517 22.6191 20.2347C22.7991 19.9177 22.8897 19.5617 22.8824 19.2018C22.8774 18.2018 22.2634 2.97978 22.2647 2.42778Z" fill="currentColor"/>
                <path d="M8.83772 15.1318L8.28772 19.1558C8.28772 19.1558 8.14772 19.6198 8.70172 19.6198C9.25572 19.6198 13.9977 15.6198 13.9977 15.6198L8.83772 15.1318Z" fill="white"/>
                <path d="M8.84259 15.1285L7.07959 14.4375L13.7246 9.29248L14.1416 9.70948C14.1416 9.70948 9.13559 14.3115 8.84259 15.1285Z" fill="white"/>
              </svg>
              تواصل معنا عبر تلجرام
            </a>
          </div>
    
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700/50">
            {formSubmitted && (
              <div className={`mb-6 p-4 rounded-lg text-center ${formError ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                {formError ? 'حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.' : 'تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا!'}
              </div>
            )}
    
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">الاسم</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors"
                    placeholder="أدخل اسمك"
                    required
                  />
                  {formErrors?.name && <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">البريد الإلكتروني</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                  {formErrors?.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
                </div>
              </div>
    
              <div>
                <label className="block text-gray-300 mb-2 font-medium">نوع الخدمة المطلوبة</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors"
                  required
                >
                  <option value="">اختر الخدمة</option>
                  <option value="video">إنتاج فيديو</option>
                  <option value="motion">موشن جرافيك</option>
                  <option value="editing">مونتاج فيديو</option>
                  <option value="design">تصميم جرافيك</option>
                </select>
                {formErrors?.service && <p className="text-red-400 text-sm mt-1">{formErrors.service}</p>}
              </div>
    
              <div>
                <label className="block text-gray-300 mb-2 font-medium">الرسالة</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors h-32 resize-none"
                  placeholder="اكتب رسالتك هنا"
                  required
                ></textarea>
                {formErrors?.message && <p className="text-red-400 text-sm mt-1">{formErrors.message}</p>}
              </div>
    
              {/* <div>
                <label className="block text-gray-300 mb-2 font-medium">رفع الملفات</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <input 
                    type="file" 
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileUpload"
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-gray-300">اسحب الملفات هنا أو انقر للاختيار</span>
                    <span className="text-gray-500 text-sm mt-1">الحد الأقصى للملف: 10MB</span>
                  </label>
                </div>
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-gray-300 text-sm">{selectedFiles.length} ملف تم اختياره</p>
                  </div>
                )}
              </div> */}
    
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإرسال...
                  </span>
                ) : 'إرسال'}
              </button>
            </form>
          </div>
    
          {/* <div className="mt-10 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/60 rounded-xl backdrop-blur-sm shadow-lg border border-gray-700/30">
            <h3 className="text-xl font-bold text-white mb-4">وسائل أخرى للتواصل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="mailto:info@ammedia.com" className="flex items-center gap-3 p-4 bg-gray-700/40 rounded-lg hover:bg-gray-700/70 transition-colors transform hover:-translate-y-1 duration-300">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>info@ammedia.com</span>
              </a>
              <a href="tel:+201026043165" className="flex items-center gap-3 p-4 bg-gray-700/40 rounded-lg hover:bg-gray-700/70 transition-colors transform hover:-translate-y-1 duration-300">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>+201026043165</span>
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">AM 4 Media</h3>
              <p className="text-gray-400">نحول أفكارك إلى واقع مرئي مع فريق محترف من المبدعين</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">الرئيسية</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">خدماتنا</a></li>
                <li><a href="#portfolio" className="text-gray-400 hover:text-white transition-colors">أعمالنا</a></li>
                <li><a href="#why-us" className="text-gray-400 hover:text-white transition-colors">لماذا نحن؟</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">اتصل بنا</a></li>
              </ul>
            </div>
            <div>
           <h4 className="text-xl font-bold text-white mb-4">تواصل معنا</h4>
           <div className="flex space-x-4 rtl:space-x-reverse">
             <a href="https://www.facebook.com/A7meed.Mo7ameed" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
               <Facebook className="w-6 h-6" />
             </a>
             <a href="https://www.instagram.com/a7meed.mo7ameed/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
               <Instagram className="w-6 h-6" />
             </a>
             <a href="https://x.com/0xAhmeed" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
               <Twitter className="w-6 h-6" />
             </a>
             <a href="https://www.youtube.com/c/A7meedMo7ameed?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
               <Youtube className="w-6 h-6" />
             </a>
           </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AM 4 Media. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
}