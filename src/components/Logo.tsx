"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-12 h-12" }: LogoProps) {
  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.8
      }}
      className={`relative ${className}`}
    >
      <Image 
        src="/logo.svg" 
        alt="SECURE-OHM Logo" 
        width={800} 
        height={800} 
        className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(168,85,247,0.6)] scale-150 brightness-110 hue-rotate-[240deg]"
        priority
      />
    </motion.div>
  );
}
