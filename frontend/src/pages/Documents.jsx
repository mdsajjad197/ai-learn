import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../services/DataService';
import { Button, Input } from '../components/UI';
import { FileText, Search, Plus, Calendar, ArrowRight, Trash2 } from 'lucide-react';

const Documents = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const docs = await dataService.getAllDocuments();
            setDocuments(docs);
        } catch (error) {
            console.error("Failed to load documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
            return;
        }

        try {
            await dataService.deleteDocument(id);
            setDocuments(prev => prev.filter(d => d._id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 animate-fade-in relative min-h-screen">
            {/* Ambient Background Mesh */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 pointer-events-none"></div>
            <div className="absolute top-20 right-0 w-96 h-96 bg-purple-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">My Documents</h1>
                    <p className="mt-2 text-gray-500 max-w-xl">
                        Manage your uploaded files and access AI-generated study materials.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <Button
                        text="Upload New"
                        variant="primary"
                        icon={<Plus size={18} />}
                        onClick={() => navigate('/dashboard')}
                        className="w-full sm:w-auto justify-center"
                    />
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-10">
                <div className="relative max-w-md w-full group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-3.5 border-none rounded-2xl leading-5 bg-white shadow-md shadow-gray-200/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all duration-300 ease-in-out font-medium hover:shadow-lg hover:shadow-gray-200/50"
                        placeholder="Search your documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Document List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
            ) : filteredDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocs.map((doc) => (
                        <Link to={`/document/${doc._id}`} key={doc._id} className="group block h-full">
                            <div className="h-full bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col relative overflow-hidden ring-1 ring-gray-100">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500"></div>

                                <div className="flex items-start justify-between mb-5 relative z-10">
                                    <div className="p-3.5 bg-gray-50 text-gray-500 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                                        <FileText size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                                        {doc.type?.split('/')[1]?.toUpperCase() || 'DOC'}
                                    </span>
                                </div>

                                <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                    {doc.name}
                                </h3>

                                <div className="mt-auto pt-6 flex items-center justify-between text-sm text-gray-500 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5 font-medium text-xs uppercase tracking-wide text-gray-400">
                                        <Calendar size={12} />
                                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDelete(doc._id, doc.name);
                                        }}
                                        className="p-2 -mr-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                        title="Delete Document"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <FileText className="h-8 w-8" />
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-gray-900">No documents found</h3>
                    <p className="mt-1 text-gray-500 max-w-sm mx-auto mb-8">
                        {searchTerm ? 'We couldn\'t find any documents matching your search.' : 'Upload your first document to unlock AI-powered features.'}
                    </p>
                    {!searchTerm && (
                        <div className="mt-2">
                            <Button
                                text="Upload Document"
                                variant="primary"
                                icon={<Plus size={18} />}
                                onClick={() => navigate('/dashboard')}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Documents;
