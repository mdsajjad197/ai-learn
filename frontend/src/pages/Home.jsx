import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Sparkles, Zap, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

const featureColors = {
    indigo: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        glow: 'bg-indigo-500/10 group-hover:bg-indigo-500/20',
        titleHover: 'group-hover:text-indigo-600'
    },
    teal: {
        bg: 'bg-teal-50',
        text: 'text-teal-600',
        glow: 'bg-teal-500/10 group-hover:bg-teal-500/20',
        titleHover: 'group-hover:text-teal-600'
    },
    rose: {
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        glow: 'bg-rose-500/10 group-hover:bg-rose-500/20',
        titleHover: 'group-hover:text-rose-600'
    }
};

const FeatureCard = ({ icon, title, description, color }) => {
    const theme = featureColors[color] || featureColors.indigo;

    return (
        <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl transition-all duration-500 ${theme.glow}`}></div>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 ${theme.bg} ${theme.text}`}>
                {icon}
            </div>
            <h3 className={`text-xl font-heading font-bold text-gray-900 mb-3 transition-colors ${theme.titleHover}`}>{title}</h3>
            <p className="text-gray-600 leading-relaxed font-medium text-sm">{description}</p>
        </div>
    );
};

const Home = () => {
    return (
        <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative pt-24 pb-12 sm:pt-40 sm:pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-teal-500/5 to-transparent blur-3xl -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in">
                    <div className="inline-flex items-center px-4 py-2 rounded-full glass mb-8 animate-bounce-slow">
                        <Sparkles className="w-4 h-4 text-teal-500 mr-2" />
                        <span className="text-sm font-medium text-gray-600">AI-Powered Learning Revolution</span>
                    </div>

                    <h1 className="text-4xl sm:text-7xl font-heading font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                        Master Any Subject with <br />
                        <span className="gradient-text">Intelligent Tools</span>
                    </h1>

                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed">
                        Transform your documents into interactive study materials. Chat with PDF's, generate smart flashcards, and take quizzes—all powered by advanced AI.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0">
                        <Link to="/signup" className="btn-primary text-base sm:text-lg px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 group w-full sm:w-auto">
                            Get Started Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login" className="px-8 py-3.5 rounded-xl bg-white text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center shadow-sm w-full sm:w-auto">
                            Existing User
                        </Link>
                    </div>

                    {/* Stats/Social Proof */}
                    <div className="mt-16 pt-8 border-t border-gray-200/60 max-w-4xl mx-auto flex flex-wrap justify-center gap-8 sm:gap-16">
                        {[
                            { label: 'Active Students', value: '10k+' },
                            { label: 'Documents Processed', value: '50k+' },
                            { label: 'Questions Answered', value: '1M+' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white/50">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Supercharge Your Study Routine</h2>
                    <p className="text-gray-600">Our AI analyzes your materials to create personalized learning experiences automatically.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Brain className="w-7 h-7" />}
                        title="Semantic Chat"
                        description="Ask questions and get precise answers referenced directly from your uploaded documents."
                        color="indigo"
                    />
                    <FeatureCard
                        icon={<Zap className="w-7 h-7" />}
                        title="Smart Flashcards"
                        description="Instantly generate spaced-repetition flashcards to memorize key concepts faster."
                        color="teal"
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="w-7 h-7" />}
                        title="Auto-Quizzes"
                        description="Test your knowledge with AI-generated multiple choice questions based on your notes."
                        color="rose"
                    />
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-gray-900 to-slate-800 rounded-3xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>

                        <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6 relative z-10">Ready to boost your grades?</h2>
                        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto relative z-10">Join thousands of students utilizing EduCompanion to study smarter, not harder.</p>
                        <Link to="/signup" className="relative z-10 inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-teal-50 transition-colors shadow-lg">
                            Start Learning Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
