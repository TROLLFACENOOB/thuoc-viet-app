# 🔒 Hướng Dẫn Setup Backend An Toàn

## 📁 Cấu trúc project mới:

```
thuoc-viet-app/
├── backend/              ← THÊM MỚI
│   ├── server.js
│   ├── package.json
│   ├── .env             ← Token ở đây (KHÔNG commit)
│   └── .gitignore
│
├── src/                 ← Frontend (React)
│   ├── api/
│   │   ├── medicineService.js  ← CẬP NHẬT (gọi backend)
│   │   ├── symptomsDB.js
│   │   └── pharmacyService.js
│   └── ...
│
├── .env                 ← Frontend env (KHÔNG CÓ TOKEN)
└── package.json
```

---

## 🚀 Bước 1: Tạo thư mục Backend

```bash
# Trong thư mục gốc project
mkdir backend
cd backend
```

---

## 🚀 Bước 2: Tạo các file Backend

### 2.1. Tạo `package.json`
```bash
npm init -y
```

Sau đó sửa lại thành:
```json
{
  "name": "thuoc-viet-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 2.2. Install dependencies
```bash
npm install
```

### 2.3. Tạo file `server.js`
Copy code từ artifact "server.js (Backend Node.js)"

### 2.4. Tạo file `.env`
```bash
# backend/.env
PORT=5000
HUGGINGFACE_TOKEN=hf_YOUR_REAL_TOKEN_HERE
HUGGINGFACE_URL=https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct
FRONTEND_URL=http://localhost:3000
```

### 2.5. Tạo `.gitignore`
```bash
# backend/.gitignore
node_modules/
.env
*.log
```

---

## 🚀 Bước 3: Cập nhật Frontend

### 3.1. Cập nhật `.env` (frontend)
```bash
# thuoc-viet-app/.env (GỐC PROJECT)
REACT_APP_BACKEND_URL=http://localhost:5000
```

**LƯU Ý**: KHÔNG CÓ `REACT_APP_HUGGINGFACE_TOKEN` nữa!

### 3.2. Cập nhật `src/api/medicineService.js`
Copy code từ artifact "src/api/medicineService.js (Frontend - Gọi Backend)"

---

## 🚀 Bước 4: Chạy cả 2 servers

### Terminal 1: Chạy Backend
```bash
cd backend
npm run dev
# hoặc: npm start
```

Kết quả:
```
🚀 Server running on http://localhost:5000
✅ Token: Loaded
```

### Terminal 2: Chạy Frontend
```bash
# Ở thư mục gốc
npm start
```

Kết quả:
```
Compiled successfully!
You can now view thuoc-viet-app in the browser.
Local: http://localhost:3000
```

---

## ✅ So Sánh: Trước vs Sau

### ❌ TRƯỚC (Không an toàn):
```
Frontend (React)
    ↓
    Token exposed trong JS bundle
    ↓
Hugging Face API
```

### ✅ SAU (An toàn):
```
Frontend (React)
    ↓
    Không có token
    ↓
Backend (Node.js) ← Token ở đây
    ↓
Hugging Face API
```

---

## 🔍 Kiểm tra bảo mật

### Test 1: Build frontend
```bash
npm run build
grep -r "hf_" build/
```
**Kết quả mong muốn**: KHÔNG tìm thấy token!

### Test 2: DevTools
1. Mở http://localhost:3000
2. F12 → Sources → static/js
3. Tìm "hf_" → **KHÔNG tìm thấy**

### Test 3: Network tab
1. F12 → Network
2. Tìm thuốc
3. Xem request → chỉ thấy call đến `http://localhost:5000/api/search-medicine`
4. **KHÔNG thấy token** trong request

---

## 🚀 Deploy Production

### Backend (Heroku/Railway/Render):
```bash
# Heroku
heroku create thuoc-viet-backend
heroku config:set HUGGINGFACE_TOKEN=hf_your_token
git push heroku main
```

### Frontend (Netlify/Vercel):
```bash
# Chỉ cần set biến:
REACT_APP_BACKEND_URL=https://thuoc-viet-backend.herokuapp.com
```

**LƯU Ý**: Token CHỈ ở backend, KHÔNG bao giờ ở frontend!

---

## 📞 FAQ

### Q: Có cần chạy cả 2 servers không?
**A**: Có! Backend (port 5000) + Frontend (port 3000)

### Q: Deploy thế nào?
**A**: 
- Backend → Heroku/Railway/Render
- Frontend → Netlify/Vercel
- Cập nhật `REACT_APP_BACKEND_URL` trong frontend env

### Q: Có chậm hơn không?
**A**: Có thêm ~100-200ms latency, nhưng đáng để đổi lấy bảo mật

### Q: Nếu không muốn setup backend?
**A**: Dùng database offline (symptomsDB.js), bỏ tính năng AI

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **KHÔNG BAO GIỜ** commit file `.env` của backend
2. Token **CHỈ LƯU Ở SERVER**, không bao giờ ở client
3. Nếu deploy, nhớ set CORS đúng
4. Rate limit backend để tránh abuse

---

## 🎉 Kết luận

Giờ thì token đã **AN TOÀN 100%**! Không ai xem được token trong browser nữa! 🔒