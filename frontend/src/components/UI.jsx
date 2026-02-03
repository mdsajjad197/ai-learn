import React from 'react';
import { Upload, X, MessageSquare, Plus, FileText, Brain, User, CheckCircle, XCircle, RotateCcw, ArrowRight } from 'lucide-react';

export const Input = ({ id, label, type = "text", required = false, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <input
                id={id}
                name={id}
                type={type}
                required={required}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow sm:text-sm"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    </div>
);

export const Button = ({ text, onClick, type = "button", variant = "primary", fullWidth = false, icon = null, disabled = false, className = "" }) => {
    const baseClasses = "inline-flex items-center justify-center px-6 py-3 border text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "btn-primary border-transparent", // Uses the index.css class
        secondary: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100",
        outline: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
        danger: "bg-red-50 text-red-700 hover:bg-red-100 border-red-100"
    };

    return (
        <button
            type={type}
            className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {text}
        </button>
    );
};

export const StatCard = ({ title, value, icon, gradient }) => (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
        <div className="flex items-center">
            <div className={`flex-shrink-0 rounded-xl p-3 ${gradient} text-white shadow-lg`}>
                {icon}
            </div>
            <div className="ml-5 w-0 flex-1">
                <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                    <dd className="flex items-baseline">
                        <div className="text-2xl font-bold text-gray-900">{value}</div>
                    </dd>
                </dl>
            </div>
        </div>
    </div>
);

export const FileUploader = ({ onFileSelect, selectedFile }) => (
    <div className="col-span-1">
        <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-xl appearance-none cursor-pointer hover:border-teal-500 focus:outline-none hover:bg-teal-50 group">
            <span className="flex items-center space-x-2">
                {selectedFile ? (
                    <div className="flex flex-col items-center">
                        <div className="bg-teal-100 p-2 rounded-full mb-2">
                            <FileText className="w-6 h-6 text-teal-600" />
                        </div>
                        <span className="font-medium text-gray-600">{selectedFile.name}</span>
                        <span className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-teal-600 transition-colors" />
                        <span className="font-medium text-gray-600 mt-2">Drop files or click</span>
                        <span className="text-xs text-gray-400 mt-1">PDF, DOCX, TXT</span>
                    </div>
                )}
            </span>
            <input type="file" name="file_upload" className="hidden" onChange={onFileSelect} accept=".pdf,.doc,.docx,.txt,.md" />
        </label>
    </div>
);

export const TabNavigation = ({ tabs, activeTab, onSwitch }) => (
    <div className="mb-6">
        <nav className="flex p-1 space-x-1 bg-gray-100/80 rounded-xl overflow-x-auto no-scrollbar touch-pan-x" aria-label="Tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onSwitch(tab.id)}
                    className={`
                        rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 whitespace-nowrap px-4 flex-shrink-0 flex-1 md:flex-none
                        ${activeTab === tab.id
                            ? 'bg-white text-teal-600 shadow-sm ring-1 ring-black/5'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    </div>
);

export const Flashcard = ({ front, back }) => {
    const [isFlipped, setIsFlipped] = React.useState(false);

    return (
        <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="group h-64 w-full perspective cursor-pointer"
        >
            <div className={`relative preserve-3d w-full h-full duration-500 transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute backface-hidden inset-0 bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8 flex flex-col items-center justify-center text-center group-hover:shadow-lg transition-shadow">
                    <span className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-4">Question</span>
                    <p className="text-gray-800 font-medium text-base sm:text-lg">{front}</p>
                </div>
                {/* Back */}
                <div className="absolute backface-hidden rotate-y-180 inset-0 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-md p-6 sm:p-8 flex flex-col items-center justify-center text-center text-white">
                    <span className="text-xs font-bold text-teal-100 uppercase tracking-widest mb-4">Answer</span>
                    <p className="font-medium text-base sm:text-lg">{back}</p>
                </div>
            </div>
        </div>
    );
};

