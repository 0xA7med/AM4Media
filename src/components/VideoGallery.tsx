import React, { useState, useMemo } from 'react';
import { Video } from '../types';
import VideoModal from './VideoModal';
import Masonry from 'react-masonry-css';

interface VideoGalleryProps {
  videos: Video[];
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
      return;
    }
    
    let newCategories = selectedCategories.filter(cat => cat !== 'all');
    
    if (selectedCategories.includes(category)) {
      newCategories = newCategories.filter(cat => cat !== category);
      if (newCategories.length === 0) {
        newCategories = ['all'];
      }
    } else {
      newCategories.push(category);
    }
    
    setSelectedCategories(newCategories);
  };

  // Get unique categories from all videos
  const categories = Array.from(new Set(videos.flatMap(video => video.categories)));
  
  // ترتيب الفيديوهات بحيث تكون الأحدث في الأعلى
  const sortedVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    return [...videos].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [videos]);

  const filteredVideos = useMemo(() => {
    if (selectedCategories.includes('all')) {
      return sortedVideos;
    }
    return sortedVideos.filter(video => 
      selectedCategories.some(cat => video.categories.includes(cat))
    );
  }, [sortedVideos, selectedCategories]);

  // تحديد عدد الأعمدة حسب عرض الشاشة
  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <>
      {/* Categories Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedCategories.includes('all') ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
          onClick={() => handleCategoryChange('all')}
        >
          الكل
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategories.includes(category) ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-full -mr-8" // استخدام margin سالب للتعويض عن الفراغ
        columnClassName="pl-8" // padding للعمود
      >
        {filteredVideos.map((video) => (
          <div key={video.id} className="mb-8 relative group">
            <button
              onClick={() => setSelectedVideo(video.id)}
              className={`block relative overflow-hidden rounded-xl w-full ${
                video.aspectRatio === 'portrait' ? 'aspect-[9/16]' : 'aspect-square'
              }`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
                  <p className="text-gray-200 text-sm">{video.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {video.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </Masonry>

      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoId={selectedVideo || ''}
      />
    </>
  );
}