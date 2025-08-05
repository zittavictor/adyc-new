import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Floating particles component
const FloatingParticles = ({ count = 50 }) => {
  const mesh = useRef();
  const mousePosition = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Create particle positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push([
        (Math.random() - 0.5) * viewport.width * 2,
        (Math.random() - 0.5) * viewport.height * 2,
        Math.random() * 20 - 10
      ]);
    }
    return temp;
  }, [count, viewport]);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      // Gentle rotation and mouse following
      mesh.current.rotation.y += 0.001;
      mesh.current.rotation.x += 0.0005;
      
      // Mouse interaction - subtle movement
      const mouseInfluence = 0.1;
      mesh.current.rotation.y += mousePosition.current.x * mouseInfluence * 0.01;
      mesh.current.rotation.x += mousePosition.current.y * mouseInfluence * 0.01;

      // Animate individual particles
      const positions = mesh.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
        positions[i3] += Math.cos(state.clock.elapsedTime + i * 0.1) * 0.001;
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(particles.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#3b82f6"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
};

// Floating geometric shapes
const FloatingGeometry = () => {
  const group = useRef();
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
    if (group.current) {
      group.current.rotation.y += 0.002;
      
      // Mouse interaction
      group.current.rotation.x += mousePosition.current.y * 0.02;
      group.current.rotation.y += mousePosition.current.x * 0.02;
    }
  });

  return (
    <group ref={group}>
      {/* Octahedron */}
      <mesh position={[-4, 2, -5]}>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
      
      {/* Icosahedron */}
      <mesh position={[4, -1, -3]}>
        <icosahedronGeometry args={[0.25]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>
      
      {/* Dodecahedron */}
      <mesh position={[0, 3, -8]}>
        <dodecahedronGeometry args={[0.2]} />
        <meshStandardMaterial
          color="#f59e0b"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>

      {/* Tetrahedron */}
      <mesh position={[-2, -2, -6]}>
        <tetrahedronGeometry args={[0.35]} />
        <meshStandardMaterial
          color="#ef4444"
          transparent
          opacity={0.12}
          wireframe
        />
      </mesh>
    </group>
  );
};

// Main background component
const ThreeJSBackground = ({ className = "" }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: -1 }}>
      <Canvas
        camera={{ 
          position: [0, 0, 10], 
          fov: 60,
          near: 0.1,
          far: 1000 
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]} // Limit pixel ratio for performance
        performance={{ min: 0.5 }} // Performance optimization
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        <FloatingParticles count={window.innerWidth > 768 ? 50 : 25} />
        <FloatingGeometry />
      </Canvas>
    </div>
  );
};

export default ThreeJSBackground;