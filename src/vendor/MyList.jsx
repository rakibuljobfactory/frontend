import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Navbar } from "./Navbar";
import { 
  Plus, 
  Search, 
  MapPin, 
  Building2, 
  IndianRupee, 
  Mail, 
  Edit3, 
  Trash2, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Layers, 
  FileText, 
  CheckCircle2, 
  XCircle,
  Filter
} from "lucide-react";

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
    }, [page, statusFilter, jobTypeFilter, search, navigate]);

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
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Vendor Recruitment Panel
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            You have deployed <span className="font-bold text-indigo-400">{pagination.totalJobs} openings</span> to the pipeline.
                        </p>
                    </div>
                    <Link 
                        to="/create-job" 
                        className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Post a New Job</span>
                    </Link>
                </div>

                {/* Filters Board Workspace */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl mb-6 flex flex-col md:flex-row items-center gap-4 justify-between">
                    <form onSubmit={handleSearchSubmit} className="w-full md:max-w-xs flex gap-2">
                        <div className="relative w-full">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by title, town..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2 rounded-xl border border-slate-700 font-medium transition"
                        >
                            Search
                        </button>
                    </form>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative">
                            <select
                                value={jobTypeFilter}
                                onChange={(e) => { setJobTypeFilter(e.target.value); setPage(1); }}
                                className="text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 outline-none focus:border-indigo-500 transition cursor-pointer"
                            >
                                <option value="" className="bg-slate-900">All Job Types</option>
                                <option value="Full-time" className="bg-slate-900">Full-time</option>
                                <option value="Part-time" className="bg-slate-900">Part-time</option>
                                <option value="Internship" className="bg-slate-900">Internship</option>
                                <option value="Remote" className="bg-slate-900">Remote</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 flex items-center gap-1">
                                <Filter className="w-3 h-3 text-slate-500" />
                                Status:
                            </span>
                            {[
                                { label: "All", value: "" },
                                { label: "Active", value: "Active" },
                                { label: "Inactive", value: "Closed" }
                            ].map((pill) => (
                                <button
                                    key={pill.label}
                                    onClick={() => { setStatusFilter(pill.value); setPage(1); }}
                                    className={`text-xs px-3 py-1 rounded-lg font-medium transition ${
                                        statusFilter === pill.value 
                                            ? "bg-indigo-600 text-white shadow-md" 
                                            : "text-slate-400 hover:text-white hover:bg-slate-900"
                                    }`}
                                >
                                    {pill.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Stream View */}
                {loading ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl py-24 flex justify-center shadow-xl">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                ) : listings.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl py-16 text-center shadow-xl">
                        <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-400">No postings found matching your parameters.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {listings.map((job) => (
                            <div key={job._id} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-5 sm:p-6 transition hover:border-slate-700">
                                {editingJobId === job._id ? (
                                    /* Inline Edit Form */
                                    <form onSubmit={(e) => saveInlineModifications(e, job._id)} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Position Title</label>
                                                <input type="text" name="title" required value={editFormData.title} onChange={handleEditFormChange} className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 focus:border-indigo-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company Branding</label>
                                                <input type="text" name="companyName" required value={editFormData.companyName} onChange={handleEditFormChange} className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 focus:border-indigo-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Geographic Location</label>
                                                <input type="text" name="location" required value={editFormData.location} onChange={handleEditFormChange} className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 focus:border-indigo-500 outline-none" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Salary Range</label>
                                                <input type="text" name="salaryRange" required value={editFormData.salaryRange} onChange={handleEditFormChange} className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 focus:border-indigo-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Job Setting Mode</label>
                                                <select name="jobType" value={editFormData.jobType} onChange={handleEditFormChange} className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 focus:border-indigo-500 outline-none">
                                                    <option value="Full-time" className="bg-slate-900">Full-time</option>
                                                    <option value="Part-time" className="bg-slate-900">Part-time</option>
                                                    <option value="Internship" className="bg-slate-900">Internship</option>
                                                    <option value="Remote" className="bg-slate-900">Remote</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">HR Email Channel</label>
                                                <input type="email" name="contact" required value={editFormData.contact} onChange={handleEditFormChange} className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 focus:border-indigo-500 outline-none" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Job Description Requirements</label>
                                            <textarea name="description" rows={3} required value={editFormData.description} onChange={handleEditFormChange} className="w-full text-xs bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 focus:border-indigo-500 outline-none resize-none"></textarea>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                                            <button type="button" onClick={() => setEditingJobId(null)} className="px-4 py-2 border border-slate-800 text-slate-300 hover:bg-slate-800 rounded-xl text-xs font-semibold transition">Cancel</button>
                                            <button type="submit" disabled={actionLoadingId === job._id} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition flex items-center space-x-1.5">
                                                {actionLoadingId === job._id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                                <span>{actionLoadingId === job._id ? "Saving..." : "Save System Changes"}</span>
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    /* Display View */
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <h3 className="text-lg font-extrabold text-white">{job.title}</h3>
                                                <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                                                    {job.jobType}
                                                </span>

                                                {/* Status Toggle Button */}
                                                <button
                                                    disabled={actionLoadingId === job._id}
                                                    onClick={() => handleStatusToggle(job._id, job.status)}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition duration-200 ${
                                                        job.status === "Active"
                                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                                            : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                                                    }`}
                                                    title="Click to toggle status"
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${job.status === "Active" ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}></span>
                                                    {actionLoadingId === job._id
                                                        ? "Updating..."
                                                        : job.status === "Active"
                                                            ? "Active"
                                                            : "Inactive"
                                                    }
                                                </button>
                                            </div>

                                            <div className="flex items-center space-x-3 text-xs text-slate-400 font-medium">
                                                <span className="flex items-center space-x-1 text-slate-300">
                                                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                                                    <span>{job.companyName}</span>
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center space-x-1 text-slate-400">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                                    <span>{job.location}</span>
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-400 line-clamp-2 max-w-3xl pt-1">
                                                {job.description}
                                            </p>

                                            <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                                                <span className="flex items-center space-x-1">
                                                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                                                    <span>Scale: <strong className="text-slate-200">{job.salaryRange}</strong></span>
                                                </span>
                                                <span className="flex items-center space-x-1">
                                                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                                                    <span>Contact: <strong className="text-slate-200">{job.contact}</strong></span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0 shrink-0">
                                            <span className="text-[10px] text-slate-500 font-medium">
                                                Created: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
                                            </span>
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={() => startInlineEditing(job)}
                                                    className="w-full md:w-auto inline-flex items-center justify-center space-x-1.5 text-xs bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold px-3 py-1.5 rounded-xl transition"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteJob(job._id)}
                                                    className="w-full md:w-auto inline-flex items-center justify-center space-x-1.5 text-xs bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-400 font-semibold px-3 py-1.5 rounded-xl transition"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Pagination Layout Footer */}
                        {pagination.totalPages > 1 && (
                            <div className="bg-slate-900 border border-slate-800 py-3 px-6 flex items-center justify-between rounded-2xl shadow-xl mt-6">
                                <span className="text-xs text-slate-400">
                                    Showing <span className="font-bold text-slate-200">{listings.length}</span> of {pagination.totalJobs} listings
                                </span>
                                <div className="flex items-center gap-2">
                                    <button 
                                        disabled={!pagination.hasPrevPage} 
                                        onClick={() => setPage(p => p - 1)} 
                                        className="p-1.5 text-xs font-semibold border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-xs text-slate-400 font-semibold px-2">
                                        {page} / {pagination.totalPages}
                                    </span>
                                    <button 
                                        disabled={!pagination.hasNextPage} 
                                        onClick={() => setPage(p => p + 1)} 
                                        className="p-1.5 text-xs font-semibold border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};