import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Briefcase,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  IndianRupee,
  UserPlus,
  LogIn,
  Zap,
  Award
} from "lucide-react";

export const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/register`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[400px] -right-20 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Navigation Bar */}
      <header className="bg-slate-900/80 border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/30">
              J
            </div>
            <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
              Job<span className="text-indigo-400">Hub</span>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition"
            >
              <LogIn className="w-4 h-4 text-indigo-400" />
              <span>Sign In</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/25 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5" />
          100% Free Job & Hiring Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto"
        >
          Connect directly with top companies &{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
            hire verified talents.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 text-xs sm:text-base max-w-2xl mx-auto mt-4 sm:mt-6 leading-relaxed"
        >
          Zero hidden fees. Whether you are looking for your dream job or an employer hiring candidates, JobHub offers free listings and instant direct communication.
        </motion.p>

        {/* Quick Search Interactive Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 sm:mt-10 max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 p-2 sm:p-3 rounded-2xl shadow-2xl backdrop-blur-xl"
        >
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Job title, skill, or company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 shrink-0"
            >
              <span>Explore Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>

        {/* Highlighted Value Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-slate-400 text-xs sm:text-sm"
        >
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-3.5 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No Application Charges</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-3.5 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Free Job Postings for Employers</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-3.5 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Verified Corporate Listings</span>
          </div>
        </motion.div>
      </section>

      {/* Feature Cards Grid (Why Choose Us) */}
      <section className="py-12 sm:py-16 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Built for Candidates & Recruiters</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Simple, transparent, and built to eliminate recruitment middlemen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-slate-700 transition">
              <div className="w-12 h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">For Job Seekers</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Browse hundreds of active engineering, technical, and non-tech openings. Apply directly via employer contacts with zero fees.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-slate-700 transition">
              <div className="w-12 h-12 bg-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">For Employers & Vendors</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Post full-time, part-time, or internship listings in minutes. Manage applicants and recruit without agency commission fees.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-slate-700 transition">
              <div className="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center text-violet-400 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Verified & Secure</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Every employer profile undergoes admin gatekeeper review, ensuring job seekers interact only with legitimate corporate requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action CTA Banner */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ready to take the next step in your career?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Create your account in seconds and unlock live career opportunities today.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
              >
                <span>Register Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm px-8 py-3.5 rounded-xl border border-slate-800 transition flex items-center justify-center"
              >
                <span>Sign In To Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} JobHub. All rights reserved. 100% Free Job & Recruiting Portal.</p>
      </footer>
    </div>
  );
};