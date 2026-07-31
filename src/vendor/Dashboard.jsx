import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";
import {
  Briefcase,
  CheckCircle2,
  FileEdit,
  XCircle,
  Archive,
  MapPin,
  Layers,
  Clock,
  User,
  Mail,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export const Dashboard = () => {
  const token = localStorage.getItem("token");

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(
        "https://backend-8sm3.onrender.com/api/vendor/vendor-dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(data.dashboard);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Skeleton Loader for smooth loading UX
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
          {/* Header Skeleton */}
          <div className="h-28 bg-slate-900 border border-slate-800 rounded-2xl"></div>
          {/* Cards Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-2xl"></div>
            ))}
          </div>
          {/* Content Skeleton */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 bg-slate-900 border border-slate-800 rounded-2xl"></div>
            <div className="h-64 bg-slate-900 border border-slate-800 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[70vh] gap-3">
          <AlertCircle className="w-12 h-12 text-rose-500" />
          <p className="text-slate-400 font-medium">{error || "No dashboard data available."}</p>
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

        {/* Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold tracking-wider uppercase mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Vendor Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Welcome back, {dashboard.vendor?.name || "Vendor"}!
              </h1>
              <div className="flex items-center space-x-2 text-slate-400 text-xs sm:text-sm mt-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{dashboard.vendor?.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-950/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
              <User className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Account Status: <span className="text-emerald-400 font-semibold">Verified</span></span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card
            title="Total Jobs"
            value={dashboard.overview?.totalJobs || 0}
            icon={Briefcase}
            color="indigo"
          />
          <Card
            title="Active Jobs"
            value={dashboard.overview?.activeJobs || 0}
            icon={CheckCircle2}
            color="emerald"
          />
          <Card
            title="Draft Jobs"
            value={dashboard.overview?.draftJobs || 0}
            icon={FileEdit}
            color="amber"
          />
          <Card
            title="Closed Jobs"
            value={dashboard.overview?.closedJobs || 0}
            icon={XCircle}
            color="rose"
          />
          <Card
            title="Archived Jobs"
            value={dashboard.overview?.archivedJobs || 0}
            icon={Archive}
            color="slate"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Jobs By Type */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Jobs By Type
              </h2>
            </div>

            <div className="space-y-3">
              {dashboard.analytics?.jobsByType?.length > 0 ? (
                dashboard.analytics.jobsByType.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <span className="text-sm font-medium text-slate-300 capitalize">{item._id || "Unspecified"}</span>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {item.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">No type data available</p>
              )}
            </div>
          </div>

          {/* Jobs By Location */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Jobs By Location
              </h2>
            </div>

            <div className="space-y-3">
              {dashboard.analytics?.jobsByLocation?.length > 0 ? (
                dashboard.analytics.jobsByLocation.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <span className="text-sm font-medium text-slate-300 capitalize">{item._id || "Remote / Unspecified"}</span>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">No location data available</p>
              )}
            </div>
          </div>

        </div>

        {/* Recent Jobs Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Recent Jobs
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-4 rounded-l-xl">Title</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 rounded-r-xl text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {dashboard.recentJobs?.length > 0 ? (
                  dashboard.recentJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-semibold text-white">{job.title}</td>
                      <td className="p-4 text-slate-400">{job.location || "Remote"}</td>
                      <td className="p-4">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {job.jobType}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <StatusBadge status={job.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-500 text-xs">
                      No recent jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

/* --- Helper Component: Styled Stat Card --- */
function Card({ title, value, icon: Icon, color = "indigo" }) {
  const colorStyles = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    slate: "text-slate-400 bg-slate-800 border-slate-700",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-slate-700 transition flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-slate-400">{title}</p>
        <div className={`p-2 rounded-xl border ${colorStyles[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <h2 className="text-3xl font-extrabold text-white tracking-tight">
        {value}
      </h2>
    </div>
  );
}

/* --- Helper Component: Dynamic Status Badge --- */
function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase() || "";

  let badgeClass = "bg-slate-800 text-slate-300 border-slate-700";

  if (normalizedStatus === "active" || normalizedStatus === "published") {
    badgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  } else if (normalizedStatus === "draft") {
    badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
  } else if (normalizedStatus === "closed") {
    badgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/30";
  } else if (normalizedStatus === "archived") {
    badgeClass = "bg-slate-800 text-slate-400 border-slate-700";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass} inline-block capitalize`}>
      {status}
    </span>
  );
}