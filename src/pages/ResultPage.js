import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Pill, Leaf, AlertCircle } from 'lucide-react';

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
          onClick={() => fromHistory ? navigate('/history') : navigate('/search')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Kết quả tìm kiếm
        </h2>
      </div>

      {/* Disclaimer */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-5 shadow-lg">
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

      {/* Chẩn đoán */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
        <h3 className="font-bold text-gray-800 mb-3 text-lg">📋 Chẩn đoán sơ bộ</h3>
        <p className="text-gray-700 text-base leading-relaxed">{searchResult.diagnosis}</p>
      </div>

      {/* Thuốc tây */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-6 h-6 text-blue-600" />
          <h3 className="font-bold text-gray-800 text-lg">Thuốc tây</h3>
        </div>
        <div className="space-y-3">
          {searchResult.westernMeds.map((med, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-gray-800 flex-1">{med.name}</p>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold ml-2 whitespace-nowrap">
                  {med.price}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>Cách dùng:</strong> {med.usage}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Thuốc dân gian */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-6 h-6 text-green-600" />
          <h3 className="font-bold text-gray-800 text-lg">Thuốc dân gian</h3>
        </div>
        <div className="space-y-3">
          {searchResult.traditionalMeds.map((med, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <p className="font-bold text-gray-800 mb-2">{med.name}</p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Thành phần:</strong> {med.ingredients}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Tác dụng:</strong> {med.effect}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Lời khuyên & Cảnh báo */}
      {searchResult.advice && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 shadow-lg">
          <p className="font-bold text-blue-900 mb-2 text-base">💡 Lời khuyên</p>
          <p className="text-sm text-blue-800 leading-relaxed">{searchResult.advice}</p>
        </div>
      )}

      {searchResult.warning && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5 shadow-lg">
          <p className="font-bold text-orange-900 mb-2 text-base">⚠️ Cảnh báo</p>
          <p className="text-sm text-orange-800 leading-relaxed whitespace-pre-line">{searchResult.warning}</p>
        </div>
      )}
    </div>
  );
}