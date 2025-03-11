// server.js
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(express.json());
app.use(cors()); // للسماح بالاتصال من المتصفح

// تحديث ملف videos.js
app.post('/api/updateVideos', (req, res) => {
  const videos = req.body;
  const filePath = path.join(__dirname, 'src', 'videos.js');

  const fileContent = `// تم التحديث تلقائياً في ${new Date().toLocaleString('ar-EG')}\nexport const videos = ${JSON.stringify(videos, null, 2)};`;

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error('حدث خطأ أثناء تحديث الملف:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
    console.log('تم تحديث ملف videos.js بنجاح');
    res.json({ success: true });
  });
});

// تشغيل السيرفر على البورت 3001
app.listen(3001, () => console.log('🚀 السيرفر يعمل على http://localhost:3001'));