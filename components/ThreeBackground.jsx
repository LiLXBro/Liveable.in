'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Cloud, Stars, Sparkles, Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { usePathname } from 'next/navigation';

// --- EFFECTS ---

function CloudsEffect() {
    return (
        <group>
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#ffddaa" />
            <Cloud position={[-4, -2, -10]} args={[3, 2]} speed={0.2} opacity={0.5} color="#e0f2fe" />
            <Cloud position={[4, 2, -15]} args={[3, 2]} speed={0.2} opacity={0.5} color="#e0f2fe" />
            <Cloud position={[0, -5, -20]} args={[3, 2]} speed={0.2} opacity={0.5} color="#cbd5e1" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
}

function WaterDropletsEffect() {
    // Falling rain / droplets
    const count = 1000;
    const geom = useMemo(() => {
        const positions = [];
        for (let i = 0; i < count; i++) {
            positions.push(Math.random() * 40 - 20);
            positions.push(Math.random() * 20 + 10);
            positions.push(Math.random() * 40 - 20);
        }
        return new THREE.BufferAttribute(new Float32Array(positions), 3);
    }, []);

    const positionsRef = useRef(null);

    useFrame(() => {
        if (!positionsRef.current) return;
        const positions = positionsRef.current.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.3; // Fall speed
            if (positions[i] < -10) {
                positions[i] = 20;
            }
        }
        positionsRef.current.needsUpdate = true;
    });

    return (
        <group>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 10, 2]} intensity={1} color="#bae6fd" />
            <points>
                <bufferGeometry>
                    <bufferAttribute ref={positionsRef} attach="attributes-position" {...geom} />
                </bufferGeometry>
                <pointsMaterial color="#bae6fd" size={0.1} transparent opacity={0.8} />
            </points>
            <fog attach="fog" args={['#0f172a', 5, 30]} />
        </group>
    );
}

function BirdsAndCityEffect() {
    // Abstract representation: Green blocks for city, small triangles for birds
    const Birds = () => {
        const birdsRef = useRef();
        useFrame(({ clock }) => {
            if (birdsRef.current) {
                birdsRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.5;
                birdsRef.current.position.y = Math.sin(clock.elapsedTime) * 0.5;
            }
        });

        return (
            <group ref={birdsRef} position={[0, 2, -5]}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <mesh key={i} position={[Math.random() * 10 - 5, Math.random() * 5, Math.random() * 5 - 2]}>
                        <coneGeometry args={[0.1, 0.3, 3]} />
                        <meshBasicMaterial color="#fef08a" />
                    </mesh>
                ))}
            </group>
        );
    };

    const City = () => (
        <group position={[0, -5, -10]}>
            {Array.from({ length: 30 }).map((_, i) => (
                <mesh key={i} position={[Math.random() * 20 - 10, 0, Math.random() * 10 - 5]}>
                    <boxGeometry args={[1, Math.random() * 3 + 1, 1]} />
                    <meshStandardMaterial color="#4ade80" />
                </mesh>
            ))}
        </group>
    );

    return (
        <group>
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#fcd34d" />
            <Birds />
            <City />
            <Sparkles count={50} scale={10} size={4} speed={0.4} opacity={0.5} color="#86efac" />
        </group>
    );
}

function SustainableSocietyEffect() {
    // Clean, organized, futuristic, sustainable (Wind turbines abstraction?)
    const Turbine = ({ position }) => (
        <group position={position}>
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 4]} />
                <meshStandardMaterial color="#e2e8f0" />
            </mesh>
            <mesh position={[0, 4, 0]}>
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                <meshStandardMaterial color="#3b82f6" />
            </mesh>
            <Float speed={5} rotationIntensity={0} floatIntensity={0}>
                <group position={[0, 4, 0]}>
                    <mesh position={[1, 0, 0]} rotation={[0, 0, 1.57]}>
                        <boxGeometry args={[0.1, 2, 0.05]} />
                        <meshStandardMaterial color="#fff" />
                    </mesh>
                    <mesh position={[-0.5, 0.86, 0]} rotation={[0, 0, -0.52]}>
                        <boxGeometry args={[0.1, 2, 0.05]} />
                        <meshStandardMaterial color="#fff" />
                    </mesh>
                    <mesh position={[-0.5, -0.86, 0]} rotation={[0, 0, 3.66]}>
                        <boxGeometry args={[0.1, 2, 0.05]} />
                        <meshStandardMaterial color="#fff" />
                    </mesh>
                </group>
            </Float>
        </group>
    );

    return (
        <group>
            <ambientLight intensity={0.6} />
            <directionalLight position={[-5, 5, 5]} intensity={0.8} color="#ffffff" />
            <Turbine position={[-3, -2, -5]} />
            <Turbine position={[3, -2, -8]} />
            <Turbine position={[0, -2, -12]} />
            <gridHelper args={[50, 50, 0x1e293b, 0x1e293b]} position={[0, -2, 0]} />
        </group>
    );
}

function NorthEastGreeneryEffect() {
    // Dense foliage / Hills
    return (
        <group>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} color="#dcfce7" />
            <Cloud position={[-4, 0, -10]} args={[3, 2]} speed={0.1} opacity={0.3} color="#166534" />
            <Cloud position={[4, 1, -12]} args={[3, 2]} speed={0.1} opacity={0.3} color="#15803d" />

            {/* Hills */}
            <mesh position={[0, -6, -10]} rotation={[-0.2, 0, 0]}>
                <coneGeometry args={[15, 8, 32]} />
                <meshStandardMaterial color="#14532d" roughness={0.8} />
            </mesh>
            <mesh position={[-8, -6, -15]} rotation={[-0.2, 0, 0]}>
                <coneGeometry args={[12, 10, 32]} />
                <meshStandardMaterial color="#166534" roughness={0.8} />
            </mesh>
            <mesh position={[8, -6, -12]} rotation={[-0.2, 0, 0]}>
                <coneGeometry args={[10, 9, 32]} />
                <meshStandardMaterial color="#15803d" roughness={0.8} />
            </mesh>

            <Sparkles count={200} scale={12} size={2} speed={0.2} opacity={0.4} color="#f0fdf4" />
            <fog attach="fog" args={['#dcfce7', 0, 25]} />
        </group>
    );
}

// --- MAIN COMPONENT ---

export default function ThreeBackground() {
    const pathname = usePathname();

    let Effect = CloudsEffect; // Default Home
    let bgClass = "bg-gradient-to-b from-blue-100 to-white"; // Fallback CSS bg

    if (pathname.startsWith('/dashboard/champion')) {
        Effect = WaterDropletsEffect;
        bgClass = "bg-slate-900"; // Darker for rain
    } else if (pathname.startsWith('/dashboard/editor')) {
        Effect = BirdsAndCityEffect;
        bgClass = "bg-gradient-to-b from-blue-50 to-green-50";
    } else if (pathname.startsWith('/dashboard/admin')) {
        Effect = SustainableSocietyEffect;
        bgClass = "bg-slate-50";
    } else if (pathname.startsWith('/blog')) {
        Effect = NorthEastGreeneryEffect;
        bgClass = "bg-gradient-to-b from-green-50 to-emerald-100";
    }

    return (
        <div className={`fixed top-0 left-0 w-full h-full -z-10 transition-colors duration-1000 ${bgClass}`}>
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <Effect />
            </Canvas>
        </div>
    );
}
