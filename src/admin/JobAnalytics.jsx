import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";

const BASE_URL = "http://localhost:5000/api/admin";

export const JobAnalytics = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pendingJobs: 0,
    totalVendors: 0,
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Replace with your exact analytics endpoint if available
      const res = await axios.get(`${BASE_URL}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setStats(res.data.stats || stats);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Job Analytics Dashboard
        </h1>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            Loading Job Analytics...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Total Jobs Posted
                </p>
                <h3 className="text-2xl font-bold text-blue-600 mt-2">
                  {stats.totalJobs || 0}
                </h3>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Active Jobs
                </p>
                <h3 className="text-2xl font-bold text-emerald-600 mt-2">
                  {stats.activeJobs || 0}
                </h3>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Pending Approvals
                </p>
                <h3 className="text-2xl font-bold text-amber-600 mt-2">
                  {stats.pendingJobs || 0}
                </h3>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Total Vendors
                </p>
                <h3 className="text-2xl font-bold text-indigo-600 mt-2">
                  {stats.totalVendors || 0}
                </h3>
              </div>
            </div>

            {/* Analytics Visual Container */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                System Job Activity Summary
              </h2>
              <div className="h-48 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                Chart / Graphical Data Visualization Area
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};