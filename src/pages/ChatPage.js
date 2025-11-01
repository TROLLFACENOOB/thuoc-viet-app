import React, { useState } from 'react';
import { sendChatMessage } from '../api/medicineService'; // 👈 Gọi API chat

export default function ChatPage() {
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Xin chào! Tôi là trợ lý ảo Thuốc Việt. Bạn có thắc mắc gì về thuốc không?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotReplying, setIsBotReplying] = useState(false);

  const handleSend = async () => {
    const message = chatInput.trim();
    if (message === '' || isBotReplying) return;
    
    const newMessages = [...chatMessages, { type: 'user', text: message }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsBotReplying(true);

    try {
      // Gọi API (mock)
      const botResponse = await sendChatMessage(message);
      
      setChatMessages([...newMessages, { type: 'bot', text: botResponse }]);
    } catch (error) {
      setChatMessages([...newMessages, { type: 'bot', text: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.' }]);
    } finally {
      setIsBotReplying(false);
    }
  };

  return (
    // Dùng 100vh và trừ đi chiều cao của Header và BottomNav
    <div className="flex flex-col h-[calc(100vh-170px)] pb-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
        Tư vấn trực tuyến
      </h2>
      
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 mb-4 overflow-y-auto space-y-3">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              msg.type === 'user' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isBotReplying && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-gray-100 text-gray-800">
              <p className="text-sm italic">... Bot đang nhập</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập câu hỏi..."
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={isBotReplying}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}