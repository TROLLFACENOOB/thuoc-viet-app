// ============================================
// MEDICINE SERVICE - GỌI BACKEND (GROQ API)
// ============================================

import { findMedicinesBySymptoms } from './symptomsDB';

// URL Backend API
const BACKEND_URL = '';

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
    console.log('   Model: Llama 3.3 70B');
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

export const searchMedicine = async (symptoms) => {
  console.log('═══════════════════════════════════════');
  console.log('🔍 STARTING MEDICINE SEARCH');
  console.log('═══════════════════════════════════════');
  console.log('📋 Symptoms:', symptoms);
  
  let medicineData;
  
  try {
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Phân tích triệu chứng với Groq AI
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('📝 Analyzing symptoms with Groq AI...');
    
    try {
      medicineData = await analyzeSymptomsWithAI(symptoms);
      
      console.log('🔍 AI Result:', medicineData);
      console.log('📋 Diagnosis:', medicineData.diagnosis);
      console.log('💊 Western Meds Count:', medicineData.westernMeds?.length || 0);
      console.log('🌿 Traditional Meds Count:', medicineData.traditionalMeds?.length || 0);
      
      console.log('✅ Groq AI analysis complete');
      
    } catch (aiError) {
      console.log('⚠️ Groq AI failed, using local database fallback');
      medicineData = findMedicinesBySymptoms(symptoms);
      console.log('✅ Fallback database complete');
    }
    
    console.log('═══════════════════════════════════════');
    console.log('✅ SEARCH COMPLETE');
    console.log('═══════════════════════════════════════');
    
    return medicineData;
    
  } catch (error) {
    console.error('═══════════════════════════════════════');
    console.error('❌ SEARCH ERROR:', error);
    console.error('═══════════════════════════════════════');
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FALLBACK CUỐI CÙNG
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    console.log('⚠️ Using emergency fallback data');
    
    return {
      diagnosis: `Triệu chứng: ${symptoms.join(', ')}`,
      severity: 'medium',
      westernMeds: [
        { 
          name: 'Paracetamol 500mg', 
          price: '15,000đ - 20,000đ/hộp 10 viên', 
          usage: 'Uống 1-2 viên khi cần (đau/sốt), cách 4-6 giờ, tối đa 8 viên/ngày. Uống sau ăn để tránh kích ứng dạ dày.' 
        },
        { 
          name: 'Vitamin C 1000mg', 
          price: '50,000đ/hộp 10 viên sủi', 
          usage: 'Hòa 1 viên vào 200ml nước, uống 1 lần/ngày sau bữa ăn sáng. Tăng cường sức đề kháng, hỗ trợ phục hồi.' 
        }
      ],
      traditionalMeds: [
        { 
          name: 'Trà gừng mật ong', 
          ingredients: 'Gừng tươi 20-30g (thái lát), mật ong 2 thìa, nước sôi 300ml', 
          effect: 'Đun sôi gừng 10 phút, thêm mật ong khi nguội. Uống ấm 2-3 lần/ngày. Giảm đau, sát khuẩn, ấm cơ thể.' 
        },
        { 
          name: 'Nghỉ ngơi đầy đủ', 
          ingredients: 'Ngủ 7-8 giờ/đêm, tránh thức khuya', 
          effect: 'Giúp cơ thể tự phục hồi, tăng cường miễn dịch tự nhiên' 
        },
        { 
          name: 'Uống nhiều nước', 
          ingredients: '2-3 lít nước lọc/ngày (chia nhỏ)', 
          effect: 'Thanh lọc cơ thể, bù nước, giảm nhiệt độ, đào thải độc tố' 
        }
      ],
      advice: '💡 Nghỉ ngơi đầy đủ, uống nhiều nước (2-3 lít/ngày), ăn đủ dinh dưỡng, bổ sung trái cây giàu vitamin. Tránh thức khuya, hạn chế tiếp xúc người bệnh. Theo dõi nhiệt độ cơ thể 2 lần/ngày.',
      warning: '⚠️ QUAN TRỌNG: Đến bác sĩ/bệnh viện NGAY nếu:\n• Sốt trên 39°C không hạ sau dùng thuốc\n• Triệu chứng nặng hơn hoặc kéo dài >3 ngày\n• Khó thở, đau ngực, ho ra máu\n• Choáng váng, lú lẫn, co giật\n• Trẻ em/người cao tuổi/phụ nữ mang thai\n\n🚨 Gọi 115 nếu cấp cứu!'
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
      reply: '⚠️ Xin lỗi, tôi không thể trả lời lúc này do lỗi kết nối.\n\n💡 Bạn có thể:\n• Thử lại sau vài giây\n• Kiểm tra backend có chạy không (http://localhost:5000/health)\n• Sử dụng tính năng "Tìm thuốc" ở trang chủ\n• Liên hệ dược sĩ trực tiếp qua hotline 1800 xxxx',
      model: 'Fallback'
    };
  }
};