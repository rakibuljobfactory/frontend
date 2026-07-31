import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Building2,
  IndianRupee,
  Mail,
  Calendar,
  Filter,
  Loader2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  X,
  LogOut,
  Menu,
  User as UserIcon
} from "lucide-react";

// Framer Motion Variants for Staggered Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export const Dashboard = () => {
  const navigate = useNavigate();

  // 1. Core State Configurations
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 2. Search, Filtering, and Pagination States
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    totalJobs: 0,
  });

  // 3. Authentication Verification & User Hydration
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      toast.error("Unauthorized access. Please log in.");
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  // 4. API Core High Throughput Job Fetcher Routine
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "9",
        search: search.trim(),
        status: "Active",
      });

      if (jobType) {
        params.append("jobType", jobType);
      }

      const { data } = await axios.get(
        `http://localhost:5000/api/jobs?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setJobs(data.data);
        setPagination({
          totalPages: data.pagination.totalPages,
          hasNextPage: data.pagination.hasNextPage,
          hasPrevPage: data.pagination.hasPrevPage,
          totalJobs: data.pagination.totalJobs,
        });
      }
    } catch (error) {
      console.error("Dashboard Fetch Fault:", error);
      toast.error(error.response?.data?.message || "Failed to load job listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [page, jobType, user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Navigation Header with Mobile Controls */}
      <header className="bg-slate-900/90 border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/30">
              J
            </div>
            <span className="font-bold text-base sm:text-lg text-white tracking-tight">
              Job<span className="text-indigo-400">Hub</span>
            </span>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="text-left leading-tight pr-1">
                <p className="text-xs font-semibold text-white">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 border border-slate-800 hover:border-red-500/30 bg-slate-950 hover:bg-red-500/10 text-slate-300 hover:text-red-400 text-xs font-semibold rounded-xl transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden border-t border-slate-800 bg-slate-900/95 overflow-hidden px-4 py-4 space-y-3"
            >
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[11px] text-slate-400">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold transition active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Animated Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Glow Spheres */}
          <div className="absolute -top-12 -right-12 w-36 sm:w-48 h-36 sm:h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 sm:w-48 h-36 sm:h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                {user.role} Space
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">{user.name}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Explore live openings, review applicant demands, or filter through active corporate requests in real-time.
            </p>
          </div>

          <div className="relative z-10 hidden md:flex items-center gap-3 bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col pr-2">
              <span className="text-xs font-bold text-white">{user.name}</span>
              <span className="text-[11px] text-slate-400">{user.email}</span>
            </div>
          </div>
        </motion.div>

        {/* Mobile-Responsive Search Bar & Filters */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3.5 sm:p-5 shadow-xl mb-6 sm:mb-8 backdrop-blur-xl"
        >
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="w-full sm:flex-1 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search title, company, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition shadow-inner"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Job Type Selector */}
            <div className="w-full sm:w-48 relative">
              <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={jobType}
                onChange={(e) => {
                  setJobType(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm text-slate-300 outline-none focus:border-indigo-500 transition cursor-pointer appearance-none"
              >
                <option value="" className="bg-slate-900 text-slate-300">All Job Types</option>
                <option value="Full-time" className="bg-slate-900 text-slate-300">Full-time</option>
                <option value="Part-time" className="bg-slate-900 text-slate-300">Part-time</option>
                <option value="Internship" className="bg-slate-900 text-slate-300">Internship</option>
                <option value="Remote" className="bg-slate-900 text-slate-300">Remote</option>
              </select>
            </div>

            {/* Submit CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Find Jobs</span>
            </motion.button>
          </form>
        </motion.section>

        {/* Dynamic Cards Grid & Viewport */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl sm:rounded-3xl py-20 sm:py-28 flex flex-col items-center justify-center shadow-xl"
            >
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 animate-spin mb-3 sm:mb-4" />
              <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                Querying real-time openings...
              </p>
            </motion.div>
          ) : jobs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center bg-slate-900/60 border border-slate-800/80 rounded-2xl sm:rounded-3xl py-16 sm:py-20 px-4 sm:px-6 shadow-xl"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-500">
                <Briefcase className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">No active positions match your criteria</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
                Try broadening your search keywords or adjusting your filters to discover open recruitment parameters.
              </p>
            </motion.div>
          ) : (
            <motion.div key="results" className="space-y-4 sm:space-y-6">
              {/* Metrics Header */}
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                <span>Showing {jobs.length} of {pagination.totalJobs} live career openings</span>
              </div>

              {/* Responsive Job Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {jobs.map((job) => (
                  <motion.article
                    key={job._id}
                    variants={cardVariants}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-slate-700 transition flex flex-col justify-between group relative overflow-hidden backdrop-blur-md"
                  >
                    {/* Top Accent Gradient Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                    <div>
                      {/* Badges / Header Metadata */}
                      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                        <span className="inline-block text-[10px] font-extrabold px-2.5 py-0.5 sm:py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md uppercase tracking-wider">
                          {job.jobType}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {job.status}
                        </span>
                      </div>

                      {/* Title & Company */}
                      <h3 className="font-extrabold text-white group-hover:text-indigo-300 transition text-base sm:text-lg line-clamp-1 flex items-center justify-between gap-2">
                        <span className="truncate">{job.title}</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition shrink-0" />
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{job.companyName}</span>
                      </div>

                      {/* Specifications Grid */}
                      <div className="space-y-2 sm:space-y-2.5 mt-4 sm:mt-5">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-200 text-xs font-medium bg-slate-950/80 border border-slate-800/80 p-2 sm:p-2.5 rounded-xl">
                          <IndianRupee className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate">Scale: <strong className="text-white">{job.salaryRange || "Not Disclosed"}</strong></span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 mt-3 sm:mt-4 line-clamp-3 leading-relaxed border-t border-slate-800/80 pt-3">
                        {job.description}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <a
                        href={`mailto:${job.contact}`}
                        className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:underline font-semibold truncate max-w-[150px] sm:max-w-[170px]"
                        title={`Contact ${job.contact}`}
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                        <span className="truncate">{job.contact}</span>
                      </a>

                      <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium shrink-0">
                        <Calendar className="w-3 h-3 text-slate-600" />
                        {new Date(job.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </motion.article>
                ))}
              </motion.div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="bg-slate-900 border border-slate-800 py-3 px-4 sm:px-6 flex items-center justify-between rounded-xl sm:rounded-2xl shadow-xl mt-6 sm:mt-8">
                  <span className="text-xs text-slate-400">
                    Page <strong className="text-white">{page}</strong> of <strong className="text-white">{pagination.totalPages}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!pagination.hasPrevPage}
                      onClick={() => setPage((prev) => prev - 1)}
                      className="p-2 text-xs font-semibold border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!pagination.hasNextPage}
                      onClick={() => setPage((prev) => prev + 1)}
                      className="p-2 text-xs font-semibold border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};