import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, Mail, Phone, Calendar, RefreshCw, ShieldCheck } from "lucide-react";
import { Navbar } from "./Navbar";
const API_BASE_URL = "https://backend-0a04.onrender.com/api/admin";

export const ActiveVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchActiveVendors = async () => {
    try {
      setLoading(true);
      // Fixed: URL correctly mapped to fetching active/approved vendors
      const res = await axios.get(`${API_BASE_URL}/vendors/active`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVendors(res.data.vendors || []);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to fetch active vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveVendors();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Navbar />
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            Active Vendors
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Total Active & Verified Vendors : <span className="font-semibold text-gray-700">{vendors.length}</span>
          </p>
        </div>
        <button
          onClick={fetchActiveVendors}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          Refresh List
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-center py-24 text-gray-400 font-medium text-sm">
          Loading active vendors...
        </div>
      ) : vendors.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center space-y-2">
          <p className="text-gray-500 font-medium">No active vendors found right now.</p>
          <p className="text-xs text-gray-400">Approved and active accounts will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50/70 text-gray-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 text-left">Vendor Details</th>
                  <th className="px-6 py-3.5 text-left">Contact Info</th>
                  <th className="px-6 py-3.5 text-left">Subscription Valid Until</th>
                  <th className="px-6 py-3.5 text-left">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                          {vendor.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{vendor.name}</p>
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-md">
                            Vendor
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{vendor.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{vendor.phone || "N/A"}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {vendor.End_date
                            ? new Date(vendor.End_date).toLocaleDateString()
                            : "Lifetime / No Expiry"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Active & Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};