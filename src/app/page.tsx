"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  User, 
  Store, 
  ChevronRight,
  Zap,
  Lock,
  Battery
} from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useEffect, useState } from "react";

function LoadingScreen() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#0d091a] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute w-[500px] h-[500px] bg-[#a855f7]/20 rounded-full blur-[120px]"
      />

      {/* Energy Flow Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         {Array.from({ length: 20 }).map((_, i) => (
           <motion.div
             key={i}
             initial={{ 
               x: (i % 2 === 0 ? -100 : 100) + "%", 
               y: Math.random() * 100 + "%",
               opacity: 0 
             }}
             animate={{ 
               x: "50%", 
               y: "50%",
               opacity: [0, 1, 0]
             }}
             transition={{ 
               repeat: Infinity, 
               duration: 2 + Math.random() * 2,
               delay: Math.random() * 2,
               ease: "circIn"
             }}
             className="absolute w-1 h-1 bg-[#a855f7] rounded-full shadow-[0_0_10px_#a855f7]"
             style={{ left: 0, top: 0 }}
           />
         ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            filter: ["drop-shadow(0 0 20px rgba(168,85,247,0.4))", "drop-shadow(0 0 40px rgba(168,85,247,0.8))", "drop-shadow(0 0 20px rgba(168,85,247,0.4))"]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Logo className="w-48 h-48" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col items-center"
        >
          <div className="flex items-center gap-3 text-[#a855f7] mb-2">
             <Zap className="w-4 h-4 animate-bounce" />
             <span className="text-[12px] font-black uppercase tracking-[0.5em]">System Energizing</span>
          </div>

          <div className="text-4xl font-black mb-6 italic tracking-tighter tabular-nums text-white/80">
            {percent}%
          </div>
          
          {/* Stylized Battery Loader */}
          <div className="w-64 h-8 border-2 border-white/10 rounded-lg p-1 relative flex gap-1 overflow-hidden">
             {Array.from({ length: 10 }).map((_, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: percent > (i * 10) ? 1 : 0.1 }}
                 className="flex-1 h-full bg-gradient-to-t from-[#a855f7] to-[#6366f1] rounded-sm shadow-[0_0_10px_rgba(168,85,247,0.5)]"
               />
             ))}
             {/* Scanning Energy Line */}
             <motion.div 
               animate={{ left: ["-10%", "110%"] }}
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
               className="absolute top-0 bottom-0 w-8 bg-white/20 blur-sm -skew-x-12 pointer-events-none"
             />
          </div>
          
          <div className="mt-6 flex flex-col items-center gap-2">
             <div className="flex gap-4 opacity-40">
                <Battery className={`w-4 h-4 ${percent === 100 ? "text-green-400" : ""}`} />
                <Shield className="w-4 h-4" />
                <Store className="w-4 h-4" />
             </div>
             <p className="text-[8px] font-mono opacity-20 tracking-widest uppercase">Grid Sync: {percent > 80 ? "Stable" : "Synchronizing"}</p>
          </div>
        </motion.div>
      </div>
      
      {/* Technical Text Drift */}
      <div className="absolute bottom-10 left-10 opacity-10 font-mono text-[8px] space-y-1">
         <p>CURRENT_VOLTAGE: 480V_DC</p>
         <p>PHASE_ALIGNMENT: OPTIMAL</p>
         <p>SECURE_OHM_NODE: 0x7E...4A</p>
      </div>
    </motion.div>
  );
}

