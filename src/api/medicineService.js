// ============================================
// MEDICINE SERVICE - FRONTEND (GỌI BACKEND)
// ============================================

import { findMedicinesBySymptoms } from './symptomsDB';
import { geocodeAddress, findNearbyPharmacies } from './pharmacyService';

// URL Backend API
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// ============================================
// HÀM TÌM THUỐC BẰNG AI (GỌI BACKEND)
// ============================================

async function analyzeSymptomsWithAI(symptoms) {
  console.log('🤖 Calling backend AI service...');
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/search-medicine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ symptoms })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Backend failed');
    }

    console.log('✅ AI Analysis successful (via backend)');
    return result.data;

  } catch (error) {
    console.error('❌ Backend AI failed:', error.message);
    throw error; // Ném lỗi để fallback
  }
}

// ============================================
// HÀM CHÍNH - TÌM THUỐC THEO TRIỆU CHỨNG
// ============================================

export const searchMedicine = async (symptoms, location) => {
  console.log('🚀 Starting search...');
  console.log('   Symptoms:', symptoms);
  console.log('   Location:', location);
  
  let medicineData;
  
  try {
    // BƯỚC 1: Tìm thông tin thuốc
    // Thử gọi backend AI trước
    try {
      medicineData = await analyzeSymptomsWithAI(symptoms);
      console.log('✅ Step 1A: AI analysis successful (via backend)');
    } catch (aiError) {
      console.log('⚠️ Backend AI failed, using local database fallback');
      medicineData = findMedicinesBySymptoms(symptoms);
    }
    
    console.log('✅ Step 1: Medicine data ready');
    
    // BƯỚC 2: Tìm tọa độ từ địa chỉ
    const coords = await geocodeAddress(location);
    console.log('✅ Step 2: Coordinates', coords);
    
    // BƯỚC 3: Tìm hiệu thuốc gần nhất
    const pharmacies = await findNearbyPharmacies(coords.lat, coords.lon);
    console.log('✅ Step 3: Found', pharmacies.length, 'pharmacies');
    
    // Kết hợp kết quả
    const result = {
      ...medicineData,
      pharmacies: pharmacies
    };
    
    console.log('✅ SEARCH COMPLETE');
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
      pharmacies: [
        {
          name: 'Nhà thuốc Pharmacity',
          address: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
          distance: '0.8 km',
          rating: '4.5',
          phone: '1800 6821'
        }
      ],
      advice: 'Nghỉ ngơi, uống nước. Đến bác sĩ nếu nặng.',
      warning: 'Hỏi dược sĩ trước khi dùng thuốc.'
    };
  }
};

// ============================================
// HÀM CHAT - TƯ VẤN TRỰC TUYẾN (GỌI BACKEND)
// ============================================

export const sendChatMessage = async (message) => {
  console.log('💬 Chat (via backend):', message);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error('Backend chat failed');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error);
    }

    return result.reply;

  } catch (error) {
    console.error('❌ Backend chat failed:', error);
    return 'Xin lỗi, tôi không thể trả lời lúc này. Vui lòng sử dụng tính năng "Tìm thuốc".';
  }
};