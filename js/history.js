// History Manager - Quản lý lịch sử làm bài
class HistoryManager {
    constructor() {
        this.HISTORY_KEY = 'jpn_quiz_history';
    }

    /**
     * Lưu kết quả làm bài
     * @param {Object} result
     */
    saveHistory(result) {
        try {
            const history = this.getHistory();

            const record = {
                id: Date.now(),
                quizId: result.quizId,
                quizTitle: result.quizTitle,
                mode: result.mode, // 'practice' or 'test'
                score: result.score,
                totalScore: result.totalScore,
                correctCount: result.correctCount,
                totalQuestions: result.totalQuestions,
                percentage: result.percentage,
                duration: result.duration, // Thời gian làm bài thực tế (seconds)
                timestamp: new Date().toISOString(),
                answers: result.answers // Array of user answers
            };

            history.unshift(record);

            // Giữ tối đa 100 records
            if (history.length > 100) {
                history.splice(100);
            }

            localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
            return true;
        } catch (error) {
            console.error('Error saving history:', error);
            return false;
        }
    }

    /**
     * Lấy toàn bộ lịch sử
     * @returns {Array}
     */
    getHistory() {
        try {
            const data = localStorage.getItem(this.HISTORY_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading history:', error);
            return [];
        }
    }

    /**
     * Lấy lịch sử của một quiz cụ thể
     * @param {string} quizId
     * @returns {Array}
     */
    getQuizHistory(quizId) {
        const history = this.getHistory();
        return history.filter(h => h.quizId === quizId);
    }

    /**
     * Lấy thống kê tổng quan
     * @returns {Object}
     */
    getStatistics() {
        const history = this.getHistory();

        if (history.length === 0) {
            return {
                totalAttempts: 0,
                averageScore: 0,
                bestScore: 0,
                totalQuestions: 0
            };
        }

        const totalScore = history.reduce((sum, h) => sum + h.percentage, 0);
        const bestScore = Math.max(...history.map(h => h.percentage));
        const totalQuestions = history.reduce((sum, h) => sum + h.totalQuestions, 0);

        return {
            totalAttempts: history.length,
            averageScore: (totalScore / history.length).toFixed(1),
            bestScore: bestScore.toFixed(1),
            totalQuestions
        };
    }

    /**
     * Xóa một record
     * @param {number} id
     * @returns {boolean}
     */
    deleteRecord(id) {
        try {
            const history = this.getHistory();
            const filtered = history.filter(h => h.id !== id);
            localStorage.setItem(this.HISTORY_KEY, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting record:', error);
            return false;
        }
    }

    /**
     * Xóa toàn bộ lịch sử
     * @returns {boolean}
     */
    clearAll() {
        try {
            localStorage.removeItem(this.HISTORY_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing history:', error);
            return false;
        }
    }
}

// Export singleton
const historyManager = new HistoryManager();

