import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import ReactMarkdown from 'react-markdown';

export default function AI() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const aiResponse = await axios.post('/api/ai/query', {
                query: query
            });
            
            setResponse(aiResponse.data.content);
        } catch (error) {
            console.error("Error:", error);
            setResponse("An error occurred while processing your request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head title="AI Assistant" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-2xl font-semibold mb-4">AI Assistant</h1>
                            
                            <form onSubmit={handleSubmit} className="mb-6">
                                <div className="mb-4">
                                    <label htmlFor="query" className="block text-gray-700 text-sm font-bold mb-2">
                                        Ask anything:
                                    </label>
                                    <textarea
                                        id="query"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        rows={4}
                                        placeholder="What would you like to know?"
                                        required
                                    />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                            
                            {response && (
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-2">Response:</h2>
                                    <div className="prose max-w-none">
                                        <ReactMarkdown>{response}</ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}