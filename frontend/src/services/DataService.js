import api from '../api/axios';

/**
 * Data Service Module
 * Handles backend operations via API
 */
export class DataService {

    async getStats() {
        try {
            const response = await api.get('/documents/stats');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch stats", error);
            return { documents: 0, flashcards: 0, quizzes: 0 };
        }
    }

    async getAllDocuments() {
        try {
            const response = await api.get('/documents');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch documents');
        }
    }

    async getDocument(id) {
        try {
            const response = await api.get(`/documents/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch document');
        }
    }

    async deleteDocument(id) {
        try {
            const response = await api.delete(`/documents/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete document');
        }
    }

    async uploadDocument(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Upload failed');
        }
    }

    async getAllFlashcards() {
        try {
            const response = await api.get('/documents/flashcards/all');
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async getFlashcardsForDoc(docId) {
        try {
            const response = await api.get(`/documents/${docId}/flashcards`);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async generateFlashcards(docId) {
        try {
            const response = await api.post(`/documents/${docId}/flashcards`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Generation failed');
        }
    }

    getQuizzesForDoc(docId) {
        // Mock for now or implement backend route
        return [];
    }

    async generateQuiz(docId) {
        const response = await api.post(`/documents/${docId}/quiz`);
        return response.data;
    }

    async saveQuizResult(docId, score, totalQuestions) {
        const response = await api.post(`/documents/${docId}/quiz/result`, { score, totalQuestions });
        return response.data;
    }

    async chat(message, docId) {
        try {
            const response = await api.post(`/documents/${docId}/chat`, { message });
            return response.data.response;
        } catch (error) {
            const serverMessage = error.response?.data?.message || error.message;
            throw new Error('Chat failed: ' + serverMessage);
        }
    }
}

export const dataService = new DataService();
