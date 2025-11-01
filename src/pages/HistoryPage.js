import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../context/HistoryContext';
import { Clock } from 'lucide-react';

export default function HistoryPage() {
  const { searchHistory } = useHistory(); // 👈 Lấy toàn bộ lịch sử
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
        Lịch sử tra cứu
      </h2>
      {searchHistory.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Chưa có lịch sử</p>
        </div>
      ) : (
        <div className="space-y-3">
          {searchHistory.map((item) => (
            <div 
              key={item.id} 
              // 👈 Click để xem lại kết quả
              onClick={() => navigate('/result', { state: { result: item.result, fromHistory: true } })}
              className="bg-white rounded-2xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-all"
            >
              <p className="font-bold text-gray-800 mb-1">{item.symptoms.join(', ')}</p>
              <p className="text-xs text-gray-500 mb-2">{item.date}</p>
              <p className="text-sm text-gray-600">{item.result.diagnosis}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}