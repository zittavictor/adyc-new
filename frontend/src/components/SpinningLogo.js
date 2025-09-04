import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';

const SpinningLogo = ({ className, size = 80 }) => {
  const [spinDirection, setSpinDirection] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [hasAutoSpun, setHasAutoSpun] = useState(false);

  // Auto-spin on component mount (page load)
  useEffect(() => {
    if (!hasAutoSpun) {
      const timer = setTimeout(() => {
        setIsSpinning(true);
        setHasAutoSpun(true);
        
        // Stop spinning after one full rotation
        setTimeout(() => {
          setIsSpinning(false);
        }, 2000); // 2 seconds for smooth rotation
      }, 1000); // Start after 1 second of page load

      return () => clearTimeout(timer);
    }
  }, [hasAutoSpun]);

  const handleClick = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      setIsClicked(true);
      setSpinDirection(prev => prev * -1); // Change direction
      
      // Stop spinning after one full rotation
      setTimeout(() => {
        setIsSpinning(false);
      }, 1000);
      
      // Remove clicked effect after animation
      setTimeout(() => {
        setIsClicked(false);
      }, 2000);
    }
  };

  const handleHoverStart = () => {
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
  };

  // Determine if logo should be spinning (either clicked or hovered)
  const shouldSpin = isSpinning || isHovered;

  return (
    <div className={`flex justify-center ${className}`}>
      <motion.div
        onClick={handleClick}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        className="cursor-pointer relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ width: size, height: size }}
      >
        {/* Enhanced glow effect that responds to hover and click */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }} className={`absolute inset-0 bg-gradient-to-br from-orange-500/30 to-green-500/30 rounded-full blur-xl transition-all duration-500 ${
          isClicked 
            ? 'scale-200 from-orange-600/60 to-green-600/60 blur-3xl shadow-2xl' 
            : isHovered 
              ? 'scale-150 from-orange-500/40 to-green-500/40 blur-2xl shadow-xl' 
              : 'scale-110 blur-lg shadow-lg group-hover:scale-125'
        }`} />
        
        {/* Additional prominent shadow for click effect */}
        {(isClicked || isHovered) && (
          <div className={`absolute inset-0 bg-gradient-to-br from-orange-400/20 to-green-400/20 rounded-full transition-all duration-700 ${
            isClicked 
              ? 'scale-250 blur-[4rem] opacity-60' 
              : 'scale-175 blur-2xl opacity-40'
          }`} />
        )}
        
        {/* Pulsing ring effect on hover/click */}
        {(isHovered || isClicked) && (
          <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
            isClicked 
              ? 'border-orange-400/70 animate-ping scale-125' 
              : 'border-orange-400/50 animate-ping'
          }`} />
        )}
        
        {/* Main logo container */}
        <motion.div
          className="w-full h-full bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center border border-orange-100/50 shadow-lg overflow-hidden relative"
          animate={shouldSpin ? { 
            rotate: isSpinning ? 360 * spinDirection : 360,
          } : {}}
          transition={{ 
            duration: isSpinning ? 1 : 2, 
            ease: isSpinning ? "easeInOut" : "linear",
            repeat: isHovered && !isSpinning ? Infinity : 0
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
          <div className="hidden w-full h-full bg-gradient-to-br from-orange-600 via-orange-700 to-green-600 rounded-full items-center justify-center">
            <span className="text-white font-bold text-2xl tracking-wider">ADYC</span>
          </div>
        </motion.div>

        {/* Decorative ring with hover/click effects */}
        <div className={`absolute inset-0 rounded-full border transition-all duration-300 ${
          isClicked
            ? 'border-orange-500/80 shadow-2xl scale-105'
            : isHovered 
              ? 'border-orange-400/60 shadow-md' 
              : 'border-orange-200/30 group-hover:border-orange-300/50'
        }`} />
        
        {/* Enhanced sparkle effects on hover/click */}
        {(isHovered || isClicked) && (
          <>
            <motion.div
              className={`absolute top-2 right-2 rounded-full ${
                isClicked ? 'w-2 h-2 bg-yellow-300' : 'w-1 h-1 bg-yellow-400'
              }`}
              animate={{ 
                scale: isClicked ? [0, 1.5, 0] : [0, 1, 0],
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: isClicked ? 2 : 1.5, 
                repeat: Infinity,
                delay: 0 
              }}
            />
            <motion.div
              className="absolute bottom-3 left-3 w-1 h-1 bg-yellow-300 rounded-full"
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                delay: 0.5 
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1 w-0.5 h-0.5 bg-yellow-500 rounded-full"
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                delay: 1 
              }}
            />
          </>
        )}
      </motion.div>
    </div>
  );
};

export default SpinningLogo;
