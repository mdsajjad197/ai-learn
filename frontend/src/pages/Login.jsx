import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { Input, Button } from '../components/UI';
import { BookOpen, AlertCircle, ArrowRight, User, Lock, Mail } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.login(formData.email, formData.password);
            const user = authService.getUser();
            if (user.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (error) {
            setError(error.message || 'Login failed. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-slate-900 overflow-hidden">
            {/* Animated Background Mesh */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-stretch rounded-3xl overflow-hidden shadow-2xl m-4 border border-white/10 backdrop-blur-sm bg-black/40">

                {/* Left Side: Brand & Visuals */}
                <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-teal-900/40 via-gray-900/60 to-black/80 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

                    <Link to="/" className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-xl shadow-lg shadow-teal-500/20">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-heading font-bold text-white tracking-wide">Canopus<span className="text-teal-400">.ai</span></span>
                    </Link>

                    <div className="relative z-10 my-auto">
                        <h1 className="text-5xl font-heading font-extrabold text-white mb-6 leading-tight">
                            Master your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">Materials.</span>
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
                            Canopus transforms your static documents into interactive study sessions with AI-powered flashcards and quizzes.
                        </p>
                    </div>

                    <div className="relative z-10 text-xs text-gray-500 font-medium tracking-wider uppercase">
                        © 2024 Canopus AI Leaning
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full md:w-1/2 bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-3xl font-heading font-bold text-gray-900">Welcome Back</h2>
                        <p className="mt-2 text-gray-500">Enter your credentials to access your workspace.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-fade-in">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-5">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="email"
                                    required
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium text-gray-700 placeholder-gray-400"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium text-gray-700 placeholder-gray-400"
                                />
                            </div>
                        </div>



                        <Button
                            text={loading ? 'Authenticating...' : 'Sign In'}
                            type="submit"
                            fullWidth
                            disabled={loading}
                            variant="primary"
                            icon={!loading && <ArrowRight size={18} />}
                        />
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-bold text-teal-600 hover:text-teal-700 hover:underline transition-all">
                                Create one for free
                            </Link>
                        </p>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Login;
