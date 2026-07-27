import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Users, Clock, CheckCircle2, BarChart3, Menu, X } from 'lucide-react';

export const Navbar = ({ pendingCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: '/admin-dashboard/all-vendors', label: 'All Vendors', icon: Users },
    { id: '/admin-dashboard/pending-vendors', label: 'Pending Vendors', icon: Clock, badge: pendingCount },
    { id: '/admin-dashboard/active-vendors', label: 'Active Vendors', icon: CheckCircle2 },
    { id: '/admin-dashboard/jobs', label: 'Job Analytics', icon: BarChart3 },
    {id: '/admin-dashboard/manage-jobs', label: 'Manage Jobs', icon: BarChart3 },
    { id: '/admin-dashboard/manage-jobs', label: 'Show Passwords', icon: ShieldCheck },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile drawer on navigation
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer shrink-0"
            onClick={() => handleNavigation('/admin-dashboard')}
          >
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base md:text-lg leading-tight tracking-wide">
                Admin Panel
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Vendor Control Board</p>
            </div>
          </div>

          {/* Desktop Navigation Links (hidden on mobile/tablet) */}
          <div className="hidden lg:flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Section: Status & Mobile Hamburger Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Status Indicator */}
            <div className="flex items-center space-x-2 bg-slate-950/80 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="text-slate-300 font-medium hidden xs:inline text-[11px] sm:text-xs">
                Connected
              </span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation (visible on mobile/tablet when open) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};