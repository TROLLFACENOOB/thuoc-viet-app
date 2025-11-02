// ============================================
// DATABASE TRIỆU CHỨNG
// ============================================

export const SYMPTOMS_DB = {
  'đau đầu': {
    westernMeds: [
      { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống 1-2 viên khi đau, cách 4-6 giờ, tối đa 8 viên/ngày' },
      { name: 'Ibuprofen 400mg', price: '25,000đ', usage: 'Uống 1 viên sau ăn, cách 6-8 giờ, tối đa 3 viên/ngày' },
      { name: 'Aspirin 500mg', price: '20,000đ', usage: 'Uống 1-2 viên sau ăn, cách 4-6 giờ' }
    ],
    traditionalMeds: [
      { name: 'Trà gừng mật ong', ingredients: 'Gừng tươi 20g, mật ong 2 thìa', effect: 'Giảm đau đầu, ấm cơ thể' },
      { name: 'Bạc hà', ingredients: 'Lá bạc hà tươi 10g', effect: 'Giảm đau đầu, thư giãn' },
      { name: 'Massage huyệt thái dương', ingredients: 'Massage nhẹ', effect: 'Giảm đau tức thì' }
    ]
  },

  'sốt': {
    westernMeds: [
      { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống 1-2 viên khi sốt trên 38.5°C, cách 4-6 giờ' },
      { name: 'Efferalgan 500mg', price: '30,000đ', usage: 'Hòa 1 viên sủi vào nước, uống khi sốt' },
      { name: 'Hapacol 325mg', price: '18,000đ', usage: 'Uống 1-2 viên khi sốt, cách 4-6 giờ' }
    ],
    traditionalMeds: [
      { name: 'Lá tía tô sắc', ingredients: 'Lá tía tô tươi 50g, nước 500ml', effect: 'Giải cảm, giảm sốt nhẹ' },
      { name: 'Nước chanh muối', ingredients: 'Chanh tươi, muối, đường', effect: 'Bù nước, hạ nhiệt' },
      { name: 'Chườm mát', ingredients: 'Khăn mát, nước lạnh', effect: 'Hạ nhiệt nhanh' }
    ]
  },

  'ho': {
    westernMeds: [
      { name: 'Prospan', price: '45,000đ', usage: 'Uống 5ml x 3 lần/ngày sau ăn' },
      { name: 'Bisolvon', price: '35,000đ', usage: 'Uống 1 viên x 3 lần/ngày, giúp long đờm' },
      { name: 'Euviphyllin', price: '40,000đ', usage: 'Uống theo chỉ định bác sĩ' }
    ],
    traditionalMeds: [
      { name: 'Mật ong chanh', ingredients: 'Mật ong 2 thìa, chanh tươi', effect: 'Làm dịu họng, giảm ho' },
      { name: 'Nước cam tươi', ingredients: 'Cam tươi vắt', effect: 'Bổ sung vitamin C' },
      { name: 'Lá lốt hấp', ingredients: 'Lá lốt tươi 30g', effect: 'Tiêu đờm, giảm ho' }
    ]
  },

  'sổ mũi': {
    westernMeds: [
      { name: 'Decolgen', price: '20,000đ', usage: 'Uống 1 viên x 3 lần/ngày' },
      { name: 'Actifed', price: '25,000đ', usage: 'Uống 1 viên khi cần, cách 4-6 giờ' },
      { name: 'Rhinathiol', price: '50,000đ', usage: 'Uống 10ml x 3 lần/ngày' }
    ],
    traditionalMeds: [
      { name: 'Hành tím mật ong', ingredients: 'Hành tím 3 củ, mật ong', effect: 'Giảm nghẹt mũi' },
      { name: 'Trà gừng', ingredients: 'Gừng tươi 30g, đường phèn', effect: 'Ấm cơ thể, giảm sổ mũi' },
      { name: 'Hơi nước nóng', ingredients: 'Nước nóng + lá bạc hà', effect: 'Thông mũi' }
    ]
  },

  'đau bụng': {
    westernMeds: [
      { name: 'Buscopan', price: '35,000đ', usage: 'Uống 1-2 viên khi đau, giảm co thắt' },
      { name: 'Smecta', price: '25,000đ', usage: 'Pha 1 gói vào nước, uống 3 lần/ngày' },
      { name: 'De-Nol', price: '120,000đ', usage: 'Uống trước bữa ăn 30 phút' }
    ],
    traditionalMeds: [
      { name: 'Trà gừng ấm', ingredients: 'Gừng tươi 20g, đường', effect: 'Giảm đau bụng, ấm dạ dày' },
      { name: 'Nước chanh ấm', ingredients: 'Chanh tươi, mật ong', effect: 'Hỗ trợ tiêu hóa' }
    ]
  },

  'tiêu chảy': {
    westernMeds: [
      { name: 'Smecta', price: '25,000đ', usage: 'Pha 1 gói vào nước, uống 3 lần/ngày' },
      { name: 'Bioflora', price: '40,000đ', usage: 'Uống 1-2 gói/ngày, bổ sung men vi sinh' },
      { name: 'Oresol', price: '15,000đ', usage: 'Pha 1 gói vào 200ml nước' }
    ],
    traditionalMeds: [
      { name: 'Nước gạo rang', ingredients: 'Gạo rang vàng 50g', effect: 'Cầm tiêu chảy, bù nước' },
      { name: 'Lá ổi non', ingredients: 'Lá ổi non 20g sắc nước', effect: 'Chống tiêu chảy' }
    ]
  },

  'buồn nôn': {
    westernMeds: [
      { name: 'Motilium', price: '45,000đ', usage: 'Uống 1 viên trước ăn 15-30 phút' },
      { name: 'Vogalen', price: '35,000đ', usage: 'Uống khi buồn nôn, cách 6-8 giờ' },
      { name: 'Primperan', price: '30,000đ', usage: 'Uống theo chỉ định bác sĩ' }
    ],
    traditionalMeds: [
      { name: 'Trà gừng tươi', ingredients: 'Gừng tươi 15g, mật ong', effect: 'Giảm buồn nôn, ấm dạ dày' },
      { name: 'Chanh muối', ingredients: 'Chanh muối 1 trái', effect: 'Giảm nôn nhanh' },
      { name: 'Lá bạc hà ngửi', ingredients: 'Tinh dầu bạc hà', effect: 'Giảm buồn nôn tức thì' }
    ]
  },

  'mệt mỏi': {
    westernMeds: [
      { name: 'Vitamin B Complex', price: '50,000đ', usage: 'Uống 1 viên/ngày sau ăn' },
      { name: 'Berocca', price: '80,000đ', usage: 'Hòa 1 viên sủi vào nước, uống buổi sáng' },
      { name: 'Redoxon', price: '60,000đ', usage: 'Uống 1 viên/ngày, bổ sung vitamin C' }
    ],
    traditionalMeds: [
      { name: 'Nước mía tươi', ingredients: 'Mía tươi vắt', effect: 'Bổ sung năng lượng nhanh' },
      { name: 'Trà sâm', ingredients: 'Sâm tươi hoặc khô', effect: 'Bồi bổ sức khỏe' },
      { name: 'Nghỉ ngơi đầy đủ', ingredients: 'Ngủ 7-8 giờ/đêm', effect: 'Phục hồi sức lực' }
    ]
  },

  'đau họng': {
    westernMeds: [
      { name: 'Strepsils', price: '30,000đ', usage: 'Ngậm 1 viên mỗi 2-3 giờ, tối đa 8 viên/ngày' },
      { name: 'Betadine họng', price: '45,000đ', usage: 'Súc miệng 3-4 lần/ngày' },
      { name: 'Pharyndol', price: '35,000đ', usage: 'Ngậm 1 viên khi đau họng' }
    ],
    traditionalMeds: [
      { name: 'Nước muối ấm', ingredients: 'Muối 1 thìa, nước ấm 200ml', effect: 'Sát khuẩn, giảm đau họng' },
      { name: 'Mật ong chanh', ingredients: 'Mật ong 2 thìa, chanh', effect: 'Làm dịu họng' },
      { name: 'Trà cam thảo', ingredients: 'Cam thảo 10g sắc nước', effect: 'Giảm viêm họng' }
    ]
  },

  'khó thở': {
    westernMeds: [
      { name: 'Ventolin (Xịt)', price: '120,000đ', usage: 'CHỈ DÙNG THEO ĐƠN BÁC SĨ' },
      { name: 'Theophyllin', price: '50,000đ', usage: 'Uống theo đơn bác sĩ' }
    ],
    traditionalMeds: [
      { name: 'Hít thở sâu', ingredients: 'Hít thở đều đặn', effect: 'Giãn phế quản' },
      { name: '⚠️ GỌI 115 NGAY', ingredients: 'Đến bệnh viện ngay', effect: 'Khó thở nguy hiểm!' }
    ]
  },

  'chóng mặt': {
    westernMeds: [
      { name: 'Vastarel', price: '150,000đ', usage: 'Uống theo đơn bác sĩ' },
      { name: 'Ginkgo Biloba', price: '180,000đ', usage: 'Uống 1 viên x 2 lần/ngày' },
      { name: 'Betaserc', price: '120,000đ', usage: 'Uống theo chỉ định' }
    ],
    traditionalMeds: [
      { name: 'Nước gừng mật ong', ingredients: 'Gừng tươi, mật ong', effect: 'Lưu thông khí huyết' },
      { name: 'Ngồi yên, hít thở', ingredients: 'Nghỉ ngơi tại chỗ', effect: 'Ổn định huyết áp' }
    ]
  },

  'mất ngủ': {
    westernMeds: [
      { name: 'Seduxen 5mg', price: '50,000đ', usage: 'CHỈ DÙNG THEO ĐƠN BÁC SĨ' },
      { name: 'Melatonin', price: '200,000đ', usage: 'Uống 1 viên trước ngủ 30 phút' },
      { name: 'Nhất Ngủ', price: '80,000đ', usage: 'Uống 2 viên trước ngủ' }
    ],
    traditionalMeds: [
      { name: 'Trà hoa cúc', ingredients: 'Hoa cúc khô 10g', effect: 'Thư giãn, dễ ngủ' },
      { name: 'Sữa ấm mật ong', ingredients: 'Sữa tươi, mật ong', effect: 'Giúp ngủ ngon' },
      { name: 'Tắm nước ấm', ingredients: 'Nước ấm trước ngủ', effect: 'Thư giãn cơ thể' }
    ]
  },

  'đau lưng': {
    westernMeds: [
      { name: 'Ibuprofen 400mg', price: '25,000đ', usage: 'Uống 1 viên x 3 lần/ngày sau ăn' },
      { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống khi đau' },
      { name: 'Gel bôi Voltaren', price: '80,000đ', usage: 'Bôi vùng đau 2-3 lần/ngày' }
    ],
    traditionalMeds: [
      { name: 'Chườm nóng', ingredients: 'Túi chườm nóng/muối rang', effect: 'Giảm đau, giãn cơ' },
      { name: 'Dầu gió xoa bóp', ingredients: 'Dầu gió xanh', effect: 'Lưu thông máu' }
    ]
  },

  'đau khớp': {
    westernMeds: [
      { name: 'Glucosamine 1500mg', price: '350,000đ', usage: 'Uống 1 viên/ngày, bổ khớp dài hạn' },
      { name: 'Voltaren Gel', price: '80,000đ', usage: 'Bôi vùng đau 2-3 lần/ngày' },
      { name: 'Meloxicam 7.5mg', price: '50,000đ', usage: 'Uống 1 viên/ngày sau ăn' }
    ],
    traditionalMeds: [
      { name: 'Lá lốt đắp', ingredients: 'Lá lốt giã nát', effect: 'Giảm đau khớp' },
      { name: 'Ngâm chân nước ấm', ingredients: 'Nước ấm + muối', effect: 'Giảm đau, thư giãn khớp' }
    ]
  },

  'ngứa da': {
    westernMeds: [
      { name: 'Loratadine 10mg', price: '30,000đ', usage: 'Uống 1 viên/ngày, chống dị ứng' },
      { name: 'Kem Elocon', price: '120,000đ', usage: 'Bôi vùng ngứa 1-2 lần/ngày' },
      { name: 'Cetirizine 10mg', price: '25,000đ', usage: 'Uống 1 viên/ngày buổi tối' }
    ],
    traditionalMeds: [
      { name: 'Lá lốt giã đắp', ingredients: 'Lá lốt tươi giã nát', effect: 'Giảm ngứa, kháng khuẩn' },
      { name: 'Nước lá trầu không', ingredients: 'Lá trầu không sắc', effect: 'Sát khuẩn' }
    ]
  },

  'phát ban': {
    westernMeds: [
      { name: 'Cetirizine 10mg', price: '25,000đ', usage: 'Uống 1 viên/ngày' },
      { name: 'Kem Betamethasone', price: '50,000đ', usage: 'Bôi vùng phát ban 2 lần/ngày' },
      { name: 'Loratadine 10mg', price: '30,000đ', usage: 'Uống 1 viên/ngày' }
    ],
    traditionalMeds: [
      { name: 'Lá trầu không giã', ingredients: 'Lá trầu không tươi', effect: 'Kháng khuẩn, giảm sưng' },
      { name: 'Nước muối sinh lý', ingredients: 'Nước muối 0.9%', effect: 'Làm sạch vết ban' }
    ]
  }
};

// ============================================
// HÀM TÌM THUỐC TRONG DATABASE
// ============================================

export function findMedicinesBySymptoms(symptoms) {
  console.log('💾 Using database for:', symptoms);
  
  const allWesternMeds = [];
  const allTraditionalMeds = [];
  let diagnosis = '';

  symptoms.forEach(symptom => {
    const key = symptom.toLowerCase();
    
    Object.keys(SYMPTOMS_DB).forEach(dbKey => {
      if (key.includes(dbKey) || dbKey.includes(key)) {
        const data = SYMPTOMS_DB[dbKey];
        
        // Thêm thuốc tây (tránh trùng)
        data.westernMeds.forEach(med => {
          if (!allWesternMeds.find(m => m.name === med.name)) {
            allWesternMeds.push(med);
          }
        });
        
        // Thêm thuốc dân gian (tránh trùng)
        data.traditionalMeds.forEach(med => {
          if (!allTraditionalMeds.find(m => m.name === med.name)) {
            allTraditionalMeds.push(med);
          }
        });
        
        diagnosis += (diagnosis ? ', ' : '') + symptom;
      }
    });
  });

  // Fallback nếu không tìm thấy
  if (allWesternMeds.length === 0) {
    allWesternMeds.push(
      { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống theo chỉ dẫn dược sĩ' }
    );
  }
  
  if (allTraditionalMeds.length === 0) {
    allTraditionalMeds.push(
      { name: 'Nghỉ ngơi đầy đủ', ingredients: 'Uống nhiều nước', effect: 'Tăng sức đề kháng' }
    );
  }

  return {
    diagnosis: diagnosis || symptoms.join(', '),
    severity: 'medium',
    westernMeds: allWesternMeds.slice(0, 5),
    traditionalMeds: allTraditionalMeds.slice(0, 3),
    advice: 'Nghỉ ngơi đầy đủ, uống nhiều nước. Nếu không khỏi sau 2-3 ngày, đến bác sĩ.',
    warning: 'Không tự ý dùng kháng sinh. Hỏi dược sĩ trước khi dùng thuốc.'
  };
}