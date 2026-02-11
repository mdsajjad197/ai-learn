import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { dataService } from '../services/DataService';
import { StatCard, Button, FileUploader } from '../components/UI';
import { FileText, Layers, CheckSquare, ArrowRight, Upload, Sparkles, Clock, Search } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(authService.getUser());
    const [stats, setStats] = useState({ documents: 0, flashcards: 0, quizzes: 0 });
    const [recentDocs, setRecentDocs] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [greeting, setGreeting] = useState('Good Morning');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        loadData();
    }, [user, navigate]);

    const loadData = async () => {
        try {
            const currentStats = await dataService.getStats();
            setStats(currentStats);
            const docs = await dataService.getAllDocuments();
            setRecentDocs(docs.slice(0, 6)); // Show top 6
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }
        setUploading(true);
        try {
            await dataService.uploadDocument(selectedFile);
            await loadData();
            setSelectedFile(null);
        } catch (error) {
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 pb-20 relative overflow-hidden font-sans">
            {/* Premium Ambient Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px]" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[40%] left-[20%] w-[20%] h-[20%] bg-purple-500/5 rounded-full blur-[80px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">

                {/* Modern Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                            <Sparkles className="w-3 h-3 text-teal-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400/80">
                                Canopus Engine v4.0
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-heading font-black tracking-tighter leading-tight">
                            {greeting}, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-white to-indigo-400">
                                {user.name.split(' ')[0]}
                            </span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-xl font-medium leading-relaxed">
                            Your cognitive workspace is ready. Transform complex data into crystallized knowledge.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group w-full sm:w-80">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-teal-400 transition-colors">
                                <Search className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400/50 backdrop-blur-xl transition-all placeholder:text-gray-600 font-medium"
                                placeholder="Universal Search..."
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Grid with Glassmorphism */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { title: 'Knowledge Base', value: stats.documents || 0, icon: <FileText className="w-6 h-6" />, color: 'from-teal-400 to-emerald-500' },
                        { title: 'Active Memorization', value: stats.flashcards || 0, icon: <Layers className="w-6 h-6" />, color: 'from-indigo-400 to-purple-500' },
                        { title: 'Intelligence Score', value: stats.quizzes || 0, icon: <CheckSquare className="w-6 h-6" />, color: 'from-pink-400 to-orange-500' }
                    ].map((stat, i) => (
                        <div key={i} className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] overflow-hidden hover:scale-[1.02] transition-all duration-500">
                            <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">{stat.title}</p>
                                <h3 className="text-5xl font-heading font-black tabular-nums">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Content: Recent Documents */}
                    <div className="lg:col-span-8 space-y-10">
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-teal-400">
                                        <Clock size={20} />
                                    </div>
                                    Sync Status
                                </h2>
                                <Link to="/documents" className="text-sm font-bold text-teal-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    Full Repository
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {recentDocs.length > 0 ? recentDocs.map((doc, i) => (
                                    <Link
                                        to={`/document/${doc._id}`}
                                        key={doc._id}
                                        className="group bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/5 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-500 relative overflow-hidden"
                                    >
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                                                    <FileText size={24} />
                                                </div>
                                                <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                    {doc.type?.split('/')[1]?.toUpperCase() || 'DOC'}
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-xl text-white mb-2 group-hover:text-teal-400 transition-colors line-clamp-1">
                                                {doc.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-6 font-medium">
                                                Modified {new Date(doc.createdAt).toLocaleDateString()}
                                            </p>

                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-2">
                                                    <div className="w-8 h-8 rounded-full bg-teal-400/20 border border-gray-950 flex items-center justify-center"><Sparkles size={12} className="text-teal-400" /></div>
                                                    <div className="w-8 h-8 rounded-full bg-indigo-400/20 border border-gray-950 flex items-center justify-center"><Layers size={12} className="text-indigo-400" /></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Modules Ready</span>
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="col-span-2 py-20 text-center bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
                                        <div className="mx-auto h-20 w-20 bg-white/5 rounded-full flex items-center justify-center text-gray-600 mb-6">
                                            <Upload size={32} />
                                        </div>
                                        <h3 className="text-2xl font-black text-white">Repository Empty</h3>
                                        <p className="text-gray-500 max-w-xs mx-auto mt-2 mb-8 font-medium">Initialize your intelligence engine by uploading data.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Interactive Upload Card */}
                        <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-2 border border-white/10 shadow-2xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 relative z-10">
                                <h2 className="text-2xl font-black mb-1">Quick Ingest</h2>
                                <p className="text-gray-400 text-sm font-medium mb-8">Process neural data streams</p>

                                <FileUploader
                                    onFileSelect={handleFileSelect}
                                    selectedFile={selectedFile}
                                />

                                <div className="mt-8">
                                    <button
                                        onClick={handleUpload}
                                        disabled={uploading}
                                        className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-white/5 flex items-center justify-center gap-3"
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                                <span>Analyzing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Initialize</span>
                                                <Sparkles size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Upgrade Promo */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-8 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500">
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10">
                                <CheckSquare className="w-10 h-10 mb-6 text-white/40" />
                                <h3 className="text-2xl font-black leading-tight mb-2">Neural Exam Mode</h3>
                                <p className="text-indigo-100/80 font-medium mb-6 leading-relaxed">Cross-reference multiple documents for holographic study sessions.</p>
                                <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                                    Enable Module
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
