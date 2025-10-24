import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import BirthdayPage from './pages/BirthdayPage';

export default function App() {
  // Get basename from package.json homepage for GitHub Pages deployment
  const basename = process.env.NODE_ENV === 'production' ? '/bdaycakee' : '';
  
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<AdminPage />} />
        <Route path="/celebrate" element={<BirthdayPage />} />
      </Routes>
    </BrowserRouter>
  );
}
