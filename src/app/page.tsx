"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Zap, Shield, Leaf, Activity, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Show, UserButton, SignInButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Charger } from "@/components/Map";

// Dynamic import for Leaflet to avoid SSR issues
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-secondary animate-pulse rounded-2xl flex flex-col items-center justify-center gap-4 border border-white/5">
      <Zap className="w-12 h-12 text-primary/50 animate-bounce" />
      <span className="text-xs text-white/30 font-medium tracking-widest uppercase">Initializing OSM Nodes...</span>
    </div>
  ),
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"hero" | "discovery">("hero");
  const [activeChargers, setActiveChargers] = useState<Charger[]>([]);
  const [selectedChargerId, setSelectedChargerId] = useState<string | null>(null);

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Nav */}
      <nav className="z-50 px-8 py-6 flex justify-between items-center bg-background/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("hero")}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--primary-glow)]">
            <Zap className="text-black fill-current" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">
            HEAT<span className="text-primary">SYNC</span>
          </span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-white/70">
          <button onClick={() => setView("discovery")} className="hover:text-primary transition-colors">Find Charger</button>
          <a href="#" className="hover:text-primary transition-colors">Host Node</a>
          <a href="#" className="hover:text-primary transition-colors">Sustainability</a>
        </div>

        <div className="flex gap-4 items-center">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="px-5 py-2 text-sm font-bold hover:text-primary transition-colors cursor-pointer">Login</button>
            </SignInButton>
            <button onClick={() => setView("discovery")} className="neon-button">Explore</button>
          </Show>
          <Show when="signed-in">
            <UserButton 
               appearance={{ 
                baseTheme: dark,
                elements: { 
                  userButtonAvatarBox: "w-10 h-10 border border-primary/30 shadow-[0_0_10px_rgba(0,242,255,0.2)]",
                  userButtonPopoverCard: "glass-card border-white/10 bg-[#1a1a1a]",
                  userButtonPopoverActionButtonText: "text-white hover:text-primary",
                  userButtonPopoverActionIcon: "text-primary",
                  userPreviewMainIdentifier: "text-white font-bold",
                  userPreviewSecondaryIdentifier: "text-white/50",
                } 
              }} 
            />
          </Show>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {view === "hero" ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 py-20"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8"
            >
              <Activity className="w-4 h-4" />
              <span>Phase 2: Discovery Engine Active</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold mb-6 tracking-tight leading-[1.1]"
            >
              Power to the <br />
              <span className="text-primary drop-shadow-[0_0_15px_var(--primary-glow)]">People.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/50 max-w-2xl mb-10"
            >
              The world's first decentralized EV charging network. Find private chargers, 
              track grid load, and pay seamlessly with Razorpay.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button 
                onClick={() => setView("discovery")}
                className="neon-button px-8 py-4 text-lg flex items-center gap-2 group"
              >
                Find a Node <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 text-lg font-bold glass-card hover:bg-white/10 transition-colors">
                List Charger
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="discovery"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col md:flex-row p-6 gap-6 z-10"
          >
            {/* Sidebar */}
            <div className="w-full md:w-[400px] flex flex-col gap-6">
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <MapPin className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wider">Discovery Engine</span>
                </div>
                
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search destination..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <button className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-black rounded-xl text-sm font-bold shadow-[0_0_20px_var(--primary-glow)] hover:scale-[1.02] transition-all">
                    <Activity className="w-5 h-5 animate-pulse" /> Find Nearby Charging Points
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xs font-bold transition-all mt-2">
                    <Filter className="w-4 h-4" /> Advanced Filters
                  </button>
                </div>
              </div>

              <div className="flex-1 glass-card p-6 overflow-hidden flex flex-col">
                <h2 className="font-bold mb-4 flex justify-between items-center">
                  Available Nodes
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">{activeChargers.length} found</span>
                </h2>

                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                  {activeChargers.map((charger) => (
                    <motion.div 
                      key={charger.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedChargerId(charger.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                        selectedChargerId === charger.id 
                        ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,242,255,0.1)]' 
                        : 'bg-white/5 border-white/10 hover:border-primary/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold transition-colors ${selectedChargerId === charger.id ? 'text-primary' : 'group-hover:text-primary'}`}>
                          {charger.name}
                        </h3>
                        <span className="text-xs font-bold text-primary">${charger.price}/kWh</span>
                      </div>
                      <p className="text-[10px] text-white/40 mb-3">{charger.address}</p>
                      
                      <div className="flex gap-2 mb-3">
                        <span className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20 flex items-center gap-1 font-bold">
                          <Zap className="w-3 h-3" /> {charger.speed}kW
                        </span>
                        {charger.isGreen && (
                          <span className="text-[10px] px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20 flex items-center gap-1 font-bold">
                            <Leaf className="w-3 h-3" /> Green
                          </span>
                        )}
                      </div>

                      {charger.load > 0.8 && (
                        <div className="mt-2 text-[10px] text-yellow-400 flex items-center gap-1 font-bold bg-yellow-400/5 p-2 rounded border border-yellow-400/20">
                          <Activity className="w-3 h-3 animate-pulse" />
                          High Grid Load - Delayed Start Advised
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {activeChargers.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-white/20">
                      <MapPin className="w-12 h-12 mb-4" />
                      <p className="text-sm">No nodes detected in this sector.</p>
                      <p className="text-[10px] mt-1">Try searching a different location.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative">
               <Map 
                  searchQuery={searchQuery} 
                  onChargersUpdate={setActiveChargers} 
                  selectedChargerId={selectedChargerId}
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Stats */}
      {view === "hero" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-8 pb-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold">100%</div>
              <div className="text-[10px] text-white/40 uppercase">Clean Nodes</div>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold">50kW+</div>
              <div className="text-[10px] text-white/40 uppercase">Fast Charging</div>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold">Secure</div>
              <div className="text-[10px] text-white/40 uppercase">P2P Escrow</div>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold">Smart</div>
              <div className="text-[10px] text-white/40 uppercase">Grid Balancing</div>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}
