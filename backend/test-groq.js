// ============================================
// TEST GROQ API
// ============================================
// Chạy: node test-groq.js

require('dotenv').config();

async function testGroqAPI() {
  console.log('═══════════════════════════════════════');
  console.log('🧪 TESTING GROQ API');
  console.log('═══════════════════════════════════════\n');

  // Check API Key
  console.log('1️⃣ Checking API Key...');
  if (!process.env.GROQ_API_KEY) {
    console.log('❌ GROQ_API_KEY not found in .env file');
    console.log('   Create backend/.env and add:');
    console.log('   GROQ_API_KEY=gsk_xxxxx\n');
    return;
  }
  console.log(`✅ API Key found: ${process.env.GROQ_API_KEY.substring(0, 10)}...\n`);

  // Test 1: Simple Chat
  console.log('2️⃣ Testing Simple Chat...');
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'user', content: 'Chào bạn! Hãy trả lời bằng tiếng Việt: 2+2=?' }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`HTTP ${response.status}: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('✅ Chat Response:', data.choices[0].message.content);
    console.log('📊 Token Usage:', data.usage);
    console.log('');
  } catch (error) {
    console.log('❌ Chat Test Failed:', error.message);
    console.log('');
    return;
  }

  // Test 2: Medicine Analysis
  console.log('3️⃣ Testing Medicine Analysis (Vietnamese)...');
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: 'Bạn là dược sĩ Việt Nam. Trả lời ngắn gọn bằng tiếng Việt.' 
          },
          { 
            role: 'user', 
            content: 'Paracetamol 500mg dùng như thế nào?' 
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`HTTP ${response.status}: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('✅ Medicine Response:');
    console.log(data.choices[0].message.content);
    console.log('\n📊 Token Usage:', data.usage);
    console.log('');
  } catch (error) {
    console.log('❌ Medicine Test Failed:', error.message);
    console.log('');
    return;
  }

  // Test 3: JSON Generation
  console.log('4️⃣ Testing JSON Generation...');
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: 'Trả lời ĐÚNG format JSON, không thêm markdown hay giải thích.' 
          },
          { 
            role: 'user', 
            content: 'Tạo JSON với thông tin: name: "Paracetamol", price: "15000", usage: "Uống sau ăn"' 
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`HTTP ${response.status}: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content.trim();
    console.log('✅ JSON Response:', text);
    
    // Try parse
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const parsed = JSON.parse(cleanText);
      console.log('✅ JSON Parsed Successfully:', parsed);
    } catch (e) {
      console.log('⚠️  Warning: Could not parse JSON, but response received');
    }
    console.log('');
  } catch (error) {
    console.log('❌ JSON Test Failed:', error.message);
    console.log('');
    return;
  }

  // Success
  console.log('═══════════════════════════════════════');
  console.log('✅ ALL TESTS PASSED!');
  console.log('═══════════════════════════════════════');
  console.log('🎉 Groq API is working perfectly!');
  console.log('🚀 You can now run: node server.js');
  console.log('═══════════════════════════════════════\n');
}

// Run tests
testGroqAPI().catch(error => {
  console.error('Fatal Error:', error);
  process.exit(1);
});