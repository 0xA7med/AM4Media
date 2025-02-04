import React, { useState, useEffect } from 'react';
import { Camera, Play, Edit, Monitor, Users, Phone, ChevronDown, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import VideoGallery from './components/VideoGallery';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const portfolioVideos = [
    {
      id: '1EdZYRx8cPOaV7rzIaHOwOJzqdnNlNUEu',
      title: 'موشن جرافيك احترافي',
      description: 'تصميم موشن جرافيك إبداعي لشركة تقنية',
      category: 'موشن جرافيك'
    },
    {
      id: '1Thcs7caBUTJoCiVJd5n4wmIEZKXdZEvf',
      title: 'فيديو تسويقي',
      description: 'فيديو ترويجي لمنتج جديد',
      category: 'تسويق'
    },
    {
      id: '1wTBExl03Pk5-kBEvZimZapspnHO3Topn',
      title: 'مونتاج فيديو',
      description: 'مونتاج احترافي لفيديو تعليمي',
      category: 'مونتاج'
    },
    {
      id: '1EdZYRx8cPOaV7rzIaHOwOJzqdnNlNUEu',
      title: 'إعلان تجاري',
      description: 'إعلان تلفزيوني لشركة عقارية',
      category: 'إعلانات'
    },
    {
      id: '1Thcs7caBUTJoCiVJd5n4wmIEZKXdZEvf',
      title: 'فيديو تعليمي',
      description: 'شرح مبسط لمفاهيم تقنية',
      category: 'تعليمي'
    },
    {
      id: '1Cp55nRwgOCUx6LXWtJ9HOabL5GfEEIwE',
      title: 'فيديو ترويجي لشركة MicroPOS لبرنامج المحاسبة ',
      description: 'فيديو ترويجي لشركة MicroPOS لبرنامج المحاسبة الخاص بالكمبيوتر باستخدام الموشن جرافيك',
      category: 'موشن جرافيك,تسويق'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100" dir="rtl">
      {/* Header */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              AM Media
            </div>
            
            {/* Desktop Menu */}
            <nav className="hidden md:flex space-x-8 space-x-reverse">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">الرئيسية</a>
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">خدماتنا</a>
              <a href="#portfolio" className="text-gray-300 hover:text-white transition-colors">أعمالنا</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">اتصل بنا</a>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <nav className="py-4 space-y-4">
              <a href="#home" className="block text-gray-300 hover:text-white transition-colors">الرئيسية</a>
              <a href="#services" className="block text-gray-300 hover:text-white transition-colors">خدماتنا</a>
              <a href="#portfolio" className="block text-gray-300 hover:text-white transition-colors">أعمالنا</a>
              <a href="#contact" className="block text-gray-300 hover:text-white transition-colors">اتصل بنا</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJsLTIgMnYtNGwyIDJzMi0yIDItNGMwLTIgMC00LTItNHMtNCAwLTQgMmwtMiAyaC00bDIgMnMtMiAyLTIgNGMwIDIgMCA0IDIgNHM0IDAgNCAybDIgMmg0bC0yLTJzMi0yIDItNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-5"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                نحول أفكارك إلى واقع مرئي
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                نقدم خدمات إنتاج فيديو وموشن جرافيك احترافية تساعدك على إيصال رسالتك بشكل مميز
              </p>
              <a href="#contact" className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity">
                ابدأ مشروعك
              </a>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <iframe
                  src="https://drive.google.com/file/d/1EdZYRx8cPOaV7rzIaHOwOJzqdnNlNUEu/preview"
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* خدماتنا */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-black"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            خدماتنا
          </h2>
          <div className="flex flex-nowrap justify-center gap-8 overflow-x-auto pb-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex-none w-64 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-6 transform hover:-translate-y-1 transition-all duration-300 border border-gray-700/30"
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="mb-6 text-4xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {service.icon}
                  </div>
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
          <VideoGallery
            videos={[
              {
                id: '1EdZYRx8cPOaV7rzIaHOwOJzqdnNlNUEu',
                title: 'موشن جرافيك احترافي',
                description: 'تصميم موشن جرافيك إبداعي لشركة تقنية',
                categories: ['موشن جرافيك', 'تسويق'],
                thumbnail: '/thumbnails/motion-graphic.jpg'
              },
              {
                id: '1Thcs7caBUTJoCiVJd5n4wmIEZKXdZEvf',
                title: 'فيديو تسويقي',
                description: 'فيديو ترويجي لمنتج جديد',
                categories: ['تسويق', 'إعلانات']
              },
              {
                id: '1wTBExl03Pk5-kBEvZimZapspnHO3Topn',
                title: 'مونتاج فيديو',
                description: 'مونتاج احترافي لفيديو تعليمي',
                categories: ['مونتاج', 'تعليمي'],
                thumbnail: '/thumbnails/video-editing.jpg'
              },
              {
                id: '1EdZYRx8cPOaV7rzIaHOwOJzqdnNlNUEu',
                title: 'إعلان تجاري',
                description: 'إعلان تلفزيوني لشركة عقارية',
                categories: ['إعلانات', 'تسويق', 'مونتاج']
              },
              {
                id: '1c4zMYcKbFmLOaf4dEEG9mt8mwwiHQNlp',
                title: 'فيديو تشويقي لمعرض Leap',
                description: 'فيديو تشويقي لمعرض Leap التقني',
                categories: ['مونتاج', 'ترويجي']
              },
              {
                id: '1Cp55nRwgOCUx6LXWtJ9HOabL5GfEEIwE',
                title: 'فيديو ترويجي لشركة MicroPOS لبرنامج المحاسبة',
                description: 'فيديو ترويجي لشركة MicroPOS لبرنامج المحاسبة الخاص بالكمبيوتر باستخدام الموشن جرافيك',
                categories: ['موشن جرافيك', 'تسويق'],
                thumbnail: 'https://i.ibb.co/k29m8x0Y/w.jpg'
              }
            ]}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">اتصل بنا</h2>
          <div className="max-w-3xl mx-auto">
            <form className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">الاسم</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors"
                  placeholder="أدخل اسمك"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">الرسالة</label>
                <textarea 
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors h-32"
                  placeholder="اكتب رسالتك هنا"
                ></textarea>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                إرسال
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">جميع الحقوق محفوظة © AM Media</p>
            <div className="flex space-x-6 space-x-reverse">
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
      </footer>
    </div>
  );
}

export default App;