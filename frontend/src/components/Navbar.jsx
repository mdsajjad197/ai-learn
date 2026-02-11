import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { BookOpen, Menu, X, Rocket, Layout, User as UserIcon, LogOut, ChevronDown, Layers, FileText } from 'lucide-react';

export const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const navLinkClass = (path) => `
        relative px-3 py-2 text-sm font-medium transition-colors duration-200
        ${location.pathname === path
            ? 'text-teal-400'
            : 'text-gray-300 hover:text-white'}
    `;

    return (
        <nav
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
                ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
                : 'bg-gradient-to-r from-gray-900 via-gray-900/90 to-black/90 backdrop-blur-md border-b border-white/5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center group">
                        <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-300 rounded-xl flex items-center justify-center text-black shadow-lg shadow-white/10 group-hover:shadow-white/20 transition-shadow duration-300">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <span className="ml-3 font-heading font-bold text-xl tracking-tight text-white">
                            Canopus<span className="text-teal-400">.ai</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center space-x-1">
                        {user ? (
                            <>
                                <div className="flex items-center bg-white/5 rounded-full px-2 py-1 border border-white/10 mr-4">
                                    {user.role !== 'admin' && (
                                        <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                                            Dashboard
                                        </Link>
                                    )}
                                    {user.role !== 'admin' && (
                                        <Link to="/documents" className={navLinkClass('/documents')}>
                                            Documents
                                        </Link>
                                    )}
                                    {user.role !== 'admin' && (
                                        <Link to="/flashcards" className={navLinkClass('/flashcards')}>
                                            Flashcards
                                        </Link>
                                    )}
                                </div>
                                <div className="text-[10px] text-teal-400 font-mono px-2 hidden sm:block">
                                    {user.email} | {user.role}
                                </div>

                                <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="text-right hidden lg:block">
                                            <div className="text-sm font-bold text-white">{user.name}</div>
                                            <div className="text-xs text-gray-400 font-medium capitalize">{user.role || 'Student'}</div>
                                        </div>
                                        <Link to="/profile" className="relative group">
                                            <img
                                                className="h-10 w-10 rounded-full border-2 border-transparent group-hover:border-teal-400 transition-colors object-cover ring-2 ring-white/10"
                                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0d9488&color=fff`}
                                                alt={user.name}
                                            />
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
                                        </Link>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                        <span className="text-sm font-medium">Sign Out</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</Link>
                                <Link to="/signup" className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 border border-white/10">
                                    <span>Get Started</span>
                                    <Rocket size={16} />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute w-full bg-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className="px-4 pt-2 pb-6 space-y-2">
                    {user ? (
                        <>
                            <div className="flex items-center gap-4 p-4 mb-4 bg-white/5 rounded-xl border border-white/5">
                                <img
                                    className="h-12 w-12 rounded-full border border-white/10"
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                                    alt=""
                                />
                                <div>
                                    <div className="font-bold text-white">{user.name}</div>
                                    <div className="text-sm text-gray-400">{user.email}</div>
                                </div>
                            </div>

                            {user.role !== 'admin' && (
                                <>
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-colors font-medium">
                                        <Layout size={20} /> Dashboard
                                    </Link>
                                    <Link to="/documents" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-colors font-medium">
                                        <FileText size={20} /> Documents
                                    </Link>
                                    <Link to="/flashcards" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-colors font-medium">
                                        <Layers size={20} /> Flashcards
                                    </Link>
                                </>
                            )}
                            <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-colors font-medium">
                                <UserIcon size={20} /> My Profile
                            </Link>

                            <div className="border-t border-white/10 my-2 pt-2">
                                <button
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                                >
                                    <LogOut size={20} /> Sign out
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="grid gap-3 p-4">
                            <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-3 font-bold text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
                                Log in
                            </Link>
                            <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full text-center py-3 bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 active:scale-95 transition-all">
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
