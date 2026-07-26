import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    
    // UI State Management
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [companyName, setCompanyName] = useState("Vendor Panel");
    const [user, setUser] = useState(null); // FIXED: Initialized user state to prevent ReferenceError crash

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

    // Helper utility to inject highlight utility classes on active application routes
    // FIXED: Aligned routes with the actual 'to' paths of the Links
    const isActive = (path) => {
        return location.pathname === path
            ? "bg-blue-50 text-blue-600 font-semibold"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900";
    };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    
                    {/* Left Section: Branding & Links */}
                    <div className="flex items-center gap-8">
                        {/* Core Logo Branding */}
                        <Link to="/vendor-dashboard" className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm shadow-blue-300">
                                V
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 leading-none text-sm">JobPortal</span>
                                <span className="text-[10px] text-blue-600 font-bold tracking-wider uppercase mt-0.5">Recruiter</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links Workspace */}
                        {/* FIXED: Path mismatches with isActive helper */}
                        <div className="hidden md:flex items-center gap-1">
                            <Link to="/vendor-dashboard" className={`px-3 py-2 text-sm rounded-lg transition ${isActive("/vendor-dashboard")}`}>
                                Dashboard
                            </Link>
                            <Link to="/create-job" className={`px-3 py-2 text-sm rounded-lg transition ${isActive("/create-job")}`}>
                                Post a Job
                            </Link>
                            <Link to="/my-list" className={`px-3 py-2 text-sm rounded-lg transition ${isActive("/my-list")}`}>
                                My List
                            </Link>
                        </div>
                    </div>

                    {/* Right Section: Interactions & User Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        
                        {/* Decorative Notification Stream Pill Anchor */}
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 relative transition">
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                        </button>

                        <div className="w-px h-6 bg-slate-200"></div>

                        {/* Profile Context Selector Container */}
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-200 text-left"
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm uppercase">
                                    {companyName.charAt(0)}
                                </div>
                                <div className="flex flex-col max-w-[120px]">
                                    <span className="text-xs font-semibold text-slate-800 truncate leading-tight">{companyName}</span>
                                    <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                                        <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block animate-pulse"></span> Hiring
                                    </span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>

                            {/* Dropdown Card */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                                    <div className="px-4 py-3 border-b border-slate-100 flex flex-col gap-1">
                                        <h3 className="font-semibold text-sm text-slate-800 truncate">{user?.name || "Recruiter"}</h3>
                                        <p className="text-[11px] text-slate-500 truncate leading-none">{user?.email || "No email linked"}</p>
                                        <div className="mt-1.5">
                                            <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                                                {user?.role || "Vendor"}
                                            </span>
                                        </div>
                                    </div>
{/* 
                                    <Link
                                        to="/vendor/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-medium transition"
                                    >
                                        Company Profile
                                    </Link>

                                    <Link
                                        to="/vendor/settings"
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-medium transition"
                                    >
                                        Account Settings
                                    </Link> */}

                                    <div className="border-t border-slate-100 my-1"></div>

                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 font-semibold transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Hamburger Layout Controls Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none transition"
                        >
                            {mobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Expandable Menu Container Panel */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1 shadow-inner">
                    <Link to="/vendor-dashboard" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2.5 rounded-lg text-sm transition ${isActive("/vendor-dashboard")}`}>
                        Dashboard
                    </Link>
                    <Link to="/create-job" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2.5 rounded-lg text-sm transition ${isActive("/create-job")}`}>
                        Post a Job
                    </Link>
                    <Link to="/my-list" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2.5 rounded-lg text-sm transition ${isActive("/my-list")}`}>
                        My Listings
                    </Link>
                    
                    <div className="border-t border-slate-100 pt-3 mt-2">
                        {user && (
                            <div className="px-3 pb-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm uppercase">
                                    {companyName.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-800 leading-none">{user.name}</span>
                                    <span className="text-[10px] text-slate-400 mt-1">{user.email}</span>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false);
                                handleLogout();
                            }}
                            className="w-full text-center bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-lg text-xs transition"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};