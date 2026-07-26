import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const Dashboard = () => {
    const navigate = useNavigate();

    // 1. Core State Configurations
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Search, Filtering, and Pagination States
    const [search, setSearch] = useState("");
    const [jobType, setJobType] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        totalJobs: 0
    });

    // 3. Authentication Verification & User Hydration
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
            toast.error("Unauthorized access. Please log in.");
            navigate("/login");
            return;
        }

        setUser(JSON.parse(storedUser));
    }, [navigate]);

    // 4. API Core High Throughput Job Fetcher Routine
    const fetchJobs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            // Build dynamic query string parameters based on current controller states
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "9", // Fetching 6 items per page for visual symmetry
                search: search.trim(),
                status: "Active"
            });

            if (jobType) {
                params.append("jobType", jobType);
            }

            const { data } = await axios.get(`http://localhost:5000/api/jobs?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Attach token securely in the header pipeline
                }
            });

            if (data.success) {
                setJobs(data.data);
                setPagination({
                    totalPages: data.pagination.totalPages,
                    hasNextPage: data.pagination.hasNextPage,
                    hasPrevPage: data.pagination.hasPrevPage,
                    totalJobs: data.pagination.totalJobs
                });
            }
        } catch (error) {
            console.error("Dashboard Fetch Fault:", error);
            toast.error(error.response?.data?.message || "Failed to load job listings.");
        } finally {
            setLoading(false);
        }
    };

    // Re-trigger query executions whenever pagination anchors or structural filters adjust
    useEffect(() => {
        if (user) {
            fetchJobs();
        }
    }, [page, jobType, user]);

    // Handler to execute keyword searches when clicking the manual CTA button
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1); // Force reset boundary pointer back to origin index
        fetchJobs();
    };

    // Session termination routine clearing application context states
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate("/login");
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Navigation Header Grid */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold tracking-wider uppercase bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md">
                            {user.role} Space
                        </span>
                        <h1 className="text-xl font-bold mt-1 text-slate-900">
                            Welcome back, {user.name} 👋
                        </h1>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition text-red-600 hover:border-red-200"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Dashboard Core Interface Workspace */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Search Bar & Filtering Controls */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4">
                        <div className="w-full md:flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search by title, company, or city..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-600 text-sm"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => { setSearch(""); setPage(1); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="w-full md:w-48">
                            <select
                                value={jobType}
                                onChange={(e) => { setJobType(e.target.value); setPage(1); }}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 bg-white outline-none focus:border-blue-600 text-sm"
                            >
                                <option value="">All Job Types</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition"
                        >
                            Find Jobs
                        </button>
                    </form>
                </section>

                {/* Main Dynamic Viewport */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-slate-500 mt-4 font-medium">Querying real-time openings...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center bg-white border border-slate-200 rounded-xl py-16 px-4">
                        <h3 className="text-lg font-semibold text-slate-800">No active positions match your criteria</h3>
                        <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                            Try broadening your search keywords or adjusting your filters to discover open parameters.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Metrics Meta Overview */}
                        <div className="mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Showing {jobs.length} of {pagination.totalJobs} live career openings
                        </div>

                        {/* Job Listing Cards Container */}
                        {/* Job Listing Cards Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <article
                                    key={job._id}
                                    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* Badges / Header Metadata */}
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                                                {job.jobType}
                                            </span>
                                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                                {job.status}
                                            </span>
                                        </div>

                                        {/* Main Titles */}
                                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition text-lg line-clamp-1">
                                            {job.title}
                                        </h3>

                                        <p className="text-sm font-semibold text-slate-600 mt-0.5">
                                            {job.companyName}
                                        </p>

                                        {/* Core Specifications Grid (Location, Salary & Poster Info) */}
                                        <div className="space-y-2 mt-4">
                                            {/* Location Param */}
                                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0 text-slate-400">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                                </svg>
                                                <span className="truncate">{job.location}</span>
                                            </div>

                                            {/* Salary Compensation Range Param */}
                                            <div className="flex items-center gap-2 text-slate-700 text-xs font-medium bg-slate-50 p-2 rounded-lg">
                                                <span className="text-slate-400 font-bold font-mono">₹</span>
                                                <span>{job.salaryRange || "Not Disclosed"}</span>
                                            </div>
                                        </div>

                                        {/* Brief Paragraph Description Truncated at 3 lines Max */}
                                        <p className="text-xs text-slate-500 mt-4 line-clamp-3 leading-relaxed border-t border-dashed border-slate-100 pt-3">
                                            {job.description}
                                        </p>
                                    </div>

                                    {/* Bottom Panel Component: Contacts and Utility actions */}
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex flex-col">
                                            {/* Dynamic HR Email Link Context */}
                                            <a
                                                href={`mailto:${job.contact}`}
                                                className="text-xs text-blue-600 hover:underline font-medium truncate max-w-[160px]"
                                                title={`Contact ${job.contact}`}
                                            >
                                                {job.contact}
                                            </a>

                                            {/* Poster Verification Flag
                    <span className="text-[10px] text-slate-400 mt-0.5">
                        Posted by: <span className="font-medium text-slate-500">{job.postedByType}</span>
                    </span> */}
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-2 mt-2 sm:mt-0">
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                                {new Date(job.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>


                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Pagination Interface Controls */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <button
                                    disabled={!pagination.hasPrevPage}
                                    onClick={() => setPage((prev) => prev - 1)}
                                    className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-white transition bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                <span className="text-sm text-slate-600 mx-4 font-medium">
                                    Page {page} of {pagination.totalPages}
                                </span>

                                <button
                                    disabled={!pagination.hasNextPage}
                                    onClick={() => setPage((prev) => prev + 1)}
                                    className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-white transition bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};