import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';

const SpinningLogo = ({ size = 80 }) => {
  const [spinDirection, setSpinDirection] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
      setSpinDirection(prev => prev * -1); // Change direction
      
      // Stop spinning after one full rotation
      setTimeout(() => {
        setIsSpinning(false);
      }, 1000);
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
    <div className="flex justify-center mb-8">
      <motion.div
        onClick={handleClick}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        className="cursor-pointer relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ width: size, height: size }}
      >
        {/* Enhanced glow effect that responds to hover */}
        <div className={`absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 rounded-full blur-lg scale-110 -z-10 transition-all duration-300 ${
          isHovered ? 'scale-125 from-primary-600/30 to-secondary-600/30 blur-xl' : 'group-hover:scale-125'
        }`} />
        
        {/* Pulsing ring effect on hover */}
        {isHovered && (
          <div className="absolute inset-0 rounded-full border-2 border-primary-400/50 animate-ping" />
        )}
        
        {/* Main logo container */}
        <motion.div
          className="w-full h-full bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary-100/50 shadow-lg overflow-hidden relative"
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
            src="https://customer-assets.emergentagent.com/job_08188fa5-14cb-4a99-bccc-7b97522397cf/artifacts/3feq369o_ADYC%20LOGO%202-1.jpg"
            alt="ADYC Logo" 
            className="w-full h-full object-contain p-2 rounded-full"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback text logo */}
          <div className="hidden w-full h-full bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 rounded-full items-center justify-center">
            <span className="text-white font-bold text-2xl tracking-wider">ADYC</span>
          </div>
        </motion.div>

        {/* Decorative ring with hover effects */}
        <div className={`absolute inset-0 rounded-full border transition-all duration-300 ${
          isHovered 
            ? 'border-primary-400/60 shadow-md' 
            : 'border-primary-200/30 group-hover:border-primary-300/50'
        }`} />
        
        {/* Sparkle effects on hover */}
        {isHovered && (
          <>
            <motion.div
              className="absolute top-2 right-2 w-1 h-1 bg-yellow-400 rounded-full"
              animate={{ 
                scale: [0, 1, 0],
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 1.5, 
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