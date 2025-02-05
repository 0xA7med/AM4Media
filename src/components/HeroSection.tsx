import { motion } from "framer-motion";
import VideoSlider from "./VideoSlider";
const HeroSection = ({ videos }) => {
  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden">
      {/* تأثيرات الخلفية */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJsLTIgMnYtNGwyIDJzMi0yIDItNGMwLTIgMC00LTItNHMtNCAwLTQgMmwtMiAyaC00bDIgMnMtMiAyLTIgNGMwIDIgMCA0IDIgNHM0IDAgNCAybDIgMmg0bC0yLTJzMi0yIDItNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row items-center gap-8">
          
          {/* القسم الأيسر - النصوص */}
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0 text-center md:text-right"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent leading-tight">
              نحول أفكارك إلى واقع مرئي
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
              نقدم خدمات إنتاج فيديو وموشن جرافيك احترافية تناسب احتياجات عملك
            </p>

            <div className="flex gap-3 md:gap-4 flex-wrap justify-center md:justify-start">
              <motion.a 
                href="#contact"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold shadow-lg hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.1 }}
              >
                ابدأ مشروعك
              </motion.a>

              <motion.a 
                href="#portfolio"
                className="inline-block bg-white/10 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                شاهد أعمالنا
              </motion.a>
            </div>
          </motion.div>

          {/* القسم الأيمن - سلايدر الفيديو */}
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-full max-w-2xl mx-auto">
              <VideoSlider videos={videos} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;