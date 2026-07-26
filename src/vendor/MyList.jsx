import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Navbar } from "./Navbar";

export const MyList = () => {
    const navigate = useNavigate();

    // Core State Hub
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // Filter and Pagination Systems
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState(""); // Holds: "", "Active", or "Closed"
    const [jobTypeFilter, setJobTypeFilter] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalJobs: 0,
        hasNextPage: false,
        hasPrevPage: false
    });

    // Inline Editor Form States
    const [editingJobId, setEditingJobId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: "",
        companyName: "",
        location: "",
        salaryRange: "",
        jobType: "Full-time",
        contact: "",
        description: ""
    });

    // API Postings Fetch Controller
    const fetchMyPostings = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Session missing. Please log in.");
                return navigate("/");
            }

            const params = new URLSearchParams({
                page: page.toString(),
                limit: "6",
                search: search.trim()
            });

            if (statusFilter) params.append("status", statusFilter);
            if (jobTypeFilter) params.append("jobType", jobTypeFilter);

            const { data } = await axios.get(`http://localhost:5000/api/job/my-postings?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setListings(data.data || []);
                setPagination({
                    totalPages: data.pagination?.totalPages || 1,
                    totalJobs: data.pagination?.totalJobs || 0,
                    hasNextPage: data.pagination?.hasNextPage || false,
                    hasPrevPage: data.pagination?.hasPrevPage || false
                });
            }
        } catch (error) {
            console.error("Fetch operational telemetry failure:", error);
            toast.error(error.response?.data?.message || "Could not retrieve postings.");
            setListings([]);
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, jobTypeFilter, navigate]);

    useEffect(() => {
        fetchMyPostings();
    }, [fetchMyPostings]);

    // DB-Aligned Status Toggling Engine
    const handleStatusToggle = async (jobId, currentStatus) => {
        try {
            setActionLoadingId(jobId);

            // Inverts Active <-> Closed to satisfy backend Mongoose Schema Enums
            const nextStatus = currentStatus === "Active" ? "Closed" : "Active";
            const token = localStorage.getItem("token");

            const { data } = await axios.patch(
                `http://localhost:5000/api/job/status/${jobId}`,
                { status: nextStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success(`Job status changed to ${nextStatus === "Closed" ? "Inactive" : "Active"}`);

                // Live UI Synchronization Pipeline
                setListings(listings.map(j => j._id === jobId ? { ...j, status: nextStatus } : j));
            }
        } catch (error) {
            console.error("Status toggle routing fault:", error);
            toast.error(error.response?.data?.message || "Status validation failed.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to permanently delete this job listing?")) return;

        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.delete(`http://localhost:5000/api/job/delete/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success("Job posting successfully deleted.");
                fetchMyPostings();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Purge execution failed.");
        }
    };

    const startInlineEditing = (job) => {
        setEditingJobId(job._id);
        setEditFormData({
            title: job.title || "",
            companyName: job.companyName || "",
            location: job.location || "",
            salaryRange: job.salaryRange || "",
            jobType: job.jobType || "Full-time",
            contact: job.contact || "",
            description: job.description || ""
        });
    };

    const handleEditFormChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const saveInlineModifications = async (e, jobId) => {
        e.preventDefault();
        try {
            setActionLoadingId(jobId);
            const token = localStorage.getItem("token");

            const { data } = await axios.put(
                `http://localhost:5000/api/job/update/${jobId}`,
                editFormData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success("Job updates saved successfully!");
                setEditingJobId(null);
                fetchMyPostings();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update listing parameters.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchMyPostings();
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">

                <div className="max-w-7xl mx-auto">

                    {/* Upper Dashboard Info */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Vendor Recruitment Panel</h1>
                            <p className="text-sm text-slate-500 mt-0.5">
                                You have deployed <span className="font-bold text-slate-900">{pagination.totalJobs} openings</span> down to the pipeline.
                            </p>
                        </div>
                        <Link to="/create-job" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition shadow-sm">
                            + Post a New Job
                        </Link>
                    </div>

                    {/* Filters Board Workspace */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4 justify-between">
                        <form onSubmit={handleSearchSubmit} className="w-full md:max-w-xs flex gap-2">
                            <input
                                type="text"
                                placeholder="Search by title, town..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-600"
                            />
                            <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg transition">Search</button>
                        </form>

                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                            <select
                                value={jobTypeFilter}
                                onChange={(e) => { setJobTypeFilter(e.target.value); setPage(1); }}
                                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-600 outline-none"
                            >
                                <option value="">All Architectures</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Remote">Remote</option>
                            </select>

                            <div className="flex items-center gap-1">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
                                {[
                                    { label: "All", value: "" },
                                    { label: "Active", value: "Active" },
                                    { label: "Inactive", value: "Closed" } // Submits 'Closed' filter directly to API
                                ].map((pill) => (
                                    <button
                                        key={pill.label}
                                        onClick={() => { setStatusFilter(pill.value); setPage(1); }}
                                        className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border ${statusFilter === pill.value ? "bg-slate-900 border-slate-900 text-white" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                                    >
                                        {pill.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Stream View */}
                    {loading ? (
                        <div className="bg-white border border-slate-200 rounded-xl py-24 flex justify-center shadow-sm">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : listings.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-xl py-16 text-center shadow-sm">
                            <p className="text-sm text-slate-500">No postings found matching your parameters.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {listings.map((job) => (
                                <div key={job._id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-5 transition hover:shadow-md">
                                    {editingJobId === job._id ? (
                                        <form onSubmit={(e) => saveInlineModifications(e, job._id)} className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Position Title</label>
                                                    <input type="text" name="title" required value={editFormData.title} onChange={handleEditFormChange} className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-600 outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Company Branding</label>
                                                    <input type="text" name="companyName" required value={editFormData.companyName} onChange={handleEditFormChange} className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-600 outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Geographic Location</label>
                                                    <input type="text" name="location" required value={editFormData.location} onChange={handleEditFormChange} className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-600 outline-none" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Salary Range</label>
                                                    <input type="text" name="salaryRange" required value={editFormData.salaryRange} onChange={handleEditFormChange} className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-600 outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Job Setting Mode</label>
                                                    <select name="jobType" value={editFormData.jobType} onChange={handleEditFormChange} className="w-full text-xs border border-slate-300 bg-white rounded-lg px-3 py-2 focus:border-blue-600 outline-none">
                                                        <option value="Full-time">Full-time</option>
                                                        <option value="Part-time">Part-time</option>
                                                        <option value="Internship">Internship</option>
                                                        <option value="Remote">Remote</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">HR Email Channel</label>
                                                    <input type="email" name="contact" required value={editFormData.contact} onChange={handleEditFormChange} className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-600 outline-none" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Job Description Requirements</label>
                                                <textarea name="description" rows={3} required value={editFormData.description} onChange={handleEditFormChange} className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-600 outline-none resize-none"></textarea>
                                            </div>

                                            <div className="flex justify-end gap-2 pt-2">
                                                <button type="button" onClick={() => setEditingJobId(null)} className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                                                <button type="submit" disabled={actionLoadingId === job._id} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50">
                                                    {actionLoadingId === job._id ? "Saving..." : "Save System Changes"}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                                                    <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wide">{job.jobType}</span>

                                                    {/* Production Ready Dynamic Toggle Button */}
                                                    <button
                                                        disabled={actionLoadingId === job._id}
                                                        onClick={() => handleStatusToggle(job._id, job.status)}
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border transition duration-200 ${job.status === "Active"
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                                            : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                                            }`}
                                                        title="Click to toggle status"
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${job.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                                                        {actionLoadingId === job._id
                                                            ? "Updating..."
                                                            : job.status === "Active"
                                                                ? "Active"
                                                                : "Inactive"
                                                        }
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-600 font-medium">{job.companyName} • <span className="text-slate-400">📍 {job.location}</span></p>
                                                <p className="text-xs text-slate-400 mt-2 line-clamp-2 max-w-3xl">{job.description}</p>
                                                <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                                                    <span>💰 Scale: <strong className="text-slate-700">{job.salaryRange}</strong></span>
                                                    <span>✉️ Contact: <strong className="text-slate-700">{job.contact}</strong></span>
                                                </div>
                                            </div>

                                            <div className="flex md:flex-col items-center md:items-end justify-start gap-2 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                                                <span className="text-[10px] text-slate-400 font-medium hidden md:block">
                                                    Created: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
                                                </span>
                                                <div className="flex gap-2 w-full md:w-auto">
                                                    <button
                                                        onClick={() => startInlineEditing(job)}
                                                        className="w-full md:w-auto text-xs bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition"
                                                    >
                                                        Edit Fields
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteJob(job._id)}
                                                        className="w-full md:w-auto text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Pagination Layout Footer */}
                            {pagination.totalPages > 1 && (
                                <div className="bg-white border border-slate-200 py-3 px-6 flex items-center justify-between rounded-xl shadow-sm">
                                    <span className="text-xs text-slate-500">Showing <span className="font-bold text-slate-700">{listings.length}</span> of {pagination.totalJobs} listings</span>
                                    <div className="flex gap-2">
                                        <button disabled={!pagination.hasPrevPage} onClick={() => setPage(p => p - 1)} className="px-3 py-1 text-xs font-semibold border bg-white text-slate-600 rounded-md disabled:opacity-40 transition">Prev</button>
                                        <span className="text-xs text-slate-600 font-semibold flex items-center px-1">{page} / {pagination.totalPages}</span>
                                        <button disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-xs font-semibold border bg-white text-slate-600 rounded-md disabled:opacity-40 transition">Next</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};