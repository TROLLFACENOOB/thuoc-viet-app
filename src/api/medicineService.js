// ============================================
// MEDICINE SERVICE - GỌI BACKEND (GROQ API)
// ============================================

import { findMedicinesBySymptoms } from './symptomsDB';
import { geocodeAddress, findNearbyPharmacies } from './pharmacyService';

// URL Backend API
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// ============================================
// HÀM TÌM THUỐC BẰNG AI (GỌI BACKEND GROQ)
// ============================================

async function analyzeSymptomsWithAI(symptoms) {
  console.log('🤖 Calling Groq AI via backend...');
  console.log('   Symptoms:', symptoms);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/search-medicine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ symptoms })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Backend error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Backend failed');
    }

    console.log('✅ Groq AI Analysis successful');
    console.log('   Model: Llama 3.1 70B');
    console.log('   Tokens:', result.usage);
    
    return result.data;

  } catch (error) {
    console.error('❌ Groq AI failed:', error.message);
    throw error;
  }
}

// ============================================
// HÀM CHÍNH - TÌM THUỐC THEO TRIỆU CHỨNG
// ============================================

export const searchMedicine = async (symptoms, location) => {
  console.log('═══════════════════════════════════════');
  console.log('🔍 STARTING MEDICINE SEARCH');
  console.log('═══════════════════════════════════════');
  console.log('📋 Symptoms:', symptoms);
  console.log('📍 Location:', location);
  
  let medicineData;
  
  try {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // BƯỚC 1: Phân tích triệu chứng với Groq AI
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('📝 Step 1: Analyzing symptoms with Groq AI...');
    
    try {
      medicineData = await analyzeSymptomsWithAI(symptoms);
      console.log('✅ Step 1: Groq AI analysis complete');
    } catch (aiError) {
      console.log('⚠️  Groq AI failed, using local database fallback');
      medicineData = findMedicinesBySymptoms(symptoms);
      console.log('✅ Step 1: Fallback database complete');
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // BƯỚC 2: Tìm tọa độ từ địa chỉ
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('📝 Step 2: Geocoding address...');
    const coords = await geocodeAddress(location);
    console.log(`✅ Step 2: Got coordinates (${coords.lat}, ${coords.lon})`);
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // BƯỚC 3: Tìm hiệu thuốc gần nhất
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('📝 Step 3: Finding nearby pharmacies...');
    const pharmacies = await findNearbyPharmacies(coords.lat, coords.lon);
    console.log(`✅ Step 3: Found ${pharmacies.length} pharmacies`);
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // KẾT HỢP KẾT QUẢ
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const result = {
      ...medicineData,
      pharmacies: pharmacies
    };
    
    console.log('═══════════════════════════════════════');
    console.log('✅ SEARCH COMPLETE');
    console.log('═══════════════════════════════════════');
    
    return result;
    
  } catch (error) {
    console.error('═══════════════════════════════════════');
    console.error('❌ SEARCH ERROR:', error);
    console.error('═══════════════════════════════════════');
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FALLBACK CUỐI CÙNG
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('⚠️  Using emergency fallback data');
    
    return {
      diagnosis: `Triệu chứng: ${symptoms.join(', ')}`,
      severity: 'medium',
      westernMeds: [
        { 
          name: 'Paracetamol 500mg', 
          price: '15,000đ', 
          usage: 'Uống 1-2 viên khi cần, cách 4-6 giờ, tối đa 8 viên/ngày. Uống sau ăn.' 
        },
        { 
          name: 'Vitamin C 1000mg', 
          price: '50,000đ', 
          usage: 'Uống 1 viên/ngày sau bữa ăn sáng. Tăng cường sức đề kháng.' 
        }
      ],
      traditionalMeds: [
        { 
          name: 'Nghỉ ngơi đầy đủ', 
          ingredients: 'Ngủ 7-8 giờ/đêm', 
          effect: 'Giúp cơ thể phục hồi' 
        },
        { 
          name: 'Uống nhiều nước', 
          ingredients: '2-3 lít nước/ngày', 
          effect: 'Thanh lọc cơ thể, bù nước' 
        }
      ],
      pharmacies: [
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
        }
      ],
      advice: 'Nghỉ ngơi, uống nhiều nước, ăn đủ dinh dưỡng. Nếu không khỏi sau 2-3 ngày hoặc triệu chứng nặng thêm, hãy đến bác sĩ.',
      warning: '⚠️ QUAN TRỌNG: Không tự ý dùng kháng sinh. Luôn hỏi dược sĩ/bác sĩ trước khi dùng thuốc. Gọi 115 nếu cấp cứu.'
    };
  }
};

// ============================================
// HÀM CHAT - TƯ VẤN TRỰC TUYẾN (GỌI BACKEND)
// ============================================

export const sendChatMessage = async (message, conversationHistory = []) => {
  console.log('💬 Sending chat message to Groq AI...');
  console.log('   Message:', message);
  console.log('   History length:', conversationHistory.length);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message,
        conversationHistory 
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Backend chat failed');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error);
    }

    console.log('✅ Chat response received');
    console.log('   Model:', result.model);
    console.log('   Tokens:', result.usage);

    return {
      reply: result.reply,
      model: result.model
    };

  } catch (error) {
    console.error('❌ Chat failed:', error);
    
    // Fallback response
    return {
      reply: '⚠️ Xin lỗi, tôi không thể trả lời lúc này do lỗi kết nối.\n\n💡 Bạn có thể:\n• Thử lại sau vài giây\n• Sử dụng tính năng "Tìm thuốc" ở trang chủ\n• Liên hệ dược sĩ trực tiếp qua hotline 1800 xxxx',
      model: 'Fallback'
    };
  }
};