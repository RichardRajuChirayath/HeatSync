"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${className} relative flex items-center justify-center`}
    >
      <Image 
        src="/logo.svg" 
        alt="SECURE-OHM Logo" 
        width={800} 
        height={800} 
        className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] scale-150"
        priority
      />
    </motion.div>
  );
}
