import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataService } from '../services/DataService';
import { TabNavigation, ChatBubble, Button, Flashcard, Quiz } from '../components/UI';

import { ArrowLeft, ArrowRight, Save, Share2, MoreVertical, Trash2, MessageSquare, Layers, FileText, Brain, Menu, X, Sparkles, Calendar } from 'lucide-react';

const DocumentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doc, setDoc] = useState(null);
    const [activeTab, setActiveTab] = useState('chat'); // chat first is more engaging

    // Tab Data Handlers
    const [flashcards, setFlashcards] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    const [chatMessages, setChatMessages] = useState([
        { message: "Hello! I'm ready to help you study this document. What would you like to know?", isAi: true }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [typing, setTyping] = useState(false);
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
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this document? This cannot be undone.')) {
            try {
                await dataService.deleteDocument(id);
                navigate('/dashboard');
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
            // Optional: alert or toast
        } catch (error) {
            console.error("Failed to save quiz result", error);
        }
    };



    if (!doc) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-teal-500 rounded-full border-t-transparent"></div></div>;

    const tabs = [
        { id: 'chat', label: 'AI Chat', icon: <MessageSquare size={18} /> },
        { id: 'flashcards', label: 'Flashcards', icon: <Layers size={18} /> },
        { id: 'content', label: 'Raw Content', icon: <FileText size={18} /> },
        { id: 'quiz', label: 'Quiz', icon: <Brain size={18} /> },
        { id: 'plan', label: 'Revision', icon: <Calendar size={18} /> }
    ];

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-24 pb-2 sm:pb-8 h-[100dvh] flex flex-col animate-fade-in text-gray-800 supports-[height:100cqh]:h-[100cqh] supports-[height:100svh]:h-[100svh]">

            <div className="flex flex-col md:flex-row h-full md:gap-8 min-h-0">
                {/* Desktop Sidebar navigation */}
                <aside className="hidden md:flex flex-col w-64 flex-shrink-0 overflow-y-auto pb-4">
                    <button
                        onClick={() => navigate('/documents')}
                        className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors font-medium group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Library
                    </button>

                    <nav className="space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group ${activeTab === tab.id
                                    ? 'bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={activeTab === tab.id ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'}>
                                        {tab.icon}
                                    </span>
                                    {tab.label}
                                </div>
                                {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100/50">
                            <h4 className="text-sm font-bold text-indigo-900 mb-1">Study Tip</h4>
                            <p className="text-xs text-indigo-700/80 leading-relaxed">
                                Switch to Flashcards after chatting to reinforce your memory.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-full min-w-0">

                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-4 md:mb-6 flex-shrink-0">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <button onClick={() => navigate('/documents')} className="hidden md:flex p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 flex-shrink-0">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 flex-shrink-0">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 truncate leading-tight">{doc.name}</h1>
                                <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                                    <span className="hidden sm:inline">Added on</span>
                                    {new Date(doc.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:self-auto self-end flex-shrink-0">
                            <Button
                                text={<span className="hidden sm:inline">Delete</span>}
                                variant="danger"
                                className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm h-9"
                                icon={<Trash2 size={16} />}
                                onClick={handleDelete}
                            />
                        </div>
                    </div>

                    {/* Mobile Sidebar Drawer */}
                    {isMobileMenuOpen && (
                        <div className="fixed inset-0 z-50 md:hidden">
                            {/* Backdrop */}
                            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}></div>
                            {/* Drawer */}
                            <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col p-6 animate-slide-in-right">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-6 flex-1 overflow-y-auto">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Navigation</p>
                                        <button
                                            onClick={() => navigate('/documents')}
                                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 border border-transparent"
                                        >
                                            <ArrowLeft className="w-5 h-5 mr-3 text-gray-400" />
                                            Back to Library
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tools</p>
                                        {tabs.map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => {
                                                    setActiveTab(tab.id);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === tab.id
                                                    ? 'bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-100'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={activeTab === tab.id ? 'text-teal-600' : 'text-gray-400'}>
                                                        {tab.icon}
                                                    </span>
                                                    {tab.label}
                                                </div>
                                                {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex-grow overflow-hidden relative rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col">

                        {/* Chat Tab */}
                        {activeTab === 'chat' && (
                            <div className="flex flex-col h-full">
                                <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50/50 scroll-smooth">
                                    {chatMessages.map((msg, idx) => (
                                        <ChatBubble key={idx} message={msg.message} isAi={msg.isAi} />
                                    ))}
                                    {typing && (
                                        <div className="flex items-center gap-2 text-xs text-gray-400 ml-4 animate-pulse">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-200"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-400"></div>
                                            AI is thinking...
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-white border-t border-gray-200">
                                    {chatMessages.length < 3 && (
                                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar mask-fade-right">
                                            {['Summarize this', 'Key concepts', 'Create a study plan'].map(action => (
                                                <button
                                                    key={action}
                                                    onClick={() => submitChat(action)}
                                                    className="px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-100 hover:bg-teal-100 transition whitespace-nowrap flex-shrink-0"
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
                                            className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow shadow-sm text-sm sm:text-base"
                                            placeholder="Ask..."
                                        />
                                        <button
                                            type="submit"
                                            disabled={!chatInput.trim()}
                                            className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:hover:bg-teal-500 transition-colors flex items-center justify-center shadow-sm w-9 sm:w-10"
                                        >
                                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Content Tab */}
                        {activeTab === 'content' && (
                            <div className="h-full overflow-y-auto p-4 bg-gray-100 flex flex-col">
                                {doc.type === 'application/pdf' ? (
                                    <div className="flex flex-col h-full gap-4">
                                        <div className="flex justify-end items-center px-2">
                                            <a
                                                href={`${doc.url}?token=${JSON.parse(localStorage.getItem('edu_companion_user'))?.token}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-teal-600 font-bold hover:underline flex items-center gap-1"
                                            >
                                                Open Original File <ArrowRight size={12} />
                                            </a>
                                        </div>
                                        <div className="flex-grow relative bg-gray-200 rounded-xl overflow-hidden border border-gray-200">
                                            <object
                                                data={`${doc.url}?token=${JSON.parse(localStorage.getItem('edu_companion_user'))?.token}`}
                                                type="application/pdf"
                                                className="w-full h-full absolute inset-0 rounded-xl"
                                            >
                                                <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-500">
                                                    <p className="mb-2">Unable to display PDF directly.</p>
                                                    <a
                                                        href={`${doc.url}?token=${JSON.parse(localStorage.getItem('edu_companion_user'))?.token}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                                                    >
                                                        Download PDF
                                                    </a>
                                                </div>
                                            </object>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="prose max-w-none text-gray-700 bg-white p-8 rounded-xl shadow-sm">
                                        <pre className="whitespace-pre-wrap font-sans text-sm leading-8">{doc.content || "No textual content extracted."}</pre>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Flashcards Tab */}
                        {activeTab === 'flashcards' && (
                            <div className="h-full overflow-y-auto p-4 sm:p-8 bg-gray-50/50">
                                {flashcards.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Save className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Flashcards Yet</h3>
                                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Generate a study set from this document to start practicing spaced repetition.</p>
                                        <Button text="Generate Study Set" onClick={handleGenerateFlashcards} variant="primary" />
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-lg">Your Study Sets</h3>
                                            <Button text="New Set" onClick={handleGenerateFlashcards} variant="outline" />
                                        </div>
                                        {flashcards.map(set => (
                                            <div key={set._id} className="space-y-4">
                                                <h4 className="font-medium text-gray-500 uppercase tracking-widest text-xs border-b border-gray-200 pb-2">{set.topic}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <div className="h-full overflow-y-auto p-4 sm:p-8 bg-gray-50/50">
                                {quizzes.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <div className="max-w-md">
                                            <h3 className="text-lg font-bold">Quiz Mode</h3>
                                            <p className="text-gray-500 mt-2 mb-6">Test your knowledge with AI-generated questions.</p>
                                            <Button text="Start Practice Quiz" variant="primary" onClick={handleGenerateQuiz} />
                                        </div>
                                    </div>
                                ) : (
                                    <Quiz
                                        questions={quizzes}
                                        onRestart={() => setQuizzes([])}
                                        onComplete={handleQuizComplete}
                                    />
                                )}
                            </div>
                        )}

                        {/* Revision Plan Tab */}
                        {activeTab === 'plan' && (
                            <div className="h-full overflow-y-auto p-4 sm:p-8 bg-white flex flex-col">
                                {(!doc.revisionPlan || doc.revisionPlan.length === 0) ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Brain className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Revision Planner</h3>
                                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                            Get a personalized daily study schedule based on this document's key concepts.
                                        </p>
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
                                        />
                                    </div>
                                ) : (
                                    <div className="max-w-3xl mx-auto w-full space-y-8 animate-fade-in">
                                        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">Your Revision Schedule</h2>
                                                <p className="text-gray-500 text-sm mt-1">Follow this plan to master the material.</p>
                                            </div>
                                            <Button
                                                text="Refresh Plan"
                                                variant="outline"
                                                onClick={async () => {
                                                    if (confirm("Regenerate plan?")) {
                                                        const plan = await dataService.generateRevisionPlan(id);
                                                        setDoc(prev => ({ ...prev, revisionPlan: plan }));
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-0 relative border-l-2 border-indigo-100 ml-4">
                                            {doc.revisionPlan.map((day, idx) => (
                                                <div key={idx} className="relative pl-8 pb-10 last:pb-0">
                                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-500"></div>
                                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h3 className="font-bold text-indigo-900 text-lg">{day.day}</h3>
                                                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase rounded-full tracking-wide">
                                                                {day.focus}
                                                            </span>
                                                        </div>
                                                        <ul className="space-y-3">
                                                            {day.tasks.map((task, tIdx) => (
                                                                <li key={tIdx} className="flex items-start gap-3 text-gray-700">
                                                                    <div className="mt-1 w-5 h-5 rounded border border-gray-300 flex items-center justify-center flex-shrink-0 bg-white">
                                                                        {/* Checkbox visual only */}
                                                                    </div>
                                                                    <span>{task}</span>
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
                </main>
            </div >
        </div >
    );
};

export default DocumentDetail;
