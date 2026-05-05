"use client";

import { motion } from "framer-motion";
import { 
  Shield, 
  User, 
  Store, 
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useEffect, useState } from "react";

export default function HybridLoginPortal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-[#0d091a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* ELECTRA Gradient Overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#3b0764,transparent)] pointer-events-none opacity-40" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_100%_100%,#1e1b4b,transparent)] pointer-events-none opacity-30" />

      {/* Circuit Background Decorations (Updated to Purple) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M0 50 H100 M50 0 V100 M20 20 L80 80 M80 20 L20 80" stroke="#a855f7" strokeWidth="0.5" fill="none" />
            <circle cx="20" cy="20" r="2" fill="#a855f7" />
            <circle cx="80" cy="80" r="2" fill="#a855f7" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Main Container - Optimized for Single Screen Visibility */}
      <div className="max-w-7xl w-full flex flex-col items-center z-10 py-4">
        
        <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-0 relative">
          
          {/* Left Side: DRIVER PORTAL */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col items-center p-4 relative"
          >
            <div className="text-center mb-4">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-white/40">User: Find a Charger</h2>
            </div>

            {/* Technical Map Decoration (Purple Glow) */}
            <div className="absolute top-16 left-8 right-8 h-48 opacity-20 pointer-events-none">
               <div className="w-full h-full border border-[#a855f7]/20 rounded-2xl bg-black/40 overflow-hidden relative">
                  <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 border-[#a855f7]/5 border">
                    {mounted && Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="absolute w-1 h-1 bg-[#a855f7] rounded-full animate-pulse shadow-[0_0_8px_#a855f7]" style={{ 
                        top: `${(i * 13) % 85}%`, 
                        left: `${(i * 17) % 95}%` 
                      }} />
                    ))}
                  </div>
               </div>
            </div>

            {/* Feature Card */}
            <div className="glass-card w-full max-w-sm p-8 relative z-20 mt-6 flex flex-col items-center text-center">
               <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mb-6 shadow-inner group hover:border-[#a855f7]/40 transition-colors">
                  <User className="w-6 h-6 text-[#a855f7]" />
               </div>

               <h3 className="text-2xl font-black mb-3 tracking-tight">Charge Your EV</h3>
               <p className="text-white/50 text-xs leading-relaxed mb-6 max-w-[240px]">
                 Find the nearest private charging nodes. Real-time availability, grid-aware pricing, and seamless one-tap payments.
               </p>

               {/* Tags */}
               <div className="flex flex-wrap justify-center gap-2 mb-6 opacity-60 scale-75">
                  {["FAST NODES", "OSM MAPS", "AUTO-AUTH"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black tracking-widest">{tag}</span>
                  ))}
               </div>

               <Link href="/discover" className="w-full">
                 <button className="neon-button w-full py-4 text-base">
                    Enter as Driver <ChevronRight className="w-4 h-4 stroke-[3px]" />
                 </button>
               </Link>
            </div>
          </motion.div>

          {/* CENTRAL DIVIDER - ELECTRA STYLE */}
          <div className="hidden md:flex flex-col items-center relative w-16">
             {/* Line Top */}
             <div className="flex-1 w-[2px] bg-gradient-to-t from-[#a855f7] to-transparent shadow-[0_0_20px_#a855f7]" />
             
             {/* Logo Container */}
             <div className="z-30 py-8 flex items-center justify-center">
               <Logo className="w-32 h-32 drop-shadow-[0_0_40px_rgba(168,85,247,0.6)]" />
             </div>

             {/* Line Bottom */}
             <div className="flex-1 w-[2px] bg-gradient-to-b from-[#a855f7] to-transparent shadow-[0_0_20px_#a855f7]" />
          </div>

          {/* Right Side: HOST PORTAL */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col items-center p-4 relative"
          >
            <div className="text-center mb-4">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-white/40">Host: List Your Charger</h2>
            </div>

            {/* Technical Chart Decoration (Indigo Glow) */}
            <div className="absolute top-16 left-8 right-8 h-48 opacity-20 pointer-events-none">
               <div className="w-full h-full border border-[#6366f1]/20 rounded-2xl bg-black/40 overflow-hidden relative">
                  <svg viewBox="0 0 400 200" className="w-full h-full p-8 opacity-40">
                    <path d="M0 150 Q 50 100, 100 130 T 200 80 T 300 110 T 400 50" stroke="#6366f1" strokeWidth="2" fill="none" />
                    <line x1="0" y1="180" x2="400" y2="180" stroke="#fff" strokeWidth="0.5" strokeDasharray="4" />
                  </svg>
               </div>
            </div>

            {/* Feature Card */}
            <div className="glass-card w-full max-w-sm p-8 relative z-20 mt-6 flex flex-col items-center text-center">
               <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mb-6 shadow-inner group hover:border-[#6366f1]/40 transition-colors">
                  <Store className="w-6 h-6 text-[#6366f1]" />
               </div>

               <h3 className="text-2xl font-black mb-3 tracking-tight">Become a Host</h3>
               <p className="text-white/50 text-xs leading-relaxed mb-6 max-w-[240px]">
                 Monetize your home charger. Manage listings, track real-time earnings, and contribute to a greener grid.
               </p>

               {/* Tags */}
               <div className="flex flex-wrap justify-center gap-2 mb-6 opacity-60 scale-75">
                  {["REVENUE ANALYTICS", "GRID DATA", "P2P ESCROW"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black tracking-widest">{tag}</span>
                  ))}
               </div>

               <Link href="/host" className="w-full">
                 <button className="neon-button w-full py-4 text-base bg-gradient-to-br from-[#6366f1] to-[#a855f7]">
                    Enter Seller Admin <ChevronRight className="w-4 h-4 stroke-[3px]" />
                 </button>
               </Link>
            </div>
          </motion.div>

        </div>

        {/* Unified Subsurface Branding - PULLED UP */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-4">
             <div className="h-[1px] w-8 bg-white/10" />
             <Shield className="w-4 h-4 text-[#a855f7]" />
             <div className="h-[1px] w-8 bg-white/10" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">SECURE-<span className="text-[#a855f7]">OHM</span></h1>
          <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.6em]">
            SECURE PEER-TO-PEER PROTOCOL V1.0
          </p>
        </motion.div>

      </div>

    </main>
  );
}
