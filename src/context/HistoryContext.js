import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Tạo Context
const HistoryContext = createContext();

// 2. Tạo Provider (component "máy chủ")
export function HistoryProvider({ children }) {
  const [searchHistory, setSearchHistory] = useState(() => {
    // Lấy dữ liệu từ localStorage khi app tải lần đầu
    const savedHistory = localStorage.getItem('thuocviet_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Tự động lưu vào localStorage mỗi khi history thay đổi
  useEffect(() => {
    localStorage.setItem('thuocviet_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Hàm để thêm một mục mới vào lịch sử
  const addHistoryItem = (symptoms, result) => {
    const newHistory = {
      id: Date.now(),
      date: new Date().toLocaleString('vi-VN'),
      symptoms: [...symptoms],
      result: result
    };
    setSearchHistory([newHistory, ...searchHistory]);
  };

  const value = {
    searchHistory,
    addHistoryItem
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
}

// 3. Tạo custom hook (để "client" dễ dàng sử dụng)
export function useHistory() {
  return useContext(HistoryContext);
}