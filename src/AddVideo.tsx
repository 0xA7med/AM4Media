import React, { useState, useEffect } from 'react';
import { videos as appVideos } from './App';
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Copy, Check, Eye, X, Plus, Trash, Edit2, ArrowLeft } from 'lucide-react';

// دالة لاستخراج معرف الفيديو من رابط جوجل درايف
function extractGoogleDriveId(url) {
  if (!url) return null;
  
  // نمط للبحث عن معرف جوجل درايف في الرابط
  const patterns = [
    /\/file\/d\/([^\/]+)/,           // https://drive.google.com/file/d/FILEID/view
    /id=([^&]+)/,                    // https://drive.google.com/open?id=FILEID
    /\/d\/([^\/]+)/,                 // https://drive.google.com/d/FILEID/view
    /^([a-zA-Z0-9_-]{25,})/          // المعرف مباشرة
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

const SECRET_PASSWORD = "353567"; // كلمة المرور

// مكونات بسيطة
const Input = ({ type, value, onChange, placeholder, className, ...props }) => (
  <input
    type={type || "text"}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-2 border rounded-md ${className || ''}`}
    {...props}
  />
);

const Select = ({ value, onChange, options, className, ...props }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full p-2 border rounded-md ${className || ''}`}
    {...props}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const RadioGroup = ({ value, onValueChange, children, className, ...props }) => (
  <div className={`flex space-x-4 ${className || ''}`} {...props}>
    {children}
  </div>
);

const RadioGroupItem = ({ value, id, className, ...props }) => (
  <div className="flex items-center space-x-2">
    <input
      type="radio"
      id={id}
      value={value}
      className={className}
      {...props}
    />
  </div>
);

export default function AddVideo() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [videoAspectRatio, setVideoAspectRatio] = useState("square");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCategories, setVideoCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingVideo, setEditingVideo] = useState(null);
  const [showVideoList, setShowVideoList] = useState(true);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videos, setVideos] = useState(appVideos);
  const [thumbnailOptions, setThumbnailOptions] = useState([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const extractThumbnailsFromVideo = (videoId) => {
    if (!videoId) return [];
    
    // إنشاء مجموعة من الصور المصغرة بأحجام مختلفة
    return [
      `https://drive.google.com/thumbnail?id=${videoId}&sz=w400`,
      `https://drive.google.com/thumbnail?id=${videoId}&sz=w800`,
      `https://drive.google.com/thumbnail?id=${videoId}&sz=w1200`,
      `https://drive.google.com/thumbnail?id=${videoId}&sz=w2000`
    ];
  };

  const handleExtractThumbnails = () => {
    if (!videoUrl.trim()) {
      alert("يرجى إدخال رابط الفيديو أولاً");
      return;
    }
  
    const videoId = extractGoogleDriveId(videoUrl);
    if (!videoId) {
      alert("لم يتم العثور على معرف صالح للفيديو");
      return;
    }
    
    setIsLoadingThumbnails(true);
    
    // الحصول على الصور المصغرة
    const thumbnails = extractThumbnailsFromVideo(videoId);
    
    // محاكاة وقت التحميل
    setTimeout(() => {
      setThumbnailOptions(thumbnails);
      setIsLoadingThumbnails(false);
    }, 1000);
  };

  const handleSelectThumbnail = (thumbnailUrl) => {
    setVideoThumbnail(thumbnailUrl);
    setThumbnailPreview(thumbnailUrl);
  };

  // الفئات المتاحة
  const availableCategories = [
    "مونتاج", "ترويجي", "Reels", "إعلان", "موشن جرافيك", "تصوير", "أخرى"
  ];

  const handleLogin = () => {
    if (password === SECRET_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("كلمة المرور غير صحيحة!");
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !videoCategories.includes(newCategory.trim())) {
      setVideoCategories([...videoCategories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category) => {
    setVideoCategories(videoCategories.filter(c => c !== category));
  };

  const handleThumbnailPreview = () => {
    if (videoThumbnail.trim()) {
      setThumbnailPreview(videoThumbnail);
    }
  };

  const handleAddVideo = () => {
    if (videoUrl.trim() === "") {
      alert("يرجى إدخال رابط الفيديو");
      return;
    }
    
    if (videoTitle.trim() === "") {
      alert("يرجى إدخال عنوان الفيديو");
      return;
    }
    
    if (videoThumbnail.trim() === "") {
      alert("يرجى إدخال رابط الصورة المصغرة");
      return;
    }
    
    const videoId = extractGoogleDriveId(videoUrl);
    
    const newVideo = {
      id: videoId,
      title: videoTitle,
      description: videoDescription,
      categories: videoCategories,
      thumbnail: videoThumbnail,
      aspectRatio: videoAspectRatio
    };
    
    setVideos([...videos, newVideo]);
    
    // إنشاء كود لإضافته في App.tsx
    const videoCode = `{
    id: '${videoId}',
    title: '${videoTitle}',
    description: '${videoDescription}',
    categories: [${videoCategories.map(cat => `'${cat}'`).join(', ')}],
    thumbnail: '${videoThumbnail}',
    aspectRatio: '${videoAspectRatio}'
  },`;
    
    // نسخ الكود إلى الحافظة
    navigator.clipboard.writeText(videoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    
    // إعادة تعيين الحقول
    setVideoTitle("");
    setVideoDescription("");
    setVideoThumbnail("");
    setVideoUrl("");
    setVideoCategories([]);
    setThumbnailPreview("");
    setThumbnailOptions([]);
  };

  const handleUpdateVideo = () => {
    if (!editingVideo) return;
    
    const videoId = extractGoogleDriveId(videoUrl);
    
    const updatedVideos = videos.map(video => {
      if (video.id === editingVideo.id) {
        return {
          ...video,
          id: videoId,
          title: videoTitle,
          description: videoDescription,
          categories: videoCategories,
          thumbnail: videoThumbnail,
          aspectRatio: videoAspectRatio
        };
      }
      return video;
    });
    
    setVideos(updatedVideos);
    
    // إنشاء كود لتحديثه في App.tsx
    const videoCode = `{
    id: '${videoId}',
    title: '${videoTitle}',
    description: '${videoDescription}',
    categories: [${videoCategories.map(cat => `'${cat}'`).join(', ')}],
    thumbnail: '${videoThumbnail}',
    aspectRatio: '${videoAspectRatio}'
  },`;
    
    // نسخ الكود إلى الحافظة
    navigator.clipboard.writeText(videoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    
    // إعادة تعيين الحقول
    setVideoTitle("");
    setVideoDescription("");
    setVideoThumbnail("");
    setVideoUrl("");
    setVideoCategories([]);
    setThumbnailPreview("");
    setThumbnailOptions([]);
    setEditingVideo(null);
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setVideoTitle(video.title);
    setVideoDescription(video.description);
    setVideoThumbnail(video.thumbnail);
    setThumbnailPreview(video.thumbnail);
    setVideoCategories(video.categories);
    setVideoAspectRatio(video.aspectRatio);
    setVideoUrl(`https://drive.google.com/file/d/${video.id}/view`);
    setShowVideoList(false);
  };

  const handleCancelEdit = () => {
    setEditingVideo(null);
    setVideoTitle("");
    setVideoDescription("");
    setVideoThumbnail("");
    setVideoUrl("");
    setVideoCategories([]);
    setThumbnailPreview("");
    setThumbnailOptions([]);
  };

  const handleDeleteVideo = (videoId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الفيديو؟")) {
      setVideos(videos.filter(video => video.id !== videoId));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          {!authenticated ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center">تسجيل الدخول</h2>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleLogin}
              >
                دخول
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {showVideoList ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">قائمة الفيديوهات</h2>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setShowVideoList(false)}
                    >
                      إضافة فيديو جديد
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos.map((video) => (
                      <div 
                        key={video.id} 
                        className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{video.title}</h3>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditVideo(video)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteVideo(video.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {video.description.length > 100 
                            ? video.description.substring(0, 100) + '...' 
                            : video.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {video.categories.map((category) => (
                            <span 
                              key={category} 
                              className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                      {editingVideo ? 'تعديل الفيديو' : 'إضافة فيديو جديد'}
                    </h2>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowVideoList(true);
                        handleCancelEdit();
                      }}
                    >
                      <ArrowLeft className="ml-2" size={16} />
                      العودة للقائمة
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">رابط الفيديو (Google Drive)</label>
                      <div className="flex space-x-2">
                        <Input
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="أدخل رابط الفيديو من Google Drive"
                          className="flex-1"
                        />
                        <Button 
                          onClick={handleExtractThumbnails}
                          disabled={isLoadingThumbnails}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          استخراج الصور المصغرة
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1">عنوان الفيديو</label>
                      <Input
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="أدخل عنوان الفيديو"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1">وصف الفيديو</label>
                      <textarea
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="أدخل وصف الفيديو"
                        className="w-full p-2 border rounded-md h-24"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1">نسبة العرض إلى الارتفاع</label>
                      <RadioGroup
                        value={videoAspectRatio}
                        onValueChange={(e) => setVideoAspectRatio(e.target.value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem
                            id="square"
                            name="aspectRatio"
                            value="square"
                            checked={videoAspectRatio === "square"}
                            onChange={(e) => setVideoAspectRatio(e.target.value)}
                          />
                          <label htmlFor="square" className="mr-2">مربع (1:1)</label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem
                            id="portrait"
                            name="aspectRatio"
                            value="portrait"
                            checked={videoAspectRatio === "portrait"}
                            onChange={(e) => setVideoAspectRatio(e.target.value)}
                          />
                          <label htmlFor="portrait" className="mr-2">طولي (9:16)</label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem
                            id="landscape"
                            name="aspectRatio"
                            value="landscape"
                            checked={videoAspectRatio === "landscape"}
                            onChange={(e) => setVideoAspectRatio(e.target.value)}
                          />
                          <label htmlFor="landscape" className="mr-2">عرضي (16:9)</label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <label className="block mb-1">الفئات</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {videoCategories.map((category) => (
                          <div 
                            key={category}
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full flex items-center"
                          >
                            <span>{category}</span>
                            <button 
                              onClick={() => handleRemoveCategory(category)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="flex-1 p-2 border rounded-md"
                        >
                          <option value="">اختر فئة أو أدخل فئة جديدة</option>
                          {availableCategories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        <Button 
                          onClick={handleAddCategory}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    {isLoadingThumbnails ? (
                      <div className="text-center p-4">
                        جاري تحميل الصور المصغرة...
                      </div>
                    ) : thumbnailOptions.length > 0 ? (
                      <div>
                        <label className="block mb-1">اختر صورة مصغرة</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {thumbnailOptions.map((thumbnail, index) => (
                            <div 
                              key={index}
                              className={`border rounded-md overflow-hidden cursor-pointer ${
                                videoThumbnail === thumbnail ? 'ring-2 ring-blue-500' : ''
                              }`}
                              onClick={() => handleSelectThumbnail(thumbnail)}
                            >
                              <img 
                                src={thumbnail} 
                                alt={`صورة مصغرة ${index + 1}`} 
                                className="w-full h-auto"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block mb-1">رابط الصورة المصغرة</label>
                        <div className="flex space-x-2">
                          <Input
                            value={videoThumbnail}
                            onChange={(e) => setVideoThumbnail(e.target.value)}
                            placeholder="أدخل رابط الصورة المصغرة"
                            className="flex-1"
                          />
                          <Button 
                            onClick={handleThumbnailPreview}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Eye size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {thumbnailPreview && (
                      <div>
                        <label className="block mb-1">معاينة الصورة المصغرة</label>
                        <div className="border rounded-md overflow-hidden">
                          <img 
                            src={thumbnailPreview} 
                            alt="معاينة الصورة المصغرة" 
                            className="w-full h-auto max-h-48 object-contain"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button 
                        onClick={editingVideo ? handleUpdateVideo : handleAddVideo}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="ml-2" size={16} />
                            تم نسخ الكود!
                          </>
                        ) : (
                          <>
                            <Copy className="ml-2" size={16} />
                            {editingVideo ? 'تحديث الفيديو ونسخ الكود' : 'إضافة الفيديو ونسخ الكود'}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">تعليمات الاستخدام</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>قم بإضافة أو تعديل الفيديو باستخدام النموذج أعلاه.</li>
                      <li>عند النقر على "إضافة الفيديو" أو "تحديث الفيديو"، سيتم نسخ كود الفيديو إلى الحافظة.</li>
                      <li>افتح ملف <code>App.tsx</code> والصق الكود ضمن مصفوفة <code>videos</code>.</li>
                      <li>إذا كنت تقوم بتحديث فيديو موجود، استبدل الكود القديم بالكود الجديد.</li>
                      <li>احفظ الملف وأعد تشغيل التطبيق لرؤية التغييرات.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}