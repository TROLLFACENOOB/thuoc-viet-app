import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, History, MessageCircle, Search } from 'lucide-react';

export default function BottomNav() {
  const getNavClass = (isActive) => {
    return `flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl transition-all duration-300 ${
      isActive 
        ? 'text-purple-600 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105' 
        : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
    }`;
  };

  // Hàm riêng cho Search/Result
  const getSearchClass = () => {
    const isSearchResult = window.location.pathname === '/result';
    const isActive = window.location.pathname === '/search' || isSearchResult;
    return getNavClass(isActive);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glass morphism background */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-purple-100 shadow-2xl">
        <div className="max-w-2xl mx-auto flex justify-around py-2">
          
          <NavLink to="/" className={({ isActive }) => getNavClass(isActive)}>
            <Home className="w-6 h-6" />
            <span className="text-xs font-bold">Trang chủ</span>
          </NavLink>
          
          <NavLink to="/search" className={getSearchClass}>
            <Search className="w-6 h-6" />
            <span className="text-xs font-bold">Tìm kiếm</span>
          </NavLink>
          
          <NavLink to="/history" className={({ isActive }) => getNavClass(isActive)}>
            <History className="w-6 h-6" />
            <span className="text-xs font-bold">Lịch sử</span>
          </NavLink>
          
          <NavLink to="/chat" className={({ isActive }) => getNavClass(isActive)}>
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-bold">Chat</span>
          </NavLink>
          
        </div>
      </div>
      
      {/* Gradient decoration */}
      <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300"></div>
    </div>
  );
}