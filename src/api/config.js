// ============================================
// API CONFIGURATION
// ============================================

export const API_CONFIG = {
  huggingface: {
    token: process.env.REACT_APP_HUGGINGFACE_TOKEN || '',
    url: process.env.REACT_APP_HUGGINGFACE_URL || 
         'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct'
  }
};

// ⚠️ Cảnh báo nếu thiếu token
if (!API_CONFIG.huggingface.token) {
  console.warn('⚠️ CẢNH BÁO: Chưa có token Hugging Face.');
  console.warn('Tính năng AI sẽ không hoạt động.');
  console.warn('Vui lòng tạo file .env và thêm: REACT_APP_HUGGINGFACE_TOKEN=your_token');
}

// ============================================
// HELPER: Kiểm tra token hợp lệ
// ============================================

export function hasValidToken() {
  return API_CONFIG.huggingface.token && 
         API_CONFIG.huggingface.token.startsWith('hf_');
}