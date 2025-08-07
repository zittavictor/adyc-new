import React from 'react';
import { motion } from 'framer-motion';

const FloatingBackgroundElements = () => {
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingVariants2 = {
    animate: {
      y: [0, 15, 0],
      x: [0, -15, 0],
      rotate: [0, -3, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }
    }
  };

  const floatingVariants3 = {
    animate: {
      y: [0, -25, 0],
      x: [0, 5, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 4
      }
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large floating shape - top right */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-orange-500/8 to-green-500/8 rounded-full blur-3xl"
        style={{ filter: 'blur(60px)' }}
      />
      
      {/* Medium floating shape - bottom left */}
      <motion.div
        variants={floatingVariants2}
        animate="animate"
        className="absolute bottom-32 left-16 w-48 h-48 bg-gradient-to-br from-green-500/6 to-blue-500/6 rounded-full blur-2xl"
        style={{ filter: 'blur(40px)' }}
      />
      
      {/* Small floating shape - middle right */}
      <motion.div
        variants={floatingVariants3}
        animate="animate"
        className="absolute top-1/2 right-32 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-xl"
        style={{ filter: 'blur(30px)' }}
      />
      
      {/* Additional subtle shapes */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-br from-amber-500/4 to-orange-500/4 rounded-full blur-xl"
        style={{ filter: 'blur(25px)', animationDelay: '3s' }}
      />
      
      <motion.div
        variants={floatingVariants2}
        animate="animate"
        className="absolute bottom-1/4 right-1/3 w-36 h-36 bg-gradient-to-br from-teal-500/5 to-green-500/5 rounded-full blur-xl"
        style={{ filter: 'blur(35px)', animationDelay: '5s' }}
      />
      
      {/* Very subtle geometric shapes */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
          transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }
        }}
        className="absolute top-3/4 left-10 w-16 h-16 border border-orange-500/10 rounded-lg"
        style={{ transform: 'rotate(45deg)' }}
      />
      
      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1, 0.9, 1],
          transition: {
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }
        }}
        className="absolute top-1/6 right-1/4 w-12 h-12 border border-green-500/8 rounded-full"
      />
    </div>
  );
};

export default FloatingBackgroundElements;