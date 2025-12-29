# 📥 Hướng dẫn Import Đề Thi

## 🎯 Cách sử dụng

### 1. Truy cập trang Import
- Từ trang chủ, click nút **"📥 Import/Export"**
- Hoặc truy cập trực tiếp: `import.html`

### 2. Import đề thi

**Cách 1: Kéo thả file**
- Kéo file JSON vào vùng drop zone
- Hệ thống sẽ tự động validate

**Cách 2: Chọn file**
- Click vào vùng drop zone
- Chọn file JSON từ máy tính

### 3. Xem kết quả validate
- ✅ Nếu hợp lệ: Click "Xác nhận Import"
- ❌ Nếu có lỗi: Sửa file JSON theo thông báo

### 4. Sử dụng bộ đề đã import
- Về trang chủ
- Bộ đề đã import sẽ có nhãn **"📥 Imported"**
- Click để bắt đầu làm bài

## 📋 Format JSON

### Format 1: Nhiều bộ đề (Recommended)

```json
{
  "quizzes": [
    {
      "id": "unique-quiz-id",
      "title": "Tên bài thi",
      "level": "n5",
      "totalQuestions": 10,
      "description": "Mô tả bài thi",
      "questions": [...]
    }
  ]
}
```

### Format 2: Một bộ đề

```json
{
  "id": "unique-quiz-id",
  "title": "Tên bài thi",
  "level": "n5",
  "totalQuestions": 10,
  "description": "Mô tả bài thi",
  "questions": [...]
}
```

### Cấu trúc câu hỏi

```json
{
  "q": "Câu hỏi (có thể dùng <ruby> cho furigana)",
  "options": [
    "a. Đáp án 1",
    "b. Đáp án 2",
    "c. Đáp án 3",
    "d. Đáp án 4"
  ],
  "correct": 0,
  "point": 1,
  "explain": "Giải thích chi tiết (có thể dùng HTML: <b>, <br>...)"
}
```

## ✅ Required Fields (Bắt buộc)

### Exam level:
- `id` (string): ID duy nhất
- `title` (string): Tên bài thi
- `questions` (array): Mảng câu hỏi

### Question level:
- `q` (string): Câu hỏi
- `options` (array): Mảng đáp án (2-6 options)
- `correct` (number): Index đáp án đúng (0-based)

## 🔄 Optional Fields (Tùy chọn)

### Exam level:
- `level` (string): n5, n4, n3, n2, n1 (default: n5)
- `totalQuestions` (number): Tự động tính nếu không có
- `description` (string): Mô tả bài thi

### Question level:
- `point` (number): Điểm của câu (default: 1)
- `explain` (string): Giải thích (default: "No explanation")

## 🎨 Sử dụng Furigana

### Format Đơn Giản (Khuyến nghị) ⭐

Chỉ cần viết: `漢字[ふりがな]`

```json
{
  "q": "私[わたし]は学生[がくせい]です。",
  "options": [
    "a. 日本語[にほんご]を勉強[べんきょう]します",
    "b. 本[ほん]を読[よ]みます",
    "c. 友達[ともだち]と遊[あそ]びます"
  ],
  "explain": "毎日[まいにち]日本語[にほんご]を勉強[べんきょう]しています。"
}
```

**Hỗ trợ nhiều format:**
- `漢字[かんじ]` ← Khuyến nghị nhất
- `漢字{かんじ}` ← Cũng OK
- `漢字(かんじ)` ← Nếu thích
- `漢字【かんじ】` ← Dấu ngoặc vuông tiếng Nhật

Hệ thống tự động chuyển thành `<ruby>` tags!

### Format Ruby Tags (Nâng cao)

Nếu bạn đã quen với HTML, vẫn có thể dùng:

```json
{
  "q": "<ruby>漢<rt>かん</rt></ruby><ruby>字<rt>じ</rt></ruby>を勉強します。",
  "options": [
    "a. <ruby>日<rt>に</rt></ruby><ruby>本<rt>ほん</rt></ruby><ruby>語<rt>ご</rt></ruby>"
  ]
}
```

### Ví dụ Mix Format

```json
{
  "q": "これは何[なん]ですか。",
  "options": [
    "a. 本[ほん]です",
    "b. ノートです",
    "c. ペンです"
  ]
}
```

**Lưu ý:**
- Chỉ thêm furigana cho Kanji
- Hiragana/Katakana không cần
- Khoảng trắng trong `[ ]` không quan trọng

**💡 Work cho cả 2 cách:**
- ✅ Import qua UI → Tự động convert
- ✅ Chỉnh sửa `data/quizzes.json` trực tiếp → Cũng tự động convert!

Bạn có thể edit file `quizzes.json` với format đơn giản mà không cần qua import UI.

## 📤 Export

### Export 1 bộ đề:
- Vào trang Import
- Click nút **"💾 Export"** bên cạnh bộ đề
- File sẽ được tải về: `{quiz-id}.json`

### Export tất cả:
- Click nút **"💾 Export tất cả"**
- File sẽ được tải về: `all-exams-{timestamp}.json`

## 🗑️ Xóa dữ liệu

### Xóa 1 bộ đề:
- Click nút **"🗑️ Xóa"** bên cạnh bộ đề

### Xóa tất cả:
- Click nút **"🗑️ Xóa tất cả"** (màu đỏ)
- ⚠️ Cần xác nhận 2 lần

## 📊 Thông tin Storage

Trang Import hiển thị:
- Số lượng bộ đề
- Tổng số câu hỏi
- Dung lượng đã dùng (KB)

## 🔍 Validation Rules

### ID:
- Phải là string
- Không được trùng (nếu trùng sẽ ghi đè)

### Level:
- Phải là: n5, n4, n3, n2, n1
- Nếu sai sẽ có warning

### Questions:
- Ít nhất 1 câu hỏi
- Mỗi câu có 2-6 options
- `correct` phải nằm trong range [0, options.length-1]
- `point` không được âm

## 📝 Example File

Xem file mẫu: `data/example-import.json`

Bạn có thể:
1. Tải file này về
2. Chỉnh sửa
3. Import lại

## ⚠️ Lưu ý

1. **Dữ liệu lưu ở localStorage**:
   - Không mất khi tắt trình duyệt
   - Mất khi xóa cache/data của browser
   - Giới hạn ~5-10MB tùy trình duyệt

2. **Backup thường xuyên**:
   - Export ra file JSON
   - Lưu trữ ở nơi an toàn

3. **Giới hạn storage**:
   - Nếu đầy, xóa bớt dữ liệu cũ
   - Hoặc export rồi xóa tất cả, import lại

4. **CORS Policy**:
   - Cần chạy local server
   - Không chạy được bằng file:// protocol

## 🐛 Troubleshooting

### "QuotaExceededError"
- Storage đã đầy
- Giải pháp: Xóa bớt data hoặc export ra file

### "Invalid JSON"
- File JSON sai format
- Dùng JSONLint.com để check

### "Quiz not found"
- ID không tồn tại
- Kiểm tra lại URL hoặc về trang chủ

### Không hiển thị furigana
- Kiểm tra format `<ruby><rt>` tags
- Đảm bảo không có lỗi cú pháp

## 💡 Tips

1. **Tạo ID dễ nhớ**: `n4-vocab-01`, `n3-kanji-01`
2. **Group theo level**: Dễ quản lý
3. **Backup trước khi xóa**: Luôn export trước
4. **Test trước khi import nhiều**: Import 1 file test trước

