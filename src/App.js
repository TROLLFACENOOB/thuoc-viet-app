import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Search, X, Clock, Pill, Leaf, Store, AlertCircle, ChevronRight, Home, History, MessageCircle, Sparkles, Heart, Shield } from 'lucide-react';

export default function ThuocVietApp() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [location, setLocation] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Xin chào! Tôi là trợ lý ảo Thuốc Việt. Bạn có thắc mắc gì về thuốc không?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const commonSymptoms = [
    'Đau đầu', 'Sốt', 'Ho', 'Sổ mũi', 'Đau bụng', 
    'Tiêu chảy', 'Buồn nôn', 'Mệt mỏi', 'Đau họng',
    'Khó thở', 'Chóng mặt', 'Mất ngủ', 'Đau lưng',
    'Đau khớp', 'Ngứa da', 'Phát ban'
  ];

  const mockMedicines = {
    'default': {
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

  const getCurrentLocation = () => {
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
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const searchMedicine = () => {
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
    
    if (!confirmSearch) {
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      const result = mockMedicines['default'];
      setSearchResult(result);
      
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

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraOpen(true);
      }
    } catch (error) {
      alert('Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera và thử lại.');
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsCameraOpen(false);
      
      alert('Đã quét đơn thuốc!\n\nPhát hiện:\n• Paracetamol 500mg\n• Vitamin C 1000mg\n\nLưu ý: Chức năng OCR đang phát triển.');
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const sendChatMessage = () => {
    if (chatInput.trim() === '') return;
    
    const newMessages = [...chatMessages, { type: 'user', text: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: 'Để được tư vấn chính xác, vui lòng sử dụng tính năng "Tìm thuốc" và chọn đầy đủ các triệu chứng bạn đang gặp phải.'
      };
      setChatMessages([...newMessages, botResponse]);
    }, 1000);
  };

  const renderHomeScreen = () => (
    <div className="space-y-8 pb-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8 text-white shadow-2xl">
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
            Tư vấn thuốc thông minh,<br/>
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
          onClick={() => setCurrentScreen('search')}
          className="group relative bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden"
        >
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
          onClick={openCamera}
          className="group relative bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-95 overflow-hidden"
        >
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
              onClick={() => setCurrentScreen('history')}
              className="text-purple-600 text-sm font-semibold hover:text-purple-700"
            >
              Xem tất cả
            </button>
          </div>
          <div className="space-y-3">
            {searchHistory.slice(0, 2).map((item) => (
              <div key={item.id} className="group flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all">
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
    </div>
  );

  const renderSearchScreen = () => (
    <div className="space-y-6 pb-6">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setCurrentScreen('home')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Tìm thuốc theo triệu chứng
        </h2>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
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
                <button onClick={() => removeSymptom(symptom)} className="hover:bg-white/20 rounded-full p-1">
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
              className="px-4 py-2 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-full text-sm font-medium transition-all"
            >
              + {symptom}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
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
          <button
            onClick={getCurrentLocation}
            className="px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:shadow-lg transition-all active:scale-95"
          >
            <MapPin className="w-5 h-5" />
          </button>
        </div>
      </div>

      <button
        onClick={searchMedicine}
        disabled={isSearching || selectedSymptoms.length === 0}
        className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 active:scale-95"
      >
        {isSearching ? 'Đang tìm kiếm...' : 'Tìm thuốc phù hợp ✨'}
      </button>
    </div>
  );

  const renderResultScreen = () => {
    if (!searchResult) return null;

    return (
      <div className="space-y-6 pb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentScreen('search')}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Kết quả tìm kiếm
          </h2>
        </div>

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

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
          <h3 className="font-bold text-gray-800 mb-3 text-lg">Chẩn đoán sơ bộ</h3>
          <p className="text-gray-700">{searchResult.diagnosis}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
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
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-gray-800 text-lg">Thuốc dân gian</h3>
          </div>
          <div className="space-y-3">
            {searchResult.traditionalMeds.map((med, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <p className="font-bold text-gray-800 mb-2">{med.name}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Thành phần:</strong> {med.ingredients}</p>
                <p className="text-sm text-gray-600"><strong>Tác dụng:</strong> {med.effect}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-gray-800 text-lg">Hiệu thuốc gần bạn</h3>
          </div>
          <div className="space-y-3">
            {searchResult.pharmacies.map((pharmacy, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <p className="font-bold text-gray-800 mb-2">{pharmacy.name}</p>
                <p className="text-sm text-gray-600 mb-2">{pharmacy.address}</p>
                <div className="flex justify-between">
                  <p className="text-sm text-purple-600 font-semibold">📍 {pharmacy.distance}</p>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">⭐ {pharmacy.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderHistoryScreen = () => (
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
            <div key={item.id} className="bg-white rounded-2xl p-5 shadow-lg">
              <p className="font-bold text-gray-800 mb-1">{item.symptoms.join(', ')}</p>
              <p className="text-xs text-gray-500 mb-2">{item.date}</p>
              <p className="text-sm text-gray-600">{item.result.diagnosis}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderChatScreen = () => (
    <div className="flex flex-col h-[calc(100vh-200px)] pb-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
        Tư vấn trực tuyến
      </h2>
      
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 mb-4 overflow-y-auto space-y-3">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              msg.type === 'user' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-800'
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
          placeholder="Nhập câu hỏi..."
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
        />
        <button
          onClick={sendChatMessage}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all active:scale-95"
        >
          Gửi
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white p-4 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8" />
            Thuốc Việt
          </h1>
          <p className="text-sm opacity-90 mt-1">Sức khỏe trong tầm tay</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 pb-24">
        {currentScreen === 'home' && renderHomeScreen()}
        {currentScreen === 'search' && renderSearchScreen()}
        {currentScreen === 'result' && renderResultScreen()}
        {currentScreen === 'history' && renderHistoryScreen()}
        {currentScreen === 'chat' && renderChatScreen()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
        <div className="max-w-2xl mx-auto flex justify-around py-3">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentScreen === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-semibold">Trang chủ</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('search')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentScreen === 'search' || currentScreen === 'result' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Search className="w-6 h-6" />
            <span className="text-xs font-semibold">Tìm kiếm</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('history')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentScreen === 'history' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <History className="w-6 h-6" />
            <span className="text-xs font-semibold">Lịch sử</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('chat')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              currentScreen === 'chat' ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-semibold">Chat</span>
          </button>
        </div>
      </div>

      {isCameraOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 text-white">
            <h3 className="text-lg font-semibold">Quét đơn thuốc</h3>
            <button onClick={closeCamera} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-full" />
          </div>
          
          <div className="p-6 flex justify-center">
            <button
              onClick={capturePhoto}
              className="w-20 h-20 bg-white rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
            />
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {capturedImage && !isCameraOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
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
              onClick={() => setCapturedImage(null)}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold hover:shadow-2xl transition-all"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}