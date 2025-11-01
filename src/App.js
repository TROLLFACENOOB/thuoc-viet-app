import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import các "trang"
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import ChatPage from './pages/ChatPage';

// Import các "layout" chung
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';

// Import "Provider" để quản lý state
import { HistoryProvider } from './context/HistoryContext';

export default function App() {
  return (
    // HistoryProvider bọc ngoài cùng để chia sẻ state lịch sử
    <HistoryProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
          <Header />

          <div className="max-w-2xl mx-auto p-4 pb-24">
            {/* Routes định nghĩa trang nào sẽ hiển thị với URL nào */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </div>

          <BottomNav />
        </div>
      </BrowserRouter>
    </HistoryProvider>
  );
}