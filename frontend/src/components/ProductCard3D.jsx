import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

// Rotating product display pedestal
const ProductPedestal = ({ color = '#6366f1' }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
        }
    });

    return (
        <group ref={meshRef}>
            {/* Base platform */}
            <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[1.2, 1.5, 0.1, 32]} />
                <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Glow ring */}
            <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.3, 0.02, 16, 64]} />
                <meshBasicMaterial color={color} transparent opacity={0.7} />
            </mesh>

            {/* Floating orbs */}
            <Float speed={2} rotationIntensity={0.5}>
                <mesh position={[0, 0.5, 0]}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <MeshDistortMaterial color="#ec4899" distort={0.3} speed={2} />
                </mesh>
            </Float>
            <Float speed={1.5} rotationIntensity={0.3}>
                <mesh position={[0.8, 0.3, 0.5]}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <MeshDistortMaterial color="#06b6d4" distort={0.2} speed={3} />
                </mesh>
            </Float>
            <Float speed={1.8} rotationIntensity={0.4}>
                <mesh position={[-0.7, 0.4, -0.4]}>
                    <sphereGeometry args={[0.12, 16, 16]} />
                    <MeshDistortMaterial color="#a855f7" distort={0.25} speed={2.5} />
                </mesh>
            </Float>
        </group>
    );
};

// Product card 3D effect component
const ProductCard3D = ({ children, className = '' }) => {
    return (
        <div className={`product-card-3d ${className}`}>
            <div className="product-card-3d-inner">
                <Suspense fallback={null}>
                    <Canvas
                        camera={{ position: [0, 0, 3], fov: 50 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '200px',
                            pointerEvents: 'none',
                            zIndex: 1
                        }}
                        gl={{ alpha: true }}
                    >
                        <ambientLight intensity={0.6} />
                        <pointLight position={[5, 5, 5]} intensity={0.8} />
                        <ProductPedestal />
                    </Canvas>
                </Suspense>
                {children}
            </div>
        </div>
    );
};

export { ProductCard3D, ProductPedestal };
