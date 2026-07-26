import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Users, Clock, CheckCircle2, BarChart3 } from 'lucide-react';

export const Navbar = ({ pendingCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: '/admin-dashboard/all-vendors', label: 'All Vendors', icon: Users },
    { id: '/admin-dashboard/pending-vendors', label: 'Pending Vendors', icon: Clock, badge: pendingCount },
    { id: '/admin-dashboard/active-vendors', label: 'Active Vendors', icon: CheckCircle2 },
    { id: '/admin-dashboard/jobs', label: 'Job Analytics', icon: BarChart3 },
    { id: '/admin-dashboard/users-passwords', label: 'Show Passwords', icon: ShieldCheck },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/admin-dashboard')}
          >
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-tight tracking-wide">
                Admin Panel
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Vendor Control Board</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
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

          {/* Status Indicator */}
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-medium hidden sm:inline">Backend Connected</span>
          </div>

        </div>
      </div>
    </nav>
  );
};