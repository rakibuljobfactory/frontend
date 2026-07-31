import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Navbar } from "./Navbar";

export const AdminJobsManager = () => {
    const navigate = useNavigate();

    // Tab view controller: 'listings' or 'create'
    const [activeTab, setActiveTab] = useState("listings");

    // Core Data States
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // Filters and Pagination
    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [jobTypeFilter, setJobTypeFilter] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalJobs: 0,
        hasNextPage: false,
        hasPrevPage: false
    });

    // New Job Creation Form State
    const [createFormData, setCreateFormData] = useState({
        title: "",
        companyName: "",
        location: "",
        salaryRange: "",
        jobType: "Full-time",
        contact: "",
        description: "",
    });

    // Inline Editing Form States
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

    // Auth verification guard on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Admin session expired. Please log in.");
            navigate("/login");
        }
    }, [navigate]);

    // Fetch Admin Job Postings API
    const fetchAdminPostings = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            const params = new URLSearchParams({
                page: page.toString(),
                limit: "6"
            });

            if (appliedSearch.trim()) params.append("search", appliedSearch.trim());
            if (statusFilter) params.append("status", statusFilter);
            if (jobTypeFilter) params.append("jobType", jobTypeFilter);

            const { data } = await axios.get(
                `http://localhost:5000/api/job/my-postings?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data?.success) {
                setListings(data.data || []);
                setPagination({
                    totalPages: data.pagination?.totalPages || 1,
                    totalJobs: data.pagination?.totalJobs || 0,
                    hasNextPage: data.pagination?.hasNextPage || false,
                    hasPrevPage: data.pagination?.hasPrevPage || false
                });
            }
        } catch (error) {
            console.error("Error fetching admin job postings:", error);
            toast.error(error.response?.data?.message || "Failed to load job listings.");
            setListings([]);
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, jobTypeFilter, appliedSearch]);

    useEffect(() => {
        if (activeTab === "listings") {
            fetchAdminPostings();
        }
    }, [fetchAdminPostings, activeTab]);

    // --- CREATE JOB HANDLERS ---
    const handleCreateChange = (e) => {
        setCreateFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            setFormLoading(true);
            const token = localStorage.getItem("token");

            const { data } = await axios.post(
                "http://localhost:5000/api/job/create",
                createFormData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data?.success) {
                toast.success(data.message || "Job posted successfully!");
                setCreateFormData({
                    title: "",
                    companyName: "",
                    location: "",
                    salaryRange: "",
                    jobType: "Full-time",
                    contact: "",
                    description: "",
                });
                setActiveTab("listings");
            }
        } catch (error) {
            console.error("Create job error:", error);
            toast.error(error.response?.data?.message || "Failed to post job.");
        } finally {
            setFormLoading(false);
        }
    };

    // --- STATUS TOGGLE HANDLER ---
    const handleStatusToggle = async (jobId, currentStatus) => {
        try {
            setActionLoadingId(jobId);
            const nextStatus = currentStatus === "Active" ? "Closed" : "Active";
            const token = localStorage.getItem("token");

            const { data } = await axios.patch(
                `http://localhost:5000/api/job/status/${jobId}`,
                { status: nextStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data?.success) {
                toast.success(`Job marked as ${nextStatus === "Closed" ? "Inactive" : "Active"}`);
                setListings(prev => prev.map(job => job._id === jobId ? { ...job, status: nextStatus } : job));
            }
        } catch (error) {
            console.error("Status toggle error:", error);
            toast.error(error.response?.data?.message || "Could not update status.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // --- DELETE JOB HANDLER ---
    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to permanently delete this job listing?")) return;

        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.delete(
                `http://localhost:5000/api/job/delete/${jobId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data?.success) {
                toast.success("Job posting deleted.");
                fetchAdminPostings();
            }
        } catch (error) {
            console.error("Delete job error:", error);
            toast.error(error.response?.data?.message || "Delete request failed.");
        }
    };

    // --- INLINE EDIT HANDLERS ---
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
        setEditFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

            if (data?.success) {
                toast.success("Job updated successfully!");
                setEditingJobId(null);
                fetchAdminPostings();
            }
        } catch (error) {
            console.error("Update job error:", error);
            toast.error(error.response?.data?.message || "Failed to update job details.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        setAppliedSearch(searchInput);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

                {/* Header & Sub-Navigation */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-5">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Admin Job Control Center</h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Post, update, filter, and manage job listings across the platform.
                        </p>
                    </div>

                    <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto">
                        <button
                            onClick={() => setActiveTab("listings")}
                            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition ${activeTab === "listings"
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                    : "text-slate-400 hover:text-white"
                                }`}
                        >
                            All Admin Jobs ({pagination.totalJobs})
                        </button>
                        <button
                            onClick={() => setActiveTab("create")}
                            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition ${activeTab === "create"
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                    : "text-slate-400 hover:text-white"
                                }`}
                        >
                            + Post New Job
                        </button>
                    </div>
                </div>

                {/* TAB 1: LISTINGS & MANAGEMENT */}
                {activeTab === "listings" && (
                    <div className="space-y-6">

                        {/* Search & Filter Bar */}
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center gap-4 justify-between">
                            <form onSubmit={handleSearchSubmit} className="w-full md:max-w-xs flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search by title, location..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                                />
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-2 rounded-lg transition font-medium">
                                    Search
                                </button>
                            </form>

                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                <select
                                    value={jobTypeFilter}
                                    onChange={(e) => { setJobTypeFilter(e.target.value); setPage(1); }}
                                    className="text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 outline-none focus:border-indigo-500"
                                >
                                    <option value="">All Employment Types</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Remote">Remote</option>
                                </select>

                                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                                    {[
                                        { label: "All", value: "" },
                                        { label: "Active", value: "Active" },
                                        { label: "Inactive", value: "Closed" }
                                    ].map((pill) => (
                                        <button
                                            key={pill.label}
                                            onClick={() => { setStatusFilter(pill.value); setPage(1); }}
                                            className={`text-xs px-2.5 py-1 rounded-md font-medium transition ${statusFilter === pill.value
                                                    ? "bg-indigo-600 text-white"
                                                    : "text-slate-400 hover:text-slate-200"
                                                }`}
                                        >
                                            {pill.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Content Stream */}
                        {loading ? (
                            <div className="bg-slate-950 border border-slate-800 rounded-xl py-24 flex justify-center">
                                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : listings.length === 0 ? (
                            <div className="bg-slate-950 border border-slate-800 rounded-xl py-16 text-center">
                                <p className="text-sm text-slate-400">No job postings found matching your parameters.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {listings.map((job) => (
                                    <div key={job._id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 transition hover:border-slate-700">
                                        {editingJobId === job._id ? (
                                            /* Inline Editing Form */
                                            <form onSubmit={(e) => saveInlineModifications(e, job._id)} className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Position Title</label>
                                                        <input type="text" name="title" required value={editFormData.title} onChange={handleEditFormChange} className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company Branding</label>
                                                        <input type="text" name="companyName" required value={editFormData.companyName} onChange={handleEditFormChange} className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Location</label>
                                                        <input type="text" name="location" required value={editFormData.location} onChange={handleEditFormChange} className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Salary Range</label>
                                                        <input type="text" name="salaryRange" required value={editFormData.salaryRange} onChange={handleEditFormChange} className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Employment Type</label>
                                                        <select name="jobType" value={editFormData.jobType} onChange={handleEditFormChange} className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500">
                                                            <option value="Full-time">Full-time</option>
                                                            <option value="Part-time">Part-time</option>
                                                            <option value="Internship">Internship</option>
                                                            <option value="Remote">Remote</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">HR Email Channel</label>
                                                        <input type="email" name="contact" required value={editFormData.contact} onChange={handleEditFormChange} className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                                                    <textarea name="description" rows={3} required value={editFormData.description} onChange={handleEditFormChange} className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 resize-y"></textarea>
                                                </div>

                                                <div className="flex justify-end gap-2 pt-2">
                                                    <button type="button" onClick={() => setEditingJobId(null)} className="px-3 py-1.5 border border-slate-800 text-slate-400 rounded-lg text-xs font-semibold hover:bg-slate-900">Cancel</button>
                                                    <button type="submit" disabled={actionLoadingId === job._id} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold disabled:opacity-50">
                                                        {actionLoadingId === job._id ? "Saving..." : "Save Changes"}
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            /* Regular Card Display */
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-base font-bold text-white">{job.title}</h3>
                                                        <span className="text-[10px] bg-slate-900 border border-slate-800 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                                                            {job.jobType}
                                                        </span>

                                                        <button
                                                            disabled={actionLoadingId === job._id}
                                                            onClick={() => handleStatusToggle(job._id, job.status)}
                                                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border transition duration-200 ${job.status === "Active"
                                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                                                    : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                                                                }`}
                                                        >
                                                            <span className={`w-1.5 h-1.5 rounded-full ${job.status === "Active" ? "bg-emerald-400" : "bg-rose-400"}`}></span>
                                                            {actionLoadingId === job._id ? "Updating..." : job.status === "Active" ? "Active" : "Inactive"}
                                                        </button>
                                                    </div>

                                                    <p className="text-xs text-slate-300 font-medium">
                                                        {job.companyName} • <span className="text-slate-400">📍 {job.location}</span>
                                                    </p>
                                                    <p className="text-xs text-slate-400 line-clamp-2 max-w-3xl">{job.description}</p>

                                                    <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                                                        <span>💰 Scale: <strong className="text-slate-200">{job.salaryRange}</strong></span>
                                                        <span>✉️ Contact: <strong className="text-slate-200">{job.contact}</strong></span>
                                                    </div>
                                                </div>

                                                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 border-slate-800/80 pt-3 lg:pt-0">
                                                    <span className="text-[10px] text-slate-500 font-medium">
                                                        Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
                                                    </span>
                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                        <button
                                                            onClick={() => startInlineEditing(job)}
                                                            className="flex-1 sm:flex-none text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold px-3 py-1.5 rounded-lg transition"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteJob(job._id)}
                                                            className="flex-1 sm:flex-none text-xs bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-semibold px-3 py-1.5 rounded-lg transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {pagination.totalPages > 1 && (
                                    <div className="bg-slate-950 border border-slate-800 py-3 px-6 flex items-center justify-between rounded-xl">
                                        <span className="text-xs text-slate-400">
                                            Showing <span className="font-bold text-white">{listings.length}</span> of {pagination.totalJobs} listings
                                        </span>
                                        <div className="flex gap-2">
                                            <button disabled={!pagination.hasPrevPage} onClick={() => setPage(p => p - 1)} className="px-3 py-1 text-xs font-semibold border border-slate-800 bg-slate-900 text-slate-300 rounded-md disabled:opacity-40 transition">
                                                Prev
                                            </button>
                                            <span className="text-xs text-slate-400 font-semibold flex items-center px-1">
                                                {page} / {pagination.totalPages}
                                            </span>
                                            <button disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-xs font-semibold border border-slate-800 bg-slate-900 text-slate-300 rounded-md disabled:opacity-40 transition">
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: POST NEW JOB FORM */}
                {activeTab === "create" && (
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 max-w-3xl mx-auto shadow-xl">
                        <div className="border-b border-slate-800 pb-4 mb-6">
                            <h2 className="text-xl font-bold text-white">Post an Admin Job Listing</h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Fill out the required parameters below to publish this position directly.
                            </p>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Job Title <span className="text-indigo-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={createFormData.title}
                                        onChange={handleCreateChange}
                                        placeholder="e.g. Senior Frontend Engineer"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Company Name <span className="text-indigo-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        required
                                        value={createFormData.companyName}
                                        onChange={handleCreateChange}
                                        placeholder="e.g. Admin Portal Corp"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Location <span className="text-indigo-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        value={createFormData.location}
                                        onChange={handleCreateChange}
                                        placeholder="e.g. Mumbai / Remote"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Employment Type <span className="text-indigo-400">*</span>
                                    </label>
                                    <select
                                        name="jobType"
                                        value={createFormData.jobType}
                                        onChange={handleCreateChange}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Salary Compensation <span className="text-indigo-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="salaryRange"
                                        required
                                        value={createFormData.salaryRange}
                                        onChange={handleCreateChange}
                                        placeholder="e.g. ₹8 LPA - ₹12 LPA"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Contact / HR Email <span className="text-indigo-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="contact"
                                        required
                                        value={createFormData.contact}
                                        onChange={handleCreateChange}
                                        placeholder="e.g. admin-hr@company.com"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Detailed Job Description <span className="text-indigo-400">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    required
                                    rows={5}
                                    value={createFormData.description}
                                    onChange={handleCreateChange}
                                    placeholder="Enter role expectations, required skill set, and qualification parameters..."
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-3 text-sm text-white outline-none focus:border-indigo-500 transition resize-y"
                                ></textarea>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("listings")}
                                    className="w-full sm:w-auto px-5 py-2.5 border border-slate-800 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900 transition text-center"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition shadow-md shadow-indigo-600/30 disabled:opacity-50 text-center"
                                >
                                    {formLoading ? "Publishing..." : "Publish Job"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};