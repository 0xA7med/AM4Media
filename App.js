import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AddVideo from './AddVideo'; // تأكد من المسار الصحيح لملف AddVideo.js

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/admin/videos" element={<AddVideo />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
