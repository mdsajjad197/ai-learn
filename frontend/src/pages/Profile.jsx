import React, { useEffect, useState } from 'react';
import { authService } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, Shield } from 'lucide-react';
import { Button } from '../components/UI';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authService.getUser();
        if (currentUser) {
            setUser(currentUser);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            authService.logout();
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 animate-fade-in">
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8 border-b pb-4">My Profile</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-emerald-600 h-32 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 bg-white rounded-full p-2 shadow-md">
                            <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User size={40} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                            <div className="flex items-center gap-3 text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <User className="text-teal-500" size={20} />
                                {user?.name || 'N/A'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                            <div className="flex items-center gap-3 text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <Mail className="text-teal-500" size={20} />
                                {user?.email || 'N/A'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Account Role</label>
                            <div className="flex items-center gap-3 text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <Shield className="text-teal-500" size={20} />
                                <span className="capitalize">{user?.role || 'User'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                        <Button
                            text="Sign Out"
                            onClick={handleLogout}
                            variant="danger"
                            icon={<LogOut size={18} />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
