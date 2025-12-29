// Storage Manager - Quản lý localStorage cho quiz data
class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'jpn_quiz_imported_exams';
        this.HISTORY_KEY = 'jpn_quiz_import_history';
    }

    /**
     * Lấy tất cả các bộ đề đã import
     * @returns {Array} Danh sách các quiz đã import
     */
    getAllImportedExams() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    }

    /**
     * Lưu một bộ đề vào localStorage
     * @param {Object} exam - Quiz object đã được validate
     * @returns {boolean} Success status
     */
    saveImportedExam(exam) {
        try {
            const exams = this.getAllImportedExams();

            // Kiểm tra trùng ID
            const existingIndex = exams.findIndex(e => e.id === exam.id);

            if (existingIndex >= 0) {
                // Cập nhật exam đã tồn tại
                exams[existingIndex] = {
                    ...exam,
                    updatedAt: new Date().toISOString()
                };
            } else {
                // Thêm exam mới
                exams.push({
                    ...exam,
                    importedAt: new Date().toISOString(),
                    source: 'imported'
                });
            }

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(exams));

            // Lưu lịch sử import
            this.addToHistory(exam);

            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            if (error.name === 'QuotaExceededError') {
                alert('Bộ nhớ đã đầy! Vui lòng xóa bớt dữ liệu cũ.');
            }
            return false;
        }
    }

    /**
     * Xóa một bộ đề
     * @param {string} examId - ID của exam cần xóa
     * @returns {boolean} Success status
     */
    deleteExam(examId) {
        try {
            const exams = this.getAllImportedExams();
            const filtered = exams.filter(e => e.id !== examId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting exam:', error);
            return false;
        }
    }

    /**
     * Lấy một bộ đề theo ID
     * @param {string} examId
     * @returns {Object|null}
     */
    getExamById(examId) {
        const exams = this.getAllImportedExams();
        return exams.find(e => e.id === examId) || null;
    }

    /**
     * Export một bộ đề ra JSON
     * @param {string} examId
     * @returns {string|null} JSON string
     */
    exportExamToJson(examId) {
        const exam = this.getExamById(examId);
        if (!exam) return null;

        // Loại bỏ metadata không cần thiết
        const cleanExam = {
            id: exam.id,
            title: exam.title,
            level: exam.level,
            totalQuestions: exam.totalQuestions,
            description: exam.description,
            questions: exam.questions
        };

        return JSON.stringify(cleanExam, null, 2);
    }

    /**
     * Export tất cả bộ đề
     * @returns {string} JSON string
     */
    exportAllExams() {
        const exams = this.getAllImportedExams();
        return JSON.stringify({ quizzes: exams }, null, 2);
    }

    /**
     * Import từ JSON string
     * @param {string} jsonString
     * @returns {Object} Result with success and message
     */
    importFromJson(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            // Kiểm tra format
            if (data.quizzes && Array.isArray(data.quizzes)) {
                // Format: { quizzes: [...] }
                return {
                    success: true,
                    exams: data.quizzes,
                    count: data.quizzes.length
                };
            } else if (data.id && data.questions) {
                // Format: single quiz
                return {
                    success: true,
                    exams: [data],
                    count: 1
                };
            } else {
                return {
                    success: false,
                    error: 'Invalid JSON format. Expected { quizzes: [...] } or single quiz object.'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Invalid JSON: ' + error.message
            };
        }
    }

    /**
     * Lưu lịch sử import
     * @param {Object} exam
     */
    addToHistory(exam) {
        try {
            const history = this.getImportHistory();
            history.unshift({
                examId: exam.id,
                examTitle: exam.title,
                timestamp: new Date().toISOString(),
                questionCount: exam.questions?.length || 0
            });

            // Giữ tối đa 50 items
            if (history.length > 50) {
                history.splice(50);
            }

            localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }

    /**
     * Lấy lịch sử import
     * @returns {Array}
     */
    getImportHistory() {
        try {
            const data = localStorage.getItem(this.HISTORY_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading history:', error);
            return [];
        }
    }

    /**
     * Xóa tất cả dữ liệu
     * @returns {boolean}
     */
    clearAll() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.HISTORY_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    /**
     * Lấy thông tin storage
     * @returns {Object}
     */
    getStorageInfo() {
        const exams = this.getAllImportedExams();
        const totalQuestions = exams.reduce((sum, exam) =>
            sum + (exam.questions?.length || 0), 0);

        // Tính size (ước lượng)
        const dataStr = localStorage.getItem(this.STORAGE_KEY) || '';
        const sizeInBytes = new Blob([dataStr]).size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);

        return {
            examCount: exams.length,
            totalQuestions,
            sizeInKB,
            lastImport: this.getImportHistory()[0]?.timestamp || null
        };
    }
}

// Export singleton instance
const storageManager = new StorageManager();

