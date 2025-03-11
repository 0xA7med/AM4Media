import React, { useState, useEffect } from 'react';
import { Camera, Play, Edit, Monitor, Facebook, Instagram, Twitter, Youtube, Clock, Award, DollarSign, Users2, MessageCircle } from 'lucide-react';
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
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { videos, introVideo } = useVideos();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
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
    setIsSubmitting(true);

    try {
      await emailjs.send(
        'service_8t94fdu',
        'template_pw1o4yu',
        {
          to_name: 'AM Media',
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          reply_to: formData.email,
          to_email: 'zeero4123@gmail.com',
          service: formData.service
        },
        'HLBCVhf1ZCFwFRH2T'
      );

      alert('تم إرسال رسالتك بنجاح!');
      setFormData({ name: '', email: '', service: '', message: '' });
    } catch (error) {
      alert('عذراً، حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى.');
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
                نحول أفكارك إلى واقع مرئي مع فريق محترف من المبدعين
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  تواصل معنا
                </a>
                <a
                  href="https://wa.me/201026043165"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  طلب خدمة عبر واتساب
                </a>
              </div>
            </div>
            {introVideo && (
              <div className="flex-1 max-w-xl">
                <IntroVideo videoId={introVideo.id} />
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
          <VideoGallery videos={videos} />
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
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">اتصل بنا</h2>
          <div className="max-w-3xl mx-auto">
            {/* WhatsApp Button */}
            <div className="text-center mb-8">
              <a
                href="https://wa.me/201026043165"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                تواصل معنا عبر واتساب
              </a>
            </div>
            <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">الاسم</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors"
                  placeholder="أدخل اسمك"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">البريد الإلكتروني</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">نوع الخدمة المطلوبة</label>
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
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">الرسالة</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors h-32"
                  placeholder="اكتب رسالتك هنا"
                  required
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">رفع الملفات</label>
                <input 
                  type="file" 
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
              </button>
            </form>
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
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
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