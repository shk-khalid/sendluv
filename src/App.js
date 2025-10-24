import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import BirthdayPage from './pages/BirthdayPage';

export default function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminPage />} />
        <Route path="/celebrate" element={<BirthdayPage />} />
      </Routes>
    </BrowserRouter>
  );
}
