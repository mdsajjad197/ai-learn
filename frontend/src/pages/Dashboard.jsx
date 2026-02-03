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
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-20 relative overflow-hidden">
            {/* Ambient Background Mesh */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-50/80 to-transparent -z-10"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-20 -left-20 w-72 h-72 bg-teal-100/50 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">

                {/* Modern Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-white/60 backdrop-blur-sm border border-black/5 rounded-full text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Canopus AI Companion
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900 tracking-tight">
                            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600 block sm:inline">{user.name.split(' ')[0]}</span>
                        </h1>
                        <p className="mt-2 text-lg text-gray-500 max-w-xl">
                            Ready to transform your documents into interactive study materials?
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative group w-full sm:w-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-64 shadow-sm transition-all"
                                placeholder="Search documents..."
                            />
                        </div>
                        <Button
                            text="Flashcards"
                            variant="outline"
                            onClick={() => navigate('/flashcards')}
                            icon={<Layers size={18} />}
                            className="w-full sm:w-auto justify-center"
                        />
                    </div>
                </div>

                {/* Stats Grid with Modern Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard
                        title="Active Documents"
                        value={stats.documents || 0}
                        icon={<FileText className="w-6 h-6" />}
                        gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                    />
                    <StatCard
                        title="Study Sets Created"
                        value={stats.flashcards || 0}
                        icon={<Layers className="w-6 h-6" />}
                        gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
                    />
                    <StatCard
                        title="Knowledge Checks"
                        value={stats.quizzes || 0}
                        icon={<CheckSquare className="w-6 h-6" />}
                        gradient="bg-gradient-to-br from-orange-400 to-pink-500"
                    />

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Content: Recent Documents */}
                    <div className="lg:col-span-8 space-y-8">
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                                        <Clock size={18} />
                                    </div>
                                    Recent Activity
                                </h2>
                                <Link to="/documents" className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1 group">
                                    View Library
                                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {recentDocs.length > 0 ? recentDocs.map((doc, i) => (
                                    <Link
                                        to={`/document/${doc._id}`}
                                        key={doc._id}
                                        className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:border-teal-100 transition-all duration-300 relative overflow-hidden"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-bl-full -mr-4 -mt-4 transition-colors group-hover:from-teal-50 group-hover:to-teal-100"></div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-teal-500 group-hover:text-white group-hover:border-teal-400 transition-all duration-300 shadow-sm">
                                                    <FileText size={20} />
                                                </div>
                                                <span className="px-2 py-1 bg-white/80 backdrop-blur text-xs font-semibold text-gray-500 rounded-md shadow-sm border border-gray-100">
                                                    {doc.type?.split('/')[1]?.toUpperCase() || 'DOC'}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-teal-700 transition-colors line-clamp-1">
                                                {doc.name}
                                            </h3>
                                            <p className="text-sm text-gray-400 mb-4">
                                                Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                                                <span className="flex items-center gap-1 hover:text-teal-600 transition-colors">
                                                    <Sparkles size={12} /> AI Chat
                                                </span>
                                                <span className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                                                    <Layers size={12} /> Flashcards
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="col-span-2 py-16 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                        <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                            <Upload size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">No documents yet</h3>
                                        <p className="text-gray-500 max-w-xs mx-auto mt-2 mb-6">Upload your first document to unlock AI-powered study tools.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Interactive Upload Card */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-1 border border-gray-100">
                            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-t-xl p-6 text-white text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="20" cy="20" r="50" fill="white" />
                                        <circle cx="80" cy="80" r="30" fill="white" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold relative z-10">Quick Upload</h2>
                                <p className="text-teal-100 text-sm mt-1 relative z-10">Generate study materials instantly</p>
                            </div>

                            <div className="p-6">
                                <FileUploader
                                    onFileSelect={handleFileSelect}
                                    selectedFile={selectedFile}
                                />

                                <div className="mt-6">
                                    <Button
                                        text={uploading ? 'Analyzing Document...' : 'Upload & Process'}
                                        fullWidth
                                        onClick={handleUpload}
                                        disabled={uploading}
                                        variant={uploading ? "outline" : "primary"}
                                        icon={!uploading && <Sparkles size={18} />}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Feature Promo Card */}
                        <div className="glass-card bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden group">
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="flex items-start gap-4 text-left">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                                    <CheckSquare size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Exam Mode</h3>
                                    <p className="text-sm text-gray-500 mt-1 mb-3">Generate practice exams from multiple documents at once.</p>
                                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group/btn">
                                        Start Exam <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
