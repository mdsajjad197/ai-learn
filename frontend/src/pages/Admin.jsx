import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/AdminService';
import { authService } from '../services/AuthService';
import { Button } from '../components/UI';
import { Users, FileText, HardDrive, Trash2, Search, Eye, X, MoreVertical, Shield, Calendar, Download, LogOut, ArrowLeft, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import UserAnalysisCard from '../components/UserAnalysisCard';

const Admin = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, documents: 0, storage: '0 MB' });
    const [users, setUsers] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'documents'
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        loadDashboard();
        const user = authService.getUser();
        setCurrentUser(user);
    }, []);

    const loadDashboard = async () => {
        try {
            const [statsData, usersData, docsData] = await Promise.all([
                adminService.getSystemStats(),
                adminService.getUsers(),
                adminService.getAllDocuments()
            ]);
            setStats(statsData);
            setUsers(usersData);
            setDocuments(docsData);
        } catch (error) {
            console.error("Dashboard load error:", error);
            setError(error.message || "Failed to load admin dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Delete this user? Action cannot be undone.')) {
            try {
                await adminService.deleteUser(id);
                setUsers(users.filter(user => user._id !== id));
                const newStats = await adminService.getSystemStats();
                setStats(newStats);
            } catch (error) {
                alert(error.response?.data?.message || ' delete user');
            }
        }
    };

    const handleDeleteDocument = async (id) => {
        if (window.confirm('Delete this document? Action cannot be undone.')) {
            try {
                await adminService.deleteDocument(id);
                setDocuments(documents.filter(doc => doc._id !== id));
                const newStats = await adminService.getSystemStats();
                setStats(newStats);
            } catch (error) {
                alert('delete document');
            }
        }
    };

    const handleDeleteAllDocuments = async () => {
        if (window.confirm('WARNING: This will delete ALL documents and their flashcards from the ENTIRE system. This action is IRREVERSIBLE. Are you sure?')) {
            try {
                await adminService.deleteAllDocuments();
                setDocuments([]);
                const newStats = await adminService.getSystemStats();
                setStats(newStats);
                alert('System purge complete.');
            } catch (error) {
                alert('Failed to purge system: ' + error.message);
            }
        }
    };

    const handleDownloadDocument = async (doc) => {
        if (!doc) {
            alert('Document not found');
            return;
        }

        try {
            // Use axios to download verify auth token
            const response = await adminService.downloadDocument(doc._id);

            // Create a blob URL from the response
            const url = window.URL.createObjectURL(new Blob([response.data], {
                type: response.headers['content-type'] || doc.type
            }));

            // Create temporary link to trigger download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', doc.name || 'document');
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            alert(`Download failed: ${error.message}`);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.owner && doc.owner.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Modern Stat Card Component
    const ModernStatCard = ({ title, value, icon, color }) => (
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-xl group hover:scale-[1.02] transition-transform duration-300">
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10 bg-gradient-to-br ${color} blur-2xl group-hover:opacity-20 transition-opacity`}></div>
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-4xl font-heading font-extrabold text-gray-900">{value}</h3>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    // Mobile Data Card Component
    const MobileDataCard = ({ data, type }) => {
        const isUser = type === 'user';
        return (
            <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        {isUser ? (
                            <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={data.avatar} alt="" />
                        ) : (
                            <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                <FileText size={20} />
                            </div>
                        )}
                        <div>
                            <h4 className="font-bold text-gray-900 truncate max-w-[150px]">{data.name}</h4>
                            <p className="text-xs text-gray-500">{isUser ? data.email : (data.owner?.name || 'Unknown')}</p>
                        </div>
                    </div>
                    {isUser && (
                        <span className={`px-2 py-1 text-xs font-bold rounded-lg ${data.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                            {data.role}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    {isUser ? (
                        <>
                            <div className="bg-gray-50 p-2 rounded-lg text-center">
                                <span className="block font-bold text-gray-900">{data.documentCount || 0}</span>
                                <span className="text-xs">Docs</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg text-center">
                                <span className="block font-bold text-gray-900">{data.flashcardCount || 0}</span>
                                <span className="text-xs">Cards</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-gray-50 p-2 rounded-lg">
                                <span className="text-xs text-gray-400 block">Size</span>
                                <span className="font-medium">{data.size || 'N/A'}</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg">
                                <span className="text-xs text-gray-400 block">Date</span>
                                <span className="font-medium">{new Date(data.createdAt).toLocaleDateString()}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex gap-2 w-full">
                    {isUser && (
                        <button
                            onClick={() => setSelectedUser(data)}
                            className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 font-medium text-sm hover:bg-blue-100 transition-colors"
                        >
                            View Details
                        </button>
                    )}

                    {(!isUser || (currentUser && currentUser._id !== data._id)) && (
                        <button
                            onClick={() => isUser ? handleDeleteUser(data._id) : handleDeleteDocument(data._id)}
                            className={`flex-1 py-2 rounded-xl ${isUser ? 'bg-white border border-gray-200' : 'bg-red-50 text-red-600'} font-medium text-sm hover:bg-red-50 hover:text-red-600 text-gray-600 transition-colors`}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                <p className="text-gray-500 font-medium">Loading Dashboard...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <X size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <Button text="Try Again" onClick={() => { setError(null); setLoading(true); loadDashboard(); }} variant="primary" fullWidth />
                <button onClick={() => navigate('/admin/login')} className="mt-4 text-gray-500 font-bold hover:underline text-xs uppercase tracking-widest">Back to Admin Login</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans">
            {/* Command Center Ambient Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Global Command Header */}
                <div className="mb-12 animate-fade-in-up flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">
                                Global Oversight Active
                            </span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl font-heading font-black tracking-tighter text-white">
                            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-500">Dashboard</span>
                        </h1>
                        <div className="flex items-center gap-6">
                            <p className="text-gray-500 font-medium">Platform Matrix V2.8</p>
                        </div>
                    </div>


                </div>

                {/* Critical Metrics Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="relative group bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] overflow-hidden hover:bg-white/[0.08] transition-all">
                        <div className="absolute top-0 right-0 p-8 text-purple-500/20 group-hover:text-purple-500/40 transition-colors">
                            <Users size={80} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Total Entities</p>
                            <h3 className="text-6xl font-heading font-black tabular-nums">{stats.users}</h3>
                            <div className="mt-8 flex items-center gap-2 text-purple-400 text-xs font-bold font-mono">
                                <span className="px-2 py-0.5 bg-purple-400/10 rounded tracking-tighter">+8.2% Growth</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative group bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] overflow-hidden hover:bg-white/[0.08] transition-all">
                        <div className="absolute top-0 right-0 p-8 text-orange-500/20 group-hover:text-orange-500/40 transition-colors">
                            <FileText size={80} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Neural Assets</p>
                            <h3 className="text-6xl font-heading font-black tabular-nums">{stats.documents || 0}</h3>
                            <div className="mt-8 flex items-center gap-2 text-orange-400 text-xs font-bold font-mono">
                                <span className="px-2 py-0.5 bg-orange-400/10 rounded tracking-tighter">Verified Blocks</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative group bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] overflow-hidden hover:bg-white/[0.08] transition-all">
                        <div className="absolute top-0 right-0 p-8 text-purple-500/20 group-hover:text-purple-500/40 transition-colors">
                            <HardDrive size={80} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Data Footprint</p>
                            <h3 className="text-6xl font-heading font-black tabular-nums tracking-tighter truncate">{stats.storage || '0 MB'}</h3>
                            <div className="mt-8 flex items-center gap-2 text-purple-400 text-xs font-bold font-mono">
                                <span className="px-2 py-0.5 bg-purple-400/10 rounded tracking-tighter">Optimal Distribution</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytical Visualizer */}
                <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-10 mb-12 animate-fade-in-up delay-150 relative group">
                    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center text-purple-400"><Layers size={18} /></div>
                            Activity Flux
                        </h3>
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            Real-time Intelligence
                        </div>
                    </div>
                    <div className="h-80 w-full px-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={(users || []).filter(u => u && u.name).sort((a, b) => (b.documentCount || 0) - (a.documentCount || 0)).slice(0, 10)}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#f97316" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 700 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                                />
                                <Bar dataKey="documentCount" name="Assets" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Unified Management Terminal */}
                <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden animate-fade-in-up delay-200">
                    {/* Controller Bar */}
                    <div className="px-10 py-8 border-b border-white/5 flex flex-col md:flex-row justify-between gap-6 items-center bg-white/[0.02]">
                        <div className="flex bg-black/40 p-1.5 rounded-2xl w-full md:w-auto">
                            {['users', 'documents'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); setSearchTerm(''); }}
                                    className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === tab
                                        ? 'bg-white text-black shadow-2xl'
                                        : 'text-gray-500 hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {activeTab === 'documents' && (
                                <button
                                    onClick={handleDeleteAllDocuments}
                                    className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl font-black uppercase tracking-wider text-[10px] transition-all flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Trash2 size={14} /> Purge All
                                </button>
                            )}
                            <div className="relative w-full md:w-96 group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder={`Filter ${activeTab} matrix...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all font-bold placeholder:text-gray-600 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Matrix View */}
                    <div className="hidden sm:block overflow-x-auto min-h-[500px]">
                        <table className="w-full">
                            <thead className="bg-white/[0.03] border-b border-white/5">
                                <tr>
                                    {activeTab === 'users' ? (
                                        <>
                                            <th className="px-10 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Identity Node</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Security Role</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Neural Load</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Initialization</th>
                                            <th className="px-10 py-6 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">- Ops -</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-10 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Asset Signature</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Origin Source</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Data Volume</th>
                                            <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Timestamp</th>
                                            <th className="px-10 py-6 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">- Ops -</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {(activeTab === 'users' ? filteredUsers : filteredDocuments).map((item) => (
                                    <tr key={item._id} className="group hover:bg-white/[0.03] transition-colors">
                                        {activeTab === 'users' ? (
                                            <>
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="relative">
                                                            <img className="h-12 w-12 rounded-2xl border border-white/10 object-cover" src={item.avatar} alt="" />
                                                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${item.role === 'admin' ? 'bg-purple-500' : 'bg-orange-500'}`}></div>
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{item.name}</div>
                                                            <div className="text-xs text-gray-600 font-bold">{item.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase ${item.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                                                        {item.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex gap-4 text-[10px] font-black font-mono">
                                                        <span className="text-gray-500"><span className="text-white">{item.documentCount || 0}</span> Assets</span>
                                                        <span className="text-gray-500"><span className="text-white">{item.flashcardCount || 0}</span> Cards</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-xs text-gray-600 font-bold font-mono uppercase tracking-tighter">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => setSelectedUser(item)} className="flex items-center gap-2 px-4 py-2 bg-white/5 text-purple-400 hover:bg-purple-500 hover:text-white rounded-xl transition-all group/btn">
                                                            <Layers size={16} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest hidden xl:inline-block">Analyze</span>
                                                        </button>
                                                        <button onClick={() => handleDeleteUser(item._id)} className="p-3 bg-white/5 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-orange-400 border border-white/5 group-hover:scale-110 transition-transform">
                                                            <FileText size={24} />
                                                        </div>
                                                        <div className="font-black text-white group-hover:text-orange-400 transition-colors uppercase tracking-tight truncate max-w-[200px]">{item.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-xs font-bold text-white uppercase tracking-tight">{item.owner?.name || 'Unknown Entity'}</div>
                                                    <div className="text-[10px] text-gray-600 font-mono italic">{item.owner?.email}</div>
                                                </td>
                                                <td className="px-8 py-6 text-[10px] font-black font-mono text-gray-500 uppercase">{item.size || 'N/A DATA'}</td>
                                                <td className="px-8 py-6 text-[10px] text-gray-600 font-bold uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString()}</td>
                                                <td className="px-10 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleDownloadDocument(item)} className="p-3 bg-white/5 text-purple-400 hover:bg-purple-400 hover:text-black rounded-xl transition-all">
                                                            <Download size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteDocument(item._id)} className="p-3 bg-white/5 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Grid Redesign */}
                    <div className="sm:hidden p-6 space-y-4">
                        {(activeTab === 'users' ? filteredUsers : filteredDocuments).map(item => (
                            <div key={item._id} className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                <div className="flex gap-4 mb-6">
                                    {activeTab === 'users' ? (
                                        <img className="h-12 w-12 rounded-2xl object-cover" src={item.avatar} alt="" />
                                    ) : (
                                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-orange-400"><FileText /></div>
                                    )}
                                    <div className="min-w-0">
                                        <h4 className="font-black text-white uppercase tracking-tight truncate">{item.name}</h4>
                                        <p className="text-[10px] text-gray-500 font-bold truncate uppercase">{activeTab === 'users' ? item.email : (item.owner?.name || 'Unknown')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 mb-6">
                                    <div className="flex-1 bg-black/40 p-3 rounded-2xl text-center">
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-xs font-black text-orange-400">ACTIVE</p>
                                    </div>
                                    <div className="flex-1 bg-black/40 p-3 rounded-2xl text-center">
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Pulse</p>
                                        <p className="text-xs font-black text-white">{activeTab === 'users' ? (item.documentCount || 0) : (item.size || '0 MB')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => activeTab === 'users' ? setSelectedUser(item) : handleDownloadDocument(item)} className="flex-1 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px]">
                                        {activeTab === 'users' ? 'Analyze' : 'Download'}
                                    </button>
                                    <button onClick={() => activeTab === 'users' ? handleDeleteUser(item._id) : handleDeleteDocument(item._id)} className="flex-1 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase tracking-widest text-[10px]">Purge</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Matrix Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
                    <UserAnalysisCard
                        user={selectedUser}
                        onClose={() => setSelectedUser(null)}
                        onDelete={handleDeleteUser}
                    />
                </div>
            )}

            {/* Removed View Document Modal */}
        </div>
    );
};

export default Admin;
