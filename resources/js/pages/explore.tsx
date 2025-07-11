import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    FileText,
    Eye,
    BoxIcon,
    SkipBackIcon,
    StepBack,
    SendToBack,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';
import { AvatarFallback } from '@/components/ui/avatar';

export default function Explore() {
    const { searchResults } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('all');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        router.get('/search', {
            query: searchQuery,
            type: searchType,
        }, {
            onFinish: () => setIsSearching(false),
        });
    };

    const fadeUp = {
      hidden: { opacity: 0, y: 80 },
      show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    return (
        <>
            <Head title="Explore Collections" />
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#FFFDD0] via-[#f7f7f7] to-[#e9e7e1] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-gradient-to-br dark:from-[#0a0a0a] dark:via-[#181818] dark:to-[#232323]">
                {/* Back Button */}
                <button
                    onClick={() => (window.history.length > 1 ? window.history.back() : window.location.href = '/')}
                    className="self-start mb-4 px-4 py-2 bg-accent dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                    <ArrowLeft/>
                </button>
                <motion.section
                    className="w-full max-w-6xl mt-8 bg-white/80 dark:bg-[#181818]/80 backdrop-blur-md border border-[#ececec] dark:border-[#232323] rounded-2xl shadow-xl p-8"
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
                            Explore Our Collections
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Search through our published artifacts, research projects, and historical reports. Discover the rich cultural heritage preserved in our museum.
                        </p>
                    </div>
                    <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for artifacts, projects, or reports..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-[#C2A14D] focus:border-transparent"
                                />
                            </div>
                            <select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-[#C2A14D] focus:border-transparent"
                            >
                                <option value="all">All Collections</option>
                                <option value="artifacts">Artifacts</option>
                                <option value="projects">Projects</option>
                                <option value="reports">Reports</option>
                            </select>
                            <button
                                type="submit"
                                disabled={isSearching || !searchQuery.trim()}
                                className="px-8 py-3 bg-[#C2A14D] text-black font-semibold rounded-lg hover:bg-[#bfa14a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSearching ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </form>
                    {searchResults && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                                    Search Results
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Found {searchResults.total || 0} results for "{searchQuery}"
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Artifacts */}
                                {searchResults.artifacts?.map((artifact: any) => (
                                    <motion.div
                                        key={artifact.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                                        whileHover={{ y: -5 }}
                                    >
                                        {artifact.media && artifact.media.length > 0 && (
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={artifact.media[0].original_url}
                                                    alt={artifact.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <BoxIcon className="h-4 w-4 text-[#C2A14D]" />
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Artifact</span>
                                            </div>
                                            <h4 className="font-semibold text-black dark:text-white mb-2 line-clamp-2">
                                                {artifact.title}
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                                                {artifact.description}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{artifact.category}</span>
                                                <Link
                                                    href={`/artifacts/${artifact.id}`}
                                                    className="flex items-center gap-1 text-[#C2A14D] hover:text-[#bfa14a] transition"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {/* Projects */}
                                {searchResults.projects?.map((project: any) => (
                                    <motion.div
                                        key={project.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="h-4 w-4 text-[#C2A14D]" />
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Project</span>
                                            </div>
                                            <h4 className="font-semibold text-black dark:text-white mb-2 line-clamp-2">
                                                {project.title}
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                                                {project.description}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{project.status}</span>
                                                <Link
                                                    href={`/projects/${project.id}`}
                                                    className="flex items-center gap-1 text-[#C2A14D] hover:text-[#bfa14a] transition"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {/* Reports/Archives */}
                                {searchResults.archives?.map((archive: any) => (
                                    <motion.div
                                        key={archive.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="h-4 w-4 text-[#C2A14D]" />
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">Report</span>
                                            </div>
                                            <h4 className="font-semibold text-black dark:text-white mb-2 line-clamp-2">
                                                {archive.title}
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                                                {archive.author && `By ${archive.author}`}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{archive.category}</span>
                                                <Link
                                                    href={`/archives/${archive.id}`}
                                                    className="flex items-center gap-1 text-[#C2A14D] hover:text-[#bfa14a] transition"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {(!searchResults.artifacts || searchResults.artifacts.length === 0) &&
                                (!searchResults.projects || searchResults.projects.length === 0) &&
                                (!searchResults.archives || searchResults.archives.length === 0) && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No results found. Try adjusting your search terms or browse our collections.
                                        </p>
                                    </div>
                                )}
                        </div>
                    )}
                </motion.section>
            </div>
        </>
    );
}
