// ============================================
// BACKEND SERVER - GROQ API (CẢI TIẾN)
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
// KIỂM TRA API KEY
// ============================================
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY không tồn tại!');
  console.error('   Tạo file backend/.env với nội dung:');
  console.error('   GROQ_API_KEY=gsk_xxxxx');
  process.exit(1);
}

if (!GROQ_API_KEY.startsWith('gsk_')) {
  console.error('❌ GROQ_API_KEY không hợp lệ!');
  console.error('   Key phải bắt đầu bằng: gsk_');
  process.exit(1);
}

// ============================================
// GROQ API HELPER - CẢI TIẾN
// ============================================

async function callGroqAPI(messages, maxTokens = 500, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📡 Groq API Call (Attempt ${attempt}/${retries})`);
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: messages,
          temperature: 0.7,
          max_tokens: maxTokens,
          top_p: 1,
          stream: false
        })
      });

      // Chi tiết lỗi HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || response.statusText;
        
        // Rate limit - thử lại
        if (response.status === 429) {
          console.warn(`⚠️  Rate limit (429). Đợi ${attempt * 2}s...`);
          await new Promise(r => setTimeout(r, attempt * 2000));
          continue;
        }
        
        // API Key sai
        if (response.status === 401) {
          throw new Error('API Key không hợp lệ. Kiểm tra lại GROQ_API_KEY trong .env');
        }
        
        // Server error - thử lại
        if (response.status >= 500) {
          console.warn(`⚠️  Groq server error (${response.status}). Thử lại...`);
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        
        throw new Error(`Groq API error ${response.status}: ${errorMsg}`);
      }

      const data = await response.json();
      
      console.log('✅ Groq API thành công');
      console.log('   Model:', data.model);
      console.log('   Tokens:', data.usage);
      
      return {
        text: data.choices[0].message.content.trim(),
        usage: data.usage,
        model: data.model
      };

    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      // Lần cuối cùng - throw error
      if (attempt === retries) {
        throw error;
      }
      
      // Đợi trước khi thử lại
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

// ============================================
// ROUTE: CHAT - TƯ VẤN TRỰC TUYẾN
// ============================================

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ 
        success: false,
        error: 'Thiếu tin nhắn' 
      });
    }

    console.log('💬 Chat Request:', message);

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

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    const result = await callGroqAPI(messages, 600);

    res.json({
      success: true,
      reply: result.text,
      model: result.model || 'Groq Llama 3.3 70B',
      usage: result.usage
    });

  } catch (error) {
    console.error('❌ Chat error:', error);
    
    // Phân loại lỗi để trả về message phù hợp
    let userMessage = 'Xin lỗi, tôi không thể trả lời lúc này.';
    
    if (error.message.includes('API Key')) {
      userMessage = '❌ API Key không hợp lệ. Vui lòng kiểm tra lại cấu hình backend.';
    } else if (error.message.includes('429')) {
      userMessage = '⚠️ Quá nhiều yêu cầu. Vui lòng đợi vài giây và thử lại.';
    } else if (error.message.includes('fetch')) {
      userMessage = '🔌 Không thể kết nối với Groq API. Kiểm tra kết nối internet.';
    }
    
    res.status(500).json({ 
      success: false, 
      error: userMessage,
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
      return res.status(400).json({ 
        success: false,
        error: 'Thiếu triệu chứng' 
      });
    }

    console.log('🔍 Search Medicine:', symptoms);

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

    const result = await callGroqAPI(messages, 2000);
    let text = result.text;

    // Loại bỏ markdown
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Tìm JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI không trả về JSON hợp lệ');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    res.json({
      success: true,
      data: {
        diagnosis: parsed.diagnosis || 'Không xác định được triệu chứng',
        severity: parsed.severity || 'medium',
        westernMeds: (parsed.westernMeds || []).slice(0, 5),
        traditionalMeds: (parsed.traditionalMeds || []).slice(0, 3),
        advice: parsed.advice || 'Nghỉ ngơi đầy đủ, uống nhiều nước.',
        warning: parsed.warning || 'Nếu triệu chứng nặng hoặc kéo dài >3 ngày, đến bác sĩ.'
      },
      usage: result.usage
    });

  } catch (error) {
    console.error('❌ Search medicine error:', error);
    
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
  const hasToken = !!GROQ_API_KEY;
  const tokenValid = GROQ_API_KEY?.startsWith('gsk_');
  
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
      model: result.model,
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
  console.log(`🔑 Token: ${GROQ_API_KEY ? '✅ Loaded' : '❌ Missing'}`);
  console.log('═══════════════════════════════════════');
  console.log('📡 Test Endpoints:');
  console.log('   http://localhost:5000/health');
  console.log('   http://localhost:5000/test-groq');
  console.log('═══════════════════════════════════════');
});

// ============================================
// ROUTE: TÌM THUỐC - CẢI TIẾN ĐẦY ĐỦ
// ============================================
// Thêm vào backend/server.js

app.post('/api/search-medicine', async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Thiếu triệu chứng' 
      });
    }

    console.log('🔍 Search Medicine:', symptoms);

    // Prompt cải tiến - chi tiết hơn
    const prompt = `Bạn là dược sĩ chuyên nghiệp tại Việt Nam. Phân tích triệu chứng và đề xuất thuốc.

TRIỆU CHỨNG: ${symptoms.join(', ')}

YÊU CẦU: Trả lời ĐÚNG format JSON (KHÔNG thêm markdown \`\`\`json, KHÔNG giải thích):

{
  "diagnosis": "Chẩn đoán sơ bộ chi tiết (2-3 câu, giải thích nguyên nhân)",
  "severity": "low hoặc medium hoặc high",
  "westernMeds": [
    {
      "name": "Tên thuốc cụ thể + hàm lượng (VD: Paracetamol 500mg)",
      "price": "Giá thực tế VNĐ (VD: 15,000đ - 20,000đ/hộp 10 viên)",
      "usage": "Cách dùng RẤT CHI TIẾT: liều lượng, thời điểm uống, lưu ý, chống chỉ định"
    }
  ],
  "traditionalMeds": [
    {
      "name": "Tên phương pháp dân gian cụ thể",
      "ingredients": "Thành phần chi tiết + số lượng (VD: Gừng tươi 30g, mật ong 2 thìa)",
      "effect": "Tác dụng cụ thể + cách thực hiện"
    }
  ],
  "advice": "Lời khuyên chăm sóc tại nhà chi tiết: chế độ ăn uống, nghỉ ngơi, theo dõi triệu chứng",
  "warning": "Cảnh báo quan trọng: Khi nào CẦN THIẾT đến bác sĩ/bệnh viện (dấu hiệu nguy hiểm)"
}

QUY TẮC BẮT BUỘC:
✅ Đề xuất 4-6 thuốc tây (phổ biến nhất, dễ mua)
✅ Đề xuất 3-4 phương pháp dân gian (an toàn, dễ làm)
✅ Giá thuốc THỰC TẾ tại Việt Nam (năm 2025)
✅ Cách dùng PHẢI có: liều, tần suất, thời điểm, lưu ý
✅ Lời khuyên PHẢI có: ăn uống, sinh hoạt, theo dõi
✅ Cảnh báo PHẢI có: dấu hiệu nguy hiểm cần đến bác sĩ

QUAN TRỌNG: Trả lời CHÍNH XÁC JSON, không thêm bất kỳ text nào khác!`;

    const messages = [
      { 
        role: 'system', 
        content: 'Bạn là dược sĩ chuyên nghiệp. CHỈ trả lời JSON hợp lệ, KHÔNG thêm markdown, KHÔNG giải thích.' 
      },
      { role: 'user', content: prompt }
    ];

    // Gọi Groq với retry
    const result = await callGroqAPI(messages, 2500, 3);
    let text = result.text;

    console.log('📝 Raw Groq Response:', text.substring(0, 200) + '...');

    // Làm sạch response
    text = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^[^{]*/, '') // Xóa text trước {
      .replace(/[^}]*$/, '') // Xóa text sau }
      .trim();

    // Parse JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI không trả về JSON hợp lệ. Raw: ' + text);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate và đảm bảo đầy đủ
    const validatedData = {
      diagnosis: parsed.diagnosis || `Phân tích triệu chứng: ${symptoms.join(', ')}`,
      severity: ['low', 'medium', 'high'].includes(parsed.severity) ? parsed.severity : 'medium',
      
      westernMeds: (parsed.westernMeds || [])
        .filter(med => med.name && med.price && med.usage)
        .slice(0, 6)
        .map(med => ({
          name: med.name.trim(),
          price: med.price.trim(),
          usage: med.usage.trim()
        })),
      
      traditionalMeds: (parsed.traditionalMeds || [])
        .filter(med => med.name && med.ingredients && med.effect)
        .slice(0, 4)
        .map(med => ({
          name: med.name.trim(),
          ingredients: med.ingredients.trim(),
          effect: med.effect.trim()
        })),
      
      advice: parsed.advice || 'Nghỉ ngơi đầy đủ, uống nhiều nước, ăn đủ dinh dưỡng. Theo dõi triệu chứng.',
      warning: parsed.warning || '⚠️ Nếu triệu chứng nặng hơn, kéo dài >3 ngày hoặc có dấu hiệu bất thường, hãy đến bác sĩ ngay.'
    };

    // Fallback nếu thiếu thuốc
    if (validatedData.westernMeds.length === 0) {
      validatedData.westernMeds = [
        { 
          name: 'Paracetamol 500mg', 
          price: '15,000đ - 20,000đ/hộp 10 viên', 
          usage: 'Uống 1-2 viên khi có triệu chứng (đau, sốt), cách 4-6 giờ. Tối đa 8 viên/ngày (4g). Uống sau ăn. Không uống nếu bị bệnh gan.' 
        }
      ];
    }

    if (validatedData.traditionalMeds.length === 0) {
      validatedData.traditionalMeds = [
        { 
          name: 'Nghỉ ngơi đầy đủ', 
          ingredients: 'Ngủ 7-8 giờ/đêm, tránh căng thẳng', 
          effect: 'Giúp cơ thể tự phục hồi, tăng cường miễn dịch' 
        },
        { 
          name: 'Uống nhiều nước', 
          ingredients: '2-3 lít nước lọc/ngày', 
          effect: 'Thanh lọc cơ thể, bù nước, giảm nhiệt độ' 
        }
      ];
    }

    console.log('✅ Validated data:', {
      diagnosis: validatedData.diagnosis.substring(0, 50) + '...',
      westernMeds: validatedData.westernMeds.length,
      traditionalMeds: validatedData.traditionalMeds.length,
      advice: !!validatedData.advice,
      warning: !!validatedData.warning
    });

    res.json({
      success: true,
      data: validatedData,
      usage: result.usage
    });

  } catch (error) {
    console.error('❌ Search medicine error:', error);
    
    // Fallback khi Groq fail
    const fallbackData = {
      diagnosis: `Phân tích triệu chứng: ${req.body.symptoms?.join(', ') || 'Không rõ'}`,
      severity: 'medium',
      westernMeds: [
        { 
          name: 'Paracetamol 500mg', 
          price: '15,000đ - 20,000đ/hộp 10 viên', 
          usage: 'Uống 1-2 viên khi đau/sốt, cách 4-6 giờ, tối đa 8 viên/ngày. Uống sau ăn.' 
        },
        { 
          name: 'Vitamin C 1000mg', 
          price: '50,000đ/hộp 10 viên sủi', 
          usage: 'Hòa 1 viên vào 200ml nước, uống 1 lần/ngày sau bữa sáng. Tăng cường đề kháng.' 
        }
      ],
      traditionalMeds: [
        { 
          name: 'Trà gừng mật ong', 
          ingredients: 'Gừng tươi 20-30g, mật ong 2 thìa, nước sôi 300ml', 
          effect: 'Đun sôi gừng 10 phút, thêm mật ong khi nguội. Uống ấm 2-3 lần/ngày. Giảm đau, sát khuẩn.' 
        },
        { 
          name: 'Nghỉ ngơi đầy đủ', 
          ingredients: 'Ngủ 7-8 giờ/đêm', 
          effect: 'Giúp cơ thể tự phục hồi, tăng miễn dịch' 
        }
      ],
      advice: 'Nghỉ ngơi, uống nhiều nước (2-3 lít/ngày), ăn đủ dinh dưỡng, tránh thức khuya. Theo dõi nhiệt độ cơ thể.',
      warning: '⚠️ Đến bác sĩ ngay nếu: Sốt >39°C, triệu chứng nặng hơn, kéo dài >3 ngày, khó thở, đau ngực, choáng váng.'
    };

    res.json({ 
      success: true,
      data: fallbackData,
      fallback: true,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});