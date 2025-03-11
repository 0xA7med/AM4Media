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
  {
      id: '1X0oD9KbArMOpp6d1Up7mUpWBGZKn6tQ5',
      title: 'افضل خدمات صيانة السيارات',
      description: 'فيديو ترويجي لخدمات صيانة السيارات لدي مركز غازي جميل',
      categories: ['مونتاج', 'ترويجي', 'Reels'],
      thumbnail: 'https://i.ibb.co/Qy3Lmqp/gazy-center-1.jpg',
      aspectRatio: 'portrait',
      url: ''
  },
  {
      id: '1Thcs7caBUTJoCiVJd5n4wmIEZKXdZEvf',
      title: 'فيديو تشويقي لمعرض Leap ج4',
      description: 'فيديو تشويقي لمعرض Leap التقني',
      categories: ['مونتاج', 'ترويجي'],
      thumbnail: 'https://i.ibb.co/KpFKjwVB/TRANS-Leap-4-4-mp4-snapshot-00-20-2025-02-05-04-04-59.jpg',
      aspectRatio: 'square',
      url: ''
  },
  {
      id: '1MB6HJb9CEYE9UsrJt4EB1GXl8VfRYMRu',
      title: 'التراث الشعبي ',
      description: 'فيديو تشويقي لمهرجان التراث الشعبي ',
      categories: ['مونتاج', 'ترويجي'],
      thumbnail: 'https://i.ibb.co/cS8c6Vb7/folk-games-60-mp4-snapshot-00-04-2025-02-05-03-58-28.jpg',
      aspectRatio: 'square',
      url: ''
  },
  {
      id: '1xCX8kP7uM3VSaktTd5wjjkfPZxTzoGli',
      title: 'استعراض سيارة Uni V ',
      description: 'فيديو ريل استعراض سيارة Uni V ',
      categories: ['مونتاج', 'ترويجي', 'Reels'],
      thumbnail: 'https://i.ibb.co/CKMj4Hp8/uni-v-am-2-mp4-snapshot-00-01-2025-02-05-00-32-57.jpg',
      aspectRatio: 'portrait',
      url: ''
  },
  {
      id: '174uOv7uYDInXSip-IuCWrZ0nC1Zl06Qx',
      title: 'كل اللي بتحلم بيه في Uni T هتلاقيه',
      description: 'فيديو عرض بعض مواصفات سيارة Uni T ',
      categories: ['Gif', 'مونتاج', 'ترويجي'],
      thumbnail: 'https://i.ibb.co/1JzcGTyp/uni-t-gif-1-mp4-snapshot-00-06-2025-02-04-23-25-08.jpg',
      aspectRatio: 'square',
      url: ''
  },
  {
      id: '13As5ieYU-zED8SSPwQi9_cfoivY2r-60',
      title: 'صيانتك الدورية بدون حجز',
      description: 'فيديو تحفيزي علي اجراء الصيانة الدورية للسيارة ',
      categories: ['Gif', 'مونتاج',],
      thumbnail: 'https://i.ibb.co/bR74CxXY/gazy-gif-1-mp4-snapshot-00-04-2025-02-05-03-27-23.jpg',
      aspectRatio: 'square',
      url: ''
  },
  {
      id: '1pdUAxv9m3SvQ3-sV4gjNiBOx8TyRiPKb',
      title: 'استعراض سيارات بتقنية الهولوجرام',
      description: 'فيديو ريل استعراض بعض سيارات شانجان بتقنية الهولوجرام ',
      categories: ['مونتاج', 'ترويجي', 'Reels'],
      thumbnail: 'https://i.ibb.co/W416NgTb/changan-hologram-jpg.jpg',
      aspectRatio: 'portrait',
      url: ''
  },
 
  {
      id: '1jkfmvqVskJ3-nQ1FWvo1HflaKM5AWk9d',
      title: 'اختار اللون اللي يناسبك',
      description: 'فيديو ترويجي لالوان سيارة Uni V من شنجان ',
      categories: ['Gif', 'مونتاج', 'ترويجي'],
      thumbnail: 'https://i.ibb.co/8gVhjkrv/changan-univ-colors.jpg',
      aspectRatio: 'square',
      url: ''
  },
  {
      id: '1c4zMYcKbFmLOaf4dEEG9mt8mwwiHQNlp',
      title: 'فيديو تشويقي لمعرض Leap ج1',
      description: 'فيديو تشويقي لمعرض Leap التقني',
      categories: ['مونتاج', 'ترويجي'],
      thumbnail: 'https://i.ibb.co/1G1LrJrs/leap-teaser.jpg',
      aspectRatio: 'square',
      url: ''
  },
  {
      id: '1Cp55nRwgOCUx6LXWtJ9HOabL5GfEEIwE',
      title: 'فيديو ترويجي لشركة MicroPOS لبرنامج المحاسبة',
      description: 'فيديو ترويجي لشركة MicroPOS لبرنامج المحاسبة الخاص بالكمبيوتر باستخدام الموشن جرافيك',
      categories: ['موشن جرافيك', 'Reels', 'ترويجي'],
      thumbnail: 'https://i.ibb.co/vCZYb64q/gif.gif',
      aspectRatio: 'portrait',
      url: ''
  },
  {
      id: '10l49AhxzyiShWCI8KcXF9lBk-V9HfDKK',
      title: 'Uni s معاك في اي مكان',
      description: 'فيديو لسيارة Uni S وهيا تتنقل في البر وفي المدن ',
      categories: ['Gif', 'مونتاج', 'ترويجي'],
      thumbnail: 'https://i.ibb.co/chS8vZ5b/uni-s-line-2-mp4-snapshot-00-20-2025-02-05-03-18-52.jpg',
      aspectRatio: 'square',
      url: ''
  },
  {
      id: '17CMXiMFguBJHtbgmTFRyJ-SDwL4JapgA',
      title: 'فيديو تشويقي لمعرض Leap ج2',
      description: 'فيديو تشويقي لمعرض Leap التقني',
      categories: ['مونتاج', 'ترويجي'],
      thumbnail: 'https://i.ibb.co/mrGjCV8V/LEAP-2-mp4-snapshot-00-16-2025-02-05-03-51-26.jpg',
      aspectRatio: 'square',
      url: ''
  }

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