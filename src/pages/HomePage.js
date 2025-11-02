import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';
import { Sparkles, Shield, Heart, Search, MessageCircle, Clock, ChevronRight } from 'lucide-react';

import DisclaimerCard from '../components/common/DisclaimerCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { searchHistory } = useHistory();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Card - Gradient với decorative circles */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8 text-white shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-9 h-9 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Thuốc Việt</h1>
              <p className="text-sm opacity-95 font-medium">Sức khỏe trong tầm tay</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-3 leading-tight">
            Tư vấn thuốc thông minh,<br />
            Chăm sóc sức khỏe toàn diện
          </h2>
          <p className="opacity-95 text-sm leading-relaxed mb-6">
            Tìm kiếm thông tin về thuốc, triệu chứng bệnh và hiệu thuốc gần bạn
          </p>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-white/25 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-md">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold">An toàn</span>
            </div>
            <div className="flex items-center gap-2 bg-white/25 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-md">
              <Heart className="w-4 h-4" />
              <span className="text-xs font-bold">Tin cậy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-5">
        {/* Nút Tìm thuốc */}
        <button
          onClick={() => navigate('/search')}
          className="group relative bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="w-16 h-16 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Search className="w-8 h-8 text-white" />
            </div>
            <p className="font-black text-white text-xl mb-1">Tìm thuốc</p>
            <p className="text-white/90 text-sm font-medium">Nhập triệu chứng</p>
          </div>
        </button>

        {/* Nút Chat AI - THAY THẾ CAMERA */}
        <button
          onClick={() => navigate('/chat')}
          className="group relative bg-gradient-to-br from-purple-500 to-pink-400 rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="w-16 h-16 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <p className="font-black text-white text-xl mb-1">Chat AI</p>
            <p className="text-white/90 text-sm font-medium">Tư vấn trực tuyến</p>
          </div>
        </button>
      </div>

      {/* Recent History */}
      {searchHistory.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-purple-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-gray-800 flex items-center gap-2 text-xl">
              <Clock className="w-6 h-6 text-purple-500" />
              Tra cứu gần đây
            </h3>
            <button 
              onClick={() => navigate('/history')}
              className="text-purple-600 text-sm font-bold hover:text-purple-700 px-4 py-2 rounded-full hover:bg-purple-50 transition-all"
            >
              Xem tất cả →
            </button>
          </div>
          <div className="space-y-3">
            {searchHistory.slice(0, 2).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/result', { state: { result: item.result, fromHistory: true } })}
                className="group flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:shadow-lg transition-all cursor-pointer border border-transparent hover:border-purple-200"
              >
                <div>
                  <p className="text-sm font-bold text-gray-800">{item.symptoms.join(', ')}</p>
                  <p className="text-xs text-gray-500 mt-1.5 font-medium">{item.date}</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer Card */}
      <DisclaimerCard />
    </div>
  );
}