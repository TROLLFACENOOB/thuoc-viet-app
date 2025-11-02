// ============================================
// SERVERLESS FUNCTION: CHAT
// ============================================

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, error: 'Thiếu tin nhắn' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return res.status(500).json({ success: false, error: 'Server chưa cấu hình API key' });
    }

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
        max_tokens: 600,
        top_p: 1,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Groq API error');
    }

    const data = await response.json();

    res.status(200).json({
      success: true,
      reply: data.choices[0].message.content.trim(),
      model: data.model || 'Groq Llama 3.3 70B',
      usage: data.usage
    });

  } catch (error) {
    console.error('Chat error:', error);
    
    let userMessage = 'Xin lỗi, tôi không thể trả lời lúc này.';
    
    if (error.message.includes('API Key')) {
      userMessage = '❌ API Key không hợp lệ.';
    } else if (error.message.includes('429')) {
      userMessage = '⚠️ Quá nhiều yêu cầu. Vui lòng đợi vài giây.';
    }
    
    res.status(500).json({ 
      success: false, 
      error: userMessage
    });
  }
}