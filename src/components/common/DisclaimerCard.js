import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function DisclaimerCard() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border-2 border-red-200 rounded-3xl p-6 shadow-xl">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
      
      <div className="relative flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-md">
            <AlertCircle className="w-7 h-7 text-red-600" />
          </div>
        </div>
        <div>
          <p className="font-black text-red-900 text-lg mb-3 flex items-center gap-2">
            ⚠️ LƯU Ý QUAN TRỌNG
          </p>
          <ul className="text-sm text-red-800 space-y-2 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold mt-0.5">•</span>
              <span><strong className="font-black">KHÔNG TỰ Ý DÙNG THUỐC</strong> dựa trên thông tin từ web</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold mt-0.5">•</span>
              <span>Thông tin chỉ <strong className="font-black">THAM KHẢO</strong>, không thay thế bác sĩ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold mt-0.5">•</span>
              <span><strong className="font-black">BẮT BUỘC</strong> hỏi bác sĩ/dược sĩ trước khi dùng thuốc</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold mt-0.5">•</span>
              <span>Gọi <strong className="font-black text-red-700">115</strong> nếu nghiêm trọng</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}