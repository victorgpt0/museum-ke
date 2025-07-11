import React, { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { MapPin, Star, AlertTriangle, Package, Cloud, Users, Shield, Navigation } from 'lucide-react';

function LandingPage() {
  const particlesRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [theme, setTheme] = useState('light'); // Enhanced light mode as default

  // Theme toggle function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Enhanced particle effect
  useEffect(() => {
    const createParticles = () => {
      if (!particlesRef.current) return;
      particlesRef.current.innerHTML = '';
      for (let i = 0; i < (theme === 'dark' ? 25 : 30); i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * (theme === 'dark' ? 4 + 2 : 6 + 3)}px;
          height: ${Math.random() * (theme === 'dark' ? 4 + 2 : 6 + 3)}px;
          background: ${theme === 'dark' 
            ? 'linear-gradient(45deg, #39ff14, #00d4ff, #ff1493)'
            : 'linear-gradient(45deg, #ff6b35, #f7931e, #8b5cf6, #06b6d4)'};
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          animation: float ${Math.random() * (theme === 'dark' ? 6 + 6 : 8 + 8)}s linear infinite;
          animation-delay: ${Math.random() * (theme === 'dark' ? 8 : 10)}s;
          pointer-events: none;
          opacity: ${Math.random() * (theme === 'dark' ? 0.8 + 0.2 : 0.7 + 0.3)};
          box-shadow: ${theme === 'dark' 
            ? '0 0 15px rgba(0, 212, 255, 0.3)' 
            : '0 0 20px rgba(255, 107, 53, 0.3)'};
        `;
        particlesRef.current.appendChild(particle);
      }
    };
    createParticles();
    const interval = setInterval(createParticles, theme === 'dark' ? 12000 : 15000);
    return () => clearInterval(interval);
  }, [theme]);

  // Auto-rotating testimonials
  useEffect(() => {
    const testimonials = document.querySelectorAll('.testimonial-slide');
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Stage Locator",
      description: "Find exact matatu stages with GPS precision",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "SACCO Ratings",
      description: "Rate and review your matatu experience",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Real-time Alerts",
      description: "Get traffic updates from drivers instantly",
      color: "from-rose-500 to-pink-600"
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Lost & Found",
      description: "Community-driven item recovery system",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Weather Updates",
      description: "Plan your journey with live weather data",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safety First",
      description: "Enhanced security through transparency",
      color: "from-purple-500 to-violet-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Daily Commuter",
      text: "Finally, I can find my matatu stage without asking around!"
    },
    {
      name: "John K.",
      role: "Matatu Driver",
      text: "The alert system helps me navigate traffic like never before."
    },
    {
      name: "Grace W.",
      role: "Student",
      text: "Lost my phone and found it through the app. Amazing!"
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background: ${theme === 'dark' 
            ? 'linear-gradient(135deg, #0a0a0a 0%, #1a0b2e 25%, #16213e 50%, #0a0a0a 100%)'
            : 'linear-gradient(135deg, #fef7ff 0%, #f0f9ff 15%, #ecfdf5 30%, #fffbeb 45%, #fdf2f8 60%, #f0f9ff 75%, #fef7ff 100%)'};
          color: ${theme === 'dark' ? '#ffffff' : '#1f2937'};
          overflow-x: hidden;
          position: relative;
        }

        .cyber-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: ${theme === 'dark'
            ? `
              radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(57, 255, 20, 0.1) 0%, transparent 50%),
              linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px)
            `
            : `
              radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.06) 0%, transparent 50%),
              linear-gradient(rgba(255, 107, 53, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
            `};
          background-size: ${theme === 'dark' ? '100px 100px, 100px 100px, 50px 50px, 50px 50px' : '100px 100px, 100px 100px, 100px 100px, 60px 60px, 60px 60px'};
          z-index: -2;
          animation: gridPulse ${theme === 'dark' ? '8' : '10'}s ease-in-out infinite;
        }

        @keyframes gridPulse {
          0%, 100% { opacity: ${theme === 'dark' ? '0.3' : '0.4'}; transform: scale(1); }
          50% { opacity: ${theme === 'dark' ? '0.6' : '0.8'}; transform: scale(${theme === 'dark' ? '1.02' : '1.01'}); }
        }

        @keyframes float {
          0% { transform: translateY(100vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) translateX(100px) rotate(360deg); opacity: 0; }
        }

        @keyframes slideInUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideInLeft {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 2rem;
          padding-top: 6rem;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          max-width: 800px;
          animation: slideInUp 1s ease-out;
        }

        .hero-title {
          font-size: 4rem;
          font-family: 'Orbitron', monospace;
          background: ${theme === 'dark' 
            ? 'linear-gradient(45deg, #00d4ff, #39ff14, #ff1493, #00d4ff)'
            : 'linear-gradient(45deg, #ff6b35, #8b5cf6, #06b6d4, #f7931e)'};
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          animation: gradientShift ${theme === 'dark' ? '3' : '4'}s ease-in-out infinite, bounce 2s ease-in-out infinite;
          font-weight: ${theme === 'dark' ? '700' : '900'};
          letter-spacing: ${theme === 'dark' ? '0' : '-2px'};
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .hero-tagline {
          font-size: 1.5rem;
          ${theme === 'dark' 
            ? 'color: #39ff14;' 
            : 'background: linear-gradient(45deg, #ff6b35, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;'}
          font-weight: 600;
          margin-bottom: 1.5rem;
          animation: fadeIn 1s ease-out 0.5s both;
        }

        .hero-description {
          font-size: 1.2rem;
          color: ${theme === 'dark' ? '#e2e8f0' : '#6b7280'};
          margin-bottom: 2rem;
          line-height: ${theme === 'dark' ? '1.6' : '1.8'};
          animation: fadeIn 1s ease-out 1s both;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          animation: slideInUp 1s ease-out 1.5s both;
          justify-content: center;
        }

        .btn-primary, .btn-secondary {
          padding: 18px 36px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.4s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
          border: none;
        }

        .btn-primary {
          background: ${theme === 'dark' 
            ? 'linear-gradient(45deg, #00d4ff, #39ff14)' 
            : 'linear-gradient(45deg, #ff6b35, #f7931e)'};
          color: ${theme === 'dark' ? '#000' : 'white'};
          box-shadow: ${theme === 'dark' 
            ? '0 10px 30px rgba(0, 212, 255, 0.3)' 
            : '0 10px 30px rgba(255, 107, 53, 0.4)'};
        }

        .btn-primary:hover {
          transform: translateY(${theme === 'dark' ? '-3' : '-4'}px);
          box-shadow: ${theme === 'dark' 
            ? '0 15px 40px rgba(0, 212, 255, 0.4)' 
            : '0 20px 40px rgba(255, 107, 53, 0.5)'};
          background: ${theme === 'dark' 
            ? 'linear-gradient(45deg, #39ff14, #00d4ff)' 
            : 'linear-gradient(45deg, #f7931e, #ff6b35)'};
        }

        .btn-secondary {
          background: ${theme === 'dark' ? 'transparent' : 'rgba(255, 255, 255, 0.9)'};
          border: 2px solid ${theme === 'dark' ? '#00d4ff' : '#8b5cf6'};
          color: ${theme === 'dark' ? '#00d4ff' : '#8b5cf6'};
          backdrop-filter: ${theme === 'dark' ? 'none' : 'blur(10px)'};
        }

        .btn-secondary:hover {
          background: ${theme === 'dark' ? '#00d4ff' : '#8b5cf6'};
          color: ${theme === 'dark' ? '#000' : 'white'};
          transform: translateY(${theme === 'dark' ? '-3' : '-4'}px);
          box-shadow: ${theme === 'dark' 
            ? '0 15px 40px rgba(0, 212, 255, 0.3)' 
            : '0 15px 35px rgba(139, 92, 246, 0.3)'};
        }

        .hero-image {
          width: 100%;
          max-width: 600px;
          height: 400px;
          background: ${theme === 'dark' 
            ? 'linear-gradient(45deg, rgba(0, 212, 255, 0.1), rgba(57, 255, 20, 0.1))' 
            : 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(139, 92, 246, 0.1))'};
          border-radius: ${theme === 'dark' ? '20px' : '30px'};
          border: ${theme === 'dark' ? '2px dashed #00d4ff' : '3px solid rgba(255, 107, 53, 0.2)'};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2rem auto;
          animation: pulse ${theme === 'dark' ? '2' : '3'}s ease-in-out infinite;
          backdrop-filter: ${theme === 'dark' ? 'none' : 'blur(10px)'};
          box-shadow: ${theme === 'dark' 
            ? '0 10px 30px rgba(0, 212, 255, 0.2)' 
            : '0 20px 40px rgba(255, 107, 53, 0.15)'};
        }

        .section {
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          text-align: center;
          font-size: ${theme === 'dark' ? '2.5rem' : '2.8rem'};
          font-family: 'Orbitron', monospace;
          ${theme === 'dark' 
            ? 'color: #00d4ff;' 
            : 'background: linear-gradient(45deg, #ff6b35, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;'}
          margin-bottom: 3rem;
          font-weight: ${theme === 'dark' ? '600' : '700'};
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(${theme === 'dark' ? '300px' : '320px'}, 1fr));
          gap: ${theme === 'dark' ? '2rem' : '2.5rem'};
          margin-top: 3rem;
        }

        .feature-card {
          background: ${theme === 'dark' 
            ? 'rgba(26, 11, 46, 0.3)' 
            : 'rgba(255, 255, 255, 0.8)'};
          border: 1px solid ${theme === 'dark' 
            ? 'rgba(0, 212, 255, 0.2)' 
            : 'rgba(255, 107, 53, 0.1)'};
          border-radius: ${theme === 'dark' ? '20px' : '25px'};
          padding: ${theme === 'dark' ? '2rem' : '2.5rem'};
          text-align: center;
          transition: all ${theme === 'dark' ? '0.3s' : '0.4s'} ease;
          backdrop-filter: ${theme === 'dark' ? 'blur(10px)' : 'blur(15px)'};
          position: relative;
          overflow: hidden;
          box-shadow: ${theme === 'dark' 
            ? '0 10px 30px rgba(0, 212, 255, 0.1)' 
            : '0 10px 30px rgba(0, 0, 0, 0.05)'};
        }

        ${theme === 'light' ? `
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.5), transparent);
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        ` : ''}

        .feature-card:hover {
          transform: translateY(${theme === 'dark' ? '-10px' : '-15px'});
          box-shadow: ${theme === 'dark' 
            ? '0 20px 40px rgba(0, 212, 255, 0.2)' 
            : '0 25px 50px rgba(255, 107, 53, 0.15)'};
          background: ${theme === 'dark' 
            ? 'rgba(26, 11, 46, 0.5)' 
            : 'rgba(255, 255, 255, 0.95)'};
        }

        .feature-icon {
          background: linear-gradient(45deg, var(--icon-color-1), var(--icon-color-2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .testimonial-section {
          background: ${theme === 'dark' 
            ? 'rgba(26, 11, 46, 0.2)' 
            : 'rgba(255, 255, 255, 0.7)'};
          border-radius: ${theme === 'dark' ? '20px' : '30px'};
          padding: ${theme === 'dark' ? '3rem' : '4rem'};
          margin: ${theme === 'dark' ? '4rem' : '5rem'} 0;
          text-align: center;
          position: relative;
          overflow: hidden;
          backdrop-filter: ${theme === 'dark' ? 'blur(10px)' : 'blur(20px)'};
          border: 1px solid ${theme === 'dark' 
            ? 'rgba(0, 212, 255, 0.1)' 
            : 'rgba(255, 107, 53, 0.1)'};
          box-shadow: ${theme === 'dark' 
            ? '0 15px 30px rgba(0, 212, 255, 0.1)' 
            : '0 20px 40px rgba(0, 0, 0, 0.05)'};
        }

        .testimonial-slide {
          display: none;
          animation: fadeIn 0.5s ease-in-out;
        }

        .testimonial-slide.active {
          display: block;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(${theme === 'dark' ? '200px' : '220px'}, 1fr));
          gap: ${theme === 'dark' ? '2rem' : '2rem'};
          margin: ${theme === 'dark' ? '3rem' : '4rem'} 0;
        }

        .stat-card {
          text-align: center;
          padding: ${theme === 'dark' ? '2rem' : '2.5rem'};
          background: ${theme === 'dark' 
            ? 'rgba(0, 212, 255, 0.1)' 
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 107, 53, 0.05))'};
          border-radius: ${theme === 'dark' ? '15px' : '20px'};
          transition: all ${theme === 'dark' ? '0.3s' : '0.4s'} ease;
          backdrop-filter: ${theme === 'dark' ? 'none' : 'blur(10px)'};
          border: 1px solid ${theme === 'dark' 
            ? 'rgba(0, 212, 255, 0.1)' 
            : 'rgba(255, 107, 53, 0.1)'};
          box-shadow: ${theme === 'dark' 
            ? '0 10px 25px rgba(0, 212, 255, 0.1)' 
            : '0 10px 25px rgba(0, 0, 0, 0.05)'};
        }

        .stat-card:hover {
          transform: translateY(${theme === 'dark' ? '-5px' : '-8px'});
          box-shadow: ${theme === 'dark' 
            ? '0 15px 30px rgba(0, 212, 255, 0.2)' 
            : '0 20px 40px rgba(255, 107, 53, 0.1)'};
        }

        .stat-number {
          font-size: ${theme === 'dark' ? '3rem' : '3.5rem'};
          font-weight: 900;
          ${theme === 'dark' 
            ? 'color: #39ff14;' 
            : 'background: linear-gradient(45deg, #ff6b35, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;'}
          margin-bottom: 0.5rem;
        }

        .cta-section {
          background: ${theme === 'dark' 
            ? 'linear-gradient(45deg, rgba(0, 212, 255, 0.1), rgba(57, 255, 20, 0.1))' 
            : 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(139, 92, 246, 0.1))'};
          border-radius: ${theme === 'dark' ? '20px' : '30px'};
          padding: ${theme === 'dark' ? '4rem 2rem' : '5rem 2rem'};
          text-align: center;
          margin: ${theme === 'dark' ? '4rem' : '5rem'} 0;
          backdrop-filter: ${theme === 'dark' ? 'blur(10px)' : 'blur(20px)'};
          border: 1px solid ${theme === 'dark' 
            ? 'rgba(0, 212, 255, 0.2)' 
            : 'rgba(255, 107, 53, 0.2)'};
          box-shadow: ${theme === 'dark' 
            ? '0 20px 40px rgba(0, 212, 255, 0.1)' 
            : '0 25px 50px rgba(0, 0, 0, 0.08)'};
        }

        .animate-visible {
          animation: slideInUp 0.8s ease-out both;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .section-title {
            font-size: 1.7rem;
          }
          .hero-buttons {
            flex-direction: column;
            gap: 1rem;
            width: 100%;
            justify-content: center;
            align-items: center;
          }
          .features-grid {
            grid-template-columns: 1fr;
            gap: 1.2rem;
          }
          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1.2rem;
          }
          .feature-card, .stat-card, .testimonial-section, .cta-section {
            padding: 1.2rem;
          }
          .hero-image {
            height: 180px;
            max-width: 100%;
          }
          .feature-icon {
            font-size: 2rem;
          }
        }
        @media (max-width: 600px) {
          .hero-section {
            padding: 1rem;
          }
          .section {
            padding: 2rem 0.5rem;
          }
          .features-grid, .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .feature-card, .stat-card, .testimonial-section, .cta-section {
            padding: 0.8rem;
          }
          .hero-title {
            font-size: 1.5rem;
          }
          .section-title {
            font-size: 1.2rem;
          }
          .hero-image {
            height: 120px;
          }
          .btn-primary, .btn-secondary {
            padding: 12px 18px;
            font-size: 1rem;
          }
        }
        @media (max-width: 400px) {
          .hero-title {
            font-size: 1.1rem;
          }
          .section-title {
            font-size: 1rem;
          }
          .hero-image {
            height: 80px;
          }
          .btn-primary, .btn-secondary {
            padding: 8px 10px;
            font-size: 0.9rem;
          }
        }

        /* Scroll indicator */
        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          animation: bounce 2s ease-in-out infinite;
          color: ${theme === 'dark' ? '#00d4ff' : '#ff6b35'};
        }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-50px);}
          to { opacity: 1; transform: translateX(0);}
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(50px);}
          to { opacity: 1; transform: translateX(0);}
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8);}
          to { opacity: 1; transform: scale(1);}
        }
        .fade-in-left { animation: fadeInLeft 0.8s both; }
        .fade-in-right { animation: fadeInRight 0.8s both; }
        .zoom-in { animation: zoomIn 0.8s both; }
      `}</style>

      <div className="cyber-grid"></div>
      <div ref={particlesRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />

      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '12px 16px',
          borderRadius: '50px',
          border: 'none',
          background: theme === 'dark' 
            ? 'linear-gradient(45deg, #00d4ff, #39ff14)' 
            : 'linear-gradient(45deg, #ff6b35, #8b5cf6)',
          color: theme === 'dark' ? '#000' : '#fff',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: theme === 'dark' 
            ? '0 4px 15px rgba(0, 212, 255, 0.3)' 
            : '0 4px 15px rgba(255, 107, 53, 0.3)',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
        onMouseEnter={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.transform = 'translateY(-2px)';
          target.style.boxShadow = theme === 'dark' 
            ? '0 6px 20px rgba(0, 212, 255, 0.4)' 
            : '0 6px 20px rgba(255, 107, 53, 0.4)';
        }}
        onMouseLeave={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.transform = 'translateY(0)';
          target.style.boxShadow = theme === 'dark' 
            ? '0 4px 15px rgba(0, 212, 255, 0.3)' 
            : '0 4px 15px rgba(255, 107, 53, 0.3)';
        }}
      >
        {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
      </button>

      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-content">
          <h1 className="hero-title">CBD Matatu Connect</h1>
          <div className="hero-tagline">Your Smart Matatu Companion</div>
          <p className="hero-description">
            Navigate Nairobi's CBD with confidence. Find stages, rate SACCOs, get real-time alerts, and travel smarter through the city.
          </p>
          
          {/* Hero Image Placeholder */}
          <div className="hero-image">
            <div style={{ textAlign: 'center', color: theme === 'dark' ? '#00d4ff' : '#ff6b35' }}>
              <Navigation size={48} />
              <img 
                src=".\pexels-volker-morr-57769261-31102079.jpg" 
                alt="Nairobi CBD Matatu Scene"
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </div>
          </div>
          
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => router.visit('/register')}>
              Get Started
            </button>
            <button className="btn-secondary" onClick={() => router.visit('/login')}>
              Sign In
            </button>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <div style={{ fontSize: '2rem' }}>↓</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" id="features" data-animate>
        <h2 className={`section-title ${isVisible.features ? 'animate-visible' : ''}`}>
          Powerful Features
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => {
            const colorParts = feature.color.split(' ');
            const color1 = colorParts[0]?.replace('from-', '') || '';
            const color2 = colorParts[1]?.replace('to-', '') || '';
            const featureId = `feature-card-${index}`;
            const animationClass = isVisible[featureId] ? (index % 2 === 0 ? 'fade-in-left' : 'fade-in-right') : '';
            return (
              <div key={index} className={`feature-card ${animationClass}`} id={featureId} data-animate style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="feature-icon" style={{ 
                  '--icon-color-1': `var(--${color1})`,
                  '--icon-color-2': `var(--${color2})`
                } as React.CSSProperties}>
                  {feature.icon}
                </div>
                <h3 style={{ color: theme === 'dark' ? '#00d4ff' : '#ff6b35', marginBottom: '1rem', fontSize: theme === 'dark' ? '1.2rem' : '1.4rem', fontWeight: '600' }}>
                  {feature.title}
                </h3>
                <p style={{ color: theme === 'dark' ? '#e2e8f0' : '#6b7280', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section" id="stats" data-animate>
        <h2 className={`section-title ${isVisible.stats ? 'animate-visible' : ''}`}>
          Making a Difference
        </h2>
        <div className="stats-grid">
          {["500+", "50+", "25+", "98%"].map((num, idx) => (
            <div className={`stat-card ${isVisible[`stat-card-${idx}`] ? 'zoom-in' : ''}`} id={`stat-card-${idx}`} data-animate key={idx}>
              <div className="stat-number">{num}</div>
              <div style={{ color: theme === 'dark' ? '#e2e8f0' : '#6b7280', fontWeight: '600' }}>
                {["Daily Commuters", "Matatu Stages", "SACCO Partners", "User Satisfaction"][idx]}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" id="how-it-works" data-animate>
        <h2 className={`section-title ${isVisible['how-it-works'] ? 'animate-visible' : ''}`}>
          How It Works
        </h2>
        <div className="features-grid">
          <div className="feature-card">
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📍</div>
            <h3 style={{ color: theme === 'dark' ? '#00d4ff' : '#ff6b35', marginBottom: '1rem', fontSize: theme === 'dark' ? '1.2rem' : '1.4rem', fontWeight: '600' }}>
              Find Your Stage
            </h3>
            <p style={{ color: theme === 'dark' ? '#e2e8f0' : '#6b7280', lineHeight: '1.6' }}>
              Use our locator to find the perfect matatu stage for your destination
            </p>
            <div style={{ 
              width: '100%', 
              height: '200px', 
              background: theme === 'dark' ? 'rgba(0, 212, 255, 0.1)' : 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(139, 92, 246, 0.1))',
              border: `2px dashed ${theme === 'dark' ? '#00d4ff' : '#ff6b35'}`,
              borderRadius: theme === 'dark' ? '10px' : '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: theme === 'dark' ? '1rem' : '1.5rem'
            }}>
              <img
                src="/Map.png"
                alt="Stage Locator Interface"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
          </div>
          
          <div className="feature-card">
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⭐</div>
            <h3 style={{ color: theme === 'dark' ? '#00d4ff' : '#ff6b35', marginBottom: '1rem', fontSize: theme === 'dark' ? '1.2rem' : '1.4rem', fontWeight: '600' }}>
              Rate & Review
            </h3>
            <p style={{ color: theme === 'dark' ? '#e2e8f0' : '#6b7280', lineHeight: '1.6' }}>
              Share your experience and help others choose the best SACCOs for their journey
            </p>
            <div style={{ 
              width: '100%', 
              height: '200px', 
              background: theme === 'dark' ? 'rgba(0, 212, 255, 0.1)' : 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(139, 92, 246, 0.1))',
              border: `2px dashed ${theme === 'dark' ? '#00d4ff' : '#8b5cf6'}`,
              borderRadius: theme === 'dark' ? '10px' : '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: theme === 'dark' ? '1rem' : '1.5rem'
            }}>
              <img
                src="/R&R.png"
                alt="Rating System Interface"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
          </div>
          
          <div className="feature-card">
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🚨</div>
            <h3 style={{ color: theme === 'dark' ? '#00d4ff' : '#ff6b35', marginBottom: '1rem', fontSize: theme === 'dark' ? '1.2rem' : '1.4rem', fontWeight: '600' }}>
              Stay Informed
            </h3>
            <p style={{ color: theme === 'dark' ? '#e2e8f0' : '#6b7280', lineHeight: '1.6' }}>
              Get alerts about traffic, weather, and important updates helpful for drivers and commuters
            </p>
            <div style={{ 
              width: '100%', 
              height: '200px', 
              background: theme === 'dark' ? 'rgba(0, 212, 255, 0.1)' : 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(139, 92, 246, 0.1))',
              border: `2px dashed ${theme === 'dark' ? '#00d4ff' : '#06b6d4'}`,
              borderRadius: theme === 'dark' ? '10px' : '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: theme === 'dark' ? '1rem' : '1.5rem'
            }}>
              <img
                src="/Alert.png"
                alt="Real-time Alerts Interface"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section" id="testimonials" data-animate>
        <div className="testimonial-section">
          <h2 className={`section-title ${isVisible.testimonials ? 'animate-visible' : ''}`}>
            What Users Say
          </h2>
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`testimonial-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>💬</div>
              <p style={{ 
                fontSize: theme === 'dark' ? '1.5rem' : '1.6rem', 
                fontStyle: 'italic', 
                marginBottom: theme === 'dark' ? '1rem' : '1.5rem',
                color: theme === 'dark' ? '#e2e8f0' : '#6b7280',
                lineHeight: '1.6'
              }}>
                "{testimonial.text}"
              </p>
              <div style={{ color: theme === 'dark' ? '#39ff14' : '#8b5cf6', fontWeight: '600' }}>
                <strong>{testimonial.name}</strong> - {testimonial.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" id="cta" data-animate>
        <div className="cta-section">
          <h2 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            color: theme === 'dark' ? '#00d4ff' : '#ff6b35'
          }}>
            Ready to Transform Your Commute?
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            marginBottom: '2rem',
            color: theme === 'dark' ? '#e2e8f0' : '#6b7280'
          }}>
            Join thousands of commuters who are already using CBD Matatu Connect to make their daily travel easier, safer, and more efficient.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => router.visit('/register')}>
              Start Your Journey
            </button>
            <button className="btn-secondary" onClick={() => router.visit('/login')}>
              I'm Already a User
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(26, 32, 44, 0.4)',
        borderTop: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(26, 32, 44, 0.1)'}`
      }}>
      </footer>
    </>
  );
}

export default LandingPage;