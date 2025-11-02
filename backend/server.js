// ============================================
// BACKEND SERVER - BẢO VẸ API KEY
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
// ROUTE: TÌM THUỐC (AI)
// ============================================

app.post('/api/search-medicine', async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: 'Thiếu triệu chứng' });
    }

    // Gọi Hugging Face API (token ở server, không lộ ra ngoài)
    const prompt = `Bạn là dược sĩ Việt Nam. Phân tích triệu chứng và đề xuất thuốc.

TRIỆU CHỨNG: ${symptoms.join(', ')}

Trả lời ĐÚNG format JSON:
{
  "diagnosis": "Chẩn đoán",
  "severity": "low/medium/high",
  "westernMeds": [{"name": "...", "price": "...", "usage": "..."}],
  "traditionalMeds": [{"name": "...", "ingredients": "...", "effect": "..."}],
  "advice": "Lời khuyên",
  "warning": "Cảnh báo"
}`;

    const response = await fetch(process.env.HUGGINGFACE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`, // ← Token ở server
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
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    let text = '';
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      text = data[0].generated_text;
    } else if (data.generated_text) {
      text = data.generated_text;
    } else {
      throw new Error('Invalid response');
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');

    const parsed = JSON.parse(jsonMatch[0]);

    res.json({
      success: true,
      data: {
        diagnosis: parsed.diagnosis,
        severity: parsed.severity || 'medium',
        westernMeds: parsed.westernMeds?.slice(0, 5) || [],
        traditionalMeds: parsed.traditionalMeds?.slice(0, 3) || [],
        advice: parsed.advice || 'Nghỉ ngơi đầy đủ',
        warning: parsed.warning || 'Hỏi dược sĩ'
      }
    });

  } catch (error) {
    console.error('Search medicine error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Không thể phân tích. Vui lòng thử lại.' 
    });
  }
});

// ============================================
// ROUTE: CHAT
// ============================================

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Thiếu tin nhắn' });
    }

    const prompt = `Bạn là dược sĩ. Trả lời NGẮN GỌN (2-3 câu):

Câu hỏi: ${message}

Trả lời:`;

    const response = await fetch(process.env.HUGGINGFACE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
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

    res.json({
      success: true,
      reply: reply || 'Xin lỗi, tôi không thể trả lời.'
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Lỗi chat' 
    });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Token: ${process.env.HUGGINGFACE_TOKEN ? 'Loaded' : '❌ Missing'}`);
});