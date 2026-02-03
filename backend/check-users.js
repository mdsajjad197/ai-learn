import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const API_URL = 'http://localhost:5000/api';

const checkUsers = async () => {
    try {
        // 1. Login as Admin
        console.log('Logging in as Admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin',
            password: 'admin123'
        });
        const token = loginRes.data.token;
        console.log('Login successful.');

        // 2. Fetch Users
        console.log('Fetching Users...');
        const usersRes = await axios.get(`${API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`Successfully fetched ${usersRes.data.length} users.`);
        usersRes.data.forEach(u => console.log(` - ${u.name} (${u.email}) [${u.role}]`));

    } catch (error) {
        console.error('Error:', error.response?.data?.message || error.message);
    }
};

checkUsers();
