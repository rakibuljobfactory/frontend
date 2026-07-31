import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";

const BASE_URL = "http://localhost:5000/api/admin";

export const ShowPassword = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsersWithPasswords(currentPage);
  }, [currentPage]);

  const fetchUsersWithPasswords = async (page) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/users-passwords?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setUsers(res.data.users || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalUsers(res.data.totalUsers || 0);
      }
    } catch (err) {
      console.error("Error fetching user passwords:", err);
      alert(
        err.response?.data?.message || "Failed to load passwords data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              User Password Management
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Total Records: <span className="font-semibold text-gray-700">{totalUsers}</span> |
              Showing 15 records per page
            </p>
          </div>
        </div>

        {/* Table Container */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            Loading Passwords Data...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-center">Role</th>
                  <th className="px-4 py-3 text-left">Stored Password</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No Records Found.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        {(currentPage - 1) * 15 + index + 1}
                      </td>

                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {user.name}
                      </td>

                      <td className="px-4 py-3 text-gray-600">{user.email}</td>

                      <td className="px-4 py-3 text-gray-600">
                        {user.phone || "N/A"}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${user.role === "vendor"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div
                          className="bg-gray-100 text-gray-700 font-mono text-xs p-2 rounded max-w-md overflow-x-auto select-all border"
                          title="Click to select"
                        >
                          {user.password}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Page <span className="font-semibold text-gray-700">{currentPage}</span> of{" "}
                <span className="font-semibold text-gray-700">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border rounded-md text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  Previous
                </button>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border rounded-md text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};