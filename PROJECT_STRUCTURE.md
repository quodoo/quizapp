# 📂 Project Structure - Final Version

```
luyenthi_app/
│
├── 📄 HTML Pages (4 pages)
│   ├── index.html          ✅ Home - Menu chọn bài thi (Bootstrap cards)
│   ├── quiz.html           ✅ Quiz player - Làm bài thi
│   ├── history.html        ✅ Lịch sử làm bài (Bootstrap stats)
│   └── settings.html       ✅ Import/Export & Settings (Bootstrap forms)
│
├── 🎨 CSS
│   └── css/
│       └── styles.css      ✅ Custom styles + Bootstrap overrides
│
├── ⚙️ JavaScript (5 modules)
│   └── js/
│       ├── navigation.js   ✅ Bootstrap navbar component
│       ├── quiz.js         ✅ Quiz logic với Practice/Test modes
│       ├── storage.js      ✅ LocalStorage manager
│       ├── history.js      ✅ History & Statistics manager
│       └── validator.js    ✅ JSON validator & Furigana converter
│
├── 📊 Data
│   └── data/
│       ├── quizzes.json           ✅ Default quiz data (2 quizzes)
│       ├── example-import.json    ✅ Import example (N3)
│       └── example-with-timer.json ✅ Timer example (3 min)
│
└── 📖 Documentation (6 files)
    ├── README.md              ✅ Project overview
    ├── QUICK_START.md         ✅ Quick guide
    ├── RELEASE_NOTES.md       ✅ Version 2.0 details
    ├── IMPORT_GUIDE.md        ✅ Import instructions
    ├── BOOTSTRAP_UPDATE.md    ✅ Bootstrap integration
    └── PROJECT_STRUCTURE.md   ✅ This file
```

## 🎯 Page Responsibilities:

### 1️⃣ index.html (Home)
**Features:**
- ✅ Navigation menu (sticky)
- ✅ Search box với real-time filter
- ✅ Quiz cards grid (responsive)
- ✅ Practice/Test buttons
- ✅ Load from JSON + localStorage
- ✅ Bootstrap cards layout

**Components:**
- Navbar (Bootstrap)
- Search input group
- Card grid (col-md-6 col-lg-4)
- Badges (level, imported)
- Action buttons

### 2️⃣ quiz.html (Quiz Player)
**Features:**
- ✅ Header với progress bar
- ✅ Mode indicator (Practice/Test)
- ✅ Timer countdown (nếu có)
- ✅ Question display với furigana
- ✅ Multiple choice options
- ✅ Explanation (conditional by mode)
- ✅ Navigation (prev/next)
- ✅ Result screen
- ✅ Review section (Test mode only)

**Modes:**
- **Practice**: Show explanation immediately
- **Test**: Hide explanation until submit

### 3️⃣ history.html (History & Stats)
**Features:**
- ✅ Statistics cards (4 metrics)
- ✅ History list với filters
- ✅ Detail modal view
- ✅ Delete individual/all
- ✅ Color-coded results
- ✅ Bootstrap layout

**Stats:**
- Total attempts
- Average score
- Best score
- Total questions

### 4️⃣ settings.html (Settings & Import)
**Features:**
- ✅ Storage info stats
- ✅ Drag & drop import
- ✅ JSON validation
- ✅ Metadata form (title, level, duration)
- ✅ Imported exam list
- ✅ Export individual/all
- ✅ Delete functions
- ✅ Success actions (Practice now)

## 📊 Data Flow:

### Import Flow:
```
JSON File → Validator → Normalize → Form Input → localStorage
                ↓
          Convert 漢字[かんじ] → <ruby> tags
```

### Quiz Flow:
```
URL Params (id, source, mode)
    ↓
Load Quiz (JSON or localStorage)
    ↓
Normalize Furigana
    ↓
QuizApp (Practice/Test mode)
    ↓
Save to History
```

### History Flow:
```
Quiz Complete → Calculate Stats → Save to localStorage
    ↓
History Page → Display Stats → Detail View
```

## 💾 LocalStorage Structure:

### 1. jpn_quiz_imported_exams
```javascript
[
  {
    id: "quiz-id",
    title: "Title",
    level: "n4",
    duration: 30,
    description: "...",
    questions: [...],
    source: "imported",
    importedAt: "2025-12-29T..."
  }
]
```

### 2. jpn_quiz_history
```javascript
[
  {
    id: timestamp,
    quizId: "quiz-id",
    quizTitle: "Title",
    mode: "practice" | "test",
    score: 25,
    totalScore: 30,
    correctCount: 20,
    totalQuestions: 20,
    percentage: 83.3,
    duration: 450,
    timestamp: "2025-12-29T...",
    answers: [...]
  }
]
```

