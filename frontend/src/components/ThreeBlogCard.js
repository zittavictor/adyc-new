import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, Plane } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Calendar, User, Eye, Edit } from 'lucide-react';

function Floating3DCard({ position, color, isHovered }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.02;
      
      if (isHovered) {
        meshRef.current.scale.setScalar(Math.sin(state.clock.elapsedTime * 4) * 0.05 + 1.05);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });
  
  return (
    <Box
      ref={meshRef}
      position={position}
      args={[1, 1.4, 0.1]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.8}
        roughness={0.1}
        metalness={0.2}
      />
    </Box>
  );
}

function Scene({ isHovered }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} color="orange" intensity={0.5} />
      <Floating3DCard 
        position={[0, 0, 0]} 
        color="#f97316" 
        isHovered={isHovered}
      />
    </>
  );
}

const ThreeBlogCard = ({ post, onClick, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl ${className}`}
      whileHover={{ scale: 1.02, y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-20">
        <Canvas
          camera={{ position: [0, 0, 2], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          <Scene isHovered={isHovered} />
        </Canvas>
      </div>
      
      {/* Card Content */}
      <div className="relative z-10 floating-card p-4 group cursor-pointer h-full">
        <div className="relative overflow-hidden rounded-lg mb-4">
          <motion.img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-48 object-cover transition-transform duration-300"
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          />
          
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent"
            animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          />
          
          <div className="absolute top-3 left-3">
            <motion.span 
              className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full"
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            >
              {post.category}
            </motion.span>
          </div>
          
          <motion.div 
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          >
            <div className="flex space-x-2">
              <button className="p-2 bg-white/90 dark:bg-neutral-800/90 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors backdrop-blur-sm">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white/90 dark:bg-neutral-800/90 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors backdrop-blur-sm">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mb-2">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{post.date}</span>
          <span className="mx-2">•</span>
          <User className="w-3 h-3 mr-1" />
          <span>{post.author}</span>
        </div>

        <motion.h3 
          className="font-semibold text-lg text-neutral-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2"
          animate={isHovered ? { x: 2 } : { x: 0 }}
        >
          {post.title}
        </motion.h3>
        
        <motion.p 
          className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-3"
          animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
        >
          {post.summary}
        </motion.p>
        
        <div className="flex items-center justify-between">
          <motion.span 
            className="text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors"
            animate={isHovered ? { x: 5 } : { x: 0 }}
          >
            Read More →
          </motion.span>
        </div>
        
        {/* Floating particles effect on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary-400 rounded-full"
                initial={{ 
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  scale: 0,
                  opacity: 0
                }}
                animate={{ 
                  y: '-20px',
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ThreeBlogCard;