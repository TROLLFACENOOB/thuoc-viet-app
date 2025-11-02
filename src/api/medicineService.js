// ============================================
// MEDICINE SERVICE - PHIÊN BẢN ĐÃ SỬA
// ============================================

const API_CONFIG = {
  huggingface: {
    token: '' // ← Thay token của bạn vào đây
  }
};

// ============================================
// DATABASE TRIỆU CHỨNG (LUÔN HOẠT ĐỘNG)
// ============================================

const SYMPTOMS_DB = {
  // ===== 1. ĐAU ĐẦU =====
  'đau đầu': {
    westernMeds: [
      { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống 1-2 viên khi đau, cách 4-6 giờ, tối đa 8 viên/ngày' },
      { name: 'Ibuprofen 400mg', price: '25,000đ', usage: 'Uống 1 viên sau ăn, cách 6-8 giờ, tối đa 3 viên/ngày' },
      { name: 'Aspirin 500mg', price: '20,000đ', usage: 'Uống 1-2 viên sau ăn, cách 4-6 giờ' }
    ],
    traditionalMeds: [
      { name: 'Trà gừng mật ong', ingredients: 'Gừng tươi 20g, mật ong 2 thìa', effect: 'Giảm đau đầu, ấm cơ thể, lưu thông khí huyết' },
      { name: 'Bạc hà', ingredients: 'Lá bạc hà tươi 10g', effect: 'Giảm đau đầu, thư giãn tinh thần' },
      { name: 'Massage huyệt thái dương', ingredients: 'Dùng tay massage nhẹ', effect: 'Giảm đau đầu tức thì' }
    ]
  },

  // ===== 2. SỐT =====
  'sốt': {
    westernMeds: [
      { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống 1-2 viên khi sốt trên 38.5°C, cách 4-6 giờ' },
      { name: 'Efferalgan 500mg', price: '30,000đ', usage: 'Hòa 1 viên sủi vào nước, uống khi sốt' },
      { name: 'Hapacol 325mg', price: '18,000đ', usage: 'Uống 1-2 viên khi sốt, cách 4-6 giờ' }
    ],
    traditionalMeds: [
      { name: 'Lá tía tô sắc', ingredients: 'Lá tía tô tươi 50g, nước 500ml', effect: 'Giải cảm, giảm sốt nhẹ, tăng đề kháng' },
      { name: 'Nước chanh muối', ingredients: 'Chanh tươi, muối, đường', effect: 'Bù nước, hạ nhiệt, bổ sung điện giải' },
      { name: 'Chườm mát', ingredients: 'Khăn mát, nước lạnh', effect: 'Hạ nhiệt nhanh cho cơ thể' }
    ]
  },

  // ===== 3. HO =====
  'ho': {
    westernMeds: [
      { name: 'Prospan', price: '45,000đ', usage: 'Uống 5ml x 3 lần/ngày sau ăn' },
      { name: 'Bisolvon', price: '35,000đ', usage: 'Uống 1 viên x 3 lần/ngày, giúp long đờm' },
      { name: 'Euviphyllin', price: '40,000đ', usage: 'Uống theo chỉ định bác sĩ, giảm co thắt phế quản' }
    ],
    traditionalMeds: [
      { name: 'Mật ong chanh', ingredients: 'Mật ong nguyên chất 2 thìa, chanh tươi', effect: 'Làm dịu họng, giảm ho, kháng khuẩn' },
      { name: 'Nước cam tươi', ingredients: 'Cam tươi vắt, không đường', effect: 'Bổ sung vitamin C, tăng sức đề kháng' },
      { name: 'Lá lốt hấp', ingredients: 'Lá lốt tươi 30g', effect: 'Tiêu đờm, giảm ho hiệu quả' }
    ]
  },

  // ===== 4. SỔ MŨI =====
  'sổ mũi': {
    westernMeds: [
      { name: 'Decolgen', price: '20,000đ', usage: 'Uống 1 viên x 3 lần/ngày' },
      { name: 'Actifed', price: '25,000đ', usage: 'Uống 1 viên khi cần, cách 4-6 giờ' },
      { name: 'Rhinathiol', price: '50,000đ', usage: 'Uống 10ml x 3 lần/ngày' }
    ],
    traditionalMeds: [
      { name: 'Hành tím mật ong', ingredients: 'Hành tím 3 củ, mật ong', effect: 'Giảm nghẹt mũi, sát khuẩn' },
      { name: 'Trà gừng', ingredients: 'Gừng tươi 30g, đường phèn', effect: 'Ấm cơ thể, giảm sổ mũi' },
      { name: 'Hơi nước nóng', ingredients: 'Nước nóng + lá bạc hà', effect: 'Thông mũi, giảm nghẹt' }
    ]
  },

  // ===== 5. ĐAU BỤNG =====
  'đau bụng': {
    westernMeds: [
      { name: 'Buscopan', price: '35,000đ', usage: 'Uống 1-2 viên khi đau, giảm co thắt' },
      { name: 'Smecta', price: '25,000đ', usage: 'Pha 1 gói vào nước, uống 3 lần/ngày' },
      { name: 'De-Nol', price: '120,000đ', usage: 'Uống trước bữa ăn 30 phút, bảo vệ niêm mạc dạ dày' }
    ],
    traditionalMeds: [
      { name: 'Trà gừng ấm', ingredients: 'Gừng tươi 20g, đường', effect: 'Giảm đau bụng, ấm dạ dày, tiêu hóa tốt' },
      { name: 'Nước chanh ấm', ingredients: 'Chanh tươi, mật ong', effect: 'Hỗ trợ tiêu hóa, giảm đầy hơi' }
    ]
  },

  // ===== 6. TIÊU CHẢY =====
  'tiêu chảy': {
    westernMeds: [
      { name: 'Smecta', price: '25,000đ', usage: 'Pha 1 gói vào nước, uống 3 lần/ngày' },
      { name: 'Bioflora', price: '40,000đ', usage: 'Uống 1-2 gói/ngày, bổ sung men vi sinh' },
      { name: 'Oresol', price: '15,000đ', usage: 'Pha 1 gói vào 200ml nước, uống nhiều lần trong ngày' }
    ],
    traditionalMeds: [
      { name: 'Nước gạo rang', ingredients: 'Gạo rang vàng 50g, nước 500ml', effect: 'Cầm tiêu chảy, bù nước' },
      { name: 'Lá ổi non', ingredients: 'Lá ổi non 20g sắc nước', effect: 'Chống tiêu chảy, sát khuẩn đường ruột' }
    ]
  },

  // ===== 7. BUỒN NÔN =====
  'buồn nôn': {
    westernMeds: [
      { name: 'Motilium', price: '45,000đ', usage: 'Uống 1 viên trước ăn 15-30 phút' },
      { name: 'Vogalen', price: '35,000đ', usage: 'Uống khi buồn nôn, cách 6-8 giờ' },
      { name: 'Primperan', price: '30,000đ', usage: 'Uống theo chỉ định bác sĩ' }
    ],
    traditionalMeds: [
      { name: 'Trà gừng tươi', ingredients: 'Gừng tươi 15g, mật ong', effect: 'Giảm buồn nôn, ấm dạ dày' },
      { name: 'Chanh muối', ingredients: 'Chanh muối 1 trái', effect: 'Giảm nôn nhanh, kích thích tiêu hóa' },
      { name: 'Lá bạc hà ngửi', ingredients: 'Tinh dầu bạc hà', effect: 'Giảm buồn nôn tức thì' }
    ]
  },

  // ===== 8. MỆT MỎI =====
  'mệt mỏi': {
    westernMeds: [
      { name: 'Vitamin B Complex', price: '50,000đ', usage: 'Uống 1 viên/ngày sau ăn' },
      { name: 'Berocca', price: '80,000đ', usage: 'Hòa 1 viên sủi vào nước, uống buổi sáng' },
      { name: 'Redoxon', price: '60,000đ', usage: 'Uống 1 viên/ngày, bổ sung vitamin C' }
    ],
    traditionalMeds: [
      { name: 'Nước mía tươi', ingredients: 'Mía tươi vắt', effect: 'Bổ sung năng lượng nhanh, giải nhiệt' },
      { name: 'Trà sâm', ingredients: 'Sâm tươi hoặc sâm khô', effect: 'Bồi bổ sức khỏe, tăng sinh lực' },
      { name: 'Nghỉ ngơi đầy đủ', ingredients: 'Ngủ 7-8 giờ/đêm', effect: 'Phục hồi sức lực tự nhiên' }
    ]
  },

  // ===== 9. ĐAU HỌNG =====
  'đau họng': {
    westernMeds: [
      { name: 'Strepsils', price: '30,000đ', usage: 'Ngậm 1 viên mỗi 2-3 giờ, tối đa 8 viên/ngày' },
      { name: 'Betadine họng', price: '45,000đ', usage: 'Súc miệng 3-4 lần/ngày' },
      { name: 'Pharyndol', price: '35,000đ', usage: 'Ngậm 1 viên khi đau họng' }
    ],
    traditionalMeds: [
      { name: 'Nước muối ấm', ingredients: 'Muối 1 thìa, nước ấm 200ml', effect: 'Sát khuẩn, giảm đau họng, làm sạch họng' },
      { name: 'Mật ong chanh', ingredients: 'Mật ong 2 thìa, chanh', effect: 'Làm dịu họng, kháng viêm' },
      { name: 'Trà cam thảo', ingredients: 'Cam thảo 10g sắc nước', effect: 'Giảm viêm họng, tiêu đờm' }
    ]
  },

  // ===== 10. KHÓ THỞ =====
  'khó thở': {
    westernMeds: [
      { name: 'Ventolin (Xịt)', price: '120,000đ', usage: 'Xịt 1-2 nhát khi khó thở (PHẢI CÓ CHỈ ĐỊNH BÁC SĨ)' },
      { name: 'Theophyllin', price: '50,000đ', usage: 'Uống theo đơn bác sĩ' },
      { name: 'Oxy hỗ trợ', price: 'Tùy bệnh viện', usage: 'Sử dụng tại cơ sở y tế' }
    ],
    traditionalMeds: [
      { name: 'Hít thở sâu', ingredients: 'Hít thở đều đặn', effect: 'Giãn phế quản, giảm căng thẳng' },
      { name: 'Trà bạc hà', ingredients: 'Lá bạc hà tươi', effect: 'Thông đường thở, giảm tức ngực' },
      { name: '⚠️ GỌI 115 NẾU NẶNG', ingredients: 'Đến bệnh viện ngay', effect: 'Khó thở có thể nguy hiểm!' }
    ]
  },

  // ===== 11. CHÓNG MẶT =====
  'chóng mặt': {
    westernMeds: [
      { name: 'Vastarel', price: '150,000đ', usage: 'Uống theo đơn bác sĩ, cải thiện tuần hoàn não' },
      { name: 'Ginkgo Biloba', price: '180,000đ', usage: 'Uống 1 viên x 2 lần/ngày' },
      { name: 'Betaserc', price: '120,000đ', usage: 'Uống theo chỉ định, trị chóng mặt' }
    ],
    traditionalMeds: [
      { name: 'Nước gừng mật ong', ingredients: 'Gừng tươi, mật ong', effect: 'Lưu thông khí huyết, giảm chóng mặt' },
      { name: 'Ngồi yên, hít thở sâu', ingredients: 'Nghỉ ngơi tại chỗ', effect: 'Ổn định huyết áp' },
      { name: 'Uống nước', ingredients: 'Nước lọc', effect: 'Bù nước, tránh mất nước gây chóng mặt' }
    ]
  },

  // ===== 12. MẤT NGỦ =====
  'mất ngủ': {
    westernMeds: [
      { name: 'Seduxen 5mg', price: '50,000đ', usage: 'CHỈ DÙNG THEO ĐƠN BÁC SĨ' },
      { name: 'Melatonin', price: '200,000đ', usage: 'Uống 1 viên trước ngủ 30 phút' },
      { name: 'Nhất Ngủ', price: '80,000đ', usage: 'Uống 2 viên trước ngủ' }
    ],
    traditionalMeds: [
      { name: 'Trà hoa cúc', ingredients: 'Hoa cúc khô 10g', effect: 'Thư giãn tinh thần, dễ ngủ' },
      { name: 'Sữa ấm mật ong', ingredients: 'Sữa tươi, mật ong', effect: 'Giúp ngủ ngon, bổ dưỡng' },
      { name: 'Tắm nước ấm', ingredients: 'Nước ấm trước ngủ', effect: 'Thư giãn cơ thể, dễ đi vào giấc ngủ' }
    ]
  },

  // ===== 13. ĐAU LƯNG =====
  'đau lưng': {
    westernMeds: [
      { name: 'Ibuprofen 400mg', price: '25,000đ', usage: 'Uống 1 viên x 3 lần/ngày sau ăn' },
      { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống khi đau' },
      { name: 'Gel bôi Voltaren', price: '80,000đ', usage: 'Bôi vùng đau 2-3 lần/ngày' }
    ],
    traditionalMeds: [
      { name: 'Chườm nóng', ingredients: 'Túi chườm nóng/muối rang', effect: 'Giảm đau, giãn cơ' },
      { name: 'Dầu gió xoa bóp', ingredients: 'Dầu gió xanh, massage nhẹ', effect: 'Lưu thông máu, giảm đau' },
      { name: 'Nghỉ ngơi đúng tư thế', ingredients: 'Nằm ngửa, gối ở đúng độ cao', effect: 'Giảm áp lực lên cột sống' }
    ]
  },

  // ===== 14. ĐAU KHỚP =====
  'đau khớp': {
    westernMeds: [
      { name: 'Glucosamine 1500mg', price: '350,000đ', usage: 'Uống 1 viên/ngày, bổ khớp dài hạn' },
      { name: 'Voltaren Gel', price: '80,000đ', usage: 'Bôi vùng đau 2-3 lần/ngày' },
      { name: 'Meloxicam 7.5mg', price: '50,000đ', usage: 'Uống 1 viên/ngày sau ăn' }
    ],
    traditionalMeds: [
      { name: 'Lá lốt đắp', ingredients: 'Lá lốt giã nát, đắp vùng đau', effect: 'Giảm đau khớp, chống viêm' },
      { name: 'Ngâm chân nước ấm', ingredients: 'Nước ấm + muối', effect: 'Giảm đau, thư giãn khớp' },
      { name: 'Tập vận động nhẹ', ingredients: 'Đi bộ, bơi lội', effect: 'Tăng cường sức khỏe khớp' }
    ]
  },

  // ===== 15. NGỨA DA =====
  'ngứa da': {
    westernMeds: [
      { name: 'Loratadine 10mg', price: '30,000đ', usage: 'Uống 1 viên/ngày, chống dị ứng' },
      { name: 'Kem Elocon', price: '120,000đ', usage: 'Bôi vùng ngứa 1-2 lần/ngày' },
      { name: 'Cetirizine 10mg', price: '25,000đ', usage: 'Uống 1 viên/ngày buổi tối' }
    ],
    traditionalMeds: [
      { name: 'Lá lốt giã đắp', ingredients: 'Lá lốt tươi giã nát', effect: 'Giảm ngứa, kháng khuẩn' },
      { name: 'Nước lá trầu không', ingredients: 'Lá trầu không sắc', effect: 'Sát khuẩn, giảm ngứa' },
      { name: 'Tắm nước ấm', ingredients: 'Tránh nước quá nóng', effect: 'Làm dịu da, giảm ngứa' }
    ]
  },

  // ===== 16. PHÁT BAN =====
  'phát ban': {
    westernMeds: [
      { name: 'Cetirizine 10mg', price: '25,000đ', usage: 'Uống 1 viên/ngày' },
      { name: 'Kem Betamethasone', price: '50,000đ', usage: 'Bôi vùng phát ban 2 lần/ngày' },
      { name: 'Loratadine 10mg', price: '30,000đ', usage: 'Uống 1 viên/ngày, giảm dị ứng' }
    ],
    traditionalMeds: [
      { name: 'Lá trầu không giã', ingredients: 'Lá trầu không tươi', effect: 'Kháng khuẩn, giảm sưng' },
      { name: 'Nước muối sinh lý rửa', ingredients: 'Nước muối 0.9%', effect: 'Làm sạch vết ban' },
      { name: 'Tránh gãi', ingredients: 'Cắt móng tay ngắn', effect: 'Tránh nhiễm trùng' }
    ]
  }
};

// ============================================
// HÀM TÌM THUỐC BẰNG AI (HUGGING FACE)
// ============================================

async function analyzeSymptomsWithAI(symptoms) {
  console.log('🤖 Trying AI analysis...');
  
  const prompt = `Bạn là dược sĩ Việt Nam. Phân tích triệu chứng và đề xuất thuốc.

TRIỆU CHỨNG: ${symptoms.join(', ')}

Trả lời ĐÚNG format JSON này (KHÔNG thêm text khác):
{
  "diagnosis": "Chẩn đoán ngắn gọn bằng tiếng Việt",
  "severity": "low hoặc medium hoặc high",
  "westernMeds": [
    {"name": "Tên thuốc đầy đủ", "price": "Giá VND", "usage": "Cách dùng chi tiết"}
  ],
  "traditionalMeds": [
    {"name": "Tên thuốc", "ingredients": "Thành phần", "effect": "Công dụng"}
  ],
  "advice": "Lời khuyên ngắn",
  "warning": "Cảnh báo"
}

CHỈ đề xuất thuốc KHÔNG KÊ ĐÔN, an toàn cho người lớn.`;

  try {
    const response = await fetch(API_CONFIG.huggingface.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.huggingface.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.7,
          return_full_text: false,
          do_sample: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ AI API Error:', response.status, errorText);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 AI Raw Response:', data);
    
    // Parse response
    let text = '';
    if (Array.isArray(data) && data[0]?.generated_text) {
      text = data[0].generated_text;
    } else if (data.generated_text) {
      text = data.generated_text;
    } else {
      throw new Error('Invalid response format');
    }

    // Tìm JSON trong response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate dữ liệu
    if (!parsed.diagnosis || !parsed.westernMeds || !parsed.traditionalMeds) {
      throw new Error('Missing required fields');
    }

    console.log('✅ AI Analysis successful:', parsed.diagnosis);
    return {
      diagnosis: parsed.diagnosis,
      severity: parsed.severity || 'medium',
      westernMeds: parsed.westernMeds.slice(0, 5),
      traditionalMeds: parsed.traditionalMeds.slice(0, 3),
      advice: parsed.advice || 'Nghỉ ngơi đầy đủ, uống nhiều nước.',
      warning: parsed.warning || 'Hỏi dược sĩ trước khi dùng thuốc.'
    };

  } catch (error) {
    console.error('❌ AI Analysis failed:', error.message);
    throw error; // Ném lỗi để fallback
  }
}

// ============================================
// HÀM TÌM THUỐC TRONG DATABASE (FALLBACK)
// ============================================

function findMedicinesBySymptoms(symptoms) {
  console.log('💾 Using database fallback for:', symptoms);
  
  const allWesternMeds = [];
  const allTraditionalMeds = [];
  let diagnosis = '';

  // Tìm kiếm trong database
  symptoms.forEach(symptom => {
    const key = symptom.toLowerCase();
    
    // Tìm khớp chính xác hoặc gần đúng
    Object.keys(SYMPTOMS_DB).forEach(dbKey => {
      if (key.includes(dbKey) || dbKey.includes(key)) {
        const data = SYMPTOMS_DB[dbKey];
        
        // Thêm thuốc tây
        data.westernMeds.forEach(med => {
          if (!allWesternMeds.find(m => m.name === med.name)) {
            allWesternMeds.push(med);
          }
        });
        
        // Thêm thuốc dân gian
        data.traditionalMeds.forEach(med => {
          if (!allTraditionalMeds.find(m => m.name === med.name)) {
            allTraditionalMeds.push(med);
          }
        });
        
        diagnosis += (diagnosis ? ', ' : '') + symptom;
      }
    });
  });

  // Nếu không tìm thấy gì, trả về thuốc chung
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

// ============================================
// TÌM HIỆU THUỐC (NOMINATIM + OVERPASS)
// ============================================

async function geocodeAddress(address) {
  if (!address || address.trim() === '') {
    console.log('ℹ️ No address, using default location (TP.HCM)');
    return { lat: 10.8231, lon: 106.6297 };
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    
    const response = await fetch(url, {
      headers: { 'User-Agent': 'ThuocVietApp/1.0' }
    });

    const data = await response.json();
    
    if (data && data.length > 0) {
      const coords = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
      console.log('✅ Geocoded:', coords);
      return coords;
    }
    
    console.log('⚠️ Address not found, using default');
    return { lat: 10.8231, lon: 106.6297 };
    
  } catch (error) {
    console.error('❌ Geocoding error:', error);
    return { lat: 10.8231, lon: 106.6297 };
  }
}

async function findNearbyPharmacies(lat, lon) {
  try {
    const radius = 2000; // 2km
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="pharmacy"](around:${radius},${lat},${lon});
        way["amenity"="pharmacy"](around:${radius},${lat},${lon});
      );
      out body;
      >;
      out skel qt;
    `;

    console.log('🏥 Searching pharmacies near:', lat, lon);

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    const data = await response.json();
    
    if (!data.elements || data.elements.length === 0) {
      console.log('⚠️ No pharmacies found via API, using fallback');
      return getFallbackPharmacies();
    }

    const pharmacies = data.elements
      .filter(el => el.tags && el.tags.name)
      .map(el => {
        const pharmLat = el.lat || el.center?.lat;
        const pharmLon = el.lon || el.center?.lon;
        
        if (!pharmLat || !pharmLon) return null;

        const distance = calculateDistance(lat, lon, pharmLat, pharmLon);
        
        return {
          name: el.tags.name || 'Nhà thuốc',
          address: buildAddress(el.tags),
          distance: `${distance.toFixed(1)} km`,
          rating: (4.0 + Math.random() * 0.9).toFixed(1),
          phone: el.tags.phone || 'N/A',
          distanceKm: distance
        };
      })
      .filter(p => p !== null)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 5);

    console.log('✅ Found', pharmacies.length, 'pharmacies');
    return pharmacies.length > 0 ? pharmacies : getFallbackPharmacies();

  } catch (error) {
    console.error('❌ Find pharmacies error:', error);
    return getFallbackPharmacies();
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function buildAddress(tags) {
  const parts = [];
  
  // Số nhà
  if (tags['addr:housenumber']) {
    parts.push(tags['addr:housenumber']);
  }
  
  // Tên đường
  if (tags['addr:street']) {
    parts.push(tags['addr:street']);
  }
  
  // Phường/Xã
  if (tags['addr:quarter'] || tags['addr:suburb']) {
    parts.push(tags['addr:quarter'] || tags['addr:suburb']);
  }
  
  // Quận/Huyện
  if (tags['addr:district']) {
    parts.push(tags['addr:district']);
  }
  
  // Thành phố
  if (tags['addr:city'] || tags['addr:province']) {
    parts.push(tags['addr:city'] || tags['addr:province'] || 'TP.HCM');
  } else {
    parts.push('TP.HCM'); // Mặc định
  }
  
  // Nếu vẫn trống, dùng địa chỉ display_name
  if (parts.length === 0 && tags['addr:full']) {
    return tags['addr:full'];
  }
  
  return parts.length > 0 ? parts.join(', ') : 'Địa chỉ chưa cập nhật (xem trên bản đồ)';
}

function getFallbackPharmacies() {
  return [
    {
      name: 'Nhà thuốc Pharmacity',
      address: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
      distance: '0.8 km',
      rating: '4.5',
      phone: '1800 6821'
    },
    {
      name: 'Nhà thuốc Long Châu FPT',
      address: '456 Lê Văn Việt, Q.9, TP.HCM',
      distance: '1.2 km',
      rating: '4.7',
      phone: '1800 6928'
    },
    {
      name: 'Nhà thuốc An Khang',
      address: '789 Võ Văn Tần, Q.3, TP.HCM',
      distance: '1.5 km',
      rating: '4.3',
      phone: '028 3930 1234'
    }
  ];
}

// ============================================
// HÀM CHÍNH - EXPORT
// ============================================

export const searchMedicine = async (symptoms, location) => {
  console.log('🚀 Starting search...');
  console.log('   Symptoms:', symptoms);
  console.log('   Location:', location);
  
  let medicineData;
  
  try {
    // BƯỚC 1A: Thử dùng AI trước (nếu có token)
    if (API_CONFIG.huggingface.token && API_CONFIG.huggingface.token !== 'hf_YOUR_TOKEN_HERE') {
      try {
        medicineData = await analyzeSymptomsWithAI(symptoms);
        console.log('✅ Step 1A: AI analysis successful');
      } catch (aiError) {
        console.log('⚠️ AI failed, using database fallback');
        medicineData = findMedicinesBySymptoms(symptoms);
      }
    } else {
      // BƯỚC 1B: Không có token → dùng database
      console.log('ℹ️ No AI token, using database');
      medicineData = findMedicinesBySymptoms(symptoms);
    }
    
    console.log('✅ Step 1: Medicine data ready', medicineData);
    
    // BƯỚC 2: Tìm tọa độ
    const coords = await geocodeAddress(location);
    console.log('✅ Step 2: Coordinates', coords);
    
    // BƯỚC 3: Tìm hiệu thuốc
    const pharmacies = await findNearbyPharmacies(coords.lat, coords.lon);
    console.log('✅ Step 3: Pharmacies', pharmacies.length);
    
    // Kết hợp kết quả
    const result = {
      ...medicineData,
      pharmacies: pharmacies
    };
    
    console.log('✅ SEARCH COMPLETE:', result);
    return result;
    
  } catch (error) {
    console.error('❌ SEARCH ERROR:', error);
    
    // FALLBACK cuối cùng
    return {
      diagnosis: symptoms.join(', '),
      severity: 'medium',
      westernMeds: [
        { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống theo chỉ dẫn' }
      ],
      traditionalMeds: [
        { name: 'Nghỉ ngơi', ingredients: 'Uống nhiều nước', effect: 'Tăng sức đề kháng' }
      ],
      pharmacies: getFallbackPharmacies(),
      advice: 'Nghỉ ngơi, uống nước. Đến bác sĩ nếu nặng.',
      warning: 'Hỏi dược sĩ trước khi dùng thuốc.'
    };
  }
};

export const sendChatMessage = async (message) => {
  console.log('💬 Chat:', message);
  
  // Kiểm tra có token không
  if (!API_CONFIG.huggingface.token || API_CONFIG.huggingface.token === 'hf_YOUR_TOKEN_HERE') {
    return 'Để được tư vấn chính xác, vui lòng sử dụng tính năng "Tìm thuốc" và chọn đầy đủ các triệu chứng.';
  }

  const prompt = `Bạn là dược sĩ tư vấn. Trả lời NGẮN GỌN (2-3 câu) bằng tiếng Việt:

Câu hỏi: ${message}

Trả lời:`;

  try {
    const response = await fetch(API_CONFIG.huggingface.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.huggingface.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) throw new Error('Chat API failed');

    const data = await response.json();
    let reply = '';
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text.trim();
    } else if (data.generated_text) {
      reply = data.generated_text.trim();
    }
    
    return reply || 'Để được tư vấn chính xác hơn, vui lòng sử dụng tính năng "Tìm thuốc".';

  } catch (error) {
    console.error('❌ Chat AI failed:', error);
    return 'Xin lỗi, tôi không thể trả lời lúc này. Vui lòng sử dụng tính năng "Tìm thuốc" để được hỗ trợ tốt hơn.';
  }
};