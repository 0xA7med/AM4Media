import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddVideo from './AddVideo'; // تأكد من المسار الصحيح لملف AddVideo.js

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/videos" element={<AddVideo />} />
        {/* مسارات أخرى */}
      </Routes>
    </Router>
  );
}

export default App;
