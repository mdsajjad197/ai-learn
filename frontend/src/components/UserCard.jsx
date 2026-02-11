import React from 'react';
import { User, Mail, Phone, Shield } from 'lucide-react';

const UserCard = ({ user, className = "" }) => {
    if (!user) return null;

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}>
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 h-24 sm:h-32 relative">
                <div className="absolute -bottom-10 sm:-bottom-12 left-6 sm:left-8">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full p-1.5 sm:p-2 shadow-md">
                        <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={32} className="sm:w-10 sm:h-10" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-14 sm:pt-16 pb-6 px-6 sm:px-8">
                <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{user.name || 'User'}</h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Shield size={14} className="text-teal-500" />
                        <span className="capitalize">{user.role || 'Member'}</span>
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100/50 hover:border-teal-100 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
                            <Mail size={16} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{user.email || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100/50 hover:border-teal-100 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
                            <Phone size={16} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Phone</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{user.phone || 'Not Verified'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
