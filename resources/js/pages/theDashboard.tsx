import React from 'react';

// Example font classes assume Tailwind CSS is set up with custom fonts
// Adjust classNames as needed for your actual font setup

const TheDashboard = () => {
  return (
    <div className="min-h-screen bg-[#181818] text-white font-sans flex flex-col relative overflow-hidden">
      {/* Header / Menu Bar */}
      <header className="flex items-center justify-between px-8 py-6 z-30 relative mb-10">
        <div className="flex items-center gap-3">
          {/* #1FB81D - logo (bottom center event thumb in original, but here as logo) */}
          <img src="/images/logo.png" alt="Museum Logo" className="h-10 w-10 rounded-full bg-white" />
          <span className="text-2xl font-bold tracking-wide">FLA</span>
        </div>
        <nav className="flex items-center gap-8 text-sm font-medium">
          <a href="#" className="hover:text-[#C2A14D]">OUR COLLECTION</a>
          <a href="#" className="hover:text-[#C2A14D]">SERVICE & RATES</a>
          <a href="#" className="hover:text-[#C2A14D]">REVIEWS</a>
          <a href="#" className="hover:text-[#C2A14D]">BLOG</a>
          <button className="ml-4">
            <span className="sr-only">User</span>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-row items-stretch px-8 pb-8 gap-2 relative">
        {/* Left: Text & CTA */}
        <section className="flex flex-col justify-center w-[45%] pr-4 z-20 relative">
          <h1 className="font-serif text-5xl font-bold leading-tight mb-3 relative z-30">
            Welcome to FLA <br /> National <span role="img" aria-label="museum">🏛️</span> Museum
          </h1>
          <p className="text-lg text-gray-300 mb-6 max-w-md relative z-30">
            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
          </p>
          <button className="bg-[#C2A14D] text-black font-semibold px-7 py-2 rounded-md w-max hover:bg-[#bfa14a] transition mb-6 relative z-30">
            BUY TICKET
          </button>
          {/* Highlight badge (optional, can be replaced with another image if needed) */}
          <div className="flex items-center gap-3 mt-2 relative z-30">
            <div className="relative w-14 h-14 rounded-full border-4 border-[#C2A14D] flex items-center justify-center bg-black">
              {/* Placeholder for badge or supporting image */}
            </div>
            <span className="text-sm text-gray-300">BIGGEST SKELETON COLLECTION</span>
          </div>
        </section>

        {/* Right: Main Image and overlays */}
        <section className="relative w-[55%] flex items-center justify-center z-10">
          {/* image1 - main skeleton/hero image */}
          <img
            src="/images/image1.png"
            alt="Main Skeleton Exhibit"
            className="absolute left-[-10%] top-[-8%] w-[120%] max-w-none object-contain z-10"
            style={{ pointerEvents: 'none' }}
          />
        </section>

        {/* image4 - bottom left, overlaps main content */}
        <img
          src="/images/image4.png"
          alt="Side Artifact"
          className="absolute left-0 bottom-4 w-40 h-40 object-contain z-40"
          style={{ pointerEvents: 'none' }}
        />
      </main>

      {/* Footnotes / Highlights */}
      <footer className="flex items-center justify-between px-8 py-5 bg-transparent text-gray-400 text-sm z-40 relative">
        {/* #1FB81D - logo (bottom center event thumb) */}
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Event Thumbnail" className="w-10 h-10 rounded-md object-cover" />
          <span>2022 Skeleton Anniversary Event</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="20" height="20" fill="currentColor" className="text-yellow-400"><polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7"/></svg>
          <span>4.8 (268 Reviews)</span>
        </div>
        {/* #16C5E4 - main (bottom right, community/users) */}
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Community" className="w-7 h-7 rounded-full object-cover" />
          <span>Join fund Community</span>
        </div>
      </footer>
    </div>
  );
};

export default TheDashboard;
