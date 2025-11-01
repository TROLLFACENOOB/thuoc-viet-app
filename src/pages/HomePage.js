import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';
import { Sparkles, Shield, Heart, Search, Camera, Clock, ChevronRight } from 'lucide-react';

import DisclaimerCard from '../components/common/DisclaimerCard';
import CameraModal from '../components/camera/CameraModal';

export default function HomePage() {
  const navigate = useNavigate();
  const { searchHistory } = useHistory(); // 👈 Lấy lịch sử từ Context
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  return (
    <div className="space-y-8 pb-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8 text-white shadow-2xl">
        {/* ... JSX cho card "Tư vấn thuốc thông minh" (giữ nguyên) ... */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Thuốc Việt</h1>
              <p className="text-sm opacity-90">Sức khỏe trong tầm tay</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3 leading-tight">
            Tư vấn thuốc thông minh,<br />
            Chăm sóc sức khỏe toàn diện
          </h2>
          <p className="opacity-90 text-sm leading-relaxed mb-6">
            Tìm kiếm thông tin về thuốc, triệu chứng bệnh và hiệu thuốc gần bạn
          </p>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-medium">An toàn</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Heart className="w-4 h-4" />
              <span className="text-xs font-medium">Tin cậy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/search')} // 👈 Chuyển trang
          className="group relative bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden"
        >
          {/* ... JSX cho nút "Tìm thuốc" (giữ nguyên) ... */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-7 h-7 text-white" />
            </div>
            <p className="font-bold text-white text-lg mb-1">Tìm thuốc</p>
            <p className="text-white/80 text-xs">Nhập triệu chứng</p>
          </div>
        </button>

        <button
          onClick={() => setIsCameraOpen(true)} // 👈 Mở modal camera
          className="group relative bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden"
        >
          {/* ... JSX cho nút "Quét đơn" (giữ nguyên) ... */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <p className="font-bold text-white text-lg mb-1">Quét đơn</p>
            <p className="text-white/80 text-xs">Dùng camera</p>
          </div>
        </button>
      </div>

      {searchHistory.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-purple-500" />
              Tra cứu gần đây
            </h3>
            <button
              onClick={() => navigate('/history')} // 👈 Chuyển trang
              className="text-purple-600 text-sm font-semibold hover:text-purple-700"
            >
              Xem tất cả
            </button>
          </div>
          <div className="space-y-3">
            {searchHistory.slice(0, 2).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/result', { state: { result: item.result, fromHistory: true } })} // 👈 Chuyển đến trang kết quả với data
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all cursor-pointer"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.symptoms.join(', ')}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}

      <DisclaimerCard />

      {/* Modal camera được quản lý ở đây */}
      <CameraModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} />
    </div>
  );
}