import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { sendChatMessage } from '../api/medicineService';

export default function ChatPage() {
  const [chatMessages, setChatMessages] = useState([
    { 
      type: 'bot', 
      text: '👋 Xin chào! Tôi là trợ lý ảo **Thuốc Việt**, được hỗ trợ bởi Groq AI.\n\n💊 Tôi có thể giúp bạn:\n• Tư vấn về thuốc và liều lượng\n• Giải đáp thắc mắc sức khỏe\n• Hướng dẫn sử dụng thuốc an toàn\n• Tư vấn về triệu chứng bệnh\n\n❓ Bạn có câu hỏi gì không?',
      model: 'Groq Llama 3.1 70B'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotReplying, setIsBotReplying] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isBotReplying]);

  // Handle send message
  const handleSend = async () => {
    const message = chatInput.trim();
    if (message === '' || isBotReplying) return;
    
    // Add user message
    const newMessages = [...chatMessages, { type: 'user', text: message }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsBotReplying(true);
    setShowQuickQuestions(false);

    try {
      // Gọi backend với conversation history
      const result = await sendChatMessage(
        message,
        chatMessages.slice(-6) // Lấy 6 tin nhắn gần nhất để giữ context
      );
      
      setChatMessages([...newMessages, { 
        type: 'bot', 
        text: result.reply,
        model: result.model 
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages([...newMessages, { 
        type: 'bot', 
        text: '⚠️ Xin lỗi, tôi đang gặp sự cố kết nối với Groq AI.\n\n💡 Vui lòng:\n• Kiểm tra backend có chạy không\n• Thử lại sau vài giây\n• Hoặc sử dụng tính năng "Tìm thuốc"',
        model: 'Error Handler'
      }]);
    } finally {
      setIsBotReplying(false);
      // Focus lại input sau khi gửi
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick questions
  const quickQuestions = [
    'Paracetamol dùng như thế nào?',
    'Thuốc ho nào tốt nhất?',
    'Đau bụng nên uống thuốc gì?',
    'Cách phân biệt cảm cúm và COVID-19?',
    'Vitamin C uống khi nào?',
    'Thuốc kháng sinh có cần đơn không?'
  ];

  const handleQuickQuestion = (question) => {
    setChatInput(question);
    inputRef.current?.focus();
    setShowQuickQuestions(false);
  };

  // Reset conversation
  const handleReset = () => {
    if (window.confirm('Xóa toàn bộ cuộc trò chuyện?')) {
      setChatMessages([
        { 
          type: 'bot', 
          text: '👋 Cuộc trò chuyện mới bắt đầu! Tôi có thể giúp gì cho bạn?',
          model: 'Groq Llama 3.1 70B'
        }
      ]);
      setShowQuickQuestions(true);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto">
      {/* Header - Compact */}
      <div className="mb-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Tư vấn trực tuyến</h2>
              <p className="text-xs opacity-90 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Powered by Groq AI ⚡
              </p>
            </div>
          </div>
          
          <button
            onClick={handleReset}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all active:scale-95"
            title="Bắt đầu cuộc trò chuyện mới"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Container - Tối đa hóa chiều cao */}
      <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`flex gap-2 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                    : 'bg-gradient-to-br from-blue-500 to-cyan-400'
                }`}>
                  {msg.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`px-4 py-3 rounded-2xl shadow-md ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  {msg.model && (
                    <p className={`text-xs mt-2 flex items-center gap-1 ${
                      msg.type === 'user' ? 'opacity-70' : 'opacity-50'
                    }`}>
                      <Sparkles className="w-3 h-3" />
                      {msg.model}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isBotReplying && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex gap-2 max-w-[80%]">
                <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-400 shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 shadow-md rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions - Nằm trong khung chat, phía dưới messages */}
        {showQuickQuestions && chatMessages.length <= 2 && (
          <div className="px-4 pb-3 border-t border-gray-100 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
            <p className="text-xs text-gray-600 mb-2 mt-3 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" />
              💡 Câu hỏi gợi ý:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-1.5 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-700 font-medium transition-all hover:shadow-md active:scale-95"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Compact */}
      <div className="mt-3 flex gap-2 flex-shrink-0">
        <textarea
          ref={inputRef}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập câu hỏi... (Enter để gửi, Shift+Enter để xuống dòng)"
          disabled={isBotReplying}
          rows={1}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
          style={{ minHeight: '48px', maxHeight: '100px' }}
        />
        <button
          onClick={handleSend}
          disabled={isBotReplying || !chatInput.trim()}
          className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Footer Info - Compact */}
      <div className="mt-2 text-center flex-shrink-0">
        <p className="text-xs text-gray-500">
          ⚠️ Thông tin chỉ tham khảo. Hãy hỏi bác sĩ/dược sĩ trước khi dùng thuốc.
        </p>
      </div>
    </div>
  );
}