import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SelectedPage from './pages/SelectedPage';


const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/selected" element={<SelectedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;