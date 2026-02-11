import React from 'react';
import { User, Mail, Shield, Activity, HardDrive, Cpu, Wifi } from 'lucide-react';

const AdminProfileCard = ({ user }) => {
    return (
        <div className="relative group w-full max-w-4xl mx-auto transform transition-all hover:scale-[1.005]">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative bg-gray-900 rounded-2xl p-6 sm:p-10 border border-gray-800 shadow-2xl overflow-hidden">

                {/* Background Grid & Effects */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-white">

                    {/* Avatar Section */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full animate-spin-slow opacity-70 blur-md"></div>
                            <div className="relative w-full h-full p-1 bg-gray-900 rounded-full">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Admin" className="w-full h-full rounded-full object-cover border-4 border-gray-800" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center border-4 border-gray-700">
                                        <User size={48} className="text-cyan-400" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-gray-900 shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                        </div>
                        <div className="mt-4 px-3 py-1 bg-cyan-950/50 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-mono tracking-widest uppercase flex items-center gap-2">
                            <Shield size={12} />
                            Administrator
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 w-full text-center md:text-left">
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 font-heading">
                            {user?.name}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 mb-8 text-gray-400">
                            <div className="flex items-center gap-1.5 text-sm">
                                <Mail size={14} className="text-blue-400" />
                                {user?.email}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm">
                                <Wifi size={14} className="text-green-400" />
                                <span className="text-green-400/80 font-mono">ONLINE</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-colors group/stat">
                                <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs font-mono uppercase">
                                    <Activity size={12} className="text-cyan-400" />
                                    System Level
                                </div>
                                <div className="text-2xl font-bold text-white group-hover/stat:text-cyan-400 transition-colors">Root Access</div>
                            </div>

                            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-colors group/stat">
                                <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs font-mono uppercase">
                                    <Cpu size={12} className="text-purple-400" />
                                    Role
                                </div>
                                <div className="text-2xl font-bold text-white group-hover/stat:text-purple-400 transition-colors">Super Admin</div>
                            </div>

                            <div className="col-span-2 lg:col-span-1 bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-colors group/stat">
                                <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs font-mono uppercase">
                                    <HardDrive size={12} className="text-blue-400" />
                                    Status
                                </div>
                                <div className="text-2xl font-bold text-white group-hover/stat:text-blue-400 transition-colors">Active</div>
                            </div>
                        </div>

                        {/* Decorative Code Block */}
                        <div className="mt-6 p-4 bg-black/40 rounded-lg border border-gray-800 font-mono text-xs text-gray-500 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-2 text-gray-700 select-none">ID_CARD.JSON</div>
                            <p><span className="text-purple-400">const</span> <span className="text-blue-400">admin</span> = {'{'}</p>
                            <p className="pl-4">id: <span className="text-green-400">"{user?._id}"</span>,</p>
                            <p className="pl-4">permissions: [<span className="text-green-400">"ALL"</span>],</p>
                            <p className="pl-4">isVerified: <span className="text-yellow-400">true</span></p>
                            <p>{'}'};</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfileCard;
