import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Pill, Leaf, Store, AlertCircle } from 'lucide-react';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu kết quả từ state của router
  const searchResult = location.state?.result;

  // Nếu không có dữ liệu (ví dụ: F5 trang), quay về trang tìm kiếm
  if (!searchResult) {
    navigate('/search');
    return null;
  }

  // Kiểm tra xem có phải xem lại từ lịch sử không
  const fromHistory = location.state?.fromHistory || false;

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center gap-3">
        <button
          // Nút X sẽ quay về trang search, hoặc trang history
          onClick={() => fromHistory ? navigate('/history') : navigate('/search')}
          className="p-2 hover:bg-gray-100 rounded-xl"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Kết quả tìm kiếm
        </h2>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-5 shadow-lg">
        {/* ... JSX Miễn trừ trách nhiệm (giữ nguyên) ... */}
        <p className="font-bold text-red-900 mb-3 text-lg flex items-center gap-2">
          <AlertCircle className="w-6 h-6" />
          ⚠️ MIỄN TRỪ TRÁCH NHIỆM
        </p>
        <ul className="text-sm text-red-800 space-y-2">
          <li>• Kết quả chỉ <strong>THAM KHẢO</strong></li>
          <li>• <strong>KHÔNG TỰ Ý DÙNG THUỐC</strong> không hỏi bác sĩ</li>
          <li className="font-bold">• Gọi 115 nếu nặng</li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
        <h3 className="font-bold text-gray-800 mb-3 text-lg">Chẩn đoán sơ bộ</h3>
        <p className="text-gray-700">{searchResult.diagnosis}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        {/* ... JSX Thuốc tây (giữ nguyên) ... */}
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-6 h-6 text-blue-600" />
          <h3 className="font-bold text-gray-800 text-lg">Thuốc tây</h3>
        </div>
        <div className="space-y-3">
          {searchResult.westernMeds.map((med, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <div className="flex justify-between mb-2">
                <p className="font-bold text-gray-800">{med.name}</p>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">{med.price}</span>
              </div>
              <p className="text-sm text-gray-600">{med.usage}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        {/* ... JSX Thuốc dân gian (giữ nguyên) ... */}
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-6 h-6 text-green-600" />
          <h3 className="font-bold text-gray-800 text-lg">Thuốc dân gian</h3>
        </div>
        <div className="space-y-3">
          _      {searchResult.traditionalMeds.map((med, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <p className="font-bold text-gray-800 mb-2">{med.name}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Thành phần:</strong> {med.ingredients}</p>
              <p className="text-sm text-gray-600"><strong>Tác dụng:</strong> {med.effect}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        {/* ... JSX Hiệu thuốc (giữ nguyên) ... */}
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-6 h-6 text-purple-600" />
          <h3 className="font-bold text-gray-800 text-lg">Hiệu thuốc gần bạn</h3>
        </div>
        <div className="space-y-3">
          {searchResult.pharmacies.map((pharmacy, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <p className="font-bold text-gray-800 mb-2">{pharmacy.name}</p>
              <p className="text-sm text-gray-600 mb-2">{pharmacy.address}</p>
              _      <div className="flex justify-between">
                <p className="text-sm text-purple-600 font-semibold">📍 {pharmacy.distance}</p>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">⭐ {pharmacy.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}