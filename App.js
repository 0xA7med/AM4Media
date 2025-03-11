import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddVideo from './AddVideo'; // تأكد من المسار الصحيح لملف AddVideo.js
import Home from './Home'; // الصفحة الرئيسية

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addvideo" element={<AddVideo />} />
      </Routes>
    </Router>
  );
}

export default App;