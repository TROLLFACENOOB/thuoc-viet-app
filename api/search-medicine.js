// ============================================
// SERVERLESS FUNCTION: SEARCH MEDICINE
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
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ success: false, error: 'Thiếu triệu chứng' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return res.status(500).json({ success: false, error: 'Server chưa cấu hình API key' });
    }

    const prompt = `Bạn là dược sĩ chuyên nghiệp tại Việt Nam. Phân tích triệu chứng và đề xuất thuốc.

TRIỆU CHỨNG: ${symptoms.join(', ')}

YÊU CẦU: Trả lời ĐÚNG format JSON (KHÔNG thêm markdown, KHÔNG giải thích):

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
        max_tokens: 2500,
        top_p: 1,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('Groq API error');
    }

    const data = await response.json();
    let text = data.choices[0].message.content.trim();

    // Làm sạch response
    text = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^[^{]*/, '')
      .replace(/[^}]*$/, '')
      .trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON from AI');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate
    const validatedData = {
      diagnosis: parsed.diagnosis || `Phân tích triệu chứng: ${symptoms.join(', ')}`,
      severity: ['low', 'medium', 'high'].includes(parsed.severity) ? parsed.severity : 'medium',
      westernMeds: (parsed.westernMeds || []).slice(0, 6).filter(m => m.name && m.price && m.usage),
      traditionalMeds: (parsed.traditionalMeds || []).slice(0, 4).filter(m => m.name && m.ingredients && m.effect),
      advice: parsed.advice || 'Nghỉ ngơi đầy đủ, uống nhiều nước.',
      warning: parsed.warning || '⚠️ Nếu triệu chứng nặng hơn, hãy đến bác sĩ.'
    };

    res.status(200).json({
      success: true,
      data: validatedData,
      usage: data.usage
    });

  } catch (error) {
    console.error('Search error:', error);
    
    // Fallback data
    const fallbackData = {
      diagnosis: `Triệu chứng: ${req.body.symptoms?.join(', ') || 'Không rõ'}`,
      severity: 'medium',
      westernMeds: [
        { name: 'Paracetamol 500mg', price: '15,000đ', usage: 'Uống 1-2 viên khi cần' }
      ],
      traditionalMeds: [
        { name: 'Nghỉ ngơi', ingredients: 'Ngủ đủ giấc', effect: 'Phục hồi sức khỏe' }
      ],
      advice: 'Nghỉ ngơi, uống nhiều nước.',
      warning: '⚠️ Hỏi bác sĩ nếu triệu chứng nặng.'
    };

    res.status(200).json({ 
      success: true,
      data: fallbackData,
      fallback: true
    });
  }
}