import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Search, X, Clock, Pill, Leaf, Store, AlertCircle, ChevronRight, Menu, Home, History, MessageCircle, User } from 'lucide-react';

// Component chính
export default function ThuocVietApp() {
  // State quản lý các tab/màn hình
  const [currentScreen, setCurrentScreen] = useState('home'); // home, search, history, chat, profile
  
  // State cho tính năng tìm kiếm
  const [symptoms, setSymptoms] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [location, setLocation] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // State cho camera
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // State cho lịch sử
  const [searchHistory, setSearchHistory] = useState([]);
  
  // State cho chat
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Xin chào! Tôi là trợ lý ảo Thuốc Việt. Bạn có thắc mắc gì về thuốc không?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Danh sách triệu chứng gợi ý
  const commonSymptoms = [
    'Đau đầu', 'Sốt', 'Ho', 'Sổ mũi', 'Đau bụng', 
    'Tiêu chảy', 'Buồn nôn', 'Mệt mỏi', 'Đau họng',
    'Khó thở', 'Chóng mặt', 'Mất ngủ', 'Đau lưng',
    'Đau khớp', 'Ngứa da', 'Phát ban'
  ];

  // Mock data - thuốc tây
  const mockMedicines = {
    'đau đầu sốt': {
      diagnosis: 'Cảm cúm, nhiễm virus thông thường',
      severity: 'medium',
      westernMeds: [
        { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống 1-2 viên khi đau, tối đa 8 viên/ngày' },
        { name: 'Ibuprofen 400mg', price: '25,000đ', usage: 'Uống 1 viên/lần, cách 6-8 tiếng' },
        { name: 'Aspirin 500mg', price: '20,000đ', usage: 'Uống sau ăn, 1-2 viên/lần' }
      ],
      traditionalMeds: [
        { name: 'Trà gừng mật ong', ingredients: 'Gừng tươi, mật ong, chanh', effect: 'Giảm đau đầu, ấm cơ thể' },
        { name: 'Lá tía tô sắc', ingredients: 'Lá tía tô tươi', effect: 'Giải cảm, giảm sốt nhẹ' }
      ],
      pharmacies: [
        { name: 'Nhà thuốc An Khang', address: '123 Nguyễn Văn Linh, Q.7', distance: '0.5km', rating: 4.5 },
        { name: 'Phòng khám Đa khoa Medic', address: '456 Lê Văn Việt, Q.9', distance: '1.2km', rating: 4.8 }
      ],
      advice: 'Nghỉ ngơi đầy đủ, uống nhiều nước. Nếu sốt trên 39°C hoặc kéo dài quá 3 ngày, nên đến bác sĩ.',
      warning: 'Không tự ý dùng kháng sinh khi chưa có chỉ định của bác sĩ.'
    }
  };

  // Hàm lấy vị trí hiện tại
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          alert('Không thể lấy vị trí. Vui lòng nhập thủ công.');
        }
      );
    }
  };

  // Hàm thêm triệu chứng
  const addSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // Hàm xóa triệu chứng
  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  // Hàm tìm kiếm thuốc
  const searchMedicine = () => {
    if (selectedSymptoms.length === 0) {
      alert('Vui lòng chọn ít nhất một triệu chứng!');
      return;
    }

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const symptomKey = selectedSymptoms.map(s => s.toLowerCase()).join(' ');
      const result = mockMedicines['đau đầu sốt']; // Mock data
      
      setSearchResult(result);
      
      // Lưu vào lịch sử
      const newHistory = {
        id: Date.now(),
        date: new Date().toLocaleString('vi-VN'),
        symptoms: [...selectedSymptoms],
        result: result
      };
      setSearchHistory([newHistory, ...searchHistory]);
      
      setIsSearching(false);
      setCurrentScreen('result');
    }, 1500);
  };

  // Hàm mở camera
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (error) {
      alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  // Hàm chụp ảnh
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      
      // Dừng camera
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraOpen(false);
      
      // Mock OCR result
      alert('Đã quét đơn thuốc! Phát hiện: Paracetamol 500mg, Vitamin C 1000mg');
    }
  };

  // Hàm đóng camera
  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  // Hàm gửi tin nhắn chat
  const sendChatMessage = () => {
    if (chatInput.trim() === '') return;
    
    // Thêm tin nhắn người dùng
    const newMessages = [...chatMessages, { type: 'user', text: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: 'Cảm ơn bạn đã hỏi! Để tư vấn chính xác, bạn vui lòng sử dụng tính năng "Tìm thuốc" để nhập đầy đủ triệu chứng nhé.'
      };
      setChatMessages([...newMessages, botResponse]);
    }, 1000);
  };

  // Render màn hình chính (Home)
  const renderHomeScreen = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Chào mừng đến Thuốc Việt! 🏥</h2>
        <p className="opacity-90">Tư vấn thuốc thông minh, tìm hiệu thuốc gần bạn</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setCurrentScreen('search')}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all active:scale-95 border-2 border-emerald-100"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3 mx-auto">
            <Search className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="font-semibold text-gray-800">Tìm thuốc</p>
          <p className="text-xs text-gray-500 mt-1">Nhập triệu chứng</p>
        </button>

        <button
          onClick={openCamera}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all active:scale-95 border-2 border-blue-100"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 mx-auto">
            <Camera className="w-6 h-6 text-blue-600" />
          </div>
          <p className="font-semibold text-gray-800">Quét đơn</p>
          <p className="text-xs text-gray-500 mt-1">Dùng camera</p>
        </button>
      </div>

      {/* Recent History */}
      {searchHistory.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              Tra cứu gần đây
            </h3>
            <button 
              onClick={() => setCurrentScreen('history')}
              className="text-emerald-600 text-sm font-medium"
            >
              Xem tất cả
            </button>
          </div>
          <div className="space-y-2">
            {searchHistory.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.symptoms.join(', ')}
                  </p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">Lưu ý quan trọng</p>
            <p className="text-xs text-amber-800 mt-1">
              Thông tin chỉ mang tính tham khảo. Hãy tham khảo ý kiến bác sĩ trước khi dùng thuốc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render màn hình tìm kiếm
  const renderSearchScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <button 
          onClick={() => setCurrentScreen('home')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Tìm thuốc theo triệu chứng</h2>
      </div>

      {/* Chọn triệu chứng */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Bạn đang gặp triệu chứng gì?
        </label>
        
        {/* Selected symptoms */}
        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSymptoms.map((symptom) => (
              <span
                key={symptom}
                className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {symptom}
                <button onClick={() => removeSymptom(symptom)} className="hover:bg-emerald-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2">
          {commonSymptoms.filter(s => !selectedSymptoms.includes(s)).map((symptom) => (
            <button
              key={symptom}
              onClick={() => addSymptom(symptom)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-full text-sm transition-colors"
            >
              + {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Vị trí */}
      <div className="bg-white rounded-xl p-4 shadow-md">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Vị trí của bạn
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Nhập địa chỉ hoặc tọa độ"
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
          />
          <button
            onClick={getCurrentLocation}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <MapPin className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Nút tìm kiếm */}
      <button
        onClick={searchMedicine}
        disabled={isSearching || selectedSymptoms.length === 0}
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        {isSearching ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
            Đang tìm kiếm...
          </span>
        ) : (
          'Tìm thuốc phù hợp'
        )}
      </button>
    </div>
  );

  // Render kết quả tìm kiếm
  const renderResultScreen = () => {
    if (!searchResult) return null;

    const severityColors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => setCurrentScreen('search')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Kết quả tìm kiếm</h2>
        </div>

        {/* Chẩn đoán */}
        <div className="bg-white rounded-xl p-5 shadow-md border-2 border-emerald-100">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Chẩn đoán sơ bộ</h3>
              <p className="text-gray-700">{searchResult.diagnosis}</p>
            </div>
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${severityColors[searchResult.severity]}`}>
            {searchResult.severity === 'low' && 'Mức độ nhẹ'}
            {searchResult.severity === 'medium' && 'Mức độ trung bình'}
            {searchResult.severity === 'high' && 'Cần gặp bác sĩ ngay'}
          </div>
        </div>

        {/* Thuốc tây */}
        <div className="bg-white rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-gray-800">Thuốc tây đề xuất</h3>
          </div>
          <div className="space-y-3">
            {searchResult.westernMeds.map((med, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-gray-800">{med.name}</p>
                  <span className="text-emerald-600 font-bold">{med.price}</span>
                </div>
                <p className="text-sm text-gray-600">{med.usage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Thuốc dân gian */}
        <div className="bg-white rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-gray-800">Phương thuốc dân gian</h3>
          </div>
          <div className="space-y-3">
            {searchResult.traditionalMeds.map((med, index) => (
              <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="font-semibold text-gray-800 mb-2">{med.name}</p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Thành phần:</span> {med.ingredients}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Tác dụng:</span> {med.effect}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hiệu thuốc gần đây */}
        <div className="bg-white rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-gray-800">Hiệu thuốc gần bạn</h3>
          </div>
          <div className="space-y-3">
            {searchResult.pharmacies.map((pharmacy, index) => (
              <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-gray-800">{pharmacy.name}</p>
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    ⭐ {pharmacy.rating}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{pharmacy.address}</p>
                <p className="text-sm text-purple-600 font-medium">📍 {pharmacy.distance}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lời khuyên */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-5">
          <p className="font-semibold text-amber-900 mb-2">💡 Lời khuyên</p>
          <p className="text-sm text-amber-800 mb-3">{searchResult.advice}</p>
          {searchResult.warning && (
            <>
              <p className="font-semibold text-red-700 mb-2">⚠️ Cảnh báo</p>
              <p className="text-sm text-red-700">{searchResult.warning}</p>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render lịch sử
  const renderHistoryScreen = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Lịch sử tra cứu</h2>
      
      {searchHistory.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Chưa có lịch sử tra cứu</p>
        </div>
      ) : (
        <div className="space-y-3">
          {searchHistory.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 mb-1">
                    {item.symptoms.join(', ')}
                  </p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">{item.result.diagnosis}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render chat
  const renderChatScreen = () => (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Tư vấn trực tuyến</h2>
      
      <div className="flex-1 bg-white rounded-xl shadow-md p-4 mb-4 overflow-y-auto space-y-3">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
              msg.type === 'user' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
          placeholder="Nhập câu hỏi của bạn..."
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
        />
        <button
          onClick={sendChatMessage}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Pill className="w-5 h-5 text-emerald-600" />
            </div>
            Thuốc Việt
          </h1>
          <p className="text-sm opacity-90 mt-1">Tư vấn thuốc thông minh</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {currentScreen === 'home' && renderHomeScreen()}
        {currentScreen === 'search' && renderSearchScreen()}
        {currentScreen === 'result' && renderResultScreen()}
        {currentScreen === 'history' && renderHistoryScreen()}
        {currentScreen === 'chat' && renderChatScreen()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-2xl mx-auto flex justify-around py-3">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === 'home' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Trang chủ</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('search')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === 'search' || currentScreen === 'result' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600'
            }`}
          >
            <Search className="w-6 h-6" />
            <span className="text-xs font-medium">Tìm kiếm</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('history')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === 'history' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600'
            }`}
          >
            <History className="w-6 h-6" />
            <span className="text-xs font-medium">Lịch sử</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('chat')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === 'chat' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-medium">Chat</span>
          </button>
        </div>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 text-white">
            <h3 className="text-lg font-semibold">Quét đơn thuốc</h3>
            <button onClick={closeCamera} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="max-w-full max-h-full"
            />
          </div>
          
          <div className="p-6 flex justify-center">
            <button
              onClick={capturePhoto}
              className="w-16 h-16 bg-white rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
            >
              <div className="w-14 h-14 border-4 border-gray-300 rounded-full" />
            </button>
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && !isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 text-white">
            <h3 className="text-lg font-semibold">Ảnh đã chụp</h3>
            <button onClick={() => setCapturedImage(null)} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4">
            <img src={capturedImage} alt="Captured" className="max-w-full max-h-full rounded-lg" />
          </div>
          
          <div className="p-6">
            <button
              onClick={() => {
                setCapturedImage(null);
                alert('Tính năng OCR sẽ được phát triển trong phiên bản tiếp theo!');
              }}
              className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600"
            >
              Xử lý ảnh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}