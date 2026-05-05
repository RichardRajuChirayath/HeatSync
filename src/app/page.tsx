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
    <main className="min-h-screen bg-[#0a0b14] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Circuit Background Decorations (From Design 2) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M0 50 H100 M50 0 V100 M20 20 L80 80 M80 20 L20 80" stroke="#7AFBB3" strokeWidth="0.5" fill="none" />
            <circle cx="20" cy="20" r="2" fill="#7AFBB3" />
            <circle cx="80" cy="80" r="2" fill="#7AFBB3" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl w-full flex flex-col items-center z-10">
        
        <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-0 relative">
          
          {/* Left Side: DRIVER PORTAL */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col items-center p-8 relative"
          >
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-white/40 mb-2">User: Find a Charger</h2>
            </div>

            {/* Technical Map Decoration */}
            <div className="absolute top-24 left-12 right-12 h-64 opacity-10 pointer-events-none">
               <div className="w-full h-full border border-[#7AFBB3]/20 rounded-2xl bg-black/40 overflow-hidden relative">
                  <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 border-[#7AFBB3]/5 border">
                    {mounted && Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="absolute w-1 h-1 bg-[#7AFBB3] rounded-full animate-pulse shadow-[0_0_8px_#7AFBB3]" style={{ 
                        top: `${(i * 13) % 85}%`, 
                        left: `${(i * 17) % 95}%` 
                      }} />
                    ))}
                  </div>
               </div>
            </div>

            {/* Feature Card */}
            <div className="glass-card w-full max-w-md p-10 border-[#7AFBB3]/10 bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] relative z-20 mt-12 flex flex-col items-center text-center shadow-2xl">
               <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mb-8 shadow-inner group hover:border-[#7AFBB3]/40 transition-colors">
                  <User className="w-8 h-8 text-[#7AFBB3]" />
               </div>

               <h3 className="text-3xl font-black mb-4 tracking-tight">Charge Your EV</h3>
               <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-[280px]">
                 Find the nearest private charging nodes. Real-time availability, grid-aware pricing, and seamless one-tap payments.
               </p>

               {/* Tags */}
               <div className="flex flex-wrap justify-center gap-2 mb-10 opacity-60 scale-90">
                  {["FAST NODES", "OSM MAPS", "AUTO-AUTH"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black tracking-widest">{tag}</span>
                  ))}
               </div>

               <Link href="/discover" className="w-full">
                 <button className="w-full py-5 bg-[#7AFBB3] text-black font-black rounded-2xl shadow-[0_20px_40px_rgba(122,251,179,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg">
                    Enter as Driver <ChevronRight className="w-5 h-5 stroke-[3px]" />
                 </button>
               </Link>
            </div>
          </motion.div>

          {/* CENTRAL DIVIDER - ALIGNMENT FIXED */}
          <div className="hidden md:flex flex-col items-center relative w-24">
             {/* Line Top */}
             <div className="flex-1 w-[2px] bg-gradient-to-t from-[#7AFBB3] to-transparent shadow-[0_0_20px_#7AFBB3]" />
             
             {/* Logo Container (Transparent - No Square Box) */}
             <div className="z-30 py-16 flex items-center justify-center">
               <Logo className="w-48 h-48 drop-shadow-[0_0_50px_rgba(122,251,179,0.5)]" />
             </div>

             {/* Line Bottom */}
             <div className="flex-1 w-[2px] bg-gradient-to-b from-[#7AFBB3] to-transparent shadow-[0_0_20px_#7AFBB3]" />
          </div>

          {/* Right Side: HOST PORTAL */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col items-center p-8 relative"
          >
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-white/40 mb-2">Host: List Your Charger</h2>
            </div>

            {/* Technical Chart Decoration */}
            <div className="absolute top-24 left-12 right-12 h-64 opacity-10 pointer-events-none">
               <div className="w-full h-full border border-[#7AFBB3]/20 rounded-2xl bg-black/40 overflow-hidden relative">
                  <svg viewBox="0 0 400 200" className="w-full h-full p-8 opacity-40">
                    <path d="M0 150 Q 50 100, 100 130 T 200 80 T 300 110 T 400 50" stroke="#7AFBB3" strokeWidth="2" fill="none" />
                    <line x1="0" y1="180" x2="400" y2="180" stroke="#fff" strokeWidth="0.5" strokeDasharray="4" />
                  </svg>
               </div>
            </div>

            {/* Feature Card */}
            <div className="glass-card w-full max-w-md p-10 border-[#7AFBB3]/10 bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] relative z-20 mt-12 flex flex-col items-center text-center shadow-2xl">
               <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mb-8 shadow-inner group hover:border-[#7AFBB3]/40 transition-colors">
                  <Store className="w-8 h-8 text-[#7AFBB3]" />
               </div>

               <h3 className="text-3xl font-black mb-4 tracking-tight">Become a Host</h3>
               <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-[280px]">
                 Monetize your home charger. Manage listings, track real-time earnings, and contribute to a greener grid.
               </p>

               {/* Tags */}
               <div className="flex flex-wrap justify-center gap-2 mb-10 opacity-60 scale-90">
                  {["REVENUE ANALYTICS", "GRID DATA", "P2P ESCROW"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black tracking-widest">{tag}</span>
                  ))}
               </div>

               <Link href="/host" className="w-full">
                 <button className="w-full py-5 bg-[#7AFBB3] text-black font-black rounded-2xl shadow-[0_20px_40px_rgba(122,251,179,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg">
                    Enter Seller Admin <ChevronRight className="w-5 h-5 stroke-[3px]" />
                 </button>
               </Link>
            </div>
          </motion.div>

        </div>

        {/* Unified Subsurface Branding */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20 text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-4">
             <div className="h-[1px] w-12 bg-white/10" />
             <Shield className="w-5 h-5 text-[#7AFBB3]" />
             <div className="h-[1px] w-12 bg-white/10" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">SECURE-<span className="text-[#7AFBB3]">OHM</span></h1>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.6em]">
            SECURE PEER-TO-PEER PROTOCOL V1.0
          </p>
        </motion.div>

      </div>

    </main>
  );
}
