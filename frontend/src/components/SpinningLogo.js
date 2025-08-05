import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';

const SpinningLogo = ({ size = 80 }) => {
  const [spinDirection, setSpinDirection] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const logoRef = useRef();

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

  return (
    <div className="flex justify-center mb-8">
      <motion.div
        onClick={handleClick}
        className="cursor-pointer relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ width: size, height: size }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 rounded-full blur-lg scale-110 -z-10 group-hover:scale-125 transition-transform" />
        
        {/* Main logo container */}
        <motion.div
          className="w-full h-full bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary-100/50 shadow-lg overflow-hidden"
          animate={isSpinning ? { rotate: 360 * spinDirection } : {}}
          transition={{ duration: 1, ease: "easeInOut" }}
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

        {/* Decorative ring */}
        <div className="absolute inset-0 rounded-full border border-primary-200/30 group-hover:border-primary-300/50 transition-colors" />
        
        {/* Click indicator */}
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-neutral-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Click to spin
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SpinningLogo;