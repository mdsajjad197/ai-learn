import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const API_URL = 'http://localhost:5000/api';

const checkStats = async () => {
    try {
        // 1. Login as Admin
        // Assuming default admin or one from previous logs. 
        // Based on Login.jsx, there is a demo admin: admin@edu.ai / password
        // Or I can use 'admin' / 'admin123' if that's what created-admin.js made.
        // Let's try 'admin@edu.ai' first as per Login page.

        let token;
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'admin@edu.ai',
                password: 'password'
            });
            token = loginRes.data.token;
        } catch (e) {
            console.log("admin@edu.ai failed, trying admin/admin123");
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'admin',
                password: 'admin123'
            });
            token = loginRes.data.token;
        }

        // 2. Fetch Users
        const usersRes = await axios.get(`${API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(JSON.stringify(usersRes.data, null, 2));

    } catch (error) {
        console.error('Error:', error.response?.data?.message || error.message);
    }
};

checkStats();
