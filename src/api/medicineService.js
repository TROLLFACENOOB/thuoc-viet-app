// ============================================
// MEDICINE SERVICE - PHIÊN BẢN BẢO MẬT
// ============================================

// ✅ ĐỌC TOKEN TỪ BIẾN MÔI TRƯỜNG
const API_CONFIG = {
  huggingface: {
    token: process.env.REACT_APP_HUGGINGFACE_TOKEN || '',
    url: process.env.REACT_APP_HUGGINGFACE_URL || 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct'
  }
};

// ⚠️ CẢNH BÁO NẾU THIẾU TOKEN
if (!API_CONFIG.huggingface.token) {
  console.warn('⚠️ CẢNH BÁO: Chưa có token Hugging Face. Tính năng AI sẽ không hoạt động.');
  console.warn('Vui lòng tạo file .env và thêm: REACT_APP_HUGGINGFACE_TOKEN=your_token');
}

// ============================================
// DATABASE TRIỆU CHỨNG (LUÔN HOẠT ĐỘNG)
// ============================================

const SYMPTOMS_DB = {
  'đau đầu': {
    westernMeds: [
      { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống 1-2 viên khi đau, cách 4-6 giờ, tối đa 8 viên/ngày' },
      { name: 'Ibuprofen 400mg', price: '25,000đ', usage: 'Uống 1 viên sau ăn, cách 6-8 giờ, tối đa 3 viên/ngày' },
      { name: 'Aspirin 500mg', price: '20,000đ', usage: 'Uống 1-2 viên sau ăn, cách 4-6 giờ' }
    ],
    traditionalMeds: [
      { name: 'Trà gừng mật ong', ingredients: 'Gừng tươi 20g, mật ong 2 thìa', effect: 'Giảm đau đầu, ấm cơ thể' },
      { name: 'Bạc hà', ingredients: 'Lá bạc hà tươi 10g', effect: 'Giảm đau đầu, thư giãn' }
    ]
  },
  'sốt': {
    westernMeds: [
      { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống 1-2 viên khi sốt trên 38.5°C' },
      { name: 'Efferalgan 500mg', price: '30,000đ', usage: 'Hòa 1 viên sủi vào nước' }
    ],
    traditionalMeds: [
      { name: 'Lá tía tô sắc', ingredients: 'Lá tía tô 50g', effect: 'Giải cảm, hạ sốt nhẹ' }
    ]
  },
  'ho': {
    westernMeds: [
      { name: 'Prospan', price: '45,000đ', usage: 'Uống 5ml x 3 lần/ngày sau ăn' },
      { name: 'Bisolvon', price: '35,000đ', usage: 'Uống 1 viên x 3 lần/ngày' }
    ],
    traditionalMeds: [
      { name: 'Mật ong chanh', ingredients: 'Mật ong 2 thìa, chanh tươi', effect: 'Làm dịu họng, giảm ho' }
    ]
  },
  'sổ mũi': {
    westernMeds: [
      { name: 'Decolgen', price: '20,000đ', usage: 'Uống 1 viên x 3 lần/ngày' },
      { name: 'Actifed', price: '25,000đ', usage: 'Uống 1 viên khi cần' }
    ],
    traditionalMeds: [
      { name: 'Hành tím mật ong', ingredients: 'Hành tím 3 củ, mật ong', effect: 'Giảm nghẹt mũi' }
    ]
  },
  'đau bụng': {
    westernMeds: [
      { name: 'Buscopan', price: '35,000đ', usage: 'Uống 1-2 viên khi đau' },
      { name: 'Smecta', price: '25,000đ', usage: 'Pha 1 gói vào nước, uống 3 lần/ngày' }
    ],
    traditionalMeds: [
      { name: 'Trà gừng ấm', ingredients: 'Gừng tươi 20g', effect: 'Giảm đau bụng, ấm dạ dày' }
    ]
  },
  'tiêu chảy': {
    westernMeds: [
      { name: 'Smecta', price: '25,000đ', usage: 'Pha 1 gói, uống 3 lần/ngày' },
      { name: 'Bioflora', price: '40,000đ', usage: 'Uống 1-2 gói/ngày' }
    ],
    traditionalMeds: [
      { name: 'Nước gạo rang', ingredients: 'Gạo rang 50g', effect: 'Cầm tiêu chảy' }
    ]
  },
  'buồn nôn': {
    westernMeds: [
      { name: 'Motilium', price: '45,000đ', usage: 'Uống 1 viên trước ăn 15-30 phút' },
      { name: 'Vogalen', price: '35,000đ', usage: 'Uống khi buồn nôn' }
    ],
    traditionalMeds: [
      { name: 'Trà gừng tươi', ingredients: 'Gừng tươi 15g, mật ong', effect: 'Giảm buồn nôn' }
    ]
  },
  'mệt mỏi': {
    westernMeds: [
      { name: 'Vitamin B Complex', price: '50,000đ', usage: 'Uống 1 viên/ngày sau ăn' },
      { name: 'Berocca', price: '80,000đ', usage: 'Hòa 1 viên sủi' }
    ],
    traditionalMeds: [
      { name: 'Nước mía tươi', ingredients: 'Mía tươi vắt', effect: 'Bổ sung năng lượng' }
    ]
  },
  'đau họng': {
    westernMeds: [
      { name: 'Strepsils', price: '30,000đ', usage: 'Ngậm 1 viên mỗi 2-3 giờ' },
      { name: 'Betadine họng', price: '45,000đ', usage: 'Súc miệng 3-4 lần/ngày' }
    ],
    traditionalMeds: [
      { name: 'Nước muối ấm', ingredients: 'Muối 1 thìa, nước ấm', effect: 'Sát khuẩn, giảm đau họng' }
    ]
  },
  'khó thở': {
    westernMeds: [
      { name: 'Ventolin (Xịt)', price: '120,000đ', usage: 'CHỈ DÙNG THEO ĐƠN BÁC SĨ' }
    ],
    traditionalMeds: [
      { name: '⚠️ GỌI 115 NGAY', ingredients: 'Khó thở nguy hiểm!', effect: 'Đến bệnh viện' }
    ]
  },
  'chóng mặt': {
    westernMeds: [
      { name: 'Vastarel', price: '150,000đ', usage: 'Theo đơn bác sĩ' }
    ],
    traditionalMeds: [
      { name: 'Nước gừng mật ong', ingredients: 'Gừng tươi, mật ong', effect: 'Giảm chóng mặt' }
    ]
  },
  'mất ngủ': {
    westernMeds: [
      { name: 'Melatonin', price: '200,000đ', usage: 'Uống trước ngủ 30 phút' }
    ],
    traditionalMeds: [
      { name: 'Trà hoa cúc', ingredients: 'Hoa cúc khô 10g', effect: 'Thư giãn, dễ ngủ' }
    ]
  },
  'đau lưng': {
    westernMeds: [
      { name: 'Ibuprofen 400mg', price: '25,000đ', usage: 'Uống 1 viên x 3 lần/ngày' }
    ],
    traditionalMeds: [
      { name: 'Chườm nóng', ingredients: 'Túi chườm/muối rang', effect: 'Giảm đau, giãn cơ' }
    ]
  },
  'đau khớp': {
    westernMeds: [
      { name: 'Glucosamine 1500mg', price: '350,000đ', usage: 'Uống 1 viên/ngày' }
    ],
    traditionalMeds: [
      { name: 'Lá lốt đắp', ingredients: 'Lá lốt giã nát', effect: 'Giảm đau khớp' }
    ]
  },
  'ngứa da': {
    westernMeds: [
      { name: 'Loratadine 10mg', price: '30,000đ', usage: 'Uống 1 viên/ngày' }
    ],
    traditionalMeds: [
      { name: 'Lá lốt giã đắp', ingredients: 'Lá lốt tươi', effect: 'Giảm ngứa' }
    ]
  },
  'phát ban': {
    westernMeds: [
      { name: 'Cetirizine 10mg', price: '25,000đ', usage: 'Uống 1 viên/ngày' }
    ],
    traditionalMeds: [
      { name: 'Lá trầu không', ingredients: 'Lá trầu không tươi', effect: 'Kháng khuẩn' }
    ]
  }
};

// ============================================
// HÀM TÌM THUỐC BẰNG AI
// ============================================

async function analyzeSymptomsWithAI(symptoms) {
  console.log('🤖 Trying AI analysis...');
  
  const prompt = `Bạn là dược sĩ Việt Nam. Phân tích triệu chứng và đề xuất thuốc.

TRIỆU CHỨNG: ${symptoms.join(', ')}

Trả lời ĐÚNG format JSON (KHÔNG thêm text khác):
{
  "diagnosis": "Chẩn đoán ngắn gọn",
  "severity": "low/medium/high",
  "westernMeds": [
    {"name": "Tên thuốc", "price": "Giá", "usage": "Cách dùng"}
  ],
  "traditionalMeds": [
    {"name": "Tên", "ingredients": "Thành phần", "effect": "Công dụng"}
  ],
  "advice": "Lời khuyên",
  "warning": "Cảnh báo"
}`;

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
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    let text = '';
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      text = data[0].generated_text;
    } else if (data.generated_text) {
      text = data.generated_text;
    } else {
      throw new Error('Invalid response format');
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');

    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.diagnosis || !parsed.westernMeds || !parsed.traditionalMeds) {
      throw new Error('Missing required fields');
    }

    console.log('✅ AI Analysis successful');
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
    throw error;
  }
}