export const ChatBubble = ({ message, isAi }) => (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-6 animate-fade-in group`}>
        <div className={`flex max-w-[85%] ${isAi ? 'flex-row' : 'flex-row-reverse'} items-end gap-3`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${isAi ? 'bg-white text-teal-600 border border-gray-100' : 'bg-indigo-600 text-white'}`}>
                {isAi ? <Brain size={16} /> : <User size={16} />}
            </div>
            <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-shadow ${isAi
                ? 'bg-white border border-gray-100 text-gray-700 rounded-bl-none group-hover:shadow-md'
                : 'bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-br-none group-hover:shadow-md'
                }`}>
                {message}
            </div>
        </div>
    </div>
);

// Quiz Component
export const Quiz = ({ questions, onRestart, onComplete }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [score, setScore] = React.useState(0);
    const [showResults, setShowResults] = React.useState(false);
    const [selectedOption, setSelectedOption] = React.useState(null);
    const [isCorrect, setIsCorrect] = React.useState(null);
    const [userAnswers, setUserAnswers] = React.useState([]); // Track answers

    const currentQuestion = questions[currentIndex];

    // Safety check if questions array is empty or undefined
    if (!questions || questions.length === 0) return null;

    const handleOptionSelect = (option) => {
        if (selectedOption !== null) return; // Prevent changing answer

        setSelectedOption(option);
        const correct = option === currentQuestion.answer;
        setIsCorrect(correct);

        if (correct) {
            setScore(score + 1);
        }

        // Record answer
        const newAnswers = [...userAnswers];
        newAnswers[currentIndex] = {
            question: currentQuestion.question,
            selected: option,
            correct: currentQuestion.answer,
            isCorrect: correct
        };
        setUserAnswers(newAnswers);
    };

    const handleNext = () => {
        setSelectedOption(null);
        setIsCorrect(null);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowResults(true);
            if (onComplete) {
                onComplete(score, questions.length);
            }
        }
    };

    if (showResults) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="mb-4 flex justify-center">
                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h3>
                    <p className="text-gray-500 mb-6">You scored <span className="font-bold text-gray-900">{score}</span> out of <span className="font-bold text-gray-900">{questions.length}</span></p>

                    <Button
                        text="Retake Quiz"
                        onClick={() => {
                            setScore(0);
                            setCurrentIndex(0);
                            setShowResults(false);
                            setUserAnswers([]);
                            onRestart && onRestart();
                        }}
                        variant="primary"
                        icon={<RotateCcw className="w-4 h-4 ml-2" />}
                    />
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold text-gray-700">Review Answers</h4>
                    {questions.map((q, idx) => {
                        const answer = userAnswers[idx];
                        if (!answer) return null;
                        return (
                            <div key={idx} className={`p-4 rounded-xl border ${answer.isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                <div className="flex gap-3">
                                    <div className="mt-1">
                                        {answer.isCorrect ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm mb-2">{q.question}</p>
                                        <p className="text-sm">
                                            <span className="font-medium">Your Answer:</span> {answer.selected}
                                        </p>
                                        {!answer.isCorrect && (
                                            <p className="text-sm mt-1 text-green-700">
                                                <span className="font-medium">Correct Answer:</span> {answer.correct}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8 flex justify-between items-center text-sm text-gray-500">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>Score: {score}</span>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                        let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group ";

                        if (selectedOption === null) {
                            btnClass += "border-gray-100 hover:border-teal-500 hover:bg-teal-50 bg-white";
                        } else if (option === currentQuestion.answer) {
                            btnClass += "border-green-500 bg-green-50 text-green-700";
                        } else if (option === selectedOption && option !== currentQuestion.answer) {
                            btnClass += "border-red-500 bg-red-50 text-red-700";
                        } else {
                            btnClass += "border-gray-100 opacity-50";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(option)}
                                disabled={selectedOption !== null}
                                className={btnClass}
                            >
                                <span className="font-medium">{option}</span>
                                {selectedOption !== null && option === currentQuestion.answer && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                                {selectedOption === option && option !== currentQuestion.answer && (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {selectedOption !== null && currentQuestion.explanation && (
                    <div className="mt-6 p-4 bg-teal-50 border border-teal-100 rounded-xl text-teal-800 animate-fade-in">
                        <p className="font-bold text-xs uppercase tracking-wider mb-1 text-teal-600">Explanation</p>
                        <p className="text-sm">{currentQuestion.explanation}</p>
                    </div>
                )}
            </div>

            <div className="flex justify-end h-12">
                {selectedOption !== null && (
                    <Button
                        text={currentIndex === questions.length - 1 ? "Finish" : "Next Question"}
                        onClick={handleNext}
                        variant="primary"
                        icon={<ArrowRight className="w-4 h-4 ml-2" />}
                    />
                )}
            </div>
        </div>
    );
};


