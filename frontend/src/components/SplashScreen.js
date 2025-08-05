import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  const [showContent, setShowContent] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Preload the logo image
  useEffect(() => {
    const preloadLogo = new Image();
    preloadLogo.src = "https://customer-assets.emergentagent.com/job_08188fa5-14cb-4a99-bccc-7b97522397cf/artifacts/3feq369o_ADYC%20LOGO%202-1.jpg";
    preloadLogo.onload = () => {
      setLogoLoaded(true);
      setShowContent(true);
    };
    preloadLogo.onerror = () => {
      setLogoError(true);
      setShowContent(true);
    };
    
    // Fallback timeout to show content even if image fails
    const fallbackTimer = setTimeout(() => {
      if (!logoLoaded && !logoError) {
        setLogoError(true);
        setShowContent(true);
      }
    }, 2000);
    
    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    // Only start completion timer after content is shown
    if (showContent) {
      const timer = setTimeout(() => onComplete(), 1500); // Reduced to 1.5 seconds for faster transition
      return () => clearTimeout(timer);
    }
  }, [onComplete, showContent]);

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
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
          />
          <p className="mt-4 text-primary-600 font-medium">Loading ADYC...</p>
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
      className="fixed inset-0 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 flex items-center justify-center z-50 overflow-hidden"
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
        <motion.div
          variants={logoSpinVariants}
          initial="initial"
          animate="animate"
          className="mb-8"
        >
          <div className="relative mx-auto w-36 h-36 mb-6">
            {/* MULTI-LAYER GLOW SYSTEM - Optimized */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 rounded-full blur-xl scale-125 -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/15 to-secondary-500/15 rounded-full blur-2xl scale-150 -z-20 animate-pulse"></div>
            
            {/* LOGO CONTAINER WITH NEUMORPHIC DESIGN */}
            <div className="relative w-36 h-36 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary-100/50 shadow-lg">
              {logoLoaded && !logoError ? (
                <img 
                  src="https://customer-assets.emergentagent.com/job_08188fa5-14cb-4a99-bccc-7b97522397cf/artifacts/3feq369o_ADYC%20LOGO%202-1.jpg"
                  alt="ADYC Logo" 
                  className="w-full h-full object-contain p-2 rounded-full"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-white font-bold text-3xl tracking-wider">ADYC</span>
                </div>
              )}
            </div>

            {/* DECORATIVE PULSING RINGS - Optimized */}
            <div className="absolute inset-0 rounded-full border border-primary-200/30 animate-ping" style={{ animationDuration: '2s' }}></div>
            <div className="absolute inset-0 rounded-full border border-secondary-200/20 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
          </div>
        </motion.div>

        {/* ANIMATED TITLE WITH LETTER STAGGER */}
        <div className="mb-4">
          <div className="text-5xl md:text-6xl font-bold mb-2 tracking-wider">
            {['A', 'D', 'Y', 'C'].map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 bg-clip-text text-transparent mr-1 will-change-transform"
                style={{ textShadow: '0 2px 4px rgba(249, 115, 22, 0.2)' }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="text-lg text-neutral-600 font-medium tracking-wide"
          >
            African Democratic Youth Congress
          </motion.p>
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