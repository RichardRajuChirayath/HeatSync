"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Zap, Shield, Leaf, Activity, MapPin, ArrowRight, 
  Star, Navigation2, Sun, Moon, Clock, CheckCircle2, X, Loader2, 
  Edit3, ChevronDown, Car, BatteryCharging, User, TrendingUp, CreditCard, Receipt
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Show, UserButton, SignInButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Charger } from "@/components/Map";
import Logo from "@/components/Logo";

// Dynamic import for Leaflet to avoid SSR issues
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#1a162e] animate-pulse rounded-2xl flex flex-col items-center justify-center gap-4 border border-white/5">
      <Zap className="w-12 h-12 text-[#a855f7]/50 animate-bounce" />
      <span className="text-xs text-white/30 font-medium tracking-widest uppercase">Initializing OSM Nodes...</span>
    </div>
  ),
});

type SortOption = "price" | "popularity" | "nearest";
type BookingStatus = "idle" | "checking" | "available" | "requesting" | "pending" | "approved";
type NavStatus = "idle" | "navigating" | "arrived" | "charging" | "payment" | "success";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"hero" | "discovery">("hero");
  const [activeChargers, setActiveChargers] = useState<Charger[]>([]);
  const [selectedChargerId, setSelectedChargerId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("nearest");
  const [mapTheme, setMapTheme] = useState<"light" | "dark">("dark");
  const [transactionId, setTransactionId] = useState("");
  
  // Booking State
  const [bookingCharger, setBookingCharger] = useState<Charger | null>(null);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("idle");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isCustomTime, setIsCustomTime] = useState(false);

  // Navigation & Charging State
  const [navStatus, setNavStatus] = useState<NavStatus>("idle");
  const [liveUnits, setLiveUnits] = useState(0);
  const [livePrice, setLivePrice] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Custom Time State
  const [custH, setCustH] = useState("12");
  const [custM, setCustM] = useState("00");
  const [custP, setCustP] = useState("PM");

  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:30 PM", "04:00 PM", "06:30 PM"];

  useEffect(() => {
    if (isCustomTime) {
      setSelectedTime(`${custH}:${custM} ${custP}`);
    }
  }, [custH, custM, custP, isCustomTime]);

  // Charging Simulation
  useEffect(() => {
    if (navStatus === "charging" && bookingCharger) {
      const interval = setInterval(() => {
        setLiveUnits(prev => {
          const next = prev + 0.05;
          setLivePrice(next * bookingCharger.price * 80); 
          return next;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [navStatus, bookingCharger]);

  useEffect(() => {
    if (navStatus === "payment") {
      setTransactionId(`HS-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [navStatus]);

  const sortedChargers = useMemo(() => {
    const list = [...activeChargers];
    if (sortBy === "price") {
      return list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "popularity") {
      return list.sort((a, b) => b.rating - a.rating);
    } else {
      return list.sort((a, b) => a.distance - b.distance);
    }
  }, [activeChargers, sortBy]);

  // Handle Initial Modal Open
  useEffect(() => {
    if (bookingCharger) {
      setBookingStatus("checking");
      const timer = setTimeout(() => {
        setBookingStatus("available");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [bookingCharger]);

  const handleBookingRequest = () => {
    if (!selectedTime) return;
    setBookingStatus("requesting");
    
    setTimeout(() => {
      setBookingStatus("pending");
      setTimeout(() => {
        setBookingStatus("approved");
      }, 3500);
    }, 1500);
  };

  const startNavigation = () => {
    setNavStatus("navigating");
    setBookingStatus("idle");
  };

  const processPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setNavStatus("success");
    }, 3000);
  };

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0d091a]">
      {/* ELECTRA Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#a855f7]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#6366f1]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header / Nav */}
      <nav className="z-50 px-8 py-6 flex justify-between items-center bg-[#0d091a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("hero")}>
          <Logo className="w-14 h-14" />
          <span className="text-2xl font-black tracking-tighter">
            SECURE-<span className="text-[#a855f7]">OHM</span>
          </span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-white/70">
          <button onClick={() => setView("discovery")} className="hover:text-[#a855f7] transition-colors">Find Charger</button>
          <a href="#" className="hover:text-[#a855f7] transition-colors">Sustainability</a>
        </div>

        <div className="flex gap-4 items-center">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="px-5 py-2 text-sm font-bold hover:text-[#a855f7] transition-colors cursor-pointer">Login</button>
            </SignInButton>
            <button onClick={() => setView("discovery")} className="neon-button px-6 py-2">Explore</button>
          </Show>
          <Show when="signed-in">
            <UserButton appearance={{ baseTheme: dark }} />
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#a855f7]/10 border border-[#a855f7]/20 text-[#a855f7] text-xs font-bold mb-8"
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#6366f1] drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">People.</span>
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
                className="neon-button px-10 py-4 text-lg flex items-center gap-2 group"
              >
                Find a Charging Node <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
              <div className="glass-card p-6 border-[#a855f7]/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-[#a855f7]">
                    <MapPin className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-wider">Discovery Engine</span>
                  </div>
                  <button 
                    onClick={() => setMapTheme(mapTheme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/50 hover:text-[#a855f7]"
                  >
                    {mapTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search destination..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#a855f7]/50 transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Advanced Filters</span>
                  <div className="grid grid-cols-3 gap-2">
                    {["price", "popularity", "nearest"].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => setSortBy(opt as SortOption)}
                        className={`py-2 text-[10px] font-bold rounded-lg border transition-all capitalize ${sortBy === opt ? "bg-[#a855f7] text-white border-[#a855f7]" : "bg-white/5 border-white/10 text-white/50"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 glass-card p-6 overflow-hidden flex flex-col border-[#a855f7]/10">
                <h2 className="font-bold mb-4 flex justify-between items-center">
                  Available Nodes
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">{sortedChargers.length} found</span>
                </h2>

                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                  {sortedChargers.map((charger) => (
                    <motion.div 
                      key={charger.id}
                      layout
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedChargerId(charger.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                        selectedChargerId === charger.id 
                        ? 'bg-[#a855f7]/10 border-[#a855f7] shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                        : 'bg-white/5 border-white/10 hover:border-[#a855f7]/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold transition-colors ${selectedChargerId === charger.id ? 'text-[#a855f7]' : 'group-hover:text-[#a855f7]'}`}>
                          {charger.name}
                        </h3>
                        <span className="text-xs font-bold text-[#a855f7]">₹{(charger.price * 80).toFixed(0)}/kWh</span>
                      </div>
                      <p className="text-[10px] text-white/40 mb-3">{charger.address}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <span className="text-[10px] px-2 py-1 bg-[#a855f7]/10 text-[#a855f7] rounded border border-[#a855f7]/20 flex items-center gap-1 font-bold">
                            <Zap className="w-3 h-3" /> {charger.speed}kW
                          </span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookingCharger(charger);
                          }}
                          className="px-3 py-1.5 bg-[#a855f7] text-white text-[10px] font-bold rounded-lg hover:bg-[#6366f1] transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative">
               <Map 
                  searchQuery={searchQuery} 
                  onChargersUpdate={setActiveChargers} 
                  selectedChargerId={selectedChargerId}
                  mapTheme={mapTheme}
                  onBookNow={setBookingCharger}
                  isNavigating={navStatus === "navigating"}
                  targetCharger={bookingCharger}
                  onArrival={() => setNavStatus("arrived")}
               />
               
               {/* In-Map Navigation Overlay */}
               {navStatus === "navigating" && (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-6 left-6 right-6 z-[1000] glass-card p-6 border-[#a855f7]/30 bg-[#0d091a]/80 backdrop-blur-xl flex items-center justify-between"
                 >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#a855f7] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse">
                        <Navigation2 className="text-white w-6 h-6 fill-current" />
                      </div>
                      <div>
                        <div className="text-xs text-white/40 font-bold uppercase tracking-widest">En route to</div>
                        <div className="text-xl font-bold text-[#a855f7]">{bookingCharger?.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black tabular-nums">{bookingCharger?.distance} km</div>
                      <div className="text-[10px] text-white/30 italic">Real-time GPS active</div>
                    </div>
                 </motion.div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlays: Booking, Charging, Payment */}
      <AnimatePresence>
        {(bookingCharger && navStatus !== "navigating") && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card max-w-md w-full p-8 border-[#a855f7]/20 relative overflow-hidden"
            >
              {navStatus === "idle" && (
                <button 
                  onClick={() => {
                    setBookingCharger(null);
                    setBookingStatus("idle");
                    setSelectedTime("");
                  }}
                  className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}

              {/* Step 1: Checking Availability */}
              {bookingStatus === "checking" && navStatus === "idle" && (
                <div className="py-12 flex flex-col items-center text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="mb-6"><Loader2 className="w-12 h-12 text-[#a855f7]" /></motion.div>
                  <h3 className="text-xl font-bold mb-2">Pinging Transformer...</h3>
                  <p className="text-white/40 text-xs">Verifying slot availability with local grid nodes.</p>
                </div>
              )}

              {/* Step 2: Slot Available Confirmation & Time Input */}
              {(bookingStatus === "available" || (bookingStatus === "idle" && bookingCharger)) && navStatus === "idle" && (
                <>
                  <div className="text-center mb-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/20"><CheckCircle2 className="text-green-500 w-8 h-8" /></motion.div>
                    <h2 className="text-2xl font-bold mb-1 text-green-400">Slot Available!</h2>
                    <p className="text-white/40 text-xs">Node {bookingCharger.name} is ready.</p>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Choose Arrival Time</span>
                    <button onClick={() => setIsCustomTime(!isCustomTime)} className="text-[#a855f7] text-[10px] font-bold flex items-center gap-1 hover:underline"><Edit3 className="w-3 h-3" /> {isCustomTime ? "Show Slots" : "Custom Time"}</button>
                  </div>

                  {isCustomTime ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex gap-2">
                      <select value={custH} onChange={(e) => setCustH(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 text-center font-bold appearance-none">
                        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => <option key={h} value={h} className="bg-[#1a1a1a]">{h}</option>)}
                      </select>
                      <div className="text-2xl font-bold py-3">:</div>
                      <select value={custM} onChange={(e) => setCustM(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 text-center font-bold appearance-none">
                        {["00", "15", "30", "45"].map(m => <option key={m} value={m} className="bg-[#1a1a1a]">{m}</option>)}
                      </select>
                      <select value={custP} onChange={(e) => setCustP(e.target.value)} className="flex-1 bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-xl py-4 text-center font-bold appearance-none text-[#a855f7]">
                        <option value="AM" className="bg-[#1a1a1a]">AM</option>
                        <option value="PM" className="bg-[#1a1a1a]">PM</option>
                      </select>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 mb-8">
                      {timeSlots.map((time) => (
                        <button key={time} onClick={() => setSelectedTime(time)} className={`py-3 rounded-xl border text-[10px] font-bold transition-all ${selectedTime === time ? 'bg-[#a855f7] border-[#a855f7] text-white' : 'bg-white/5 border-white/10 text-white/50'}`}>{time}</button>
                      ))}
                    </div>
                  )}

                  <button disabled={!selectedTime} onClick={handleBookingRequest} className="neon-button w-full py-4 text-base disabled:opacity-30">Confirm Booking Request</button>
                </>
              )}

              {/* Step 3: Approval Waiting */}
              {(bookingStatus === "requesting" || bookingStatus === "pending") && navStatus === "idle" && (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-[#a855f7]/20 rounded-full" />
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute inset-0 border-4 border-[#a855f7] border-t-transparent rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{bookingStatus === "requesting" ? "Broadcasting Request..." : "Waiting for Host Approval"}</h3>
                  <p className="text-white/40 text-xs">Your request for <span className="text-[#a855f7] font-bold">{selectedTime}</span> has been sent.</p>
                </div>
              )}

              {/* Step 4: Approved & Start Nav */}
              {bookingStatus === "approved" && navStatus === "idle" && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30"><CheckCircle2 className="w-10 h-10 text-green-500" /></div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">Booking Confirmed!</h3>
                  <p className="text-white/50 text-sm mb-8">Host approved arrival at <span className="text-white font-bold">{selectedTime}</span>.</p>
                  <button onClick={startNavigation} className="neon-button w-full py-4 text-base">
                    <Navigation2 className="w-5 h-5 fill-current" /> Start Navigation
                  </button>
                </motion.div>
              )}

              {/* Step 6: Arrived & Charge Prompt */}
              {navStatus === "arrived" && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-8 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-[#a855f7]/20 rounded-3xl flex items-center justify-center mb-8 border border-[#a855f7]/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <BatteryCharging className="w-12 h-12 text-[#a855f7] animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 tracking-tighter">You Have Arrived!</h3>
                  <p className="text-white/50 mb-10 text-sm leading-relaxed px-4">Vehicle successfully paired with <span className="text-white font-bold">{bookingCharger?.name}</span>. Grid capacity is optimal.</p>
                  <div className="flex flex-col gap-3 w-full">
                    <button onClick={() => setNavStatus("charging")} className="neon-button w-full py-5 text-lg">Yes, Start Charging</button>
                    <button onClick={() => {setNavStatus("idle"); setBookingCharger(null);}} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/50 font-bold rounded-2xl transition-all">No, Not Now</button>
                  </div>
                </motion.div>
              )}

              {/* Step 7: Live Charging Metrics */}
              {navStatus === "charging" && (
                <div className="py-6 flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-[#a855f7]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#a855f7]/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    <Zap className="w-8 h-8 text-[#a855f7] animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tighter text-[#a855f7]">Charging Session</h3>
                  <p className="text-white/40 text-xs mb-8">Node: {bookingCharger?.name}</p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <div className="glass-card p-4 border-white/5 text-center">
                      <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Energy Used</div>
                      <div className="text-2xl font-black tabular-nums">{liveUnits.toFixed(2)} <span className="text-xs text-white/40">kWh</span></div>
                    </div>
                    <div className="glass-card p-4 border-white/5 text-center">
                      <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Total Cost</div>
                      <div className="text-2xl font-black tabular-nums">₹{livePrice.toFixed(0)}</div>
                    </div>
                  </div>

                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-8">
                    <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="h-full w-1/3 bg-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold mb-10">
                    <TrendingUp className="w-4 h-4" /> Eco-Mode Active: 100% Solar Offset
                  </div>

                  <button 
                    onClick={() => setNavStatus("payment")} 
                    className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl border border-red-500/20 transition-all"
                  >
                    Stop Session
                  </button>
                </div>
              )}

              {/* Step 8: Payment Simulation (Razorpay) */}
              {navStatus === "payment" && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="py-4">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#a855f7]/20 rounded-full flex items-center justify-center border border-[#a855f7]/30">
                       <CreditCard className="w-5 h-5 text-[#a855f7]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Payment Summary</h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest">Transaction ID: {transactionId}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-white/40 text-sm font-medium">Charger Usage</span>
                      <span className="font-bold">{liveUnits.toFixed(2)} kWh</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-white/40 text-sm font-medium">Node Facility Fee</span>
                      <span className="font-bold">₹15</span>
                    </div>
                    <div className="flex justify-between items-center py-4">
                      <span className="text-lg font-bold">Total Amount</span>
                      <span className="text-2xl font-black text-[#a855f7]">₹{(livePrice + 15).toFixed(0)}</span>
                    </div>
                  </div>

                  {isProcessingPayment ? (
                    <div className="py-10 flex flex-col items-center text-center">
                       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="mb-4">
                         <Loader2 className="w-12 h-12 text-[#a855f7]" />
                       </motion.div>
                       <p className="text-[#a855f7] font-bold animate-pulse">Processing via Razorpay Secure...</p>
                       <p className="text-[10px] text-white/30 mt-2 italic">Do not close this window</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button 
                        onClick={processPayment}
                        className="neon-button w-full py-5 text-base shadow-[0_10px_20px_rgba(168,85,247,0.2)]"
                      >
                        <CreditCard className="w-5 h-5" /> Pay with Razorpay
                      </button>
                      <button className="w-full py-4 bg-white/5 text-white/40 text-xs font-bold rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest">
                        Choose Other Method
                      </button>
                    </div>
                  )}

                  <div className="mt-8 flex justify-center items-center gap-2 opacity-20">
                    <Shield className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">PCI-DSS Compliant v3.2</span>
                  </div>
                </motion.div>
              )}

              {/* Step 9: Final Success & Receipt */}
              {navStatus === "success" && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Paid Successfully!</h2>
                  <p className="text-white/40 text-sm mb-10">Your transaction has been confirmed by the node host.</p>
                  
                  <div className="w-full glass-card bg-white/5 border-dashed border-[#a855f7]/20 p-6 mb-10 relative">
                    <div className="absolute top-0 left-0 w-4 h-4 bg-black rounded-br-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute top-0 right-0 w-4 h-4 bg-black rounded-bl-full translate-x-1/2 -translate-y-1/2" />
                    
                    <div className="flex justify-between items-center mb-6">
                       <div className="flex items-center gap-2"><Logo className="w-6 h-6" /> <span className="text-[10px] font-bold uppercase tracking-widest">Secure-Ohm Receipt</span></div>
                       <div className="text-[10px] font-bold text-white/30">{new Date().toLocaleDateString()}</div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                       <div className="flex justify-between text-xs"><span className="text-white/40">Host Node:</span> <span className="font-bold">{bookingCharger?.name}</span></div>
                       <div className="flex justify-between text-xs"><span className="text-white/40">Total Energy:</span> <span className="font-bold">{liveUnits.toFixed(2)} kWh</span></div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                       <span className="text-[10px] text-white/30 font-bold uppercase">Total Paid</span>
                       <span className="text-2xl font-black text-[#a855f7]">₹{(livePrice + 15).toFixed(0)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setNavStatus("idle");
                      setBookingCharger(null);
                      setLiveUnits(0);
                      setLivePrice(0);
                    }}
                    className="w-full py-5 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-xl"
                  >
                    <Receipt className="w-5 h-5" /> Done & Download Receipt
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
