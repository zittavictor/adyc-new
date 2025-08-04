import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  const [showContent, setShowContent] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 100);
    const timer2 = setTimeout(() => onComplete(), 4000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  // FLOATING CIRCLES ANIMATION SYSTEM - Adapted for ADYC colors
  const circleVariants = {
    animate: {
      y: [0, -30, 0],
      x: [0, 15, -10, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.1, 0.9, 1],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // LETTER STAGGER ANIMATION FOR "ADYC"
  const letterVariants = {
    hidden: { y: 50, opacity: 0, rotate: -10 },
    visible: (i) => ({
      y: 0, opacity: 1, rotate: 0,
      transition: {
        delay: 2 + i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: showContent ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 flex items-center justify-center z-50 overflow-hidden"
    >
      {/* DYNAMIC FLOATING BACKGROUND CIRCLES - Adapted for ADYC colors */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            variants={circleVariants}
            animate="animate"
            className={`absolute rounded-full ${
              i % 3 === 0 
                ? 'bg-gradient-to-br from-primary-400/20 to-primary-600/30' 
                : i % 3 === 1 
                ? 'bg-gradient-to-br from-secondary-400/20 to-secondary-600/30'
                : 'bg-gradient-to-br from-primary-300/15 to-secondary-300/25'
            }`}
            style={{
              width: `${Math.random() * 60 + 40}px`,
              height: `${Math.random() * 60 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      {/* MAIN LOGO CONTAINER WITH ADVANCED EFFECTS */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.3, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative mx-auto w-40 h-40 mb-6">
            {/* MULTI-LAYER GLOW SYSTEM - Adapted for ADYC colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-secondary-600/30 rounded-full blur-xl scale-150 -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-2xl scale-200 -z-20 animate-pulse"></div>
            
            {/* LOGO CONTAINER WITH NEUMORPHIC DESIGN */}
            <div className="relative w-40 h-40 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-primary-100/50 shadow-neumorphic-light">
              <img 
                src="https://customer-assets.emergentagent.com/job_08188fa5-14cb-4a99-bccc-7b97522397cf/artifacts/3feq369o_ADYC%20LOGO%202-1.jpg"
                alt="ADYC Logo" 
                className="w-full h-full object-contain p-2 rounded-full"
                onLoad={() => setLogoLoaded(true)}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* FALLBACK TEXT LOGO */}
              <div className="hidden w-36 h-36 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 rounded-full items-center justify-center shadow-inner">
                <span className="text-white font-bold text-4xl tracking-wider">ADYC</span>
              </div>
            </div>

            {/* DECORATIVE PULSING RINGS - Adapted for ADYC colors */}
            <div className="absolute inset-0 rounded-full border-2 border-primary-200/40 animate-ping" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-0 rounded-full border border-secondary-200/30 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
          </div>
        </motion.div>

        {/* ANIMATED TITLE WITH LETTER STAGGER */}
        <div className="mb-4">
          <div className="text-6xl font-bold mb-2 tracking-wider">
            {['A', 'D', 'Y', 'C'].map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 bg-clip-text text-transparent mr-1"
                style={{ textShadow: '0 4px 8px rgba(249, 115, 22, 0.3)' }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="text-lg text-neutral-600 font-medium tracking-wide"
          >
            African Democratic Youth Congress
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;