import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";



const BASE_URL = "https://backend-0a04.onrender.com/api/admin";

export const JobAnalytics = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pendingJobs: 0,
    totalVendors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${BASE_URL}/analytics`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (res.data.success && res.data.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to load dashboard metrics.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Job Analytics Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time platform usage and system status overview
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Stats"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={fetchAnalytics}
              className="underline font-semibold hover:text-red-800"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-gray-500 font-medium text-sm">
              Loading Job Analytics...
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Jobs Posted
                </p>
                <h3 className="text-3xl font-extrabold text-blue-600 mt-2">
                  {stats.totalJobs.toLocaleString()}
                </h3>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Active Jobs
                </p>
                <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">
                  {stats.activeJobs.toLocaleString()}
                </h3>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Pending Approvals
                </p>
                <h3 className="text-3xl font-extrabold text-amber-600 mt-2">
                  {stats.pendingJobs.toLocaleString()}
                </h3>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500"></div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Vendors
                </p>
                <h3 className="text-3xl font-extrabold text-indigo-600 mt-2">
                  {stats.totalVendors.toLocaleString()}
                </h3>
              </div>
            </div>

            {/* Visual Container */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                System Job Activity Summary
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Overview of total platform throughput and active status distribution
              </p>
              
              <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                <svg
                  className="w-12 h-12 mb-2 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="font-medium text-sm">
                  Graphical Data Chart Ready
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Integrate Recharts or Chart.js here using the stats state
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};