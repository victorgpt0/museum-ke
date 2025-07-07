import { type SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Search, FileText, MapPin, Calendar, Eye, BoxIcon } from 'lucide-react';

export default function Welcome() {
    const { auth, flash, searchResults } = usePage<SharedData & {
        flash?: { success?: string; error?: string };
        searchResults?: any;
    }>().props;

    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('all');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);

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

    // Animation variants
    const containerVariants = {
      hidden: {},
      show: {
        transition: {
          staggerChildren: 0.15,
        },
      },
    };
    const fadeUp = {
      hidden: { opacity: 0, y: 80 },
      show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: '8px',
                        padding: '12px 16px',
                    },
                    success: {
                        style: {
                            background: '#f0fdf4',
                            color: '#166534',
                            border: '1px solid #bbf7d0',
                        },
                        iconTheme: {
                            primary: '#16a34a',
                            secondary: '#f0fdf4',
                        },
                    },
                    error: {
                        style: {
                            background: '#fef2f2',
                            color: '#991b1b',
                            border: '1px solid #fecaca',
                        },
                        iconTheme: {
                            primary: '#dc2626',
                            secondary: '#fef2f2',
                        },
                    },
                    loading: {
                        style: {
                            background: '#eff6ff',
                            color: '#1e40af',
                            border: '1px solid #bfdbfe',
                        },
                    },
                }}
            />
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#FFFDD0] via-[#f7f7f7] to-[#e9e7e1] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-gradient-to-br dark:from-[#0a0a0a] dark:via-[#181818] dark:to-[#232323]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl flex items-center justify-between pl-2">
                    {/* Logo section */}
                    <div className="flex items-center gap-2 ml-0">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#444]">
                        <img src="/images/image7.png" alt="National Museum Logo" className="w-8 h-8 object-contain" />
                      </span>
                      <span className="font-bold text-lg tracking-wide text-[#1b1b18] dark:text-white">National Museum</span>
                    </div>
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-md border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b] transition-colors duration-200"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>

                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-md border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b] transition-colors duration-200"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                {/* Splash screen from theDashboard.tsx below */}
                <motion.div
                  className="w-full flex flex-col items-center justify-center"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <motion.main
                    className="flex-1 flex flex-row items-stretch px-10 py-12 gap-6 relative w-full max-w-6xl rounded-3xl shadow-xl bg-[#FFFDD0]/90 dark:bg-[#181818]/80 backdrop-blur-md border border-[#ececec] dark:border-[#232323]"
                    variants={fadeUp}
                  >
                    {/* Left: Text & CTA */}
                    <motion.section className="flex flex-col justify-center w-[45%] pr-4 z-20 relative" variants={fadeUp}>
                      <motion.h1 className="font-serif text-5xl font-bold leading-tight mb-3 relative z-30 text-black dark:text-white" variants={fadeUp}>
                        Welcome to the Nairobi National Museum <span role="img" aria-label="museum">🏛️</span>
                      </motion.h1>
                      <motion.p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-md relative z-30" variants={fadeUp}>
                      We invite you to help preserve our shared heritage by donating historical artifacts to our museum for future generations to learn from and appreciate.                      </motion.p>
                      <motion.button
                        className="bg-[#C2A14D] text-black font-semibold px-7 py-2 rounded-md w-max hover:bg-[#bfa14a] transition mb-6 relative z-30 shadow-lg hover:scale-105 focus:scale-105 focus:outline-none"
                        variants={fadeUp}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => window.location.href = route('acquisitions.create')}
                      >
                        Donate
                      </motion.button>
                      <motion.div className="flex items-center gap-3 mt-2 relative z-30" variants={fadeUp}>
                        <div className="relative w-14 h-14 rounded-full border-4 border-[#C2A14D] flex items-center justify-center bg-black shadow-md">
                          {/* Optional badge image */}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 mt-2">WORLD CLASS COLLECTION OF HISTORY</span>
                      </motion.div>
                    </motion.section>

                    {/* Right: Main Image and overlays */}
                    <motion.section className="relative w-[55%] flex flex-col items-center justify-center z-10" variants={fadeUp}>
                      {/* image1 - main skeleton/hero image, contained within the right section */}
                      <motion.img
                        src="/images/image1.png"
                        alt="Main Skeleton Exhibit"
                        className="relative w-[110%] max-w-[600px] h-auto object-cover rounded-xl shadow-2xl z-10"
                        style={{ pointerEvents: 'none' }}
                        variants={fadeUp}
                      />
                            <motion.div className={`mt-8`}>
                                <Link
                                    href="/explore"
                                    className="px-8 py-3 bg-[#C2A14D] text-black font-semibold rounded-lg hover:bg-[#bfa14a] transition"
                                >
                                    Explore Our Collections
                                </Link>
                            </motion.div>
                    </motion.section>

                    {/* image4 - bottom left, overlaps main content */}
                    <motion.img
                      src="/images/image4.png"
                      alt="Side Artifact"
                      className="absolute left-0 bottom-4 w-40 h-40 object-contain z-40 drop-shadow-xl"
                      style={{ pointerEvents: 'none' }}
                      variants={fadeUp}
                    />
                  </motion.main>

                  {/* Footnotes / Highlights */}
                  <motion.footer
                    className="flex items-center justify-between px-8 py-5 bg-transparent text-gray-500 text-sm z-40 relative w-full max-w-6xl mt-2"
                    variants={fadeUp}
                  >
                    {/* Art & Culture clickable */}
                    <a href="https://artsandculture.google.com/partner/national-museums-of-kenya" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#C2A14D] transition-colors">
                      <img src="/images/imag6.png" alt="Event Thumbnail" className="w-10 h-10 rounded-md object-cover" />
                      <span>Art & Culture</span>
                    </a>
                    {/* Instagram review section */}
                    <a href="https://www.instagram.com/museumsofkenya?igsh=MTZxaTlxbGp1bjAyeA==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-500 transition-colors">
                      {/* Instagram SVG icon */}
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="w-7 h-7"><rect width="20" height="20" x="2" y="2" rx="6" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
                      <span>Instagram</span>
                    </a>
                    {/* Join community as button to visit official museum */}
                    <a href="https://www.museums.or.ke/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#C2A14D] text-black font-semibold px-4 py-2 rounded-md shadow hover:bg-[#bfa14a] transition">
                      <img src="/images/image2.png" alt="Visit Icon" className="w-7 h-7 rounded-full object-cover" />
                      <span>Visit Official Museum</span>
                    </a>
                  </motion.footer>
                </motion.div>
            </div>
        </>
    );
}
