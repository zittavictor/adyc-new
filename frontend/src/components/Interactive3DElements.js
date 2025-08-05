import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Mouse-Responsive Orb
const MouseResponsiveOrb = ({ position = [0, 0, 0], color = "#3b82f6" }) => {
  const orbRef = useRef();
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: position[0], y: position[1] });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (orbRef.current) {
      // Mouse following with smooth interpolation
      targetPosition.current.x = position[0] + mousePosition.current.x * 0.5;
      targetPosition.current.y = position[1] + mousePosition.current.y * 0.5;
      
      orbRef.current.position.x = THREE.MathUtils.lerp(
        orbRef.current.position.x,
        targetPosition.current.x,
        0.02
      );
      orbRef.current.position.y = THREE.MathUtils.lerp(
        orbRef.current.position.y,
        targetPosition.current.y,
        0.02
      );

      // Gentle rotation
      orbRef.current.rotation.x += 0.005;
      orbRef.current.rotation.y += 0.003;
      
      // Pulsing scale
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      orbRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={orbRef} position={position}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.3}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

// Floating Ring Component
const FloatingRing = ({ position = [0, 0, 0], color = "#8b5cf6" }) => {
  const ringRef = useRef();
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
    if (ringRef.current) {
      ringRef.current.rotation.x = mousePosition.current.y * 0.3;
      ringRef.current.rotation.y = mousePosition.current.x * 0.3 + state.clock.elapsedTime * 0.5;
      ringRef.current.rotation.z += 0.01;
    }
  });

  return (
    <mesh ref={ringRef} position={position}>
      <torusGeometry args={[0.8, 0.05, 8, 16]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.15}
        wireframe
      />
    </mesh>
  );
};

// Card hover 3D effect component
const CardHover3D = ({ className = "", children, intensity = 0.1 }) => {
  const containerRef = useRef();
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => {
      container.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10 * intensity;
      const rotateY = ((x - centerX) / centerX) * 10 * intensity;
      
      container.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        scale3d(1.02, 1.02, 1.02)
      `;
    };

    const handleMouseLeave = () => {
      container.style.transform = `
        perspective(1000px) 
        rotateX(0deg) 
        rotateY(0deg) 
        scale3d(1, 1, 1)
      `;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity]);

  return (
    <div 
      ref={containerRef}
      className={`transition-all duration-300 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

// Main Interactive 3D Elements Background
const Interactive3DElements = ({ className = "" }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: -1 }}>
      <Canvas
        camera={{ 
          position: [0, 0, 8], 
          fov: 45 
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.1} />
        
        {/* Multiple floating orbs */}
        <MouseResponsiveOrb position={[-3, 2, -2]} color="#3b82f6" />
        <MouseResponsiveOrb position={[3, -1, -3]} color="#10b981" />
        <MouseResponsiveOrb position={[0, 2, -4]} color="#f59e0b" />
        
        {/* Floating rings */}
        <FloatingRing position={[-2, -2, -5]} color="#8b5cf6" />
        <FloatingRing position={[2, 1, -6]} color="#ef4444" />
      </Canvas>
    </div>
  );
};

export { Interactive3DElements, CardHover3D, MouseResponsiveOrb, FloatingRing };