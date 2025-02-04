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
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              نحول أفكارك إلى واقع مرئي
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              نقدم خدمات إنتاج فيديو وموشن جرافيك احترافية تناسب احتياجات عملك
            </p>

            <div className="flex gap-4 flex-wrap">
              <motion.a 
                href="#contact"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.1 }}
              >
                ابدأ مشروعك
              </motion.a>

              <motion.a 
                href="#portfolio"
                className="inline-block bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                شاهد أعمالنا
              </motion.a>
            </div>
          </motion.div>

          {/* القسم الأيمن - فيديوهات العرض */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <VideoSlider videos={videos.slice(0, Math.min(videos.length, 5))} />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;