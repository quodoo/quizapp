// Validator & Normalizer cho Quiz Data
class QuizValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
    }

    /**
     * Validate toàn bộ exam
     * @param {Object} exam
     * @returns {Object} { valid, errors, warnings, normalized }
     */
    validateExam(exam) {
        this.errors = [];
        this.warnings = [];

        // Validate required fields
        if (!exam.id) {
            this.errors.push('Missing required field: id');
        } else if (typeof exam.id !== 'string') {
            this.errors.push('Field "id" must be a string');
        }

        if (!exam.title) {
            this.errors.push('Missing required field: title');
        } else if (typeof exam.title !== 'string') {
            this.errors.push('Field "title" must be a string');
        }

        if (!exam.level) {
            this.warnings.push('Missing field: level (will default to "n5")');
        } else if (!['n5', 'n4', 'n3', 'n2', 'n1'].includes(exam.level)) {
            this.warnings.push(`Invalid level "${exam.level}". Should be one of: n5, n4, n3, n2, n1`);
        }

        if (!exam.questions || !Array.isArray(exam.questions)) {
            this.errors.push('Missing or invalid field: questions (must be an array)');
        } else if (exam.questions.length === 0) {
            this.errors.push('Exam must have at least one question');
        } else {
            // Validate each question
            exam.questions.forEach((q, index) => {
                this.validateQuestion(q, index);
            });
        }

        // Validate totalQuestions
        if (exam.totalQuestions !== undefined) {
            if (typeof exam.totalQuestions !== 'number') {
                this.errors.push('Field "totalQuestions" must be a number');
            } else if (exam.questions && exam.totalQuestions !== exam.questions.length) {
                this.warnings.push(`totalQuestions (${exam.totalQuestions}) doesn't match actual question count (${exam.questions.length})`);
            }
        }

        return {
            valid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings,
            normalized: this.normalizeExam(exam)
        };
    }

    /**
     * Validate một câu hỏi
     * @param {Object} question
     * @param {number} index
     */
    validateQuestion(question, index) {
        const prefix = `Question ${index + 1}:`;

        if (!question.q) {
            this.errors.push(`${prefix} Missing field "q" (question text)`);
        } else if (typeof question.q !== 'string') {
            this.errors.push(`${prefix} Field "q" must be a string`);
        }

        if (!question.options || !Array.isArray(question.options)) {
            this.errors.push(`${prefix} Missing or invalid field "options" (must be an array)`);
        } else {
            if (question.options.length < 2) {
                this.errors.push(`${prefix} Must have at least 2 options`);
            }
            if (question.options.length > 6) {
                this.warnings.push(`${prefix} Has ${question.options.length} options (unusually high)`);
            }

            // Check for empty options
            question.options.forEach((opt, i) => {
                if (!opt || typeof opt !== 'string' || opt.trim() === '') {
                    this.errors.push(`${prefix} Option ${i} is empty or invalid`);
                }
            });
        }

        if (question.correct === undefined || question.correct === null) {
            this.errors.push(`${prefix} Missing field "correct"`);
        } else if (typeof question.correct !== 'number') {
            this.errors.push(`${prefix} Field "correct" must be a number`);
        } else if (question.options) {
            if (question.correct < 0 || question.correct >= question.options.length) {
                this.errors.push(`${prefix} Field "correct" (${question.correct}) is out of range [0, ${question.options.length - 1}]`);
            }
        }

        if (question.point === undefined) {
            this.warnings.push(`${prefix} Missing field "point" (will default to 1)`);
        } else if (typeof question.point !== 'number') {
            this.errors.push(`${prefix} Field "point" must be a number`);
        } else if (question.point < 0) {
            this.errors.push(`${prefix} Field "point" cannot be negative`);
        }

        if (!question.explain) {
            this.warnings.push(`${prefix} Missing field "explain" (explanation)`);
        } else if (typeof question.explain !== 'string') {
            this.errors.push(`${prefix} Field "explain" must be a string`);
        }
    }

    /**
     * Normalize exam data
     * @param {Object} exam
     * @returns {Object} Normalized exam
     */
    normalizeExam(exam) {
        const normalized = {
            id: (exam.id || '').trim(),
            title: (exam.title || 'Untitled Exam').trim(),
            level: exam.level || 'n5',
            description: (exam.description || '').trim(),
            questions: [],
            totalQuestions: 0
        };

        if (exam.questions && Array.isArray(exam.questions)) {
            normalized.questions = exam.questions.map(q => this.normalizeQuestion(q));
            normalized.totalQuestions = normalized.questions.length;
        }

        return normalized;
    }

    /**
     * Normalize một câu hỏi
     * @param {Object} question
     * @returns {Object} Normalized question
     */
    normalizeQuestion(question) {
        return {
            q: this.convertFurigana((question.q || '').trim()),
            options: (question.options || []).map(opt =>
                this.convertFurigana(typeof opt === 'string' ? opt.trim() : String(opt))
            ),
            correct: Math.max(0, parseInt(question.correct) || 0),
            point: Math.max(0, parseInt(question.point) || 1),
            explain: this.convertFurigana((question.explain || 'No explanation provided.').trim())
        };
    }

    /**
     * Convert furigana từ format đơn giản sang HTML ruby tags
     * Hỗ trợ nhiều format:
     * - 漢字[かんじ] → <ruby>漢<rt>かん</rt></ruby><ruby>字<rt>じ</rt></ruby>
     * - 漢字{かんじ} → <ruby>漢<rt>かん</rt></ruby><ruby>字<rt>じ</rt></ruby>
     * - 漢字(かんじ) → <ruby>漢<rt>かん</rt></ruby><ruby>字<rt>じ</rt></ruby>
     * - Đã có <ruby> tag → giữ nguyên
     * @param {string} text
     * @returns {string}
     */
    convertFurigana(text) {
        if (!text) return '';

        // Nếu đã có ruby tag, giữ nguyên
        if (text.includes('<ruby>')) return text;

        // Convert các format: 漢字[かんじ], 漢字{かんじ}, 漢字(かんじ)
        // Pattern: kanji + [bracket] hoặc {bracket} hoặc (bracket)
        let result = text;

        // Format: 漢字[かんじ]
        result = result.replace(/([一-龯々]+)([\[【])([\u3040-\u309F]+)([\]】])/g, (match, kanji, open, reading, close) => {
            return this.createRubyTags(kanji, reading);
        });

        // Format: 漢字{かんじ}
        result = result.replace(/([一-龯々]+)(\{)([\u3040-\u309F]+)(\})/g, (match, kanji, open, reading, close) => {
            return this.createRubyTags(kanji, reading);
        });

        // Format: 漢字(かんじ) - chỉ khi () chứa hiragana
        result = result.replace(/([一-龯々]+)(\()([\u3040-\u309F]+)(\))/g, (match, kanji, open, reading, close) => {
            return this.createRubyTags(kanji, reading);
        });

        return result;
    }

    /**
     * Tạo ruby tags từ kanji và reading
     * Smart matching: tự động chia kanji và reading
     * @param {string} kanji
     * @param {string} reading
     * @returns {string}
     */
    createRubyTags(kanji, reading) {
        const kanjiChars = kanji.split('');
        const readingChars = reading.split('');

        // Nếu số lượng bằng nhau, map 1-1
        if (kanjiChars.length === readingChars.length) {
            return kanjiChars.map((k, i) =>
                `<ruby>${k}<rt>${readingChars[i]}</rt></ruby>`
            ).join('');
        }

        // Nếu chỉ có 1 kanji, toàn bộ reading cho nó
        if (kanjiChars.length === 1) {
            return `<ruby>${kanji}<rt>${reading}</rt></ruby>`;
        }

        // Trường hợp phức tạp: chia đều reading cho các kanji
        // Ví dụ: 漢字 (かんじ) → 漢(かん) 字(じ)
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

    /**
     * Validate JSON schema nhanh
     * @param {Object} data
     * @returns {boolean}
     */
    quickValidate(data) {
        if (!data) return false;

        // Check for single exam
        if (data.id && data.questions) return true;

        // Check for multiple exams
        if (data.quizzes && Array.isArray(data.quizzes)) {
            return data.quizzes.every(exam => exam.id && exam.questions);
        }

        return false;
    }

    /**
     * Generate ID nếu thiếu
     * @param {string} title
     * @returns {string}
     */
    generateId(title) {
        const slug = title
            .toLowerCase()
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
            .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
            .replace(/[ìíịỉĩ]/g, 'i')
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
            .replace(/[ùúụủũưừứựửữ]/g, 'u')
            .replace(/[ỳýỵỷỹ]/g, 'y')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const timestamp = Date.now().toString(36);
        return `${slug}-${timestamp}`;
    }
}

// Export singleton
const quizValidator = new QuizValidator();

