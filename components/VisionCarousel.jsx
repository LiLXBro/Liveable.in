'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data - In real app, these could be cloud images
const CAROUSEL_ITEMS = [
    { id: 1, text: "Sustainable Energy Grids", color: "bg-blue-500" },
    { id: 2, text: "Efficient Public Transport", color: "bg-green-500" },
    { id: 3, text: "Clean Water Systems", color: "bg-teal-500" },
    { id: 4, text: "Urban Green Spaces", color: "bg-emerald-500" },
    { id: 5, text: "Waste Management Solutions", color: "bg-cyan-500" },
];

export default function VisionCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-gray-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className={`absolute inset-0 flex items-center justify-center ${CAROUSEL_ITEMS[index].color}`}
                >
                    {/* Placeholder for Image - Using color blocks for valid MVP without assets */}
                    <div className="absolute inset-0 opacity-50 bg-black/40" />

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="z-10 p-8 text-center"
                    >
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-2xl">
                            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-wide drop-shadow-lg">
                                {CAROUSEL_ITEMS[index].text}
                            </h2>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 z-20">
                {CAROUSEL_ITEMS.map((item, i) => (
                    <button
                        key={item.id}
                        className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                        onClick={() => setIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
}
