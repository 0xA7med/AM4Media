import { useState, useEffect } from "react";

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

export default function AddVideo() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [videoName, setVideoName] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [videoAspectRatio, setVideoAspectRatio] = useState("square");
  const [videoUrl, setVideoUrl] = useState("");
  const [videos, setVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showVideoList, setShowVideoList] = useState(false);
  const [thumbnailOptions, setThumbnailOptions] = useState([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);

  // استيراد الفيديوهات من localStorage عند تحميل المكون
  useEffect(() => {
    const savedVideos = localStorage.getItem('videos');
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    }
  }, []);

  const handleLogin = () => {
    if (password === SECRET_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("كلمة المرور غير صحيحة!");
    }
  };

  // استخراج الصور المصغرة من الفيديو (محاكاة)
  const handleExtractThumbnails = () => {
    if (!videoUrl.trim()) {
      alert("يرجى إدخال رابط الفيديو أولاً");
      return;
    }

    setIsLoadingThumbnails(true);
    
    // محاكاة استخراج الصور المصغرة (في التطبيق الحقيقي، ستستخدم API لاستخراج الصور)
    setTimeout(() => {
      const videoId = extractGoogleDriveId(videoUrl);
      // إنشاء صور وهمية للعرض
      const fakeThumbnails = [
        `https://picsum.photos/seed/${videoId}1/400/300`,
        `https://picsum.photos/seed/${videoId}2/400/300`,
        `https://picsum.photos/seed/${videoId}3/400/300`,
        `https://picsum.photos/seed/${videoId}4/400/300`
      ];
      
      setThumbnailOptions(fakeThumbnails);
      setIsLoadingThumbnails(false);
    }, 1500);
  };

  const handleSelectThumbnail = (thumbnailUrl) => {
    setVideoThumbnail(thumbnailUrl);
    setThumbnailOptions([]);
  };

  const handleAddVideo = () => {
    if (videoUrl.trim() === "") {
      alert("يرجى إدخال رابط الفيديو");
      return;
    }
    
    if (videoName.trim() === "") {
      alert("يرجى إدخال اسم الفيديو");
      return;
    }
    
    if (videoThumbnail.trim() === "") {
      alert("يرجى إدخال رابط الصورة المصغرة");
      return;
    }
    
    const videoId = extractGoogleDriveId(videoUrl);
    
    const newVideo = {
      id: Date.now().toString(), // معرف فريد للفيديو
      name: videoName,
      description: videoDescription,
      thumbnail: videoThumbnail,
      aspectRatio: videoAspectRatio,
      url: videoId
    };
    
    // إضافة الفيديو الجديد للقائمة
    const updatedVideos = [...videos, newVideo];
    setVideos(updatedVideos);
    
    // حفظ الفيديوهات في localStorage
    localStorage.setItem('videos', JSON.stringify(updatedVideos));
    
    console.log("تمت إضافة الفيديو:", newVideo);
    alert(`تمت إضافة الفيديو: ${videoName}`);
    
    // إعادة تعيين الحقول
    setVideoName("");
    setVideoDescription("");
    setVideoThumbnail("");
    setVideoAspectRatio("square");
    setVideoUrl("");
    setThumbnailOptions([]);
  };

  // دالة تعديل الفيديو
  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setVideoName(video.name);
    setVideoDescription(video.description);
    setVideoThumbnail(video.thumbnail);
    setVideoAspectRatio(video.aspectRatio);
    setVideoUrl(video.url);
  };

  // دالة حفظ التعديلات
  const handleUpdateVideo = () => {
    if (!editingVideo) return;
    
    const videoId = extractGoogleDriveId(videoUrl);
    
    const updatedVideos = videos.map(video => {
      if (video.id === editingVideo.id) {
        return {
          ...video,
          name: videoName,
          description: videoDescription,
          thumbnail: videoThumbnail,
          aspectRatio: videoAspectRatio,
          url: videoId
        };
      }
      return video;
    });
    
    setVideos(updatedVideos);
    localStorage.setItem('videos', JSON.stringify(updatedVideos));
    
    alert(`تم تحديث الفيديو: ${videoName}`);
    
    // إعادة تعيين الحقول
    setEditingVideo(null);
    setVideoName("");
    setVideoDescription("");
    setVideoThumbnail("");
    setVideoAspectRatio("square");
    setVideoUrl("");
    setThumbnailOptions([]);
  };

  // دالة حذف الفيديو
  const handleDeleteVideo = (videoId) => {
    if (confirm("هل أنت متأكد من حذف هذا الفيديو؟")) {
      const updatedVideos = videos.filter(video => video.id !== videoId);
      setVideos(updatedVideos);
      localStorage.setItem('videos', JSON.stringify(updatedVideos));
    }
  };

  // دالة تصدير النسخة الاحتياطية
  const handleExportBackup = () => {
    const backup = JSON.stringify(videos, null, 2);
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `videos_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // دالة استيراد النسخة الاحتياطية
  const handleImportBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedVideos = JSON.parse(e.target.result);
        setVideos(importedVideos);
        localStorage.setItem('videos', JSON.stringify(importedVideos));
        alert("تم استيراد النسخة الاحتياطية بنجاح");
      } catch (error) {
        alert("حدث خطأ أثناء استيراد النسخة الاحتياطية");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  // دالة إعادة تعيين النموذج
  const handleCancelEdit = () => {
    setEditingVideo(null);
    setVideoName("");
    setVideoDescription("");
    setVideoThumbnail("");
    setVideoAspectRatio("square");
    setVideoUrl("");
    setThumbnailOptions([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-4xl p-6 shadow-xl">
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
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">
                {editingVideo ? "تعديل الفيديو" : "إضافة فيديو جديد"}
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="videoName">اسم الفيديو</Label>
                <Input
                  id="videoName"
                  type="text"
                  placeholder="أدخل اسم الفيديو"
                  value={videoName}
                  onChange={(e) => setVideoName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoDescription">وصف الفيديو</Label>
                <Textarea
                  id="videoDescription"
                  placeholder="أدخل وصف الفيديو"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoUrl">رابط الفيديو (جوجل درايف)</Label>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Input
                    id="videoUrl"
                    type="text"
                    placeholder="أدخل رابط الفيديو من جوجل درايف"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleExtractThumbnails}
                    className="whitespace-nowrap bg-green-600 hover:bg-green-700"
                    disabled={isLoadingThumbnails}
                  >
                    {isLoadingThumbnails ? "جاري التحميل..." : "استخراج الصور المصغرة"}
                  </Button>
                </div>
                {videoUrl && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    معرف الفيديو: {extractGoogleDriveId(videoUrl)}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoThumbnail">رابط الصورة المصغرة</Label>
                <Input
                  id="videoThumbnail"
                  type="text"
                  placeholder="أدخل رابط الصورة المصغرة"
                  value={videoThumbnail}
                  onChange={(e) => setVideoThumbnail(e.target.value)}
                />
                
                {thumbnailOptions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">اختر صورة مصغرة:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {thumbnailOptions.map((thumbnail, index) => (
                        <div 
                          key={index}
                          className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                            videoThumbnail === thumbnail ? 'border-blue-500' : 'border-transparent'
                          }`}
                          onClick={() => handleSelectThumbnail(thumbnail)}
                        >
                          <img 
                            src={thumbnail} 
                            alt={`صورة مصغرة ${index + 1}`} 
                            className="w-full h-24 object-cover"
                          />
                        </div>
                      ))}
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
                      onChange={() => setVideoAspectRatio("square")}
                    />
                    <Label htmlFor="square">مربع</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem 
                      value="portrait" 
                      id="portrait" 
                      checked={videoAspectRatio === "portrait"}
                      onChange={() => setVideoAspectRatio("portrait")}
                    />
                    <Label htmlFor="portrait">طولي</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex space-x-2 rtl:space-x-reverse">
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
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-4">
                  <Button 
                    onClick={() => setShowVideoList(!showVideoList)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {showVideoList ? "إخفاء قائمة الفيديوهات" : "عرض قائمة الفيديوهات"}
                  </Button>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button 
                      onClick={handleExportBackup}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      تصدير نسخة احتياطية
                    </Button>
                    <label className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                      استيراد نسخة احتياطية
                      <input 
                        type="file" 
                        accept=".json" 
                        className="hidden" 
                        onChange={handleImportBackup} 
                      />
                    </label>
                  </div>
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
                                alt={video.name} 
                                className="w-full md:w-32 h-32 object-cover" 
                              />
                              <div className="p-4 flex-1">
                                <h4 className="font-semibold">{video.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                  {video.description}
                                </p>
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}