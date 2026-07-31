import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";
// Base API route ko clean rakhen
const API_BASE_URL = "http://localhost:5000/api/admin";

export const PendingVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const fetchPendingVendors = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE_URL}/vendors/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVendors(res.data.vendors || []);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const approveVendor = async (id) => {
    try {
      // Sahi API Endpoint: /api/admin/vendors/:id/approve
      await axios.put(
        `${API_BASE_URL}/vendors/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // State se immediately removal
      setVendors((prev) => prev.filter((vendor) => vendor._id !== id));
      alert("Vendor approved successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Approval failed.");
    }
  };

  const rejectVendor = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to reject this vendor?"
    );

    if (!confirmDelete) return;

    try {
      // Sahi API Endpoint: /api/admin/vendors/:id/reject
      await axios.delete(`${API_BASE_URL}/vendors/${id}/reject`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVendors((prev) => prev.filter((vendor) => vendor._id !== id));
      alert("Vendor rejected.");
    } catch (error) {
      alert(error.response?.data?.message || "Reject failed.");
    }
  };

  return (
    <div className="p-6">
      <Navbar />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pending Vendors</h1>
        <p className="text-gray-500 font-medium">
          Total Pending : {vendors.length}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-lg font-medium text-gray-500">
          Loading...
        </div>
      ) : vendors.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500 font-medium">
          No pending vendors found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
              <tr>
                <th className="px-5 py-3 text-left">Vendor</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Phone</th>
                <th className="px-5 py-3 text-left">Registered</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-gray-50/80 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                        {vendor.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{vendor.name}</p>
                        <p className="text-xs text-gray-400">Vendor</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-600">{vendor.email}</td>
                  <td className="px-5 py-4 text-gray-600">{vendor.phone || "N/A"}</td>
                  <td className="px-5 py-4 text-gray-600 font-mono text-xs">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      Pending Approval
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => approveVendor(vendor._id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectVendor(vendor._id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};