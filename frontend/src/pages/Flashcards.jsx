import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/DataService';
import { Button, Flashcard } from '../components/UI';
import { Layers, Search, BookOpen, Clock, ArrowLeft } from 'lucide-react';

const Flashcards = () => {
    const navigate = useNavigate();
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSet, setSelectedSet] = useState(null);

    useEffect(() => {
        loadFlashcards();
    }, []);

    const loadFlashcards = async () => {
        try {
            const data = await dataService.getAllFlashcards();
            setFlashcardSets(data);
        } catch (error) {
            console.error("Failed to load flashcards", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSets = flashcardSets.filter(set =>
        set.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        set.docName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStudyAll = () => {
        const allCards = flashcardSets.flatMap(set => set.cards);
        // Shuffle cards
        for (let i = allCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
        }

        setSelectedSet({
            topic: "All Flashcards (Mixed)",
            docName: "Various Documents",
            cards: allCards
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin h-8 w-8 border-4 border-teal-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    if (selectedSet) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => setSelectedSet(null)}
                        className="mb-6 flex items-center text-gray-500 hover:text-teal-600 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Library
                    </button>

                    <div className="mb-8">
                        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">{selectedSet.topic}</h1>
                        <p className="text-gray-500">From document: {selectedSet.docName}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedSet.cards.map((card, idx) => (
                            <Flashcard key={idx} front={card.front} back={card.back} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900 flex items-center gap-3">
                            <Layers className="text-teal-500" />
                            Flashcard Library
                        </h1>
                        <p className="mt-2 text-gray-500">Review your study sets and master your materials.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="w-full sm:w-auto">
                            <Button
                                text="Study All Cards"
                                onClick={handleStudyAll}
                                variant="primary"
                                icon={<Layers size={18} />}
                                disabled={flashcardSets.length === 0}
                                className="w-full justify-center"
                            />
                        </div>

                        <div className="relative w-full sm:w-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search topics..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full md:w-64 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSets.length > 0 ? filteredSets.map(set => (
                        <div
                            key={set._id}
                            onClick={() => setSelectedSet(set)}
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-50 rounded-bl-full -mr-4 -mt-4 group-hover:bg-teal-100 transition-colors"></div>

                            <div className="flex items-start justify-between mb-4 relative z-10">
                                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-500 group-hover:text-white transition-colors">
                                    <BookOpen size={24} />
                                </div>
                                <span className="px-2 py-1 bg-gray-50 text-xs font-semibold text-gray-500 rounded-md">
                                    {set.cards.length} Cards
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-teal-600 transition-colors">
                                {set.topic}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-1">
                                Source: {set.docName}
                            </p>

                            <div className="flex items-center text-xs text-gray-400 pt-4 border-t border-gray-50">
                                <Clock size={12} className="mr-1" />
                                Created {new Date(set.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <Layers size={40} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No Flashcards Found</h3>
                            <p className="text-gray-500 mt-2">
                                {searchTerm ? "Try a different search term" : "Upload documents and generate flashcards to see them here"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Flashcards;
