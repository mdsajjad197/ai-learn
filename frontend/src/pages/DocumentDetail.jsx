import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataService } from '../services/DataService';
import { ChatBubble, Button, Flashcard, Quiz } from '../components/UI';
import { ArrowLeft, ArrowRight, Save, Trash2, MessageSquare, Layers, FileText, Brain, Sparkles, Calendar, Menu, X, ChevronRight } from 'lucide-react';

const DocumentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doc, setDoc] = useState(null);
    const [activeTab, setActiveTab] = useState('chat');

    // Data States
    const [flashcards, setFlashcards] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    // Chat States
    const [chatMessages, setChatMessages] = useState([
        { message: "Hello! I'm ready to help you study this document. What would you like to know?", isAi: true }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [typing, setTyping] = useState(false);

    // Mobile Menu State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        loadDoc();
    }, [id]);

    const loadDoc = async () => {
        try {
            const document = await dataService.getDocument(id);
            setDoc(document);
            const cards = await dataService.getFlashcardsForDoc(id);
            setFlashcards(cards);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this document? This cannot be undone.')) {
            try {
                await dataService.deleteDocument(id);
                navigate('/documents');
            } catch (error) {
                alert('Failed to delete document');
            }
        }
    };

    const submitChat = async (msg) => {
        if (!msg.trim()) return;
        setChatMessages(prev => [...prev, { message: msg, isAi: false }]);
        setChatInput('');
        setTyping(true);
        try {
            const response = await dataService.chat(msg, id);
            setChatMessages(prev => [...prev, { message: response, isAi: true }]);
        } catch (error) {
            const errorMsg = error.message || "Error getting response.";
            setChatMessages(prev => [...prev, { message: `Error: ${errorMsg}`, isAi: true }]);
        } finally {
            setTyping(false);
        }
    };

    const handleGenerateFlashcards = async () => {
        try {
            alert('AI is generating your study set...');
            await dataService.generateFlashcards(id);
            const cards = await dataService.getFlashcardsForDoc(id);
            setFlashcards(cards);
            alert('Flashcards ready!');
        } catch (error) {
            alert('Generation failed.');
        }
    };

    const handleGenerateQuiz = async () => {
        try {
            alert('AI is creating a quiz...');
            const quizData = await dataService.generateQuiz(id);
            setQuizzes(quizData);
            alert('Quiz ready!');
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Quiz generation failed.';
            alert(`Error: ${msg}`);
        }
    };

    const handleQuizComplete = async (score, total) => {
        try {
            await dataService.saveQuizResult(id, score, total);
        } catch (error) {
            console.error("Failed to save quiz result", error);
        }
    };

    if (!doc) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin h-8 w-8 border-4 border-teal-500 rounded-full border-t-transparent"></div></div>;

    const tabs = [
        { id: 'chat', label: 'AI Chat', icon: <MessageSquare size={20} />, description: 'Chat with your document' },
        { id: 'flashcards', label: 'Flashcards', icon: <Layers size={20} />, description: 'Study with generated cards' },
        { id: 'content', label: 'Document', icon: <FileText size={20} />, description: 'View original content' },
        { id: 'quiz', label: 'Quiz Mode', icon: <Brain size={20} />, description: 'Test your knowledge' },
        { id: 'plan', label: 'Revision', icon: <Calendar size={20} />, description: 'Get a study schedule' }
    ];

    const SidebarContent = ({ isMobile }) => (
        <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl md:bg-transparent">
            {isMobile && (
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <span className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        <Sparkles className="text-teal-500 w-5 h-5" /> EduCompanion
                    </span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {!isMobile && (
                    <div className="flex items-center gap-2 mb-8 px-2">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/30">
                            <Sparkles className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-900 text-lg">EduCompanion</span>
                    </div>
                )}

                <button
                    onClick={() => navigate('/documents')}
                    className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium group px-2 w-full"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Library
                </button>

                <div className="space-y-1">
                    <p className="px-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Study Tools</p>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                if (isMobile) setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${activeTab === tab.id
                                ? 'bg-white shadow-md text-teal-700 border border-teal-100/50'
                                : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`p-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'}`}>
                                    {tab.icon}
                                </span>
                                <div className="text-left">
                                    <div className="font-semibold">{tab.label}</div>
                                    {isMobile && <div className="text-[10px] text-gray-400 font-normal">{tab.description}</div>}
                                </div>
                            </div>
                            {activeTab === tab.id && <ChevronRight className="w-4 h-4 text-teal-500" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-gray-200/50">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
                    <h4 className="text-sm font-bold mb-1 relative z-10 flex items-center gap-2">
                        <Brain size={14} /> Pro Tip
                    </h4>
                    <p className="text-xs text-indigo-100 leading-relaxed relative z-10">
                        Switch to Flashcards after chatting to reinforce your memory.
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-[100dvh] bg-[#f8fafc] text-gray-800 overflow-hidden relative selection:bg-teal-100 selection:text-teal-900">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>
            </div>

            {/* Mobile Drawer Overlay */}
            <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Drawer Panel */}
                <div className={`absolute top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SidebarContent isMobile={true} />
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-80 flex-col h-full border-r border-gray-200/60 bg-white/50 backdrop-blur-md relative z-20">
                <SidebarContent isMobile={false} />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full min-w-0 relative z-10">
                {/* Header */}
                <header className="h-16 md:h-20 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 flex-shrink-0 z-20 sticky top-0 transition-all">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 active:scale-95"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="min-w-0 flex-1">
                            <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate tracking-tight">{doc.name}</h1>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium tracking-wide text-[10px] uppercase">
                                    {doc.type === 'application/pdf' ? 'PDF' : 'Text'}
                                </span>
                                <span>•</span>
                                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-auto flex-shrink-0">
                        <Button
                            text={<span className="hidden sm:inline">Delete</span>}
                            variant="danger"
                            className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200 shadow-none px-3 py-1.5 text-xs sm:text-sm h-8 sm:h-9"
                            icon={<Trash2 size={16} />}
                            onClick={handleDelete}
                        />
                    </div>
                </header>

                {/* Mobile Horizontal Tabs - Force Visibility */}
                <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/50 flex overflow-x-auto no-scrollbar py-6 px-4 z-20 gap-4 flex-nowrap shadow-md relative sticky top-16 md:top-20 transition-all">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm active:scale-95 ${activeTab === tab.id
                                ? 'bg-teal-500 text-white shadow-teal-500/30 ring-4 ring-teal-500/10'
                                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                        >
                            {/* Render icon simplified for bar */}
                            {React.cloneElement(tab.icon, { size: 18 })}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content Container */}
                <div className="flex-1 overflow-y-auto relative p-4 lg:p-6 flex flex-col pt-6 scrollbar-hide">
                    <div className="w-full h-full rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200/60 shadow-sm flex flex-col overflow-hidden relative">

                        {/* Chat Tab */}
                        {activeTab === 'chat' && (
                            <div className="flex flex-col h-full min-h-0">
                                <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth custom-scrollbar">
                                    {chatMessages.map((msg, idx) => (
                                        <ChatBubble key={idx} message={msg.message} isAi={msg.isAi} />
                                    ))}
                                    {typing && (
                                        <div className="flex items-center gap-2 text-xs text-gray-400 ml-4 animate-pulse">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-200"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-400"></div>
                                            <span className="text-[10px] uppercase tracking-wider font-bold ml-1">AI Thinking</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-white border-t border-gray-100 z-10">
                                    {chatMessages.length < 3 && (
                                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar mask-fade-right">
                                            {['Summarize this', 'Key concepts', 'Create a study plan', 'Quiz me'].map(action => (
                                                <button
                                                    key={action}
                                                    onClick={() => submitChat(action)}
                                                    className="px-4 py-2 bg-teal-50 text-teal-700 text-xs font-semibold rounded-xl border border-teal-100 hover:bg-teal-100 hover:scale-105 transition-all whitespace-nowrap shadow-sm"
                                                >
                                                    {action}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <form onSubmit={(e) => { e.preventDefault(); submitChat(chatInput); }} className="relative flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            className="block w-full pl-4 pr-14 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm text-sm bg-gray-50/50 focus:bg-white placeholder-gray-400"
                                            placeholder="Ask a question about your document..."
                                        />
                                        <button
                                            type="submit"
                                            disabled={!chatInput.trim()}
                                            className="absolute right-2 top-1.5 bottom-1.5 aspect-square bg-teal-500 text-white rounded-xl hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 transition-all flex items-center justify-center shadow-lg shadow-teal-500/20 active:scale-95 w-9"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Content Tab */}
                        {activeTab === 'content' && (
                            <div className="h-full overflow-hidden flex flex-col bg-gray-100/50">
                                {doc.type === 'application/pdf' ? (
                                    <div className="flex-1 relative flex flex-col">
                                        <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center text-xs text-gray-500">
                                            <span>PDF Preview</span>
                                            <a
                                                href={`${doc.url}?token=${JSON.parse(localStorage.getItem('edu_companion_user'))?.token}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-teal-600 font-bold hover:underline flex items-center gap-1"
                                            >
                                                Open in new tab <ArrowRight size={10} />
                                            </a>
                                        </div>
                                        <iframe
                                            src={`${doc.url}?token=${JSON.parse(localStorage.getItem('edu_companion_user'))?.token}`}
                                            className="w-full h-full bg-gray-50"
                                            title="PDF Preview"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-full overflow-y-auto p-6 md:p-10">
                                        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-200 min-h-full">
                                            <pre className="whitespace-pre-wrap font-sans text-sm leading-8 text-gray-700">{doc.content || "No content available."}</pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Flashcards Tab */}
                        {activeTab === 'flashcards' && (
                            <div className="h-full overflow-y-auto p-4 sm:p-8 bg-gray-50/50 min-h-0 custom-scrollbar">
                                {flashcards.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                                        <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                                            <Layers className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Flashcards Yet</h3>
                                        <p className="text-gray-500 mb-8">Generate a study set from this document to start practicing concepts.</p>
                                        <Button text="Generate Study Set" onClick={handleGenerateFlashcards} variant="primary" className="shadow-xl shadow-teal-500/20" />
                                    </div>
                                ) : (
                                    <div className="max-w-5xl mx-auto space-y-8">
                                        <div className="flex justify-between items-center sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 py-4 -mt-4 border-b border-gray-200/50">
                                            <h3 className="font-bold text-xl text-gray-800">Your Study Sets</h3>
                                            <Button text="New Set" onClick={handleGenerateFlashcards} variant="outline" className="text-xs h-9" />
                                        </div>
                                        {flashcards.map(set => (
                                            <div key={set._id} className="space-y-4 animate-fade-in">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                                                    <h4 className="font-bold text-gray-600 text-sm uppercase tracking-wider">{set.topic}</h4>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {set.cards && set.cards.map((card, i) => (
                                                        <Flashcard key={i} front={card.front} back={card.back} />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Quiz Tab */}
                        {activeTab === 'quiz' && (
                            <div className="h-full overflow-y-auto p-4 sm:p-8 bg-gray-50/50 min-h-0 custom-scrollbar">
                                {quizzes.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                                        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                                            <Brain className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Mode</h3>
                                        <p className="text-gray-500 mb-8">Test your knowledge with AI-generated questions based on this document.</p>
                                        <Button text="Start Practice Quiz" variant="primary" onClick={handleGenerateQuiz} className="bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20" />
                                    </div>
                                ) : (
                                    <div className="max-w-2xl mx-auto py-8">
                                        <Quiz
                                            questions={quizzes}
                                            onRestart={() => setQuizzes([])}
                                            onComplete={handleQuizComplete}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Revision Plan Tab */}
                        {activeTab === 'plan' && (
                            <div className="h-full overflow-y-auto p-4 sm:p-8 bg-white flex flex-col min-h-0 custom-scrollbar">
                                {(!doc.revisionPlan || doc.revisionPlan.length === 0) ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                                        <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                                            <Calendar className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Revision Planner</h3>
                                        <p className="text-gray-500 mb-8">Get a personalized daily study schedule to master this material.</p>
                                        <Button
                                            text="Generate Revision Plan"
                                            variant="secondary"
                                            onClick={async () => {
                                                try {
                                                    alert("Generating plan...");
                                                    const plan = await dataService.generateRevisionPlan(id);
                                                    setDoc(prev => ({ ...prev, revisionPlan: plan }));
                                                    alert("Plan generated!");
                                                } catch (e) {
                                                    alert("Failed to generate plan");
                                                }
                                            }}
                                            icon={<Sparkles className="w-4 h-4" />}
                                            className="bg-purple-600 text-white hover:bg-purple-700 shadow-xl shadow-purple-500/20"
                                        />
                                    </div>
                                ) : (
                                    <div className="max-w-3xl mx-auto w-full space-y-8 animate-fade-in">
                                        <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">Revision Schedule</h2>
                                                <p className="text-gray-500 text-sm mt-1">Follow this plan to master the material.</p>
                                            </div>
                                            <Button
                                                text="Regenerate"
                                                variant="outline"
                                                onClick={async () => {
                                                    if (confirm("Regenerate plan?")) {
                                                        const plan = await dataService.generateRevisionPlan(id);
                                                        setDoc(prev => ({ ...prev, revisionPlan: plan }));
                                                    }
                                                }}
                                                className="text-xs h-9"
                                            />
                                        </div>
                                        <div className="space-y-0 relative border-l-2 border-dashed border-indigo-200 ml-4 lg:ml-8">
                                            {doc.revisionPlan.map((day, idx) => (
                                                <div key={idx} className="relative pl-8 pb-12 last:pb-0 group">
                                                    <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-indigo-500 group-hover:scale-125 transition-transform shadow-sm"></div>
                                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>
                                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                                            <h3 className="font-bold text-indigo-900 text-lg">{day.day}</h3>
                                                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase rounded-full tracking-wide shadow-sm">
                                                                {day.focus}
                                                            </span>
                                                        </div>
                                                        <ul className="space-y-3 relative z-10">
                                                            {day.tasks.map((task, tIdx) => (
                                                                <li key={tIdx} className="flex items-start gap-3 text-gray-700 text-sm group/task cursor-default">
                                                                    <div className="mt-1 w-4 h-4 rounded border-2 border-gray-300 flex items-center justify-center flex-shrink-0 bg-white group-hover/task:border-indigo-400 transition-colors"></div>
                                                                    <span className="leading-relaxed">{task}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DocumentDetail;
