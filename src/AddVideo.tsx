import { useState, useEffect } from "react";
import fs from 'fs';
import path from 'path';
import { videos as appVideos } from './App';

// مكونات بسيطة
const Input = ({ type, value, onChange, placeholder, className, ...props }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-2 border rounded-md ${className}`}
    {...props}
  />
);

const Button = ({ onClick, children, className, ...props }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className, ...props }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

const Label = ({ children, className, ...props }) => (
  <label className={`block text-sm font-medium mb-1 ${className}`} {...props}>
    {children}
  </label>
);

const RadioGroup = ({ value, onValueChange, children, className, ...props }) => (
  <div className={`space-y-2 ${className}`} {...props}>
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

const Textarea = ({ value, onChange, placeholder, className, ...props }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-2 border rounded-md ${className}`}
    {...props}
  />
);

const Select = ({ value, onChange, options, className, ...props }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full p-2 border rounded-md ${className}`}
    {...props}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// دالة لاستخراج معرف الفيديو من رابط جوجل درايف
const extractGoogleDriveId = (url) => {
  // التعبير النمطي للبحث عن معرف الفيديو في روابط جوجل درايف
  const regex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  // إذا لم يتم العثور على المعرف، نعيد الرابط كما هو
  return url;
};

const SECRET_PASSWORD = "353567"; // كلمة المرور

// قائمة الفيديوهات من App.tsx
const initialVideos = [
  {
    id: '1X0oD9KbArMOpp6d1Up7mUpWBGZKn6tQ5',
    title: 'افضل خدمات صيانة السيارات',
    description: 'فيديو ترويجي لخدمات صيانة السيارات لدي مركز غازي جميل',
    categories: ['مونتاج','ترويجي', 'Reels'],
    thumbnail: 'https://i.ibb.co/Qy3Lmqp/gazy-center-1.jpg',
    aspectRatio: 'portrait'
  },
  {
    id: '1Thcs7caBUTJoCiVJd5n4wmIEZKXdZEvf',
    title: 'فيديو تشويقي لمعرض Leap ج4',
    description: 'فيديو تشويقي لمعرض Leap التقني',
    categories: ['مونتاج', 'ترويجي'],
    thumbnail: 'https://i.ibb.co/KpFKjwVB/TRANS-Leap-4-4-mp4-snapshot-00-20-2025-02-05-04-04-59.jpg',
    aspectRatio: 'square'
  },
  // يمكن إضافة المزيد من الفيديوهات هنا
];

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
    
    // إضافة الفيديو الجديد للقائمة
    const updatedVideos = [...videos, newVideo];
    setVideos(updatedVideos);
    
    // إنشاء كود لإضافته إلى App.tsx
    const videoCode = `{
      id: '${videoId}',
      title: '${videoTitle}',
      description: '${videoDescription}',
      categories: [${videoCategories.map(cat => `'${cat}'`).join(', ')}],
      thumbnail: '${videoThumbnail}',
      aspectRatio: '${videoAspectRatio}'
    },`;
    
    console.log("كود الفيديو الجديد:");
    console.log(videoCode);
    
    // نسخ الكود إلى الحافظة
    navigator.clipboard.writeText(videoCode)
      .then(() => {
        alert(`تم إضافة الفيديو: ${videoTitle} ونسخ الكود إلى الحافظة`);
      })
      .catch(err => {
        console.error('فشل في نسخ الكود: ', err);
        alert(`تم إضافة الفيديو: ${videoTitle}\nيرجى نسخ الكود من وحدة التحكم`);
      });
    
    // إعادة تعيين الحقول
    resetForm();
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setVideoTitle(video.title);
    setVideoDescription(video.description);
    setVideoThumbnail(video.thumbnail);
    setVideoAspectRatio(video.aspectRatio || "square");
    setVideoUrl(`https://drive.google.com/file/d/${video.id}/view`);
    setVideoCategories(video.categories || []);
    setThumbnailPreview(video.thumbnail);
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
    
    console.log("كود الفيديو المحدث:");
    console.log(videoCode);
    
    // نسخ الكود إلى الحافظة
    navigator.clipboard.writeText(videoCode)
      .then(() => {
        alert(`تم تحديث الفيديو: ${videoTitle} ونسخ الكود إلى الحافظة`);
      })
      .catch(err => {
        console.error('فشل في نسخ الكود: ', err);
        alert(`تم تحديث الفيديو: ${videoTitle}\nيرجى نسخ الكود من وحدة التحكم`);
      });
    
    // إعادة تعيين الحقول
    resetForm();
  };

  const handleDeleteVideo = (videoId) => {
    if (confirm("هل أنت متأكد من حذف هذا الفيديو؟")) {
      const updatedVideos = videos.filter(video => video.id !== videoId);
      setVideos(updatedVideos);
      alert(`تم حذف الفيديو. يرجى تحديث ملف App.tsx يدويًا لإزالة هذا الفيديو.`);
    }
  };

  const resetForm = () => {
    setEditingVideo(null);
    setVideoTitle("");
    setVideoDescription("");
    setVideoThumbnail("");
    setVideoAspectRatio("square");
    setVideoUrl("");
    setVideoCategories([]);
    setThumbnailPreview("");
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  // دالة لإنشاء رابط مشاهدة الفيديو
  const getVideoViewUrl = (videoId) => {
    return `https://drive.google.com/file/d/${videoId}/preview`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-5xl p-6 shadow-xl">
        <CardContent>
          {!authenticated ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center">أدخل كلمة المرور</h2>
              <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button className="w-full" onClick={handleLogin}>
                دخول
              </Button>
            </div>
          ) : (
            <><div className="space-y-6">
                <h2 className="text-xl font-semibold text-center">
                  {editingVideo ? "تعديل الفيديو" : "إضافة فيديو جديد"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="videoTitle">عنوان الفيديو</Label>
                      <Input
                        id="videoTitle"
                        type="text"
                        placeholder="أدخل عنوان الفيديو"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoDescription">وصف الفيديو</Label>
                      <Textarea
                        id="videoDescription"
                        placeholder="أدخل وصف الفيديو"
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        rows={4} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">رابط الفيديو (جوجل درايف)</Label>
                      <Input
                        id="videoUrl"
                        type="text"
                        placeholder="أدخل رابط الفيديو من جوجل درايف"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)} />
                      {videoUrl && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          معرف الفيديو: {extractGoogleDriveId(videoUrl)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoThumbnail">رابط الصورة المصغرة</Label>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Input
                          id="videoThumbnail"
                          type="text"
                          placeholder="أدخل رابط الصورة المصغرة"
                          value={videoThumbnail}
                          onChange={(e) => setVideoThumbnail(e.target.value)}
                          className="flex-1" />
                        <Button
                          onClick={handleThumbnailPreview}
                          className="whitespace-nowrap bg-green-600 hover:bg-green-700"
                        >
                          معاينة الصورة
                        </Button>
                        <Button
                          onClick={handleExtractThumbnails}
                          className="whitespace-nowrap bg-blue-600 hover:bg-blue-700"
                        >
                          استخراج من الفيديو
                        </Button>
                      </div>

                      {isLoadingThumbnails && (
                        <div className="text-center py-4">
                          <p>جاري استخراج الصور المصغرة...</p>
                        </div>
                      )}

                      {thumbnailOptions.length > 0 && !isLoadingThumbnails && (
                        <div className="mt-4">
                          <h3 className="text-lg font-medium mb-2">اختر صورة مصغرة:</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {thumbnailOptions.map((thumbnail, index) => (
                              <div
                                key={index}
                                className={`cursor-pointer border-2 rounded-md overflow-hidden ${videoThumbnail === thumbnail ? 'border-blue-500' : 'border-gray-200'}`}
                                onClick={() => handleSelectThumbnail(thumbnail)}
                              >
                                <img
                                  src={thumbnail}
                                  alt={`صورة مصغرة ${index + 1}`}
                                  className="w-full h-auto object-cover"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x225?text=خطأ+في+تحميل+الصورة';
                                  } } />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {thumbnailPreview && (
                        <div className="mt-4">
                          <h3 className="text-lg font-medium mb-2">معاينة الصورة المصغرة:</h3>
                          <div className="border rounded-md overflow-hidden max-w-xs">
                            <img
                              src={thumbnailPreview}
                              alt="معاينة الصورة المصغرة"
                              className="w-full h-auto"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x225?text=خطأ+في+تحميل+الصورة';
                              } } />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>أبعاد الفيديو</Label>
                      <RadioGroup
                        value={videoAspectRatio}
                        onValueChange={setVideoAspectRatio}
                        className="flex space-x-4 rtl:space-x-reverse"
                      >
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <RadioGroupItem
                            value="square"
                            id="square"
                            checked={videoAspectRatio === "square"}
                            onChange={() => setVideoAspectRatio("square")} />
                          <Label htmlFor="square">مربع</Label>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <RadioGroupItem
                            value="portrait"
                            id="portrait"
                            checked={videoAspectRatio === "portrait"}
                            onChange={() => setVideoAspectRatio("portrait")} />
                          <Label htmlFor="portrait">طولي</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="videoCategories">تصنيفات الفيديو</Label>

                      {/* عرض التصنيفات المختارة */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {videoCategories.length > 0 ? (
                          videoCategories.map((category) => (
                            <div
                              key={category}
                              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full flex items-center gap-1 transition-all hover:bg-blue-200 dark:hover:bg-blue-800"
                            >
                              <span>{category}</span>
                              <button
                                onClick={() => handleRemoveCategory(category)}
                                className="text-blue-600 dark:text-blue-300 hover:text-red-500 dark:hover:text-red-400 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 dark:text-gray-400 text-sm italic">لم يتم اختيار أي تصنيفات بعد</div>
                        )}
                      </div>

                      {/* اختيار التصنيفات المتاحة */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">التصنيفات المتاحة:</h4>
                        <div className="flex flex-wrap gap-2">
                          {availableCategories.map((category) => (
                            <button
                              key={category}
                              onClick={() => {
                                if (!videoCategories.includes(category)) {
                                  setVideoCategories([...videoCategories, category]);
                                }
                              } }
                              disabled={videoCategories.includes(category)}
                              className={`px-3 py-1 rounded-full text-sm transition-all ${videoCategories.includes(category)
                                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-blue-100'}`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* إضافة تصنيف جديد */}
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Input
                          type="text"
                          placeholder="أضف تصنيفًا جديدًا"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddCategory();
                            }
                          } } />
                        <Button
                          onClick={handleAddCategory}
                          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-colors"
                        >
                          إضافة
                        </Button>
                      </div>
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <select
                        className="flex-1 p-2 border rounded-md"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      >
                        <option value="">اختر فئة...</option>
                        {availableCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={handleAddCategory}
                        className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-700"
                      >
                        إضافة فئة
                      </Button>
                    </div>
                    <Input
                      type="text"
                      placeholder="أو أدخل فئة جديدة"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                      className="mt-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* معاينة الصورة المصغرة */}
                  {thumbnailPreview && (
                    <div className="space-y-2">
                      <Label>معاينة الصورة المصغرة</Label>
                      <div className="border rounded-md overflow-hidden">
                        <img
                          src={thumbnailPreview}
                          alt="معاينة الصورة المصغرة"
                          className="w-full h-auto object-cover"
                          onError={() => {
                            alert("تعذر تحميل الصورة. تأكد من صحة الرابط.");
                            setThumbnailPreview("");
                          } } />
                      </div>
                    </div>
                  )}

                  {/* معاينة الفيديو */}
                  {videoUrl && extractGoogleDriveId(videoUrl) && (
                    <div className="space-y-2">
                      <Label>معاينة الفيديو</Label>
                      <div className="border rounded-md overflow-hidden aspect-video">
                        <iframe
                          src={getVideoViewUrl(extractGoogleDriveId(videoUrl))}
                          width="100%"
                          height="100%"
                          allow="autoplay"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              </div><div className="flex space-x-2 rtl:space-x-reverse">
                  <Button
                    className="flex-1"
                    onClick={editingVideo ? handleUpdateVideo : handleAddVideo}
                  >
                    {editingVideo ? "تحديث الفيديو" : "إضافة الفيديو"}
                  </Button>

                  {editingVideo && (
                    <Button
                      className="bg-gray-500 hover:bg-gray-600"
                      onClick={handleCancelEdit}
                    >
                      إلغاء
                    </Button>
                  )}
                </div><div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-4">
                    <Button
                      onClick={() => setShowVideoList(!showVideoList)}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {showVideoList ? "إخفاء قائمة الفيديوهات" : "عرض قائمة الفيديوهات"}
                    </Button>
                  </div>

                  {showVideoList && (
                    <div className="mt-4 space-y-4">
                      <h3 className="text-lg font-semibold">قائمة الفيديوهات ({videos.length})</h3>
                      {videos.length === 0 ? (
                        <p>لا توجد فيديوهات حالياً</p>
                      ) : (
                        <div className="space-y-4">
                          {videos.map((video) => (
                            <Card key={video.id} className="overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-full md:w-32 h-32 object-cover" />
                                <div className="p-4 flex-1">
                                  <h4 className="font-semibold">{video.title}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                    {video.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1 my-2">
                                    {video.categories && video.categories.map((category) => (
                                      <span key={category} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 text-xs rounded-md">
                                        {category}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex justify-between items-center mt-2">
                                    <div className="text-sm">
                                      <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md">
                                        {video.aspectRatio === "square" ? "مربع" : "طولي"}
                                      </span>
                                    </div>
                                    <div className="flex space-x-2 rtl:space-x-reverse">
                                      <Button
                                        onClick={() => handleEditVideo(video)}
                                        className="bg-amber-500 hover:bg-amber-600"
                                      >
                                        تعديل
                                      </Button>
                                      <Button
                                        onClick={() => handleDeleteVideo(video.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        حذف
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
</div>
)}
</CardContent>
</Card>
</div>