export default function HybridLoginPortal() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setLoading(false), 3200);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <main className="min-h-screen bg-[#0d091a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        
        {/* ELECTRA Gradient Overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#3b0764,transparent)] pointer-events-none opacity-40" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_100%_100%,#1e1b4b,transparent)] pointer-events-none opacity-30" />

        {/* Circuit Background Decorations */}
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

        {/* Main Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-7xl w-full flex flex-col items-center z-10 py-4"
        >
          
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-0 relative">
            
            {/* Left Side: DRIVER PORTAL */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex-1 flex flex-col items-center p-4 relative group w-full"
            >
              <div className="text-center mb-4">
                <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-white/40">User: Find a Charger</h2>
              </div>

              {/* Technical Map Decoration */}
              <div className="absolute top-16 left-8 right-8 h-48 opacity-20 pointer-events-none">
                 <div className="w-full h-full border border-[#a855f7]/20 rounded-2xl bg-black/40 overflow-hidden relative">
                    <motion.div 
                      animate={{ top: ["-10%", "110%"] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a855f7] to-transparent shadow-[0_0_15px_#a855f7] z-10"
                    />
                    <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 border-[#a855f7]/5 border">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="absolute w-1 h-1 bg-[#a855f7] rounded-full animate-pulse shadow-[0_0_8px_#a855f7]" style={{ 
                          top: `${(i * 13) % 85}%`, 
                          left: `${(i * 17) % 95}%` 
                        }} />
                      ))}
                    </div>
                 </div>
              </div>

              {/* Feature Card */}
              <motion.div 
                whileHover={{ scale: 1.02, translateY: -5 }}
                className="glass-card w-full max-w-sm p-8 relative z-20 mt-6 flex flex-col items-center text-center transition-all duration-500 hover:border-[#a855f7]/40 h-full"
              >
                 <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all">
                    <User className="w-6 h-6 text-[#a855f7]" />
                 </div>

                 <h3 className="text-2xl font-black mb-3 tracking-tight">Charge Your EV</h3>
                 <p className="text-white/50 text-xs leading-relaxed mb-6 max-w-[240px]">
                   Find the nearest private charging nodes. Real-time availability, grid-aware pricing, and seamless one-tap payments.
                 </p>

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
              </motion.div>
            </motion.div>

            {/* CENTRAL DIVIDER */}
            <div className="hidden md:flex flex-col items-center relative w-16 self-stretch">
               <div className="flex-1 w-[2px] bg-gradient-to-t from-[#a855f7] to-transparent shadow-[0_0_20px_#a855f7] relative overflow-hidden">
                  <motion.div 
                    animate={{ top: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-white to-transparent opacity-50"
                  />
               </div>
               
               <div className="z-30 py-8 flex items-center justify-center">
                 <Logo className="w-32 h-32" />
               </div>

               <div className="flex-1 w-[2px] bg-gradient-to-b from-[#a855f7] to-transparent shadow-[0_0_20px_#a855f7] relative overflow-hidden">
                  <motion.div 
                    animate={{ top: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 0.5 }}
                    className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-white to-transparent opacity-50"
                  />
               </div>
            </div>

            {/* Right Side: HOST PORTAL */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex-1 flex flex-col items-center p-4 relative group w-full"
            >
              <div className="text-center mb-4">
                <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-white/40">Host: List Your Charger</h2>
              </div>

              {/* Technical Chart Decoration */}
              <div className="absolute top-16 left-8 right-8 h-48 opacity-20 pointer-events-none">
                 <div className="w-full h-full border border-[#6366f1]/20 rounded-2xl bg-black/40 overflow-hidden relative">
                    <motion.div 
                      animate={{ top: ["110%", "-10%"] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6366f1] to-transparent shadow-[0_0_15px_#6366f1] z-10"
                    />
                    <svg viewBox="0 0 400 200" className="w-full h-full p-8 opacity-40">
                      <path d="M0 150 Q 50 100, 100 130 T 200 80 T 300 110 T 400 50" stroke="#6366f1" strokeWidth="2" fill="none" />
                      <line x1="0" y1="180" x2="400" y2="180" stroke="#fff" strokeWidth="0.5" strokeDasharray="4" />
                    </svg>
                 </div>
              </div>

              {/* Feature Card */}
              <motion.div 
                whileHover={{ scale: 1.02, translateY: -5 }}
                className="glass-card w-full max-w-sm p-8 relative z-20 mt-6 flex flex-col items-center text-center transition-all duration-500 hover:border-[#6366f1]/40 h-full"
              >
                 <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all">
                    <Store className="w-6 h-6 text-[#6366f1]" />
                 </div>

                 <h3 className="text-2xl font-black mb-3 tracking-tight">Become a Host</h3>
                 <p className="text-white/50 text-xs leading-relaxed mb-6 max-w-[240px]">
                   Monetize your home charger. Manage listings, track real-time earnings, and contribute to a greener grid.
                 </p>

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
              </motion.div>
            </motion.div>

          </div>

          {/* Unified Subsurface Branding */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-4">
               <div className="h-[1px] w-8 bg-white/10" />
               <Shield className="w-4 h-4 text-[#a855f7]" />
               <div className="h-[1px] w-8 bg-white/10" />
            </div>
            
            <motion.div
              animate={{ opacity: [1, 0.8, 1], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">SECURE-<span className="text-[#a855f7]">OHM</span></h1>
            </motion.div>
            
            <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.6em]">
              SECURE PEER-TO-PEER PROTOCOL V1.0
            </p>
          </motion.div>

        </motion.div>

      </main>
    </>
  );
}
