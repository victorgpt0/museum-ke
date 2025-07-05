import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useState } from 'react';
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
                query: query,
            });

            setResponse(aiResponse.data.content);
        } catch (error) {
            console.error('Error:', error);
            setResponse('An error occurred while processing your request.');
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'AI Assistant', href: '/AI' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Assistant" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <h1 className="mb-4 text-2xl font-semibold">AI Assistant</h1>

                            <form onSubmit={handleSubmit} className="mb-6">
                                <div className="mb-4">
                                    <label htmlFor="query" className="mb-2 block text-sm font-bold text-gray-700">
                                        Ask anything:
                                    </label>
                                    <textarea
                                        id="query"
                                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
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
                                        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Submit'}
                                    </button>
                                </div>
                            </form>

                            {response && (
                                <div className="rounded-lg bg-gray-100 p-4">
                                    <h2 className="mb-2 text-lg font-semibold">Response:</h2>
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
