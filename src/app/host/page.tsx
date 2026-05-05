"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  DollarSign, 
  Users, 
  Activity, 
  Plus, 
  Settings, 
  TrendingUp, 
  Battery, 
  Sun,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  ChevronRight,
  Search,
  Bell,
  MoreVertical,
  Check,
  X,
  Power,
  Clock
} from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { useState } from "react";

type HostTab = "dashboard" | "chargers" | "bookings" | "messages" | "settings";

export default function HostDashboard() {
  const [activeTab, setActiveTab] = useState<HostTab>("dashboard");

  const stats = [
    { name: "Total Revenue", value: "₹92,840", icon: DollarSign, color: "text-green-500" },
    { name: "Sessions", value: "142", icon: Zap, color: "text-primary" },
    { name: "Avg. Rating", value: "4.9", icon: TrendingUp, color: "text-accent" },
    { name: "Uptime", value: "99.9%", icon: Activity, color: "text-blue-500" },
  ];

  const myChargers = [
    { id: "1", name: "Nova Core 412", status: "Active", energy: "450 kWh", revenue: "₹12,500", power: "22kW", address: "Indiranagar, Bangalore" },
    { id: "2", name: "Apex Nexus 789", status: "Occupied", energy: "1,200 kWh", revenue: "₹34,200", power: "50kW", address: "Koramangala, Bangalore" },
    { id: "3", name: "Volt Node 102", status: "Offline", energy: "0 kWh", revenue: "₹0", power: "11kW", address: "HSR Layout, Bangalore" },
  ];

  const recentBookings = [
    { id: "B1", user: "John Doe", time: "02:30 PM Today", charger: "Nova Core 412", status: "Pending", amount: "₹450" },
    { id: "B2", user: "Sarah Smith", time: "04:00 PM Today", charger: "Apex Nexus 789", status: "Approved", amount: "₹820" },
    { id: "B3", user: "Mike Ross", time: "09:00 AM Tomorrow", charger: "Nova Core 412", status: "Pending", amount: "₹310" },
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "chargers", label: "My Chargers", icon: Battery },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar Navigation */}
      <aside className="w-72 border-r border-white/5 bg-secondary/30 backdrop-blur-2xl p-8 hidden lg:flex flex-col sticky top-0 h-screen">
        <Link href="/" className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--primary-glow)]">
            <Zap className="text-black w-6 h-6 fill-current" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">HEAT<span className="text-primary">SYNC</span></span>
        </Link>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as HostTab)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm group ${
                activeTab === item.id 
                ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,242,255,0.05)]" 
                : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? "text-primary" : "text-white/20 group-hover:text-white"}`} />
              {item.label}
              {item.id === "bookings" && <span className="ml-auto w-5 h-5 bg-primary text-black text-[10px] rounded-full flex items-center justify-center">2</span>}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5">
          <Show when="signed-in">
             <div className="flex items-center gap-4 p-2">
               <UserButton appearance={{ baseTheme: dark }} />
               <div className="text-xs">
                 <div className="font-bold">Richard Raju</div>
                 <div className="text-primary text-[10px] font-black uppercase tracking-widest">Host Admin</div>
               </div>
             </div>
          </Show>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 capitalize">
              {activeTab} <span className="text-primary">Center</span>
            </h1>
            <p className="text-white/40 text-sm">Managing your decentralized charging network.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all relative">
              <Bell className="w-5 h-5 text-white/50" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </button>
            <button className="neon-button px-6 py-3 flex items-center gap-2 font-bold">
              <Plus className="w-4 h-4" /> New Charger
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                  <div key={stat.name} className="glass-card p-8 border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity"><stat.icon className={`w-16 h-16 ${stat.color}`} /></div>
                    <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{stat.name}</div>
                    <div className="text-4xl font-black mb-2">{stat.value}</div>
                    <div className="flex items-center gap-1 text-[10px] text-green-400 font-bold">
                      <TrendingUp className="w-3 h-3" /> +12.5% this month
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <h2 className="text-xl font-bold">Recent Network Activity</h2>
                  <div className="glass-card overflow-hidden border-white/5">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] text-white/30 uppercase tracking-[0.2em]">
                          <th className="p-6 font-bold">Booking ID</th>
                          <th className="p-6 font-bold">User</th>
                          <th className="p-6 font-bold">Charger</th>
                          <th className="p-6 font-bold">Amount</th>
                          <th className="p-6 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {recentBookings.map((b) => (
                          <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                            <td className="p-6 font-mono text-white/40">{b.id}</td>
                            <td className="p-6 font-bold">{b.user}</td>
                            <td className="p-6 text-white/60">{b.charger}</td>
                            <td className="p-6 font-bold text-primary">{b.amount}</td>
                            <td className="p-6">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold ${b.status === 'Approved' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500 animate-pulse'}`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Grid Pulse</h2>
                  <div className="glass-card p-6 border-white/5">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Real-time Load</span>
                      <span className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20 font-bold">Optimal</span>
                    </div>
                    <div className="h-40 flex items-end gap-1 mb-6">
                      {[40, 70, 45, 90, 65, 30, 55, 80, 40, 60, 30, 45].map((h, i) => (
                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className={`flex-1 rounded-t-sm ${h > 80 ? 'bg-accent' : 'bg-primary/50 group-hover:bg-primary transition-all'}`} />
                      ))}
                    </div>
                    <p className="text-[10px] text-white/20 italic leading-relaxed">
                      * High solar generation detected. Dynamic rates reduced by ₹2.5/kWh across your Koramangala nodes.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "chargers" && (
            <motion.div key="chargers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myChargers.map((c) => (
                  <div key={c.id} className="glass-card p-8 border-white/5 group hover:border-primary/30 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <div className={`w-3 h-3 rounded-full ${c.status === 'Active' ? 'bg-green-500' : c.status === 'Occupied' ? 'bg-yellow-500' : 'bg-red-500'} shadow-[0_0_15px_currentColor]`}></div>
                    </div>
                    <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{c.name}</h3>
                    <p className="text-xs text-white/30 mb-6">{c.address}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] text-white/20 uppercase font-bold mb-1">Power</div>
                        <div className="font-bold text-primary">{c.power}</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] text-white/20 uppercase font-bold mb-1">Revenue</div>
                        <div className="font-bold">{c.revenue}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5">
                        <Settings className="w-4 h-4" /> Manage
                      </button>
                      <button className="px-4 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold rounded-xl transition-all border border-red-500/20">
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button className="glass-card border-dashed border-white/10 p-8 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all text-white/20 hover:text-primary hover:border-primary/50">
                  <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center"><Plus className="w-8 h-8" /></div>
                  <span className="font-bold uppercase tracking-widest text-xs">Add Another Node</span>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "bookings" && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-card border-white/5 overflow-hidden">
               <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <h2 className="font-bold">Pending Approval <span className="text-primary ml-2">(2)</span></h2>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/5 text-[10px] font-bold rounded-lg border border-white/10">Filter</button>
                    <button className="px-4 py-2 bg-white/5 text-[10px] font-bold rounded-lg border border-white/10">Export CSV</button>
                  </div>
               </div>
               <div className="divide-y divide-white/5">
                 {recentBookings.map((b) => (
                   <div key={b.id} className="p-8 flex items-center justify-between group hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-lg font-bold">{b.user}</div>
                          <div className="text-xs text-white/40 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {b.time} • <Battery className="w-3 h-3" /> {b.charger}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-12">
                        <div className="text-right">
                          <div className="text-xl font-black text-primary">{b.amount}</div>
                          <div className="text-[10px] text-white/30 uppercase font-bold tracking-widest italic">Expected Revenue</div>
                        </div>
                        {b.status === "Pending" ? (
                          <div className="flex gap-2">
                            <button className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-110 transition-transform">
                              <Check className="w-6 h-6" />
                            </button>
                            <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/30 hover:text-red-500 hover:border-red-500/50 transition-all">
                              <X className="w-6 h-6" />
                            </button>
                          </div>
                        ) : (
                          <div className="px-6 py-3 bg-green-500/10 text-green-500 text-xs font-bold rounded-xl border border-green-500/20">Approved</div>
                        )}
                      </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}

          {activeTab === "messages" && (
            <motion.div key="messages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-[600px] glass-card flex border-white/5 overflow-hidden">
               <div className="w-80 border-r border-white/5 flex flex-col">
                  <div className="p-6 border-b border-white/5">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input type="text" placeholder="Search chats..." className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-primary/50" />
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                    {[1,2,3].map(i => (
                      <div key={i} className={`p-6 cursor-pointer hover:bg-white/5 transition-all ${i === 1 ? 'bg-primary/5 border-l-2 border-primary' : ''}`}>
                         <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm">Driver #{1000+i}</span>
                            <span className="text-[10px] text-white/20">2m ago</span>
                         </div>
                         <p className="text-xs text-white/40 truncate">I'm arriving at Nova Core in 5 mins...</p>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="flex-1 flex flex-col bg-black/20">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center bg-background/50">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><User className="w-5 h-5 text-white/50" /></div>
                        <div>
                          <div className="font-bold text-sm">Driver #1001</div>
                          <div className="text-[10px] text-green-500 flex items-center gap-1 font-bold"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online</div>
                        </div>
                     </div>
                     <button className="p-2 text-white/30 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1 p-8 flex flex-col justify-end gap-4 overflow-y-auto">
                    <div className="self-start max-w-[70%] bg-white/5 p-4 rounded-2xl rounded-bl-none border border-white/10">
                       <p className="text-sm">Hi, I've booked Nova Core for 2:30 PM. Just wanted to confirm if the Type 2 cable is available?</p>
                    </div>
                    <div className="self-end max-w-[70%] bg-primary text-black p-4 rounded-2xl rounded-br-none font-medium">
                       <p className="text-sm text-black">Yes, absolutely! The cable is attached to the wallbox. See you soon!</p>
                    </div>
                  </div>
                  <div className="p-6 bg-background/50 border-t border-white/5">
                     <div className="flex gap-3">
                        <input type="text" placeholder="Type your message..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50" />
                        <button className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,242,255,0.2)] hover:scale-105 transition-transform">
                           <Zap className="w-6 h-6 fill-current" />
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl">
               <div className="glass-card p-8 border-white/5 divide-y divide-white/5">
                  <div className="pb-8">
                     <h3 className="font-bold mb-6">Network Preferences</h3>
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div>
                              <div className="text-sm font-bold">Auto-Approve Bookings</div>
                              <div className="text-xs text-white/40">Instantly accept bookings for verified drivers.</div>
                           </div>
                           <div className="w-12 h-6 bg-primary/20 rounded-full relative border border-primary/30 p-1 cursor-pointer">
                              <div className="w-4 h-4 bg-primary rounded-full absolute right-1"></div>
                           </div>
                        </div>
                        <div className="flex items-center justify-between">
                           <div>
                              <div className="text-sm font-bold">Dynamic Grid Pricing</div>
                              <div className="text-xs text-white/40">Adjust rates based on local transformer load.</div>
                           </div>
                           <div className="w-12 h-6 bg-primary/20 rounded-full relative border border-primary/30 p-1 cursor-pointer">
                              <div className="w-4 h-4 bg-primary rounded-full absolute right-1"></div>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="py-8">
                     <h3 className="font-bold mb-6">Payment Settings</h3>
                     <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><DollarSign className="w-5 h-5" /></div>
                              <div>
                                 <div className="text-sm font-bold">Razorpay Linked</div>
                                 <div className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Payouts: Weekly</div>
                              </div>
                           </div>
                           <button className="text-primary text-xs font-bold hover:underline">Change</button>
                        </div>
                     </div>
                  </div>

                  <div className="pt-8">
                     <button className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-primary transition-all">Save All Changes</button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function User(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
