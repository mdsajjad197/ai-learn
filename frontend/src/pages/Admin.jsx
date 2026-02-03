import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/AdminService';
import { authService } from '../services/AuthService';
import { Button } from '../components/UI';
import { Users, FileText, HardDrive, Trash2, Search, Eye, X, MoreVertical, Shield, Calendar, Download, LogOut } from 'lucide-react';

const Admin = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, documents: 0, storage: '0 MB' });
    const [users, setUsers] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Delete this user? Action cannot be undone.')) {
            try {
                await adminService.deleteUser(id);
                setUsers(users.filter(user => user._id !== id));
                const newStats = await adminService.getStats();
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
                const newStats = await adminService.getStats();
                setStats(newStats);
            } catch (error) {
                alert('delete document');
            }
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
                            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[100px]"></div>
                <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-teal-200/40 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-indigo-200/40 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-10 animate-fade-in-up flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-500 mt-2 text-lg">Platform overview and management.</p>
                    </div>
                    <button
                        onClick={() => { authService.logout(); navigate('/login'); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all group"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>

                {/* Functionality: Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in-up delay-100">
                    <ModernStatCard
                        title="Total Users"
                        value={stats.users}
                        icon={<Users size={24} />}
                        color="from-blue-500 to-blue-600"
                    />
                    <ModernStatCard
                        title="Documents"
                        value={stats.documents || 0}
                        icon={<FileText size={24} />}
                        color="from-teal-500 to-emerald-600"
                    />
                    <ModernStatCard
                        title="Storage"
                        value={stats.storage || '0 MB'}
                        icon={<HardDrive size={24} />}
                        color="from-purple-500 to-indigo-600"
                    />
                </div>

                {/* Main Content Card */}
                <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 overflow-hidden animate-fade-in-up delay-200">
                    {/* Toolbar */}
                    <div className="p-6 border-b border-gray-100/50 flex flex-col sm:flex-row justify-between gap-4 items-center bg-white/40">
                        {/* Toggle Tabs */}
                        <div className="flex bg-gray-100/80 p-1.5 rounded-2xl w-full sm:w-auto">
                            {['users', 'documents'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200 ${activeTab === tab
                                        ? 'bg-white text-gray-900 shadow-md transform scale-100'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full sm:w-72 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors w-5 h-5" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Desktop Table View (Hidden on Mobile) */}
                    <div className="hidden sm:block overflow-x-auto min-h-[400px]">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    {activeTab === 'users' ? (
                                        <>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stats</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                                            <th className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">File</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Owner</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Size</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Uploaded</th>
                                            <th className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {(activeTab === 'users' ? filteredUsers : filteredDocuments).map((item) => (
                                    <tr key={item._id} className="group hover:bg-teal-50/30 transition-colors">
                                        {activeTab === 'users' ? (
                                            <>
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <img className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover" src={item.avatar} alt="" />
                                                        <div>
                                                            <div className="font-bold text-gray-900">{item.name}</div>
                                                            <div className="text-xs text-gray-500">{item.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                                        {item.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2 text-xs font-medium text-gray-500">
                                                        <span className="px-2 py-1 bg-gray-100 rounded-lg" title="Documents"><FileText size={12} className="inline mr-1" />{item.documentCount || 0}</span>
                                                        <span className="px-2 py-1 bg-gray-100 rounded-lg" title="Flashcards"><Shield size={12} className="inline mr-1" />{item.flashcardCount || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => setSelectedUser(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="View Details">
                                                            <Eye size={18} />
                                                        </button>
                                                        {currentUser && currentUser._id !== item._id && (
                                                            <button onClick={() => handleDeleteUser(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Delete">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div className="font-bold text-gray-900 truncate max-w-[200px]">{item.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.owner?.name || 'Unknown'}</div>
                                                    <div className="text-xs text-gray-500">{item.owner?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-mono text-gray-500">{item.size || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                                                <td className="px-8 py-4 text-right">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleDeleteDocument(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                                {(activeTab === 'users' ? filteredUsers : filteredDocuments).length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12 text-gray-400">
                                            No {activeTab} found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View (Visible < 640px) */}
                    <div className="sm:hidden p-4 bg-gray-50/50 min-h-[300px]">
                        {(activeTab === 'users' ? filteredUsers : filteredDocuments).length > 0 ? (
                            (activeTab === 'users' ? filteredUsers : filteredDocuments).map(item => (
                                <MobileDataCard key={item._id} data={item} type={activeTab === 'users' ? 'user' : 'document'} />
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400">No results found</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modern User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-scale-in">
                        <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 z-10 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors">
                            <X size={20} />
                        </button>

                        <div className="h-32 bg-gradient-to-r from-teal-500 to-blue-600 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                        </div>

                        <div className="px-8 pb-8">
                            <div className="relative -mt-16 mb-4 flex justify-between items-end">
                                <img className="h-32 w-32 rounded-3xl border-4 border-white shadow-xl bg-white object-cover" src={selectedUser.avatar} alt="" />
                                <span className={`mb-2 px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-lg ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                    {selectedUser.role}
                                </span>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                                <p className="text-gray-500 font-medium">{selectedUser.email}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center group hover:border-teal-200 transition-colors">
                                    <div className="text-3xl font-bold text-gray-900 mb-1">{selectedUser.documentCount || 0}</div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-teal-600">Documents</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center group hover:border-purple-200 transition-colors">
                                    <div className="text-3xl font-bold text-gray-900 mb-1">{selectedUser.flashcardCount || 0}</div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-purple-600">Flashcards</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                    <span className="flex items-center gap-2 text-gray-500 text-sm font-medium"><Shield size={16} /> User ID</span>
                                    <span className="text-gray-900 text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200">{selectedUser._id}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                    <span className="flex items-center gap-2 text-gray-500 text-sm font-medium"><Calendar size={16} /> Joined</span>
                                    <span className="text-gray-900 text-sm font-bold">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Button text="Close Profile" fullWidth variant="outline" onClick={() => setSelectedUser(null)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
