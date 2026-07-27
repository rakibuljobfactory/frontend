import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";

const BASE_URL = "https://backend-tau-two-76.vercel.app/api/admin";

export const AllVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [checkingExpiry, setCheckingExpiry] = useState(false);

  // Modal State for Updating Subscription/Payment Details
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [updatingDates, setUpdatingDates] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Component Mount par sabse pehle expired vendors ko sync karein, fir list fetch karein
    initPageData();
  }, []);

  const initPageData = async () => {
    await checkAndSyncExpiredVendors(false); // Silent background check
    await fetchVendors(); // Vendor list fetch
  };

  useEffect(() => {
    const data = vendors.filter((vendor) =>
      `${vendor.name || ""} ${vendor.email || ""} ${vendor.phone || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredVendors(data);
  }, [search, vendors]);

  /**
   * ROUTE INTEGRATION: PUT /api/admin/check-expired-vendors
   * Checks database for vendors whose End_date <= current date and sets their status to pending/inactive automatically.
   * @param {boolean} showAlert - Set true when manually triggered via button
   */
  const checkAndSyncExpiredVendors = async (showAlert = true) => {
    try {
      if (showAlert) setCheckingExpiry(true);
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.put(
        `${BASE_URL}/check-expired-vendors`,
        {},
        authHeaders
      );

      if (showAlert) {
        alert(
          res.data?.message ||
          `Sync complete! Modified ${res.data?.modifiedCount || 0} vendors.`
        );
        // Sync button click hone par ताज़ा data wapas fetch karein
        await fetchVendors();
      }
    } catch (err) {
      console.error("Error checking expired vendors:", err);
      if (showAlert) {
        alert(
          err.response?.data?.message || "Failed to check expired vendors"
        );
      }
    } finally {
      if (showAlert) setCheckingExpiry(false);
    }
  };

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.get(`${BASE_URL}/vendors`, authHeaders);
      const vendorsList = res.data.vendors || [];

      const vendorsWithCounts = await Promise.all(
        vendorsList.map(async (vendor) => {
          try {
            const countRes = await axios.get(
              `${BASE_URL}/vendor-job-count/${vendor._id}`,
              authHeaders
            );
            return {
              ...vendor,
              totalJobs: countRes.data.totalJobs ?? 0,
              activeJobs: countRes.data.activeJobs ?? 0,
            };
          } catch (err) {
            return { ...vendor, totalJobs: 0, activeJobs: 0 };
          }
        })
      );

      setVendors(vendorsWithCounts);
      setFilteredVendors(vendorsWithCounts);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  // Open Modal with vendor data
  const handleOpenDateModal = (vendor) => {
    setSelectedVendor(vendor);
    setPaymentAmount(vendor.PaymentAmount || "");
    setPaymentDate(vendor.paymentDate ? vendor.paymentDate.split("T")[0] : "");
    setEndDate(vendor.End_date ? vendor.End_date.split("T")[0] : "");
  };

  // Save Subscription/Payment Updates
  const handleSaveDates = async (e) => {
    e.preventDefault();
    if (!selectedVendor) return;

    try {
      setUpdatingDates(true);
      const res = await axios.put(
        `${BASE_URL}/vendor-dates/${selectedVendor._id}`,
        {
          paymentDate,
          End_date: endDate,
          PaymentAmount: paymentAmount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Local State Update for Fast Re-render
      setVendors((prev) =>
        prev.map((v) =>
          v._id === selectedVendor._id
            ? {
              ...v,
              paymentDate,
              End_date: endDate,
              PaymentAmount: paymentAmount,
            }
            : v
        )
      );

      alert(res.data?.message || "Updated successfully!");
      setSelectedVendor(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update");
    } finally {
      setUpdatingDates(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      const res = await axios.put(
        `${BASE_URL}/vendors/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVendors((prev) =>
        prev.map((v) =>
          v._id === id ? { ...v, isApproved: true, isActive: true } : v
        )
      );

      alert(res.data?.message || "Vendor approved successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to approve vendor");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSetPending = async (id) => {
    try {
      setActionLoading(id);
      const res = await axios.put(
        `${BASE_URL}/vendors/${id}/pending`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVendors((prev) =>
        prev.map((v) =>
          v._id === id ? { ...v, isApproved: false, isActive: false } : v
        )
      );

      alert(res.data?.message || "Vendor status set back to pending!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to change vendor status");
    } finally {
      setActionLoading(null);
    }
  };

  const getPaymentStatus = (endDateVal) => {
    if (!endDateVal) return "Expired";
    return new Date(endDateVal) > new Date() ? "Active" : "Expired";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6">
      <Navbar />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Vendors</h1>
          <p className="text-gray-500 text-sm mt-1">
            Total Vendors: {filteredVendors.length}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Manual Trigger Button for check-expired-vendors */}
          <button
            onClick={() => checkAndSyncExpiredVendors(true)}
            disabled={checkingExpiry}
            className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            title="Click to manually check real-time expiry dates and set expired vendors to pending"
          >
            {checkingExpiry ? "Syncing..." : "🔄 Sync Expired Status"}
          </button>

          <input
            type="text"
            placeholder="Search vendor..."
            className="border rounded-lg px-4 py-2 w-full md:w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-lg text-gray-500">
          Loading Vendors...
        </div>
      ) : (
        <div className="overflow-auto rounded-xl border border-gray-200 shadow-sm bg-white">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50 font-semibold text-gray-600 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Vendor</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-center">Total Jobs</th>
                <th className="px-4 py-3 text-center">Active Jobs</th>
                <th className="px-4 py-3 text-center">Approval</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Payment Status</th>
                <th className="px-4 py-3 text-center">Amount</th>
                <th className="px-4 py-3 text-center">Payment Date</th>
                <th className="px-4 py-3 text-center">Expiry Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center py-10 text-gray-500">
                    No Vendors Found
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                          {vendor.name?.charAt(0).toUpperCase() || "V"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {vendor.name}
                          </p>
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 font-medium px-2 py-0.5 rounded">
                            {vendor.role || "Vendor"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-gray-600">{vendor.email}</td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {vendor.phone || "N/A"}
                    </td>

                    <td className="px-4 py-3.5 text-center font-semibold text-blue-600">
                      {vendor.totalJobs || 0}
                    </td>

                    <td className="px-4 py-3.5 text-center font-semibold text-emerald-600">
                      {vendor.activeJobs || 0}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      {vendor.isApproved ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Approved
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      {vendor.isActive ? (
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStatus(vendor.End_date) === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                          }`}
                      >
                        {getPaymentStatus(vendor.End_date)}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-center font-medium text-gray-700">
                      {vendor.PaymentAmount ? `₹${vendor.PaymentAmount}` : "N/A"}
                    </td>

                    <td className="px-4 py-3.5 text-center text-gray-600">
                      {formatDate(vendor.paymentDate)}
                    </td>

                    <td className="px-4 py-3.5 text-center text-gray-600">
                      {formatDate(vendor.End_date)}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <div className="flex justify-center items-center gap-2">
                        {/* Edit Subscription / Dates & Amount Button */}
                        <button
                          onClick={() => handleOpenDateModal(vendor)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold px-2.5 py-1.5 rounded transition border border-blue-200"
                        >
                          Edit Subscription
                        </button>

                        {/* Approval Toggle */}
                        {vendor.isApproved ? (
                          <button
                            onClick={() => handleSetPending(vendor._id)}
                            disabled={actionLoading === vendor._id}
                            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium px-2.5 py-1.5 rounded transition shadow-sm disabled:opacity-50"
                          >
                            {actionLoading === vendor._id
                              ? "Updating..."
                              : "Set Pending"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(vendor._id)}
                            disabled={actionLoading === vendor._id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-2.5 py-1.5 rounded transition shadow-sm disabled:opacity-50"
                          >
                            {actionLoading === vendor._id
                              ? "Approving..."
                              : "Approve"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Date & Payment Update Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Update Vendor Subscription
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Vendor:{" "}
              <span className="font-semibold text-gray-700">
                {selectedVendor.name}
              </span>
            </p>

            <form onSubmit={handleSaveDates} className="space-y-4">
              {/* Payment Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>

              {/* Payment Date Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>

              {/* Expiry Date Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Expiry Date (End_date)
                </label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedVendor(null)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingDates}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {updatingDates ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};