// ============================================
// BACKEND SERVER - GROQ API (LLAMA 3.3 70B)
// ============================================
// Chạy: node server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// GROQ API HELPER
// ============================================

async function callGroqAPI(messages, maxTokens = 500) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // ✅ MODEL MỚI NHẤT
        messages: messages,
        temperature: 0.7,
        max_tokens: maxTokens,
        top_p: 1,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || 'Unknown'}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content.trim(),
      usage: data.usage
    };
  } catch (error) {
    console.error('Groq API Error:', error.message);
    throw error;
  }
}

// ============================================
// ROUTE: CHAT - TƯ VẤN TRỰC TUYẾN
// ============================================

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Thiếu tin nhắn' });
    }

    // System prompt cho dược sĩ chuyên nghiệp
    const systemPrompt = `Bạn là dược sĩ chuyên nghiệp tại Việt Nam với 10 năm kinh nghiệm. 

NHIỆM VỤ:
- Tư vấn về thuốc: tác dụng, liều lượng, cách dùng, tác dụng phụ
- Giải đáp thắc mắc sức khỏe: triệu chứng, bệnh thường gặp
- Hướng dẫn an toàn: khi nào cần đến bác sĩ, cách bảo quản thuốc
- Đưa thông tin chính xác, dễ hiểu, dựa trên y học hiện đại

NGUYÊN TẮC:
✅ Trả lời ngắn gọn (2-4 câu), dễ hiểu
✅ Dùng tiếng Việt tự nhiên, thân thiện
✅ Luôn nhắc "hỏi bác sĩ/dược sĩ" khi cần thiết
✅ Cảnh báo rõ ràng về nguy hiểm tiềm ẩn

❌ KHÔNG tự ý chẩn đoán bệnh nặng
❌ KHÔNG khuyên dùng thuốc kê đơn mà không bác sĩ
❌ KHÔNG thay thế khám bác sĩ trực tiếp

LƯU Ý: Đây là tư vấn tham khảo, không thay thế bác sĩ.`;

    // Xây dựng conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    // Gọi Groq API
    const result = await callGroqAPI(messages, 600);

    res.json({
      success: true,
      reply: result.text,
      model: 'Groq Llama 3.3 70B',
      usage: result.usage
    });

  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại sau.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// ROUTE: TÌM THUỐC THEO TRIỆU CHỨNG
// ============================================

