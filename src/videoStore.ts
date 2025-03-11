// src/videoStore.ts
import { useState, useEffect } from 'react';
import { videos as initialVideos } from './videos';

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
const defaultVideos: Video[] = initialVideos;

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
    
    fetch('http://localhost:3001/api/updateVideos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(videosState)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('تم تحديث ملف videos.js بنجاح');
      } else {
        console.error('فشل تحديث ملف videos.js');
      }
    })
    .catch(error => {
      console.error('خطأ في الاتصال بالسيرفر:', error);
    });
    
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