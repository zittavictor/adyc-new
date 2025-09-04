import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  const [showContent, setShowContent] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Simplify - just show content immediately and complete after a short delay
  useEffect(() => {
    console.log('SplashScreen mounted, setting showContent to true');
    setShowContent(true);
    
    const timer = setTimeout(() => {
      console.log('SplashScreen completing');
      onComplete();
    }, 2000); // 2 second delay
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - run once on mount

  // FLOATING CIRCLES ANIMATION SYSTEM - Adapted for ADYC colors with smoother performance
  const circleVariants = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, -8, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.05, 0.95, 1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // LETTER STAGGER ANIMATION FOR "ADYC" with better performance
  const letterVariants = {
    hidden: { y: 30, opacity: 0, rotate: -5 },
    visible: (i) => ({
      y: 0, opacity: 1, rotate: 0,
      transition: {
        delay: 1.5 + i * 0.08,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Smoother spinning animation for the logo
  const logoSpinVariants = {
    initial: { scale: 0.3, rotate: -90, opacity: 0 },
    animate: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: { 
        duration: 1,
        ease: "easeOut",
        scale: { duration: 0.8 },
        rotate: { duration: 1 }
      }
    }
  };

  if (!showContent) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-500 dark:border-primary-400 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center z-50 overflow-hidden"
    >
      {/* DYNAMIC FLOATING BACKGROUND CIRCLES - Optimized for performance */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            variants={circleVariants}
            animate="animate"
            className={`absolute rounded-full will-change-transform ${
              i % 3 === 0 
                ? 'bg-gradient-to-br from-primary-400/15 to-primary-600/25' 
                : i % 3 === 1 
                ? 'bg-gradient-to-br from-secondary-400/15 to-secondary-600/25'
                : 'bg-gradient-to-br from-primary-300/10 to-secondary-300/20'
            }`}
            style={{
              width: `${Math.random() * 40 + 30}px`,
              height: `${Math.random() * 40 + 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`
            }}
          />
        ))}
      </div>

      {/* MAIN LOGO CONTAINER WITH ADVANCED EFFECTS */}
      <div className="relative z-10 text-center">
        {/* LOGO CONTAINER WITH ADVANCED EFFECTS */}
        <div className="mb-8">
          <div className="relative mx-auto w-36 h-36 mb-6">
            {/* MULTI-LAYER GLOW SYSTEM - Optimized */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 dark:from-primary-400/30 dark:to-secondary-400/30 rounded-full blur-xl scale-125 -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/15 to-secondary-500/15 dark:from-primary-300/25 dark:to-secondary-300/25 rounded-full blur-2xl scale-150 -z-20 animate-pulse"></div>
            
            {/* LOGO CONTAINER WITH NEUMORPHIC DESIGN */}
            <motion.div 
              className="relative w-36 h-36 bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary-100/50 dark:border-neutral-600/50 shadow-lg overflow-hidden"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              <img 
                src="https://customer-assets.emergentagent.com/job_a7d4cce0-5f6d-4a96-91ac-874ffa2967f3/artifacts/etvajhhm_ChatGPT%20Image%20Sep%204%2C%202025%2C%2008_59_21%20AM.png"
                alt="ADYC Logo" 
                className="w-full h-full object-contain p-2 rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback text logo */}
              <div className="hidden w-full h-full bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 rounded-full items-center justify-center">
                <span className="text-white font-bold text-3xl tracking-wider">ADYC</span>
              </div>
            </motion.div>

            {/* DECORATIVE PULSING RINGS - Optimized */}
            <div className="absolute inset-0 rounded-full border border-primary-200/30 dark:border-primary-400/40 animate-ping" style={{ animationDuration: '2s' }}></div>
            <div className="absolute inset-0 rounded-full border border-secondary-200/20 dark:border-secondary-400/30 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* ANIMATED TITLE WITH LETTER STAGGER */}
        <div className="mb-4">
          <div className="text-5xl md:text-6xl font-bold mb-2 tracking-wider">
            {['A', 'D', 'Y', 'C'].map((letter, i) => (
              <span
                key={i}
                className="inline-block bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 bg-clip-text text-transparent mr-1"
                style={{ textShadow: '0 2px 4px rgba(249, 115, 22, 0.2)' }}
              >
                {letter}
              </span>
            ))}
          </div>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium tracking-wide">
            African Democratic Youth Congress
          </p>
        </div>
        
        {/* LOADING PROGRESS INDICATOR */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1, duration: 2 }}
          className="mx-auto mt-8 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full max-w-xs"
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