app.post('/api/search-medicine', async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: 'Thiếu triệu chứng' });
    }

    // Prompt cho AI phân tích triệu chứng
    const prompt = `Bạn là dược sĩ chuyên nghiệp. Phân tích triệu chứng và đề xuất thuốc.

TRIỆU CHỨNG: ${symptoms.join(', ')}

YÊU CẦU: Trả lời ĐÚNG format JSON (KHÔNG thêm markdown, KHÔNG giải thích):

{
  "diagnosis": "Chẩn đoán sơ bộ ngắn gọn (1-2 câu)",
  "severity": "low hoặc medium hoặc high",
  "westernMeds": [
    {
      "name": "Tên thuốc cụ thể (VD: Paracetamol 500mg)",
      "price": "Giá ước tính VNĐ (VD: 15,000đ)",
      "usage": "Cách dùng chi tiết (VD: Uống 1-2 viên khi đau, cách 4-6 giờ, tối đa 8 viên/ngày)"
    }
  ],
  "traditionalMeds": [
    {
      "name": "Tên phương pháp dân gian",
      "ingredients": "Thành phần/nguyên liệu",
      "effect": "Tác dụng"
    }
  ],
  "advice": "Lời khuyên chăm sóc tại nhà (ngắn gọn)",
  "warning": "Cảnh báo quan trọng (khi nào cần đến bác sĩ)"
}

CHÚ Ý:
- Đề xuất 3-5 thuốc tây phù hợp nhất
- Đề xuất 2-3 phương pháp dân gian an toàn
- Giá thuốc thực tế tại Việt Nam
- Cách dùng rõ ràng, dễ hiểu`;

    const messages = [
      { 
        role: 'system', 
        content: 'Bạn là dược sĩ. Chỉ trả lời bằng JSON hợp lệ, KHÔNG thêm markdown (```json), KHÔNG giải thích thêm.' 
      },
      { role: 'user', content: prompt }
    ];

    // Gọi Groq API
    const result = await callGroqAPI(messages, 2000);
    let text = result.text;

    // Loại bỏ markdown nếu AI cứng đầu thêm vào
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Tìm JSON trong response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI không trả về JSON hợp lệ');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate và format response
    res.json({
      success: true,
      data: {
        diagnosis: parsed.diagnosis || 'Không xác định được triệu chứng',
        severity: parsed.severity || 'medium',
        westernMeds: (parsed.westernMeds || []).slice(0, 5),
        traditionalMeds: (parsed.traditionalMeds || []).slice(0, 3),
        advice: parsed.advice || 'Nghỉ ngơi đầy đủ, uống nhiều nước. Theo dõi triệu chứng.',
        warning: parsed.warning || 'Nếu triệu chứng nặng hoặc kéo dài >3 ngày, hãy đến bác sĩ.'
      },
      usage: result.usage
    });

  } catch (error) {
    console.error('❌ Search medicine error:', error);
    
    // Fallback response khi API fail
    res.status(500).json({ 
      success: false, 
      error: 'Không thể phân tích triệu chứng. Vui lòng thử lại.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// ROUTE: HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  const hasToken = !!process.env.GROQ_API_KEY;
  const tokenValid = process.env.GROQ_API_KEY?.startsWith('gsk_');
  
  res.json({ 
    status: 'ok',
    api: 'Groq AI',
    model: 'Llama 3.3 70B Versatile',
    timestamp: new Date().toISOString(),
    token: hasToken && tokenValid ? '✅ Valid' : '❌ Invalid/Missing'
  });
});

// ============================================
// ROUTE: TEST GROQ CONNECTION
// ============================================

app.get('/test-groq', async (req, res) => {
  try {
    const messages = [
      { role: 'user', content: 'Chào bạn! Hãy trả lời bằng tiếng Việt: 2+2=?' }
    ];
    
    const result = await callGroqAPI(messages, 50);
    
    res.json({
      success: true,
      message: 'Groq API hoạt động tốt!',
      response: result.text,
      usage: result.usage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Groq API không hoạt động',
      details: error.message
    });
  }
});

// ============================================
// ROUTE: LIST AVAILABLE MODELS
// ============================================

app.get('/api/models', async (req, res) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Cannot fetch models');
    }

    const data = await response.json();
    
    res.json({
      success: true,
      models: data.data.map(model => ({
        id: model.id,
        owned_by: model.owned_by,
        active: model.active
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Lỗi server',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log('🚀 SERVER STARTED');
  console.log('═══════════════════════════════════════');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🤖 API: Groq AI`);
  console.log(`🧠 Model: Llama 3.3 70B Versatile`);
  console.log(`🔑 Token: ${process.env.GROQ_API_KEY ? '✅ Loaded' : '❌ Missing'}`);
  console.log('═══════════════════════════════════════');
  console.log('📡 Endpoints:');
  console.log('   POST /api/chat          - Chatbot');
  console.log('   POST /api/search-medicine - Tìm thuốc');
  console.log('   GET  /health            - Health check');
  console.log('   GET  /test-groq         - Test Groq API');
  console.log('   GET  /api/models        - List models');
  console.log('═══════════════════════════════════════');
  
  if (!process.env.GROQ_API_KEY) {
    console.log('⚠️  CẢNH BÁO: Chưa có GROQ_API_KEY!');
    console.log('   Tạo file backend/.env và thêm:');
    console.log('   GROQ_API_KEY=gsk_xxxxx');
    console.log('═══════════════════════════════════════');
  }
});