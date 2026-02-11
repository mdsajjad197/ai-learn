import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { Button } from '../components/UI';
import { Shield, Lock, User, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const user = await authService.login(credentials.email, credentials.password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                setError('Unauthorized: Admin access required.');
                authService.logout(false);
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md animate-fade-in-up">
                {/* Logo & Branding */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white to-gray-400 rounded-3xl shadow-2xl shadow-white/5 mb-6 group">
                        <Shield className="w-10 h-10 text-black group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h1 className="text-4xl font-heading font-extrabold text-white tracking-tight mb-2">
                        Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Center</span>
                    </h1>
                    <p className="text-gray-400 font-medium">Restricted Administrative Access</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-3xl shadow-black/50 overflow-hidden relative">
                    {/* Decorative Edge Glow */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent"></div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-shake">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                                <p className="text-sm font-bold text-red-200">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within:text-teal-400 text-gray-400 transition-colors">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    name="email"
                                    type="text"
                                    required
                                    value={credentials.email}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400 transition-all font-medium"
                                    placeholder="Admin Identifier"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none group-focus-within:text-indigo-400 text-gray-400 transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={credentials.password}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all font-medium"
                                    placeholder="Management Password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full group relative overflow-hidden py-5 rounded-2xl bg-white text-black font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-white/5"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? 'Authenticating System...' : (
                                    <>
                                        Authorize Access <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-white text-sm font-bold flex items-center justify-center gap-2 mx-auto transition-colors"
                        >
                            <BookOpen className="w-4 h-4" /> Return to Platform
                        </button>
                    </div>
                </div>

                {/* System Status Footer */}
                <div className="mt-8 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Mainframe Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full opacity-50"></div>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Security Layer V2.4</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
