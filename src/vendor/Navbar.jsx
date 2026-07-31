import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  PlusSquare, 
  ListFilter,
  Sparkles,
  Building2,
  ShieldCheck
} from "lucide-react";

export const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    
    // UI State Management
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [companyName, setCompanyName] = useState("Vendor Panel");
    const [user, setUser] = useState(null);

    // Fetch user context dynamically from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                // Fallback chain to find the best representative title
                setCompanyName(parsed.companyName || parsed.name || "Vendor Panel");
            } catch (error) {
                console.error("Failed to parse user session data:", error);
            }
        }
    }, []);

    // Close dropdown dynamically when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Session Termination Workflow
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const navLinks = [
        { path: "/vendor-dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/create-job", label: "Post a Job", icon: PlusSquare },
        { path: "/my-list", label: "My List", icon: ListFilter },
    ];

    return (
        <nav className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Left Section: Branding & Links */}
                    <div className="flex items-center gap-6 sm:gap-10 min-w-0">
                        {/* Core Logo Branding */}
                        <Link to="/vendor-dashboard" className="flex items-center gap-2.5 flex-shrink-0 group">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/25 border border-indigo-400/30"
                            >
                                V
                            </motion.div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-white leading-none text-sm sm:text-base tracking-tight group-hover:text-indigo-300 transition-colors">
                                    JobPortal
                                </span>
                                <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase mt-0.5 flex items-center gap-1">
                                    <Sparkles className="w-2.5 h-2.5" /> Recruiter
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links Workspace */}
                        <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                                            isActive 
                                                ? "text-white" 
                                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                        }`}
                                    >
                                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                                        <span>{link.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-active-pill"
                                                className="absolute inset-0 bg-slate-800 border border-slate-700/80 rounded-lg -z-10 shadow-sm"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Section: Interactions & User Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        
                        {/* Decorative Notification Stream Pill Anchor */}
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 relative transition-colors" 
                            aria-label="Notifications"
                        >
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                            <Bell className="w-4 h-4" />
                        </motion.button>

                        <div className="w-px h-5 bg-slate-800"></div>

                        {/* Profile Context Selector Container */}
                        <div className="relative" ref={dropdownRef}>
                            <motion.button 
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`flex items-center gap-2.5 p-1.5 rounded-xl transition border text-left ${
                                    dropdownOpen 
                                        ? "bg-slate-900 border-slate-700" 
                                        : "bg-slate-900/50 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700"
                                }`}
                            >
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-extrabold text-indigo-400 text-sm uppercase flex-shrink-0 shadow-inner">
                                    {companyName.charAt(0)}
                                </div>
                                <div className="flex flex-col max-w-[130px]">
                                    <span className="text-xs font-bold text-slate-200 truncate leading-tight">{companyName}</span>
                                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Hiring
                                    </span>
                                </div>
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ml-1 ${dropdownOpen ? "rotate-180" : ""}`} />
                            </motion.button>

                            {/* Dropdown Card */}
                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                        className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-1 z-50 divide-y divide-slate-800/80 backdrop-blur-xl"
                                    >
                                        <div className="px-4 py-3 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-xs text-white truncate">{user?.name || "Recruiter"}</h3>
                                                <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                    {user?.role || "Vendor"}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 truncate">{user?.email || "No email linked"}</p>
                                        </div>

                                        <div className="p-1">
                                            <motion.button
                                                whileHover={{ x: 2 }}
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    handleLogout();
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl font-semibold transition-colors"
                                            >
                                                <LogOut className="w-3.5 h-3.5" />
                                                <span>Log Out</span>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile Controls (Notifications + Hamburger) */}
                    <div className="flex items-center gap-2 lg:hidden">
                        {/* Mobile Notification Button */}
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 relative transition-colors" 
                            aria-label="Notifications"
                        >
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                            <Bell className="w-5 h-5" />
                        </motion.button>

                        {/* Hamburger Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-slate-300 hover:bg-slate-900 focus:outline-none transition-colors border border-slate-800"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5 text-indigo-400" /> : <Menu className="w-5 h-5" />}
                        </motion.button>
                    </div>

                </div>
            </div>

            {/* Mobile Expandable Menu Container Panel */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-5 space-y-3 overflow-hidden"
                    >
                        {/* Navigation Links */}
                        <div className="space-y-1">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                            isActive
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                                : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                        
                        {/* User Profile Summary & Logout Section */}
                        <div className="border-t border-slate-800/80 pt-3 space-y-3">
                            <div className="px-1 flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center font-extrabold text-indigo-400 text-sm uppercase flex-shrink-0">
                                        {companyName.charAt(0)}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold text-slate-200 truncate">{user?.name || companyName}</span>
                                        <span className="text-[11px] text-slate-400 truncate">{user?.email || "Vendor Account"}</span>
                                    </div>
                                </div>
                                {user?.role && (
                                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex-shrink-0">
                                        {user.role}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold py-2.5 rounded-xl text-xs transition-colors"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Log Out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};