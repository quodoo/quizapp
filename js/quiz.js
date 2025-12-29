// Quiz Application Logic
class QuizApp {
    constructor(quizData, duration = null, mode = 'practice', quizInfo = {}) {
        this.quizData = quizData;
        this.currentIdx = 0;
        this.score = 0;
        this.totalScore = 0;
        this.duration = duration; // Duration in minutes
        this.timeLeft = duration ? duration * 60 : null; // Convert to seconds
        this.timerInterval = null;
        this.mode = mode; // 'practice' or 'test'
        this.quizInfo = quizInfo; // {id, title} for history
        this.startTime = Date.now();

        // Khởi tạo dữ liệu mặc định (không lưu / khôi phục trạng thái đang làm)
        this.quizData.forEach(q => {
            q.userChoice = null;      // Đáp án đã chốt
            q.tempChoice = undefined; // Lựa chọn tạm thời
            q.isCorrect = null;
            this.totalScore += q.point;
        });

        // Cache DOM elements
        this.el = {
            questionText: document.getElementById('question-text'),
            optionsContainer: document.getElementById('options-container'),
            explanationBox: document.getElementById('explanation'),
            explanationText: document.getElementById('explanation-text'),
            nextBtn: document.getElementById('next-btn'),
            prevBtn: document.getElementById('prev-btn'),
            checkBtn: document.getElementById('check-btn'),
            qNumber: document.getElementById('q-number'),
            currentScore: document.getElementById('current-score'),
            progressBar: document.getElementById('progress'),
            quizContent: document.getElementById('quiz-content'),
            resultScreen: document.getElementById('result-screen'),
            finalScore: document.getElementById('final-score'),
            header: document.getElementById('header'),
            footer: document.getElementById('footer'),
            listBtn: document.getElementById('list-btn'),
            modal: document.getElementById('modal-overlay'),
            closeModal: document.getElementById('close-modal'),
            qGrid: document.getElementById('q-grid')
        };

        this.initEventListeners();
    }

    initEventListeners() {
        // Navigation buttons
        this.el.nextBtn.onclick = () => this.handleNext();
        this.el.prevBtn.onclick = () => this.handlePrev();

        // Check button (Practice mode only)
        if (this.el.checkBtn) {
            this.el.checkBtn.onclick = () => this.checkAnswerInPractice();
        }

        // Modal handlers
        this.el.listBtn.onclick = () => this.openModal();
        this.el.closeModal.onclick = () => this.closeModal();
        this.el.modal.onclick = (e) => {
            if (e.target === this.el.modal) this.closeModal();
        };
    }

