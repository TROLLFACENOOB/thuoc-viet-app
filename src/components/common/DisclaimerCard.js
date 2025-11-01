  import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function DisclaimerCard() {
  return (
    <div className="relative bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-5 shadow-lg">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div>
          <p className="font-bold text-red-900 text-base mb-2">⚠️ LƯU Ý QUAN TRỌNG</p>
          <ul className="text-sm text-red-800 space-y-1.5">
            <li>• <strong>KHÔNG TỰ Ý DÙNG THUỐC</strong> dựa trên thông tin từ web</li>
            <li>• Thông tin chỉ <strong>THAM KHẢO</strong>, không thay thế bác sĩ</li>
            <li>• <strong>BẮT BUỘC</strong> hỏi bác sĩ/dược sĩ trước khi dùng thuốc</li>
            <li>• Gọi <strong>115</strong> nếu nghiêm trọng</li>
          </ul>
        </div>
      </div>
    </div>
  );
}