### 3. jpn_quiz_import_history
```javascript
[
  {
    examId: "quiz-id",
    examTitle: "Title",
    timestamp: "2025-12-29T...",
    questionCount: 20
  }
]
```

## 🎨 Bootstrap Components Used:

### Navigation
- `navbar` - Main menu
- `navbar-toggler` - Mobile hamburger
- `navbar-nav` - Menu items
- `nav-link` - Links với active state

### Layout
- `container` - Main wrapper
- `row` - Grid rows
- `col-*` - Responsive columns
- `card` - Content cards

### Typography
- `display-*` - Large headings
- `lead` - Subtitle text
- `text-*` - Color utilities
- `fw-bold` - Font weight

### Components
- `btn btn-*` - Buttons
- `badge bg-*` - Labels
- `alert alert-*` - Notifications
- `form-control` - Inputs
- `form-select` - Dropdowns
- `input-group` - Search box

### Utilities
- `mb-*` / `mt-*` / `my-*` - Margins
- `p-*` - Padding
- `d-flex` - Flexbox
- `gap-*` - Spacing
- `text-center` - Alignment
- `shadow-sm` - Shadows

## 🔧 JavaScript Modules:

### navigation.js (62 lines)
- `createNavigation(activePage)`
- `insertNavigation(activePage)`
- Bootstrap navbar HTML
- Auto-collapse mobile menu

### quiz.js (540 lines)
- `class QuizApp` - Main quiz logic
- Practice/Test mode handling
- Timer countdown
- History saving
- Furigana conversion
- Result screen
- Review section (Test mode)

### storage.js (220 lines)
- `class StorageManager`
- CRUD operations for quizzes
- Import/Export functions
- Storage statistics

### history.js (131 lines)
- `class HistoryManager`
- Save quiz results
- Statistics calculation
- History CRUD

### validator.js (250 lines)
- `class QuizValidator`
- JSON schema validation
- Data normalization
- Furigana auto-conversion
- Error/Warning reporting

## 📱 Mobile Responsive:

### index.html
```
Desktop: [Card] [Card] [Card]
Tablet:  [Card] [Card]
Mobile:  [Card]
         [Card]
```

### Navigation
```
Desktop: [Logo] ---------- [Menu Items]
Mobile:  [Logo] -------- [☰]
         Click ☰ → Dropdown menu
```

### Quiz Cards
```
Desktop: Side-by-side buttons
Mobile:  Stacked full-width
```

## 🎯 Key Features:

1. **Responsive Navigation** ✅
   - Desktop: Horizontal
   - Mobile: Collapsible

2. **Search Function** ✅
   - Real-time filter
   - Search by title/desc/level

3. **Dual Modes** ✅
   - Practice: Learn as you go
   - Test: Review after submit

4. **History Tracking** ✅
   - All attempts saved
   - Statistics dashboard
   - Detail view

5. **Import System** ✅
   - Drag & drop
   - Validation
   - Metadata form
   - Practice now button

6. **Timer** ✅
   - Countdown display
   - Warnings (5min, 1min)
   - Auto-submit

## 🧪 Testing URLs:

```
Home:
http://localhost:3000/index.html

Practice Mode:
http://localhost:3000/quiz.html?id=n4-grammar-01&source=default&mode=practice

Test Mode:
http://localhost:3000/quiz.html?id=n4-grammar-01&source=default&mode=test

History:
http://localhost:3000/history.html

Settings:
http://localhost:3000/settings.html
```

## 📦 Dependencies:

### External (CDN):
- Bootstrap 5.3.0 (CSS + JS)
- Bootstrap Icons 1.11.0

### Internal:
- No npm packages
- No build process
- Pure vanilla JS
- Works offline after first load

## 🎉 Complete Feature List:

### Core:
- [x] Multiple quiz support
- [x] Practice mode
- [x] Test mode
- [x] Timer countdown
- [x] Progress tracking
- [x] Score calculation

### UI/UX:
- [x] Bootstrap integration
- [x] Responsive design
- [x] Mobile menu
- [x] Search function
- [x] Icons everywhere
- [x] Professional layout

### Data:
- [x] Import JSON
- [x] Export backup
- [x] LocalStorage
- [x] Validation
- [x] Normalization
- [x] Furigana auto-convert

### History:
- [x] Save attempts
- [x] Statistics
- [x] Detail view
- [x] Delete records
- [x] Clear all

### Advanced:
- [x] Dual mode selection
- [x] URL parameters
- [x] Dynamic loading
- [x] Error handling
- [x] Responsive everywhere

## 🚀 Ready for Production!

All features implemented! Bootstrap makes it professional and mobile-friendly! ✨

