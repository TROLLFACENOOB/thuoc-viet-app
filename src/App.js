import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import các trang
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import ChatPage from './pages/ChatPage';

// Import layout
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';

// Import Context
import { HistoryProvider } from './context/HistoryContext';

export default function App() {
  return (
    <HistoryProvider>
      <BrowserRouter>
        {/* Container chính với min-height */}
        <div className="min-h-screen flex flex-col">
          <Header />

          {/* Main content area với padding phù hợp */}
          <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-28">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </main>

          <BottomNav />
        </div>
      </BrowserRouter>
    </HistoryProvider>
  );
}