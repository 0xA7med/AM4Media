import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../videoStore';
import { Video, IntroVideo } from '../types';
import { Download, Trash2, Plus, Save, Upload, X, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const ADMIN_PASSWORD = '353567';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const { videos, addVideo, updateVideo, deleteVideo, saveVideos, categories, addCategory, setIntroVideo, reorderVideos } = useVideos();
  const navigate = useNavigate();
  const [thumbnailType, setThumbnailType] = useState<'drive' | 'url' | 'upload'>('drive');
  const [customThumbnailUrl, setCustomThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [draggedVideo, setDraggedVideo] = useState<number | null>(null);

  const [newVideo, setNewVideo] = useState<Video>({
    id: '',
    createdAt: new Date().toISOString(),
    title: '',
    description: '',
    driveUrl: '',
    thumbnail: '',
    categories: [],
    aspectRatio: 'square',
    url: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!videos || videos.length === 0) return;
    
    const sortedVideos = [...videos].sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    const currentIds = videos.map(v => v.id);
    const sortedIds = sortedVideos.map(v => v.id);
    
    if (JSON.stringify(currentIds) !== JSON.stringify(sortedIds)) {
      if (typeof reorderVideos === 'function') {
        reorderVideos(sortedVideos);
      }
    }
  }, [videos]);

  const [introVideoUrl, setIntroVideoUrl] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('تم تسجيل الدخول بنجاح');
    } else {
      toast.error('كلمة المرور غير صحيحة');
    }
  };

  const extractDriveId = (url: string) => {
    const match = url.match(/\/d\/(.*?)(?:\/|$)/);
    return match ? match[1] : '';
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCustomThumbnailUrl(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getThumbnailUrl = (driveId: string, type: string, customUrl: string) => {
    switch (type) {
      case 'drive':
        return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
      case 'url':
        return customUrl;
      case 'upload':
        return customThumbnailUrl;
      default:
        return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const driveId = extractDriveId(newVideo.driveUrl);
      if (!driveId) {
        toast.error('الرجاء إدخال رابط Google Drive صحيح');
        setLoading(false);
        return;
      }
      const videoId = Date.now().toString();
      const thumbnailUrl = getThumbnailUrl(driveId, thumbnailType, customThumbnailUrl);
      const videoToAdd = {
        ...newVideo,
        id: videoId,
        thumbnail: thumbnailUrl,
        url: `https://drive.google.com/file/d/${driveId}/preview`,
      };
      await addVideo(videoToAdd);
      setNewVideo({
        id: '',
        createdAt: new Date().toISOString(),
        title: '',
        description: '',
        driveUrl: '',
        thumbnail: '',
        categories: [],
        aspectRatio: 'square',
        url: ''
      });
      setCustomThumbnailUrl('');
      setThumbnailFile(null);
      toast.success('تم إضافة الفيديو بنجاح');
    } catch (error) {
      console.error('خطأ في إضافة الفيديو:', error);
      toast.error('حدث خطأ أثناء إضافة الفيديو');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedVideo(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedVideo === null || draggedVideo === dropIndex) return;

    const newVideos = [...videos];
    const [draggedItem] = newVideos.splice(draggedVideo, 1);
    newVideos.splice(dropIndex, 0, draggedItem);
    
    reorderVideos(newVideos);
    setDraggedVideo(null);
  };

  const handleDragEnd = () => {
    setDraggedVideo(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
      deleteVideo(id);
      toast.success('تم حذف الفيديو بنجاح');
    }
  };

  const handleEditVideo = (video: Video) => {
    console.log("الفيديو الأصلي للتعديل:", video); // للتشخيص
    
    setEditingVideo(video);
    
    const videoToEdit = {
      ...video,
      id: video.id || '',
      title: video.title || '',
      description: video.description || '',
      url: video.url || '',
      driveUrl: video.driveUrl || '',
      thumbnail: video.thumbnail || '',
      categories: Array.isArray(video.categories) ? video.categories : [video.categories].filter(Boolean),
      aspectRatio: video.aspectRatio || 'square',
      createdAt: video.createdAt || new Date().toISOString()
    };
    
    console.log("الفيديو بعد الإعداد للتعديل:", videoToEdit); // للتشخيص
    
    setNewVideo(videoToEdit);
    
    if (video.thumbnail?.includes('drive.google.com')) {
      setThumbnailType('drive');
    } else if (video.thumbnail) {
      setThumbnailType('url');
      setCustomThumbnailUrl(video.thumbnail);
    } else {
      setThumbnailType('drive');
      setCustomThumbnailUrl('');
    }
  };

  const handleUpdateVideo = async (videoId: string) => {
    try {
      const updatedFields: Partial<Video> = {};
      
      updatedFields.title = newVideo.title;
      updatedFields.description = newVideo.description;
      updatedFields.categories = newVideo.categories;
      updatedFields.aspectRatio = newVideo.aspectRatio;
      
      if (newVideo.url && newVideo.url.trim() !== '') {
        updatedFields.url = newVideo.url;
      }
      
      if (newVideo.driveUrl && newVideo.driveUrl.trim() !== '') {
        updatedFields.driveUrl = newVideo.driveUrl;
      }
      
      const driveId = extractDriveId(newVideo.driveUrl || editingVideo?.driveUrl || '');
      
      if (thumbnailType !== 'drive' || driveId !== editingVideo?.id) {
        updatedFields.thumbnail = getThumbnailUrl(driveId, thumbnailType, customThumbnailUrl);
      }
      
      await updateVideo(videoId, updatedFields);
      setEditingVideo(null);
      
      toast.success('تم تحديث الفيديو بنجاح', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        duration: 3000
      });
    } catch (error) {
      console.error('Error updating video:', error);
      toast.error('فشل في تحديث الفيديو', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        duration: 4000
      });
    }
  };

  const handleDownloadBackup = () => {
    const dataStr = JSON.stringify(videos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('تم تحميل النسخة الاحتياطية');
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const restoredVideos = JSON.parse(content);
          restoredVideos.forEach((video: Video) => {
            addVideo(video);
          });
          toast.success('تم استعادة النسخة الاحتياطية بنجاح');
        } catch (error) {
          toast.error('حدث خطأ أثناء استعادة النسخة الاحتياطية');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSetIntroVideo = () => {
    const videoId = extractDriveId(introVideoUrl);
    if (!videoId) {
      toast.error('رابط Drive غير صالح');
      return;
    }

    const selectedVideo = videos.find(v => v.id === videoId);
    if (selectedVideo) {
      const introVideo: IntroVideo = {
        id: selectedVideo.id,
        url: selectedVideo.url,
        thumbnail: `https://drive.google.com/thumbnail?id=${selectedVideo.id}&sz=w1000`
      };
      setIntroVideo(introVideo);
      toast.success('تم تعيين الفيديو التعريفي بنجاح');
    } else {
      toast.error('لم يتم العثور على الفيديو');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">تسجيل الدخول للوحة التحكم</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            دخول
          </button>
        </form>
      </div>
    );
  }

  const sortedVideos = [...videos].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-900 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="file"
                onChange={handleRestoreBackup}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".json"
              />
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                <Upload size={20} />
                استعادة نسخة احتياطية
              </button>
            </div>
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Download size={20} />
              تحميل نسخة احتياطية
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              عودة للموقع
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">إعدادات الفيديو التعريفي</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">رابط الفيديو التعريفي</label>
              <input
                type="text"
                value={introVideoUrl}
                onChange={(e) => setIntroVideoUrl(e.target.value)}
                placeholder="أدخل رابط فيديو تعريفي مباشر"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
              />
            </div>
            <button
              onClick={() => {
                if (introVideoUrl) {
                  setIntroVideo({
                    id: `intro-${Date.now()}`,
                    title: 'فيديو تعريفي',
                    description: '',
                    url: introVideoUrl,
                    driveUrl: '',
                    thumbnail: '',
                    categories: [],
                    aspectRatio: 'square',
                    createdAt: new Date().toISOString()
                  });
                  toast.success('تم تعيين الفيديو التعريفي بنجاح');
                } else {
                  toast.error('الرجاء إدخال رابط فيديو تعريفي');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              تعيين الفيديو التعريفي
            </button>
          </div>
        </div>


        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">إضافة فيديو جديد</h2>
          <form onSubmit={handleAddVideo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                placeholder="عنوان الفيديو"
                className="px-4 py-2 rounded bg-gray-700 text-white"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newVideo.driveUrl}
                  onChange={(e) => setNewVideo({ ...newVideo, driveUrl: e.target.value })}
                  placeholder="رابط Google Drive"
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const text = await navigator.clipboard.readText();
                    setNewVideo({ ...newVideo, driveUrl: text });
                  }}
                  className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors flex items-center"
                >
                  لصق
                </button>
              </div>
            </div>
            <textarea
              value={newVideo.description}
              onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
              placeholder="وصف الفيديو"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white h-32"
            />
            <div>
              <label className="block text-white mb-2">التصنيفات المتاحة:</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      const currentCategories = newVideo.categories;
                      const newCategories = currentCategories.includes(category)
                        ? currentCategories.filter(c => c !== category)
                        : [...currentCategories, category];
                      setNewVideo({ ...newVideo, categories: newCategories });
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      newVideo.categories.includes(category)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={newVideo.categories.join(', ')}
                onChange={(e) => setNewVideo({ ...newVideo, categories: e.target.value.split(',').map(c => c.trim()) })}
                placeholder="التصنيفات (مفصولة بفواصل)"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-white mb-2">نوع الصورة المصغرة:</label>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="drive"
                    checked={thumbnailType === 'drive'}
                    onChange={(e) => setThumbnailType(e.target.value as 'drive' | 'url' | 'upload')}
                    className="mr-2"
                  />
                  <span className="text-white">Drive تلقائي</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="url"
                    checked={thumbnailType === 'url'}
                    onChange={(e) => setThumbnailType(e.target.value as 'drive' | 'url' | 'upload')}
                    className="mr-2"
                  />
                  <span className="text-white">رابط خارجي</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="upload"
                    checked={thumbnailType === 'upload'}
                    onChange={(e) => setThumbnailType(e.target.value as 'drive' | 'url' | 'upload')}
                    className="mr-2"
                  />
                  <span className="text-white">رفع صورة</span>
                </label>
              </div>
              {thumbnailType === 'url' && (
                <input
                  type="text"
                  value={customThumbnailUrl}
                  onChange={(e) => setCustomThumbnailUrl(e.target.value)}
                  placeholder="رابط الصورة المصغرة"
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-4"
                />
              )}
              {thumbnailType === 'upload' && (
                <input
                  type="file"
                  onChange={handleThumbnailChange}
                  accept="image/*"
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-4"
                />
              )}
            </div>
            <select
              value={newVideo.aspectRatio}
              onChange={(e) => setNewVideo({ ...newVideo, aspectRatio: e.target.value as 'square' | 'portrait' })}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            >
              <option value="square">مربع</option>
              <option value="portrait">طولي</option>
            </select>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              إضافة الفيديو
            </button>
          </form>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">الفيديوهات الحالية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVideos.map((video, index) => (
              <div
                key={`${video.id}-${index}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className="bg-gray-700 rounded-lg overflow-hidden cursor-move flex flex-col min-h-[400px]"
              >
                <div className="flex items-center justify-end p-2 bg-gray-800">
                  <GripVertical className="text-gray-400" />
                </div>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 flex-grow">{video.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {video.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 mt-auto">
                    <button
                      onClick={() => handleEditVideo(video)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"            >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        try {
                          const selectedVideo = videos.find(v => v.id === video.id);
                          if (selectedVideo) {
                            setIntroVideo(selectedVideo);
                            toast.success('تم تعيين الفيديو التعريفي بنجاح');
                          } else {
                            toast.error('لم يتم العثور على الفيديو');
                          }
                        } catch (error) {
                          console.error('Error setting intro video:', error);
                          toast.error('حدث خطأ أثناء تعيين الفيديو التعريفي');
                        }
                      }}
                      className="p-2 text-blue-500 hover:text-blue-700"
                    >
                      تعيين كفيديو تعريفي
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      
      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">تعديل الفيديو</h2>
              <button 
                onClick={() => setEditingVideo(null)} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateVideo(editingVideo.id);
            }} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">عنوان الفيديو</label>
                    <input
                      type="text"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">رابط الفيديو</label>
                    <input
                      type="text"
                      value={newVideo.url}
                      onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">رابط Google Drive</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newVideo.driveUrl}
                        onChange={(e) => setNewVideo({ ...newVideo, driveUrl: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          const text = await navigator.clipboard.readText();
                          setNewVideo({ ...newVideo, driveUrl: text });
                        }}
                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                      >
                        لصق
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">نسبة العرض</label>
                    <select
                      value={newVideo.aspectRatio}
                      onChange={(e) => setNewVideo({ ...newVideo, aspectRatio: e.target.value as 'square' | 'portrait' })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                    >
                      <option value="square">مربع</option>
                      <option value="portrait">طولي</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">الصورة المصغرة</label>
                    <div className="mb-3 relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <img 
                        src={newVideo.thumbnail || `https://drive.google.com/thumbnail?id=${extractDriveId(newVideo.driveUrl)}&sz=w1000`}
                        alt={newVideo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-gray-300 mb-2">تحديث الصورة المصغرة</label>
                        <select
                          value={thumbnailType}
                          onChange={(e) => setThumbnailType(e.target.value as 'drive' | 'url' | 'upload')}
                          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                        >
                          <option value="drive">صورة Google Drive</option>
                          <option value="url">رابط URL</option>
                          <option value="upload">رفع صورة</option>
                        </select>
                      </div>
                      
                      {thumbnailType === 'url' && (
                        <div>
                          <label className="block text-gray-300 mb-2">رابط الصورة</label>
                          <input
                            type="text"
                            value={customThumbnailUrl}
                            onChange={(e) => setCustomThumbnailUrl(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                          />
                        </div>
                      )}
                      
                      {thumbnailType === 'upload' && (
                        <div>
                          <label className="block text-gray-300 mb-2">رفع صورة</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">وصف الفيديو</label>
                    <textarea
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white h-32"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">التصنيفات</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {categories.map(category => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        const newCategories = newVideo.categories.includes(category)
                          ? newVideo.categories.filter(c => c !== category)
                          : [...newVideo.categories, category];
                        setNewVideo({ ...newVideo, categories: newCategories });
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        newVideo.categories.includes(category)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}