// ============================================
// HÀM TÌM THUỐC TRONG DATABASE
// ============================================

function findMedicinesBySymptoms(symptoms) {
  console.log('💾 Using database for:', symptoms);
  
  const allWesternMeds = [];
  const allTraditionalMeds = [];
  let diagnosis = '';

  symptoms.forEach(symptom => {
    const key = symptom.toLowerCase();
    
    Object.keys(SYMPTOMS_DB).forEach(dbKey => {
      if (key.includes(dbKey) || dbKey.includes(key)) {
        const data = SYMPTOMS_DB[dbKey];
        
        data.westernMeds.forEach(med => {
          if (!allWesternMeds.find(m => m.name === med.name)) {
            allWesternMeds.push(med);
          }
        });
        
        data.traditionalMeds.forEach(med => {
          if (!allTraditionalMeds.find(m => m.name === med.name)) {
            allTraditionalMeds.push(med);
          }
        });
        
        diagnosis += (diagnosis ? ', ' : '') + symptom;
      }
    });
  });

  if (allWesternMeds.length === 0) {
    allWesternMeds.push(
      { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống theo chỉ dẫn' }
    );
  }
  
  if (allTraditionalMeds.length === 0) {
    allTraditionalMeds.push(
      { name: 'Nghỉ ngơi', ingredients: 'Uống nhiều nước', effect: 'Tăng đề kháng' }
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
// TÌM HIỆU THUỐC
// ============================================

async function geocodeAddress(address) {
  if (!address || address.trim() === '') {
    return { lat: 10.8231, lon: 106.6297 };
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'ThuocVietApp/1.0' }
    });
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    
    return { lat: 10.8231, lon: 106.6297 };
  } catch (error) {
    console.error('Geocoding error:', error);
    return { lat: 10.8231, lon: 106.6297 };
  }
}

async function findNearbyPharmacies(lat, lon) {
  try {
    const radius = 2000;
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="pharmacy"](around:${radius},${lat},${lon});
        way["amenity"="pharmacy"](around:${radius},${lat},${lon});
      );
      out body;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });

    const data = await response.json();
    
    if (!data.elements || data.elements.length === 0) {
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

    return pharmacies.length > 0 ? pharmacies : getFallbackPharmacies();

  } catch (error) {
    console.error('Find pharmacies error:', error);
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
  
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:quarter'] || tags['addr:suburb']) {
    parts.push(tags['addr:quarter'] || tags['addr:suburb']);
  }
  if (tags['addr:district']) parts.push(tags['addr:district']);
  if (tags['addr:city'] || tags['addr:province']) {
    parts.push(tags['addr:city'] || tags['addr:province'] || 'TP.HCM');
  } else {
    parts.push('TP.HCM');
  }
  
  return parts.length > 0 ? parts.join(', ') : 'Địa chỉ chưa cập nhật';
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
  
  let medicineData;
  
  try {
    // Thử dùng AI nếu có token
    if (API_CONFIG.huggingface.token && API_CONFIG.huggingface.token.startsWith('hf_')) {
      try {
        medicineData = await analyzeSymptomsWithAI(symptoms);
      } catch (aiError) {
        console.log('⚠️ AI failed, using database');
        medicineData = findMedicinesBySymptoms(symptoms);
      }
    } else {
      medicineData = findMedicinesBySymptoms(symptoms);
    }
    
    // Tìm hiệu thuốc
    const coords = await geocodeAddress(location);
    const pharmacies = await findNearbyPharmacies(coords.lat, coords.lon);
    
    return {
      ...medicineData,
      pharmacies: pharmacies
    };
    
  } catch (error) {
    console.error('❌ SEARCH ERROR:', error);
    
    return {
      diagnosis: symptoms.join(', '),
      severity: 'medium',
      westernMeds: [
        { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống theo chỉ dẫn' }
      ],
      traditionalMeds: [
        { name: 'Nghỉ ngơi', ingredients: 'Uống nhiều nước', effect: 'Tăng đề kháng' }
      ],
      pharmacies: getFallbackPharmacies(),
      advice: 'Nghỉ ngơi, uống nước. Đến bác sĩ nếu nặng.',
      warning: 'Hỏi dược sĩ trước khi dùng thuốc.'
    };
  }
};

export const sendChatMessage = async (message) => {
  if (!API_CONFIG.huggingface.token || !API_CONFIG.huggingface.token.startsWith('hf_')) {
    return 'Để được tư vấn, vui lòng sử dụng tính năng "Tìm thuốc".';
  }

  const prompt = `Bạn là dược sĩ. Trả lời NGẮN GỌN (2-3 câu):

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
    console.error('❌ Chat failed:', error);
    return 'Xin lỗi, tôi không thể trả lời lúc này.';
  }
};