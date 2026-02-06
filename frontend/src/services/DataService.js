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
            console.error("Upload Error Details:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });

            const serverMsg = error.response?.data?.message;
            if (error.response?.headers && error.response.headers['content-type']?.includes('text/html')) {
                // Extract status to know if it's 404 (Wrong URL), 500 (Server Crash), 413 (Too Large)
                throw new Error(`Upload Failed: Server returned HTML (Status ${error.response.status}). Check Vercel Logs.`);
            }
            throw new Error(serverMsg || error.message || 'Upload failed');
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
