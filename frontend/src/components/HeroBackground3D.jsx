import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

// Floating geometric shape component
const FloatingShape = ({ position, color, speed, distort, scale, type = 'sphere' }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.5;
            meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
        }
    });

    const ShapeComponent = type === 'box' ? Box : type === 'torus' ? Torus : Sphere;
    const args = type === 'torus' ? [0.6, 0.2, 16, 32] : type === 'box' ? [1, 1, 1] : [1, 32, 32];

    return (
        <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
            <ShapeComponent ref={meshRef} args={args} position={position} scale={scale}>
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={distort}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </ShapeComponent>
        </Float>
    );
};

// Animated particles background
const ParticleField = ({ count = 100 }) => {
    const points = useRef();

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return positions;
    }, [count]);

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.elapsedTime * 0.02;
            points.current.rotation.x = state.clock.elapsedTime * 0.01;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#6366f1"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
};

// Glowing ring effect
const GlowRing = ({ position, color, size = 2 }) => {
    const ringRef = useRef();

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.x = Math.PI / 2;
            ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <mesh ref={ringRef} position={position}>
            <torusGeometry args={[size, 0.02, 16, 100]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
    );
};

// Main 3D background component
const HeroBackground3D = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none'
        }}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                style={{ background: 'transparent' }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6366f1" />

                {/* Floating shapes */}
                <FloatingShape
                    position={[3, 1, -2]}
                    color="#6366f1"
                    speed={1.5}
                    distort={0.4}
                    scale={0.8}
                    type="sphere"
                />
                <FloatingShape
                    position={[-3.5, -1, -3]}
                    color="#8b5cf6"
                    speed={1}
                    distort={0.3}
                    scale={0.6}
                    type="box"
                />
                <FloatingShape
                    position={[2, -2, -4]}
                    color="#a855f7"
                    speed={1.2}
                    distort={0.5}
                    scale={0.5}
                    type="torus"
                />
                <FloatingShape
                    position={[-2, 2.5, -2]}
                    color="#ec4899"
                    speed={0.8}
                    distort={0.2}
                    scale={0.4}
                    type="sphere"
                />
                <FloatingShape
                    position={[4.5, -1.5, -5]}
                    color="#06b6d4"
                    speed={1.3}
                    distort={0.35}
                    scale={0.7}
                    type="sphere"
                />

                {/* Glow rings */}
                <GlowRing position={[0, 0, -5]} color="#6366f1" size={3} />
                <GlowRing position={[0, 0, -6]} color="#8b5cf6" size={4} />

                {/* Particle field */}
                <ParticleField count={150} />
            </Canvas>
        </div>
    );
};

export default HeroBackground3D;
