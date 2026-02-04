import React, { useState, useEffect } from 'react';
import { Target, Calendar, TrendingUp, BookOpen, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import axios from '../api/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Efficiency = ({ embedded = false }) => {
    const [stats, setStats] = useState([]);
    const [weakAreas, setWeakAreas] = useState([]);
    const [revisionPlan, setRevisionPlan] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, weakRes, planRes] = await Promise.all([
                    axios.get('/efficiency/analytics'),
                    axios.get('/efficiency/weak-areas'),
                    axios.get('/efficiency/revision-plan')
                ]);

                setStats(analyticsRes.data);
                setWeakAreas(weakRes.data);
                setRevisionPlan(planRes.data);
            } catch (error) {
                console.error("Failed to fetch efficiency data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className={`flex items-center justify-center ${embedded ? "h-64" : "min-h-screen bg-slate-900"}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const refreshPlan = async () => {
        setLoading(true); // Set loading to true when refreshing
        try {
            const planRes = await axios.get('/efficiency/revision-plan');
            setRevisionPlan(planRes.data);
        } catch (error) {
            console.error("Failed to refresh plan", error);
        } finally {
            setLoading(false); // Set loading to false after fetch (success or error)
        }
    };

    const containerClass = embedded
        ? "space-y-8 animate-fade-in"
        : "min-h-screen bg-slate-900 text-white p-8";

    return (
        <div className={containerClass}>
            <div className={embedded ? "" : "max-w-7xl mx-auto space-y-12"}>

                {/* Header - Only hide if you really want to, but 'Learning Efficiency Hub' is a good title for the tab content too */}
                <header className="space-y-4">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Learning Efficiency Hub
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl">
                        Optimize your study sessions with AI-driven insights, weak area detection, and personalized revision schedules.
                    </p>
                </header>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Progress Analytics (Large Chart) */}
                    <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="flex items-center space-x-3 mb-6 relative z-10">
                            <div className="p-3 bg-indigo-500/20 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-semibold">Progress Analytics</h2>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#818cf8' }}
                                    />
                                    <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Weak Areas */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl shadow-2xl">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-red-500/20 rounded-xl">
                                <AlertCircle className="w-6 h-6 text-red-400" />
                            </div>
                            <h2 className="text-2xl font-semibold">Weak Areas</h2>
                        </div>

                        <div className="space-y-4">
                            {weakAreas.length === 0 ? (
                                <p className="text-slate-400">Great job! No critical weak areas detected.</p>
                            ) : (
                                weakAreas.map((doc, idx) => (
                                    <div key={idx} className="p-4 bg-slate-700/30 rounded-2xl border border-slate-700 hover:border-red-500/50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-slate-200">{doc.name}</h3>
                                                <p className="text-sm text-slate-400 mt-1">
                                                    Score: <span className="text-red-400">{doc.currentScore.toFixed(0)}%</span>
                                                    <span className="mx-2">•</span>
                                                    Wrong: <span className="text-red-400">{doc.wrongAnswers}</span>
                                                </p>
                                            </div>
                                            <Target className="w-5 h-5 text-red-400 opacity-50" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Smart Revision Planner */}
                    <div className="lg:col-span-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-cyan-500/20 rounded-xl">
                                    <Calendar className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h2 className="text-2xl font-semibold">Smart Revision Schedule</h2>
                            </div>
                            <button
                                onClick={refreshPlan}
                                className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center transition-colors border border-cyan-500/30"
                                disabled={loading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                {loading ? 'Generating...' : 'Regenerate Plan'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                            {revisionPlan && revisionPlan.length > 0 ? (
                                revisionPlan.map((dayPlan, index) => (
                                    <div key={index} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-all hover:-translate-y-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-cyan-400">{dayPlan.day}</h3>
                                            <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">{dayPlan.focus}</span>
                                        </div>
                                        <ul className="space-y-3">
                                            {dayPlan.tasks.map((task, i) => (
                                                <li key={i} className="flex items-start text-sm text-slate-300">
                                                    <CheckCircle className="w-4 h-4 text-slate-500 mr-2 mt-0.5 flex-shrink-0" />
                                                    {task}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 col-span-full">
                                    {loading ? "Generating new plan..." : "No revision plan available. Try taking some quizzes first!"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Efficiency;
