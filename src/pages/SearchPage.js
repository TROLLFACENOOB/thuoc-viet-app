import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles } from 'lucide-react';
import { useHistory } from '../context/HistoryContext';
import { searchMedicine } from '../api/medicineService';

const commonSymptoms = [
  'Đau đầu', 'Sốt', 'Ho', 'Sổ mũi', 'Đau bụng',
  'Tiêu chảy', 'Buồn nôn', 'Mệt mỏi', 'Đau họng',
  'Khó thở', 'Chóng mặt', 'Mất ngủ', 'Đau lưng',
  'Đau khớp', 'Ngứa da', 'Phát ban'
];

export default function SearchPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const { addHistoryItem } = useHistory();

  const addSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const handleSearch = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Vui lòng chọn ít nhất một triệu chứng!');
      return;
    }

    const confirmSearch = window.confirm(
      '⚠️ LƯU Ý QUAN TRỌNG:\n\n' +
      '• Thông tin chỉ THAM KHẢO, KHÔNG THAY THẾ bác sĩ\n' +
      '• KHÔNG TỰ Ý DÙNG THUỐC mà không hỏi bác sĩ/dược sĩ\n' +
      '• Web này KHÔNG CHỊU TRÁCH NHIỆM về việc tự ý dùng thuốc\n' +
      '• Nếu bệnh nặng, hãy đến bệnh viện ngay\n\n' +
      'Bạn đã hiểu và đồng ý?'
    );
    if (!confirmSearch) return;

    setIsSearching(true);

    try {
      const result = await searchMedicine(selectedSymptoms);
      addHistoryItem(selectedSymptoms, result);
      navigate('/result', { state: { result: result } });
    } catch (error) {
      alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-white/60 rounded-xl transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Tìm thuốc theo triệu chứng
        </h2>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-purple-100">
        <label className="block text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Bạn đang gặp triệu chứng gì?
        </label>
        
        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSymptoms.map((symptom) => (
              <span
                key={symptom}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md"
              >
                {symptom}
                <button onClick={() => removeSymptom(symptom)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
          {commonSymptoms.filter(s => !selectedSymptoms.includes(s)).map((symptom) => (
            <button
              key={symptom}
              onClick={() => addSymptom(symptom)}
              className="px-4 py-2 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-full text-sm font-medium transition-all hover:shadow-md"
            >
              + {symptom}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSearch}
        disabled={isSearching || selectedSymptoms.length === 0}
        className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        <span className="flex items-center justify-center gap-2">
          {isSearching ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Đang tìm kiếm...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Tìm thuốc phù hợp
            </>
          )}
        </span>
      </button>
    </div>
  );
}