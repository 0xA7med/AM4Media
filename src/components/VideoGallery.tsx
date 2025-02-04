import React, { useState, useEffect } from 'react';

interface Video {
  id: string;
  title: string;
  description: string;
  categories: string[];
  thumbnail: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
}

interface VideoGalleryProps {
  videos: Video[];
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(videos);

  useEffect(() => {
    const filtered = selectedCategory === 'الكل'
      ? videos
      : videos.filter(video => video.categories.includes(selectedCategory));
    setFilteredVideos(filtered);
  }, [selectedCategory, videos]);

  // تم تغيير طريقة إنشاء التصنيفات لتجنب التكرار
  const uniqueCategories = Array.from(new Set(videos.flatMap(video => video.categories)));
  const categories = ['الكل', ...uniqueCategories];

  const getEmbedUrl = (fileId: string) => {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  const getThumbnailUrl = (video: Video) => {
    // إذا كان هناك صورة مصغرة محددة، استخدمها
    if (video.thumbnail) {
      return video.thumbnail;
    }
    // إذا لم تكن هناك صورة مصغرة، استخدم صورة افتراضية من مجلد public
    return '/thumbnails/default-thumbnail.jpg';
  };

  return (
    <div className="p-8">
      {/* فلتر التصنيفات */}
      <div className="mb-8 flex flex-wrap gap-4 justify-center">
        <button
          className={`px-6 py-2 rounded-full text-lg transition-all duration-300 ${
            selectedCategory === 'الكل'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
          }`}
          onClick={() => setSelectedCategory('الكل')}
        >
          الكل
        </button>
        {categories.slice(1).map((category) => (
          <button
            key={category}
            className={`px-6 py-2 rounded-full text-lg transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* معرض الفيديوهات */}
      <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
        {filteredVideos.map((video) => {
          let aspectRatioClass = 'pt-[56.25%]';
          if (video.aspectRatio === 'square') {
            aspectRatioClass = 'pt-[100%]';
          } else if (video.aspectRatio === 'portrait') {
            aspectRatioClass = 'pt-[177.78%]';
          }

          return (
            <div
              key={video.id}
              className={`group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer ${
                video.aspectRatio === 'portrait' ? 'row-span-2 h-full' : ''
              }`}
              onClick={() => setSelectedVideo(video)}
            >
              <div className={`relative ${aspectRatioClass}`}>
                <img 
                  src={getThumbnailUrl(video)}
                  alt={video.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-20 h-20 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent">
                <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
                <p className="text-gray-300 text-sm line-clamp-2">{video.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {video.categories.map((category, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm rounded-full text-blue-300 text-xs">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* نافذة عرض الفيديو */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setSelectedVideo(null)}>
          <div className="relative w-full max-w-6xl" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 text-white hover:text-blue-500 transition-colors"
              onClick={() => setSelectedVideo(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
              <iframe
                src={getEmbedUrl(selectedVideo.id)}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="autoplay fullscreen"
                allowFullScreen
                title={selectedVideo.title}
              ></iframe>
            </div>
            <div className="mt-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">{selectedVideo.title}</h3>
                <div className="flex gap-2">
                  {selectedVideo.categories.map((category, index) => (
                    <span key={index} className="bg-blue-500/80 px-4 py-1 rounded-full text-sm">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-gray-300">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
