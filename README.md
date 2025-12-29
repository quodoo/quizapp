# 🇯🇵 Ứng Dụng Luyện Thi Tiếng Nhật

Ứng dụng web để luyện thi tiếng Nhật với furigana và giải thích chi tiết.

## 📁 Cấu trúc project

```
luyenthi_app/
├── index.html              # Trang chủ với menu chọn bài thi
├── quiz.html               # Trang làm bài thi
├── import.html             # Trang import/export đề thi
├── README.md               # File hướng dẫn này
├── IMPORT_GUIDE.md         # Hướng dẫn import chi tiết
├── css/
│   └── styles.css          # CSS cho toàn bộ app
├── js/
│   ├── quiz.js             # Logic xử lý quiz
│   ├── storage.js          # Quản lý localStorage
│   └── validator.js        # Validate & normalize data
└── data/
    ├── quizzes.json        # Dữ liệu các bài thi mặc định
    └── example-import.json # File mẫu để test import
```

## 🚀 Cách sử dụng

### Chạy ứng dụng

1. Mở file `index.html` trong trình duyệt
2. Chọn bài thi muốn làm từ danh sách
3. Bắt đầu làm bài!

### Thêm bài thi mới

**Cách 1: Import qua UI (Khuyến nghị)**
1. Truy cập `import.html`
2. Kéo thả hoặc chọn file JSON
3. Hệ thống tự động validate
4. Click "Xác nhận Import"

👉 Xem hướng dẫn chi tiết: [IMPORT_GUIDE.md](IMPORT_GUIDE.md)

**Cách 2: Chỉnh sửa file `data/quizzes.json`** (cho bộ đề mặc định):

```json
{
  "quizzes": [
    {
      "id": "n4-grammar-02",           // ID duy nhất cho bài thi
      "title": "Bài thi N4 - Ngữ pháp 02",
      "level": "n4",                   // n5, n4, n3...
      "totalQuestions": 20,
      "description": "Mô tả bài thi...",
      "questions": [
        {
          "q": "私[わたし]は学生[がくせい]です。",  // Format đơn giản!
          "options": [
            "a. 日本語[にほんご]を勉強[べんきょう]します",
            "b. Đáp án 2",
            "c. Đáp án 3",
            "d. Đáp án 4"
          ],
          "correct": 0,              // Index của đáp án đúng (0-3)
          "point": 2,                // Số điểm
          "explain": "Giải thích..."
        }
      ]
    }
  ]
}
```

**💡 Format Furigana đơn giản:**
- Cũ (khó): `<ruby>漢<rt>かん</rt></ruby><ruby>字<rt>じ</rt></ruby>`
- Mới (dễ): `漢字[かんじ]` ← Chỉ cần thế này!

**Work cho cả 2 cách:**
- ✅ Import qua UI
- ✅ Edit trực tiếp file `quizzes.json`

Hệ thống tự động convert khi load! Xem file mẫu: `data/example-import.json`

## ✨ Tính năng

### Quiz Features
- ✅ Hiển thị Furigana cho chữ Hán
- ✅ Giải thích chi tiết sau mỗi câu
- ✅ Theo dõi tiến độ và điểm số
- ✅ Xem lại các câu đã làm
- ✅ Giao diện responsive cho mobile

### Data Management
- ✅ Menu chọn bài thi
- ✅ Import/Export đề thi JSON
- ✅ Lưu trữ offline với localStorage
- ✅ Validate & normalize dữ liệu tự động
- ✅ Quản lý nhiều bộ đề
- ✅ Xem lịch sử import
- ✅ Backup/Restore dữ liệu

## 📱 Tương thích

- Chrome, Firefox, Safari, Edge
- Responsive trên mobile, tablet, desktop
- Không cần server, chạy được offline (nếu không có CORS)

## 🔧 Phát triển

### Thêm level mới

Trong `css/styles.css`, thêm class cho level mới:

```css
.quiz-card-level.n2 {
    background-color: #fff3e0;
    color: #e65100;
}
```

### Tùy chỉnh màu sắc

Chỉnh biến CSS trong file `css/styles.css`:

```css
:root {
    --primary-color: #4a90e2;
    --success-color: #2ecc71;
    --error-color: #e74c3c;
    ...
}
```

## 📝 License

Free to use for educational purposes.

