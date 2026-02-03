import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { Button } from '../components/UI';
import { BookOpen, AlertCircle, User, Mail, Phone, Lock, Sparkles } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
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
            await authService.signup(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-slate-900 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-20%] right-[0%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] left-[0%] w-[60%] h-[60%] bg-teal-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-stretch rounded-3xl overflow-hidden shadow-2xl m-4 border border-white/10 backdrop-blur-sm bg-black/40">

                {/* Left Side: Form */}
                <div className="w-full md:w-1/2 bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-3xl font-heading font-bold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-gray-500">Join our community of lifelong learners.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-fade-in">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User size={18} />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium text-gray-700 placeholder-gray-400"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium text-gray-700 placeholder-gray-400"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Phone size={18} />
                                </div>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium text-gray-700 placeholder-gray-400"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Create Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none font-medium text-gray-700 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                text={loading ? 'Creating account...' : 'Create Account'}
                                type="submit"
                                fullWidth
                                disabled={loading}
                                icon={!loading && <Sparkles size={18} />}
                            />
                        </div>

                        <p className="text-xs text-center text-gray-500 mt-6">
                            By joining, you agree to our <a href="#" className="underline hover:text-teal-600">Terms</a> and <a href="#" className="underline hover:text-teal-600">Privacy Policy</a>.
                        </p>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-gray-100">
                        <p className="text-gray-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right Side: Visuals */}
                <div className="hidden md:flex flex-col justify-center w-1/2 p-12 bg-gradient-to-bl from-indigo-900 via-purple-900 to-black relative overflow-hidden text-white">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                    <div className="relative z-10 max-w-md mx-auto">
                        <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 inline-block shadow-xl">
                            <BookOpen className="w-10 h-10 text-indigo-300" />
                        </div>

                        <h2 className="text-4xl font-heading font-bold mb-6 leading-tight">
                            Unlock your learning potential.
                        </h2>

                        <ul className="space-y-4 text-indigo-100">
                            <li className="flex items-start gap-3">
                                <div className="mt-1 p-1 bg-green-500/20 rounded-full text-green-400">
                                    <Sparkles size={14} />
                                </div>
                                <p>Unlimited AI flashcard generation</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 p-1 bg-teal-500/20 rounded-full text-teal-400">
                                    <Sparkles size={14} />
                                </div>
                                <p>Instant document summaries and chats</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 p-1 bg-purple-500/20 rounded-full text-purple-400">
                                    <Sparkles size={14} />
                                </div>
                                <p>Personalized quiz modes to test retention</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
