import React, { useState, useEffect } from 'react';

interface Video {
  id: string;
  title: string;
  description?: string;
  categories: string[];
  thumbnail?: string; // صورة مصغرة اختيارية
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

  const categories = ['الكل', ...Array.from(new Set(videos.flatMap(video => video.categories)))];

  const getEmbedUrl = (fileId: string) => {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  const getThumbnailUrl = (video: Video) => {
    return video.thumbnail || `https://drive.google.com/thumbnail?id=${video.id}`;
  };

  return (
    <>
      {/* أزرار التصنيف */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 px-4" dir="rtl">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* معرض الفيديوهات */}
      <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative pt-[56.25%]">
              <img 
                src={getThumbnailUrl(video)}
                alt={video.title}
                className="absolute top-0 left-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-20 h-20 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l7-5-7-5z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 flex flex-wrap gap-2 max-w-[80%]">
                {video.categories.map((category, index) => (
                  <span key={index} className="bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-gray-300 text-lg leading-relaxed">
                  {video.description}
                </p>
              )}
            </div>
          </div>
        ))}
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
              {selectedVideo.description && (
                <p className="mt-2 text-gray-300">{selectedVideo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoGallery;
