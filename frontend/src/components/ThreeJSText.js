import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// 3D Interactive Text Component
const Interactive3DText = ({ text, position = [0, 0, 0], color = "#3b82f6" }) => {
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (textRef.current) {
      // Gentle floating animation
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
      
      // Mouse interaction - subtle tilting
      const mouseInfluence = hovered ? 0.2 : 0.05;
      textRef.current.rotation.x = mousePosition.current.y * mouseInfluence;
      textRef.current.rotation.y = mousePosition.current.x * mouseInfluence;
      
      // Scale animation on hover
      const targetScale = hovered ? 1.05 : 1;
      textRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.5}
      color={color}
      anchorX="center"
      anchorY="middle"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {text}
    </Text>
  );
};

// 3D Text Background for "Welcome to ADYC"
const ThreeJSTextBackground = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 50 
        }}
        style={{ 
          background: 'transparent',
          height: '100%',
          width: '100%'
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.2} />
        
        {/* Floating decorative text elements */}
        <Interactive3DText 
          text="YOUTH" 
          position={[-2, 1, -1]} 
          color="#10b981" 
        />
        <Interactive3DText 
          text="FUTURE" 
          position={[2, -1, -1]} 
          color="#8b5cf6" 
        />
        <Interactive3DText 
          text="DEMOCRACY" 
          position={[0, 0, -2]} 
          color="#f59e0b" 
        />
      </Canvas>
    </div>
  );
};

export { Interactive3DText, ThreeJSTextBackground };