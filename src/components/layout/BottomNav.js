import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, History, MessageCircle, Search } from 'lucide-react';

export default function BottomNav() {
  const commonClass = "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all";
  const activeClass = "text-purple-600 bg-purple-50";
  const inactiveClass = "text-gray-600 hover:bg-gray-50";

  // Hàm để xác định class, đặc biệt cho trang Search/Result
  const getSearchClass = ({ isActive, isPending }) => {
    const isSearchResult = window.location.pathname === '/result';
    if (isActive || isSearchResult) {
      return `${commonClass} ${activeClass}`;
    }
    return `${commonClass} ${inactiveClass}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
      <div className="max-w-2xl mx-auto flex justify-around py-3">
        <NavLink to="/" className={({ isActive }) => `${commonClass} ${isActive ? activeClass : inactiveClass}`}>
          <Home className="w-6 h-6" />
          <span className="text-xs font-semibold">Trang chủ</span>
        </NavLink>
        
        <NavLink to="/search" className={getSearchClass}>
          <Search className="w-6 h-6" />
          <span className="text-xs font-semibold">Tìm kiếm</span>
        </NavLink>
        
        <NavLink to="/history" className={({ isActive }) => `${commonClass} ${isActive ? activeClass : inactiveClass}`}>
          <History className="w-6 h-6" />
          <span className="text-xs font-semibold">Lịch sử</span>
        </NavLink>
        
        <NavLink to="/chat" className={({ isActive }) => `${commonClass} ${isActive ? activeClass : inactiveClass}`}>
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs font-semibold">Chat</span>
        </NavLink>
      </div>
    </div>
  );
}