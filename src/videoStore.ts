// src/videoStore.ts
import { useState, useEffect } from 'react';

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  aspectRatio: string;
  url: string;
  categories: string[];
}

// الفيديوهات الافتراضية
const defaultVideos: Video[] = [
  // يمكنك نقل الفيديوهات الموجودة في App.tsx إلى هنا
];

// استدعاء الفيديوهات من التخزين المحلي أو استخدام الافتراضية
const getSavedVideos = (): Video[] => {
  if (typeof window === 'undefined') return defaultVideos;
  
  const savedVideos = localStorage.getItem('videos');
  return savedVideos ? JSON.parse(savedVideos) : defaultVideos;
};

// حفظ الفيديوهات في التخزين المحلي
const saveVideosToStorage = (videos: Video[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('videos', JSON.stringify(videos));
  }
};

// مشاركة حالة الفيديوهات بين المكونات
let videosState: Video[] = getSavedVideos();
let listeners: Function[] = [];

// إشعار جميع المستمعين بالتغييرات
const notifyListeners = () => {
  listeners.forEach(listener => listener(videosState));
};

// إضافة فيديو جديد
export const addVideo = (video: Video) => {
  videosState = [...videosState, video];
  saveVideosToStorage(videosState);
  notifyListeners();
};

// تحديث فيديو موجود
export const updateVideo = (updatedVideo: Video) => {
  videosState = videosState.map(video => 
    video.id === updatedVideo.id ? updatedVideo : video
  );
  saveVideosToStorage(videosState);
  notifyListeners();
};

// حذف فيديو
export const deleteVideo = (videoId: string) => {
  videosState = videosState.filter(video => video.id !== videoId);
  saveVideosToStorage(videosState);
  notifyListeners();
};

// Hook لاستخدام الفيديوهات في أي مكون
export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>(videosState);
  
  useEffect(() => {
    // إضافة مستمع للتغييرات
    const handleChange = (newVideos: Video[]) => {
      setVideos([...newVideos]);
    };
    
    listeners.push(handleChange);
    
    // إزالة المستمع عند تفكيك المكون
    return () => {
      listeners = listeners.filter(listener => listener !== handleChange);
    };
  }, []);
  
  return videos;
};