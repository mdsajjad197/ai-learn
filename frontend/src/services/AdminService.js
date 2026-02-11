import api from '../api/axios';

/**
 * Admin Service Module
 * Handles admin-related API calls
 */
export class AdminService {
    async getUsers() {
        try {
            const response = await api.get('/admin/users');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch users');
        }
    }

    async deleteUser(userId) {
        try {
            await api.delete(`/admin/users/${userId}`);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete user');
        }
    }

    async getSystemStats() {
        try {
            const response = await api.get('/admin/stats');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch system stats');
        }
    }

    async getAllDocuments() {
        try {
            const response = await api.get('/admin/documents');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch documents');
        }
    }

    async getDocument(id) {
        try {
            const response = await api.get(`/admin/documents/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch document details');
        }
    }

    async deleteAllDocuments() {
        try {
            const response = await api.delete('/admin/documents');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete all documents');
        }
    }

    async deleteDocument(docId) {
        try {
            await api.delete(`/admin/documents/${docId}`);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete document');
        }
    }

    async downloadDocument(docId) {
        try {
            const response = await api.get(`/documents/${docId}/content`, {
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to download document');
        }
    }
}

export const adminService = new AdminService();
