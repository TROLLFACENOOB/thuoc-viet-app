// Dữ liệu mock từ file gốc của bạn
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

// Hàm "giả" tra cứu, trả về Promise sau 1.5 giây
export const searchMedicine = async (symptoms, location) => {
  console.log('API Call: Tra cứu với triệu chứng:', symptoms, 'tại', location);
  
  // TODO: Thay thế bằng `fetch` đến backend server của bạn
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = mockMedicines['default'];
      // Cập nhật chẩn đoán dựa trên triệu chứng (ví dụ)
      result.diagnosis = `Chẩn đoán sơ bộ cho: ${symptoms.join(', ')}`;
      resolve(result);
    }, 1500);
  });
};

// Hàm "giả" chat, trả về Promise sau 1 giây
export const sendChatMessage = async (message) => {
  console.log('API Call: Gửi tin nhắn chat:', message);
  
  // TODO: Thay thế bằng `fetch` đến backend server của bạn
  return new Promise((resolve) => {
    setTimeout(() => {
      const botResponse = 'Để được tư vấn chính xác, vui lòng sử dụng tính năng "Tìm thuốc" và chọn đầy đủ các triệu chứng bạn đang gặp phải.';
      resolve(botResponse);
    }, 1000);
  });
};