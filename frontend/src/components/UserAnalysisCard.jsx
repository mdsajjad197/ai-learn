import React from 'react';
import { Shield, Calendar, FileText, Layers, X, Trash2, Mail, Phone, User } from 'lucide-react';

const UserAnalysisCard = ({ user, onClose, onDelete, className = "" }) => {
    if (!user) return null;

    return (
        <div className={`bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative animate-scale-in ${className}`}>
            {/* Ambient Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-20 p-2.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all backdrop-blur-sm"
            >
                <X size={20} />
            </button>

            {/* Header Section */}
            <div className="relative h-48 bg-gradient-to-br from-purple-900/40 to-black p-8 flex items-end">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10 flex gap-6 items-end w-full">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-[2rem] p-1 bg-gradient-to-br from-purple-500 to-orange-500 shadow-xl">
                            <img
                                className="w-full h-full rounded-[1.8rem] object-cover bg-black"
                                src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                alt={user.name}
                            />
                        </div>
                        <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center ${user.role === 'admin' ? 'bg-purple-500' : 'bg-orange-500'}`}>
                            <Shield size={10} className="text-black fill-current" />
                        </div>
                    </div>

                    <div className="mb-1 flex-1 min-w-0">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter truncate leading-none mb-1.5">{user.name}</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <span className="truncate">{user.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/5 hover:bg-white/[0.05] transition-colors group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 group-hover:text-purple-300 transition-colors">
                                <FileText size={18} />
                            </div>
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Assets</span>
                        </div>
                        <div className="text-3xl font-heading font-black text-white">{user.documentCount || 0}</div>
                        <p className="text-[10px] text-gray-500 font-medium">Uploaded Docs</p>
                    </div>

                    <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/5 hover:bg-white/[0.05] transition-colors group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400 group-hover:text-orange-300 transition-colors">
                                <Layers size={18} />
                            </div>
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Memory</span>
                        </div>
                        <div className="text-3xl font-heading font-black text-white">{user.flashcardCount || 0}</div>
                        <p className="text-[10px] text-gray-500 font-medium">Flashcards Gen</p>
                    </div>
                </div>

                {/* Details List */}
                <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                                <Shield size={14} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Identity ID</p>
                                <p className="text-xs font-mono font-bold text-gray-300">{user._id?.substring(0, 16)}...</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                                <Calendar size={14} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Inception Date</p>
                                <p className="text-xs font-bold text-gray-300">{new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onClose}
                        className="py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                    >
                        Dismiss Analysis
                    </button>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(user._id)}
                            className="py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <Trash2 size={14} /> Terminate
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserAnalysisCard;
