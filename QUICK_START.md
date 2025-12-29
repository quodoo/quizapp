# 🚀 Quick Start Guide

## Chạy App

### Bước 1: Start Local Server
```bash
cd /Users/quangtv/Study/JPN5/luyenthi_app

# Option 1: Python
python3 -m http.server 3000

# Option 2: Node.js
npx serve
```

### Bước 2: Mở Browser
```
http://localhost:3000
```

## 📌 Main Features

### 1️⃣ Home (index.html)
- Xem danh sách bài thi
- Tìm kiếm bài thi
- Chọn Practice hoặc Test mode

### 2️⃣ Lịch Sử (history.html)
- Xem thống kê tổng quan
- Danh sách chi tiết các lần làm bài
- Review từng câu trả lời

### 3️⃣ Cấu Hình (settings.html)
- Import đề thi mới
- Export backup
- Quản lý dữ liệu

## 🎮 Cách Sử Dụng

### Làm Bài Luyện Tập
```
1. Home → Chọn bài thi
2. Click "💪 Luyện Tập"
3. Làm bài → Xem giải thích ngay
4. Kết quả được lưu vào lịch sử
```

### Làm Bài Kiểm Tra
```
1. Home → Chọn bài thi
2. Click "📝 Kiểm Tra"
3. Làm hết bài → Nộp bài
4. Xem review chi tiết + giải thích
```

### Import Đề Thi
```
1. Cấu Hình → Kéo file JSON
2. Điền tên, level, thời gian
3. Click "Xác nhận Import"
4. Click "Luyện Tập Ngay" hoặc về Home
```

## 📝 Format JSON Đơn Giản

```json
{
  "id": "my-quiz",
  "title": "Bài Thi Của Tôi",
  "level": "n4",
  "duration": 30,
  "description": "Mô tả...",
  "questions": [
    {
      "q": "私[わたし]は学生[がくせい]です。",
      "options": [
        "a. Đáp án 1",
        "b. Đáp án 2"
      ],
      "correct": 0,
      "point": 1,
      "explain": "Giải thích..."
    }
  ]
}
```

## 🔍 Tìm Kiếm

Gõ vào ô search:
- Tên bài thi
- Level (n5, n4...)
- Từ khóa trong mô tả

## 💡 Tips

### Furigana
```
✅ Đúng: 漢字[かんじ]
❌ Sai: <ruby>漢<rt>かん</rt></ruby>...
```

### Practice vs Test
- **Practice**: Học từng câu một
- **Test**: Thi thử như thật

### Backup Dữ Liệu
```
Cấu Hình → "💾 Export tất cả"
```

## 🐛 Troubleshooting

### Không hiển thị quiz
→ Check console (F12)
→ Verify file path
→ Reload page

### Timer không chạy
→ Check duration field trong JSON

### Lịch sử mất
→ Đã xóa localStorage
→ Import lại từ backup

### Search không work
→ Clear cache
→ Reload page

## 📱 Mobile

App fully responsive:
- ☰ Menu button top-left
- Touch-friendly buttons
- Readable fonts
- Proper spacing

## 🎯 Keyboard Shortcuts

(Coming soon)

## 📊 Data Limits

- Max history records: 100
- Max imported quizzes: Limited by browser (5-10MB)
- Backup before clearing!

## 🔗 Navigation

```
🏠 Trang Chủ     → index.html
📊 Lịch Sử       → history.html
⚙️ Cấu Hình      → settings.html
📝 Quiz Player   → quiz.html (auto-routed)
```

## ✨ Quick Tips

1. **Thường xuyên backup**: Export all → Save file
2. **Xem lịch sử**: Track progress over time
3. **Test mode**: Kiểm tra kiến thức thật sự
4. **Search**: Find quizzes quickly
5. **Duration**: Set time limit for pressure

## 🎉 Enjoy!

Happy learning Japanese! 🇯🇵📚

Need help? Check RELEASE_NOTES.md for details.

