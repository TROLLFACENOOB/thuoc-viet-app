import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, X, Sparkles } from 'lucide-react';
import { useHistory } from '../context/HistoryContext'; // 👈 Để thêm vào lịch sử
import { searchMedicine } from '../api/medicineService'; // 👈 Logic API thật

// Dữ liệu local của trang
const commonSymptoms = [
  'Đau đầu', 'Sốt', 'Ho', 'Sổ mũi', 'Đau bụng',
  'Tiêu chảy', 'Buồn nôn', 'Mệt mỏi', 'Đau họng',
  'Khó thở', 'Chóng mặt', 'Mất ngủ', 'Đau lưng',
  'Đau khớp', 'Ngứa da', 'Phát ban'
];

export default function SearchPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const { addHistoryItem } = useHistory(); // 👈 Lấy hàm thêm lịch sử

  const getCurrentLocation = () => {
    // ... logic getCurrentLocation (giữ nguyên) ...
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`TP.HCM (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`);
        },
        () => {
          alert('Không thể lấy vị trí. Vui lòng bật Location Services.');
        }
      );
    }
  };

  const addSymptom = (symptom) => {
    // ... logic addSymptom (giữ nguyên) ...
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom) => {
    // ... logic removeSymptom (giữ nguyên) ...
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  // ⭐️ LOGIC MỚI: Xử lý tìm kiếm 
  const handleSearch = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Vui lòng chọn ít nhất một triệu chứng!');
      return;
    }

    // ... Cảnh báo (giữ nguyên) ...
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
      // 1. Gọi API (hiện đang là mock)
      const result = await searchMedicine(selectedSymptoms, location);

      // 2. Thêm vào lịch sử (qua Context)
      addHistoryItem(selectedSymptoms, result);

      // 3. Chuyển sang trang Result và mang theo dữ liệu
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
          onClick={() => navigate('/')} // 👈 Nút X giờ quay về trang chủ
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Tìm thuốc theo triệu chứng
        </h2>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
        {/* ... JSX chọn triệu chứng (giữ nguyên) ... */}
        <label className="block text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Bạn đang gặp triệu chứng gì?
        </label>
        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSymptoms.map((symptom) => (
              <span key={symptom} className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                {symptom}
                <button onClick={() => removeSymptom(symptom)} className="hover:bg-white/20 rounded-full p-1">
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
          {commonSymptoms.filter(s => !selectedSymptoms.includes(s)).map((symptom) => (
            <button key={symptom} onClick={() => addSymptom(symptom)} className="px-4 py-2 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-full text-sm font-medium transition-all">
              + {symptom}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
        {/* ... JSX chọn vị trí (giữ nguyên) ... */}
        <label className="block text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" />
          Vị trí của bạn
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Nhập địa chỉ hoặc tự động lấy"
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
          />
          <button onClick={getCurrentLocation} className="px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:shadow-lg transition-all active:scale-95">
            <MapPin className="w-5 h-5" />
          </button>
        </div>
      </div>

      <button
        onClick={handleSearch} // 👈 Thay đổi hàm xử lý
        disabled={isSearching || selectedSymptoms.length === 0}
        className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 active:scale-95"
      >
        {isSearching ? 'Đang tìm kiếm...' : 'Tìm thuốc phù hợp ✨'}
      </button>
    </div>
  );
}