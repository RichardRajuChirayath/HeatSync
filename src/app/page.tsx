"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Leaf, User, Store, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

export default function RoleSelection() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_30px_var(--primary-glow)]">
          <Zap className="text-black w-8 h-8 fill-current" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter">
          HEAT<span className="text-primary">SYNC</span>
        </h1>
      </motion.div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Guest / User Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/discover" className="group block h-full">
            <div className="glass-card h-full p-10 flex flex-col items-center text-center hover:border-primary/50 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <User className="w-32 h-32" />
              </div>
              
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 group-hover:scale-110 transition-transform">
                <User className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Charge Your EV</h2>
              <p className="text-white/50 mb-8 flex-1">
                Find the nearest private charging nodes. Real-time availability, grid-aware pricing, and seamless one-tap payments.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/40 border border-white/5">FAST NODES</span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/40 border border-white/5">OSM MAPS</span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/40 border border-white/5">AUTO-AUTH</span>
              </div>

              <div className="neon-button w-full flex items-center justify-center gap-2">
                Enter as Driver <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Host / Seller Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/host" className="group block h-full">
            <div className="glass-card h-full p-10 flex flex-col items-center text-center hover:border-accent/50 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Store className="w-32 h-32" />
              </div>

              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-8 border border-accent/20 group-hover:scale-110 transition-transform">
                <Store className="w-10 h-10 text-accent" />
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Become a Host</h2>
              <p className="text-white/50 mb-8 flex-1">
                Monetize your home charger. Manage listings, track real-time earnings, and contribute to a greener grid.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-10">
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/40 border border-white/5">REVENUE ANALYTICS</span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/40 border border-white/5">GRID DATA</span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/40 border border-white/5">P2P ESCROW</span>
              </div>

              <div className="relative w-full">
                <div className="absolute inset-0 bg-accent blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <button className="relative w-full py-4 rounded-full bg-accent text-white font-bold transition-all duration-300 flex items-center justify-center gap-2">
                  Enter Seller Admin <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <div className="flex items-center gap-2 text-white/20 text-xs font-bold uppercase tracking-[0.2em] mb-4">
          <Shield className="w-4 h-4" /> Secure Peer-to-Peer Protocol v1.0
        </div>
        <div className="flex gap-4 justify-center">
          <Leaf className="w-5 h-5 text-green-500/30" />
          <Activity className="w-5 h-5 text-primary/30" />
          <Zap className="w-5 h-5 text-accent/30" />
        </div>
      </motion.div>
    </main>
  );
}