    startTimer() {
        if (!this.timeLeft) return;

        // Update timer display
        this.updateTimerDisplay();

        // Start countdown
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            // Warning at 5 minutes
            if (this.timeLeft === 300) {
                alert('⏰ Còn 5 phút!');
            }

            // Warning at 1 minute
            if (this.timeLeft === 60) {
                alert('⏰ Còn 1 phút!');
            }

            // Time's up
            if (this.timeLeft <= 0) {
                this.stopTimer();
                alert('⏰ Hết giờ! Bài thi sẽ tự động nộp.');
                this.showResult();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (!timerElement || !this.timeLeft) return;

        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        timerElement.textContent = timeStr;

        // Change color when time is low
        if (this.timeLeft <= 60) {
            timerElement.style.color = '#e74c3c'; // Red
            timerElement.style.fontWeight = 'bold';
        } else if (this.timeLeft <= 300) {
            timerElement.style.color = '#ff9800'; // Orange
        }
    }

    loadQuestion() {
        const data = this.quizData[this.currentIdx];

        // Reset visuals
        this.el.explanationBox.style.display = 'none';
        this.el.nextBtn.style.display = 'none';

        // Reset check button (Practice mode)
        const checkBtn = document.getElementById('check-btn');
        if (checkBtn) {
            checkBtn.style.display = 'none';
            checkBtn.disabled = true;
        }

        // Handle prev button state
        this.el.prevBtn.disabled = this.currentIdx === 0;

        // Update header
        this.el.qNumber.innerText = `Câu ${this.currentIdx + 1}/${this.quizData.length}`;
        this.el.currentScore.innerText = `Điểm: ${this.score}`;
        const progressPercent = ((this.currentIdx) / this.quizData.length) * 100;
        this.el.progressBar.style.width = `${progressPercent}%`;

        // Render question
        const selectionHint = data.userChoice === null ?
            '<small style="color: #6c757d; font-weight: normal;"> - Chọn đáp án (có thể đổi trước khi sang câu khác)</small>' : '';
        this.el.questionText.innerHTML = `${this.currentIdx + 1}. ${data.q} <span style="font-size:0.8rem; color:#888;">(${data.point} điểm)</span>${selectionHint}`;

        // Render options
        this.el.optionsContainer.innerHTML = '';
        data.options.forEach((opt, index) => {
            const btn = document.createElement('div');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="option-label">${['a', 'b', 'c', 'd'][index]}</span><span>${opt}</span>`;

            // Check if already confirmed (userChoice !== null)
            if (data.userChoice !== null) {
                // Đã confirm, không cho chọn lại
                btn.classList.add('disabled');

                if (this.mode === 'practice') {
                    // PRACTICE: Show correct/wrong
                    if (index === data.correct) btn.classList.add('correct');
                    else if (index === data.userChoice) btn.classList.add('wrong');
                } else {
                    // TEST: Only show selected
                    if (index === data.userChoice) btn.classList.add('selected');
                }
            } else {
                // Chưa confirm, cho phép chọn/đổi
                btn.onclick = () => this.selectAnswer(index, btn);

                // Restore selection nếu đã chọn tạm
                if (data.tempChoice === index) {
                    btn.classList.add('selected');
                }
            }

            this.el.optionsContainer.appendChild(btn);
        });

        // Restore state if already answered
        if (data.userChoice !== null) {
            if (this.mode === 'practice') {
                // PRACTICE: Show explanation
                this.el.explanationText.innerHTML = data.explain;
                this.el.explanationBox.style.display = 'block';
            }
            this.el.nextBtn.style.display = 'block';
            this.el.nextBtn.innerText = this.currentIdx === this.quizData.length - 1 ?
                (this.mode === 'test' ? "Nộp bài" : "Xem kết quả") : "Câu tiếp theo ➜";
        }
    }

    selectAnswer(selectedIndex, btnElement) {
        const data = this.quizData[this.currentIdx];

        // Remove previous selection
        const allBtns = this.el.optionsContainer.children;
        Array.from(allBtns).forEach(btn => {
            btn.classList.remove('selected');
        });

        // Mark new selection
        btnElement.classList.add('selected');

        // Store temporary choice (chưa confirm, chỉ dùng trong phiên hiện tại)
        data.tempChoice = selectedIndex;

        if (this.mode === 'practice') {
            // PRACTICE: Show "Check Answer" button
            const checkBtn = document.getElementById('check-btn');
            if (checkBtn) {
                checkBtn.style.display = 'inline-block';
                checkBtn.disabled = false;
            }
        } else {
            // TEST: Show next button directly
            this.el.nextBtn.style.display = 'block';
            this.el.nextBtn.innerText = this.currentIdx === this.quizData.length - 1 ? "Nộp bài" : "Câu tiếp theo ➜";
        }
    }

    checkAnswerInPractice() {
        const data = this.quizData[this.currentIdx];

        if (data.tempChoice === undefined) return;
        if (data.userChoice !== null) return; // Already confirmed

        // Confirm answer
        data.userChoice = data.tempChoice;
        data.isCorrect = (data.userChoice === data.correct);

        const allBtns = this.el.optionsContainer.children;

        // Show visual feedback
        if (data.isCorrect) {
            allBtns[data.userChoice].classList.remove('selected');
            allBtns[data.userChoice].classList.add('correct');
            this.score += data.point;
            this.el.currentScore.innerText = `Điểm: ${this.score}`;
        } else {
            allBtns[data.userChoice].classList.remove('selected');
            allBtns[data.userChoice].classList.add('wrong');
            // Highlight correct answer
            allBtns[data.correct].classList.add('correct');
        }

        // Disable all buttons
        Array.from(allBtns).forEach(btn => {
            btn.classList.add('disabled');
            btn.onclick = null;
        });

        // Show explanation
        this.el.explanationText.innerHTML = data.explain;
        this.el.explanationBox.style.display = 'block';

        // Hide check button, show next
        const checkBtn = document.getElementById('check-btn');
        if (checkBtn) checkBtn.style.display = 'none';

        this.el.nextBtn.style.display = 'block';
        this.el.nextBtn.innerText = this.currentIdx === this.quizData.length - 1 ? "Xem kết quả" : "Câu tiếp theo ➜";
    }

    confirmAnswer() {
        const data = this.quizData[this.currentIdx];

        // Nếu chưa chọn gì, return
        if (data.tempChoice === undefined && data.userChoice === null) {
            return;
        }

        // Nếu đã confirm rồi, skip
        if (data.userChoice !== null) {
            return;
        }

        // ONLY confirm in TEST mode (Practice mode dùng checkAnswerInPractice)
        if (this.mode === 'test' && data.tempChoice !== undefined) {
            data.userChoice = data.tempChoice;
            data.isCorrect = (data.userChoice === data.correct);

            // Update score silently
            if (data.isCorrect) {
                this.score += data.point;
            }
        }
    }

    handleNext() {
        const data = this.quizData[this.currentIdx];

        // Trong Practice mode: phải check answer trước
        if (this.mode === 'practice' && data.userChoice === null) {
            alert('⚠️ Vui lòng click "Kiểm tra đáp án" trước khi sang câu tiếp theo!');
            return;
        }

        // Confirm answer trước khi chuyển câu (Test mode)
        this.confirmAnswer();

        if (this.currentIdx < this.quizData.length - 1) {
            this.currentIdx++;
            this.loadQuestion();
        } else {
            this.showResult();
        }
    }

    handlePrev() {
        const data = this.quizData[this.currentIdx];

        // Trong Practice mode: nếu đã chọn nhưng chưa check, confirm
        if (this.mode === 'practice' && data.tempChoice !== undefined && data.userChoice === null) {
            if (!confirm('Bạn chưa kiểm tra đáp án. Bỏ qua câu này?')) {
                return;
            }
        }

        // Test mode: confirm answer
        if (this.mode === 'test') {
            this.confirmAnswer();
        }

        if (this.currentIdx > 0) {
            this.currentIdx--;
            this.loadQuestion();
        }
    }

    openModal() {
        this.renderGrid();
        this.el.modal.style.display = 'flex';
    }

    closeModal() {
        this.el.modal.style.display = 'none';
    }

    renderGrid() {
        this.el.qGrid.innerHTML = '';
        this.quizData.forEach((q, idx) => {
            const item = document.createElement('div');
            item.className = 'q-grid-item';
            item.innerText = idx + 1;

            if (idx === this.currentIdx) item.classList.add('active');

            if (q.userChoice !== null) {
                if (q.isCorrect) item.classList.add('done-correct');
                else item.classList.add('done-wrong');
            }

            item.onclick = () => {
                const currentData = this.quizData[this.currentIdx];

                // Practice mode: check nếu đã chọn nhưng chưa check
                if (this.mode === 'practice' && currentData.tempChoice !== undefined && currentData.userChoice === null) {
                    if (!confirm('Bạn chưa kiểm tra đáp án. Chuyển câu?')) {
                        return;
                    }
                }

                // Test mode: confirm answer
                if (this.mode === 'test') {
                    this.confirmAnswer();
                }

                this.currentIdx = idx;
                this.loadQuestion();
                this.closeModal();
            };

            this.el.qGrid.appendChild(item);
        });
    }

    showResult() {
        this.stopTimer(); // Stop timer when showing results

        // Calculate stats
        const correctCount = this.quizData.filter(q => q.isCorrect).length;
        const percentage = (this.score / this.totalScore) * 100;
        const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000); // seconds

        // Save to history
        if (typeof historyManager !== 'undefined') {
            historyManager.saveHistory({
                quizId: this.quizInfo.id,
                quizTitle: this.quizInfo.title,
                mode: this.mode,
                score: this.score,
                totalScore: this.totalScore,
                correctCount: correctCount,
                totalQuestions: this.quizData.length,
                percentage: percentage,
                duration: elapsedTime,
                answers: this.quizData.map(q => ({
                    userChoice: q.userChoice,
                    correct: q.correct,
                    isCorrect: q.isCorrect
                }))
            });
        }

        this.el.quizContent.style.display = 'none';
        this.el.header.style.display = 'none';
        this.el.footer.style.display = 'none';
        this.el.resultScreen.style.display = 'block';

        this.el.finalScore.innerText = `${this.score}/${this.totalScore}`;

        const msgElement = document.getElementById('result-message');
        const percent = this.score / this.totalScore;

        let message = '';
        if (this.mode === 'test') {
            message = `<strong>Chế độ: Kiểm Tra</strong><br>`;
            message += `Đúng: ${correctCount}/${this.quizData.length} câu (${percentage.toFixed(1)}%)<br><br>`;
        }

        if (percent >= 0.9) message += "🏆 Xuất sắc! Bạn đã nắm rất vững kiến thức.";
        else if (percent >= 0.7) message += "👏 Làm tốt lắm! Hãy ôn lại những câu sai nhé.";
        else if (percent >= 0.5) message += "📚 Đạt yêu cầu. Cần cố gắng hơn nữa.";
        else message += "💪 Hãy ôn tập kỹ lại ngữ pháp và từ vựng nhé.";

        msgElement.innerHTML = message;

        // Show detailed review cho cả 2 modes
        this.addReviewSection();
    }

    addReviewSection() {
        const reviewDiv = document.createElement('div');
        reviewDiv.style.cssText = 'margin-top: 30px; text-align: left; max-width: 800px; margin: 30px auto;';

        let reviewHTML = '<h3 style="text-align: center; margin-bottom: 20px;">📋 Chi Tiết Từng Câu</h3>';

        this.quizData.forEach((q, idx) => {
            const icon = q.isCorrect ? '✅' : '❌';
            const bgColor = q.isCorrect ? '#e8f5e9' : '#ffebee';

            reviewHTML += `
                <div style="background: ${bgColor}; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid ${q.isCorrect ? '#2ecc71' : '#e74c3c'};">
                    <strong>${icon} Câu ${idx + 1}: ${q.isCorrect ? 'Đúng' : 'Sai'} (${q.point} điểm)</strong>
                    <p style="margin: 10px 0 5px 0;">${q.q}</p>
                    <p style="margin: 5px 0;">
                        <strong>Bạn chọn:</strong> ${q.options[q.userChoice]}<br>
                        ${!q.isCorrect ? `<strong style="color: #2ecc71;">Đáp án đúng:</strong> ${q.options[q.correct]}<br>` : ''}
                    </p>
                    <div style="margin-top: 10px; padding: 10px; background: white; border-radius: 4px;">
                        <strong>💡 Giải thích:</strong><br>
                        ${q.explain}
                    </div>
                </div>
            `;
        });

        reviewDiv.innerHTML = reviewHTML;
        this.el.resultScreen.appendChild(reviewDiv);
    }

    start() {
        this.loadQuestion();
        if (this.duration) {
            this.startTimer();
        }
    }

    // Lưu/khôi phục tiến độ làm bài đã được tắt theo yêu cầu,
    // sau này nếu cần có thể thêm lại logic tại đây.
}

// Load quiz from JSON or localStorage
async function loadQuiz(quizId, source, mode = 'practice') {
    try {
        let quiz = null;

        // Load history manager
        if (typeof historyManager === 'undefined') {
            await loadScript('js/history.js');
        }

        if (source === 'imported') {
            // Load from localStorage (đã được normalize khi import)
            if (typeof storageManager === 'undefined') {
                await loadScript('js/storage.js');
            }
            quiz = storageManager.getExamById(quizId);
        } else {
            // Load from JSON file - CẦN NORMALIZE!
            const response = await fetch('data/quizzes.json');
            const data = await response.json();
            quiz = data.quizzes.find(q => q.id === quizId);

            // Load validator để normalize furigana
            if (quiz && typeof quizValidator === 'undefined') {
                await loadScript('js/validator.js');
            }

            // Normalize quiz để convert furigana format đơn giản
            if (quiz) {
                quiz = normalizeQuizData(quiz);
            }
        }

        if (!quiz) {
            console.error('Quiz not found:', quizId);
            alert('Không tìm thấy bài thi!');
            window.location.href = 'index.html';
            return;
        }

        // Update page title
        const modeLabel = mode === 'test' ? '[Kiểm Tra]' : '[Luyện Tập]';
        document.title = `${quiz.title} ${modeLabel}`;

        // Add mode indicator to header
        addModeIndicator(mode);

        // Add timer element if quiz has duration
        if (quiz.duration) {
            addTimerToHeader(quiz.duration);
        }

        // Start quiz app
        const quizInfo = { id: quizId, title: quiz.title };
        const app = new QuizApp(quiz.questions, quiz.duration, mode, quizInfo);
        app.start();

    } catch (error) {
        console.error('Error loading quiz:', error);
        alert('Không thể tải bài thi. Vui lòng thử lại.');
    }
}

// Normalize quiz data (convert furigana format)
function normalizeQuizData(quiz) {
    if (!quiz.questions) return quiz;

    // Normalize mỗi câu hỏi
    quiz.questions = quiz.questions.map(q => ({
        ...q,
        q: convertFuriganaSimple(q.q),
        options: (q.options || []).map(opt => convertFuriganaSimple(opt)),
        explain: convertFuriganaSimple(q.explain || '')
    }));

    return quiz;
}

// Simple furigana converter (inline version, không cần validator.js)
function convertFuriganaSimple(text) {
    if (!text || text.includes('<ruby>')) return text;

    // Convert 漢字[かんじ] → <ruby>漢<rt>かん</rt></ruby><ruby>字<rt>じ</rt></ruby>
    let result = text;

    // Pattern 1: 漢字[かんじ]
    result = result.replace(/([一-龯々]+)([\[【])([\u3040-\u309F]+)([\]】])/g,
        (match, kanji, open, reading) => createRubyTagsSimple(kanji, reading)
    );

    // Pattern 2: 漢字{かんじ}
    result = result.replace(/([一-龯々]+)(\{)([\u3040-\u309F]+)(\})/g,
        (match, kanji, open, reading) => createRubyTagsSimple(kanji, reading)
    );

    // Pattern 3: 漢字(かんじ)
    result = result.replace(/([一-龯々]+)(\()([\u3040-\u309F]+)(\))/g,
        (match, kanji, open, reading) => createRubyTagsSimple(kanji, reading)
    );

    return result;
}

// Create ruby tags (simple version)
function createRubyTagsSimple(kanji, reading) {
    const kanjiChars = kanji.split('');
    const readingChars = reading.split('');

    // Nếu số lượng bằng nhau, map 1-1
    if (kanjiChars.length === readingChars.length) {
        return kanjiChars.map((k, i) =>
            `<ruby>${k}<rt>${readingChars[i]}</rt></ruby>`
        ).join('');
    }

    // Nếu chỉ có 1 kanji
    if (kanjiChars.length === 1) {
        return `<ruby>${kanji}<rt>${reading}</rt></ruby>`;
    }

    // Chia đều reading cho các kanji
    const charsPerKanji = Math.ceil(readingChars.length / kanjiChars.length);
    let result = '';
    let readingIndex = 0;

    kanjiChars.forEach((k, i) => {
        const isLast = i === kanjiChars.length - 1;
        const readingPart = isLast
            ? readingChars.slice(readingIndex).join('')
            : readingChars.slice(readingIndex, readingIndex + charsPerKanji).join('');

        result += `<ruby>${k}<rt>${readingPart}</rt></ruby>`;
        readingIndex += readingPart.length;
    });

    return result;
}

// Helper function to dynamically load script
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Get quiz parameters from URL
function getQuizParamsFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id') || 'n4-grammar-01',
        source: params.get('source') || 'default',
        mode: params.get('mode') || 'practice'
    };
}

// Add mode indicator to header
function addModeIndicator(mode) {
    const header = document.getElementById('header');
    const indicator = document.createElement('span');
    indicator.style.cssText = 'background: ' + (mode === 'test' ? '#e74c3c' : '#2ecc71') +
        '; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; white-space: nowrap;';
    indicator.textContent = mode === 'test' ? '📝 Kiểm Tra' : '💪 Luyện Tập';

    // Insert after first button
    const firstBtn = header.querySelector('.header-btn');
    if (firstBtn && firstBtn.nextSibling) {
        header.insertBefore(indicator, firstBtn.nextSibling);
    } else {
        header.appendChild(indicator);
    }
}

// Add timer to header
function addTimerToHeader(duration) {
    const header = document.getElementById('header');
    const timerSpan = document.createElement('span');
    timerSpan.id = 'timer';
    timerSpan.style.cssText = 'font-weight: bold; font-size: 1.2rem; color: var(--primary-color); white-space: nowrap;';

    const minutes = duration;
    timerSpan.textContent = `${minutes}:00`;

    // Insert before score
    const scoreElement = document.getElementById('current-score');
    header.insertBefore(timerSpan, scoreElement);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const params = getQuizParamsFromURL();
    loadQuiz(params.id, params.source, params.mode);
});

